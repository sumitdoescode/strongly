import { type NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Attendance from "@/models/Attendance";
import type { PipelineStage } from "mongoose";

const getPage = (value: string | null) => {
    const page = Number(value);
    return Number.isInteger(page) && page > 0 ? page : 1;
};

const getLimit = (value: string | null) => {
    const limit = Number(value);
    if (!Number.isInteger(limit) || limit < 1) return 10;
    return Math.min(limit, 50);
};

const TIME_ZONE = "Asia/Kolkata";

const getAttendanceFeedPage = async (page: number, limit: number) => {
    const skip = (page - 1) * limit;

    const basePipeline: PipelineStage[] = [
        {
            $lookup: {
                from: "members",
                localField: "member",
                foreignField: "_id",
                as: "member",
            },
        },
        { $unwind: "$member" },
        {
            $lookup: {
                from: "user",
                let: {
                    memberIdString: {
                        $toString: "$member._id",
                    },
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$memberId", "$$memberIdString"],
                            },
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            image: 1,
                        },
                    },
                    { $limit: 1 },
                ],
                as: "user",
            },
        },
        {
            $addFields: {
                date: {
                    $dateToString: {
                        format: "%Y-%m-%d",
                        date: "$createdAt",
                        timezone: TIME_ZONE,
                    },
                },
                time: {
                    $dateToString: {
                        format: "%H:%M",
                        date: "$createdAt",
                        timezone: TIME_ZONE,
                    },
                },
                user: {
                    $arrayElemAt: ["$user", 0],
                },
            },
        },
        { $sort: { createdAt: -1 } },
        {
            $group: {
                _id: "$date",
                createdAt: { $first: "$createdAt" },
                attendances: {
                    $push: {
                        id: { $toString: "$_id" },
                        time: "$time",
                        fullName: "$member.fullName",
                        userId: {
                            $cond: [{ $ifNull: ["$user._id", false] }, { $toString: "$user._id" }, null],
                        },
                        image: "$user.image",
                    },
                },
            },
        },
        { $sort: { createdAt: -1 } },
    ];

    const totalGroups = await Attendance.aggregate([...basePipeline, { $count: "total" }]);
    const feed = await Attendance.aggregate([...basePipeline, { $skip: skip }, { $limit: limit }]);
    const total = totalGroups[0]?.total || 0;

    return {
        feed: feed.map((item) => ({
            date: getDateLabel(item._id),
            day: new Date(item.createdAt).toLocaleDateString("en-US", { weekday: "long", timeZone: TIME_ZONE }),
            attendances: item.attendances,
        })),
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

const getDateLabel = (dateString: string) => {
    const today = new Date().toLocaleDateString("en-CA", { timeZone: TIME_ZONE });

    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = yesterdayDate.toLocaleDateString("en-CA", { timeZone: TIME_ZONE });

    if (dateString === today) return "Today";
    if (dateString === yesterday) return "Yesterday";

    return new Date(`${dateString}T00:00:00+05:30`).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        timeZone: TIME_ZONE,
    });
};

// GET => /api/attendance-feed, get attendance feed
export const GET = async (request: NextRequest) => {
    try {
        await connectDB();

        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const page = getPage(request.nextUrl.searchParams.get("page"));
        const limit = getLimit(request.nextUrl.searchParams.get("limit"));
        const { feed, pagination } = await getAttendanceFeedPage(page, limit);

        return NextResponse.json({ success: true, data: feed, pagination }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Failed to fetch feed data" }, { status: 500 });
    }
};

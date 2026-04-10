import { type NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Attendance from "@/models/Attendance";
import type { PipelineStage } from "mongoose";

const TIME_ZONE = "Asia/Kolkata";

const getPage = (value: string | null) => {
    const page = Number(value);
    return page > 0 ? page : 1;
};

const getLimit = (value: string | null) => {
    const limit = Number(value);
    return limit > 0 ? limit : 10;
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

export const GET = async (request: NextRequest) => {
    try {
        await connectDB();

        const page = getPage(request.nextUrl.searchParams.get("page"));
        const limit = getLimit(request.nextUrl.searchParams.get("limit"));
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
                },
            },
            { $sort: { createdAt: -1 } },
            {
                $group: {
                    _id: "$date",
                    createdAt: { $first: "$createdAt" },
                    attendances: {
                        $push: {
                            id: "$_id",
                            time: "$time",
                            fullName: "$member.fullName",
                            username: null,
                            avatar: null,
                        },
                    },
                },
            },
            { $sort: { createdAt: -1 } },
        ];

        const totalGroups = await Attendance.aggregate([...basePipeline, { $count: "total" }]);

        const feed = await Attendance.aggregate([...basePipeline, { $skip: skip }, { $limit: limit }]);

        const total = totalGroups[0]?.total || 0;

        const data = feed.map((item) => ({
            date: getDateLabel(item._id),
            day: new Date(item.createdAt).toLocaleDateString("en-US", {
                weekday: "long",
                timeZone: TIME_ZONE,
            }),
            attendances: item.attendances,
        }));

        return NextResponse.json(
            {
                success: true,
                data,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            },
            { status: 200 },
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : "Failed to fetch feed data",
            },
            { status: 500 },
        );
    }
};

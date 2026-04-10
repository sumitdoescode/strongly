import { type NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Member from "@/models/Member";
import Attendance from "@/models/Attendance";
import { Types, isValidObjectId } from "mongoose";

const TIME_ZONE = "Asia/Kolkata";

// POST => /api/attendances, mark an attendance
export const POST = async (request: NextRequest) => {
    try {
        await connectDB();

        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        // make sure the profile is completed
        if (!session.user.isProfileCompleted) {
            return NextResponse.json({ success: false, error: "Profile is not completed" }, { status: 400 });
        }

        if (!session.user.memberId) {
            return NextResponse.json({ success: false, error: "Member ID is missing" }, { status: 400 });
        }

        const member = await Member.findById(session.user.memberId).select("_id isActive");
        if (!member) {
            return NextResponse.json({ success: false, error: "Member not found" }, { status: 404 });
        }

        if (!member.isActive) {
            return NextResponse.json({ success: false, error: "Your membership is inactive" }, { status: 403 });
        }

        await Attendance.create({
            member: session.user.memberId,
        });

        return NextResponse.json({ success: true, message: "Attendance marked successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Failed to mark attendance" }, { status: 500 });
    }
};

// GET => /api/attendances, get all attendances of a member
export const GET = async (request: NextRequest) => {
    try {
        await connectDB();

        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        if (!session.user.isProfileCompleted || !session.user.memberId) {
            return NextResponse.json({ success: false, error: "Profile is not completed" }, { status: 400 });
        }

        const requestedMemberId = request.nextUrl.searchParams.get("memberId") || session.user.memberId;

        if (!isValidObjectId(requestedMemberId)) {
            return NextResponse.json({ success: false, error: "Invalid member ID" }, { status: 400 });
        }

        const member = await Member.findById(requestedMemberId).select("_id fullName gymCode phone isActive").lean();

        if (!member) {
            return NextResponse.json({ success: false, error: "Member not found" }, { status: 404 });
        }

        const query: {
            member: Types.ObjectId;
            createdAt?: {
                $gte: Date;
            };
        } = {
            member: new Types.ObjectId(requestedMemberId),
        };

        const isOwnHistory = requestedMemberId === session.user.memberId;

        if (!isOwnHistory) {
            const last15Days = new Date();
            last15Days.setDate(last15Days.getDate() - 15);
            query.createdAt = { $gte: last15Days };
        }

        const attendances = await Attendance.find(query).sort({ createdAt: -1 }).lean();

        const today = new Date().toLocaleDateString("en-CA", { timeZone: TIME_ZONE });
        const yesterdayDate = new Date();
        yesterdayDate.setDate(yesterdayDate.getDate() - 1);
        const yesterday = yesterdayDate.toLocaleDateString("en-CA", { timeZone: TIME_ZONE });

        const attendanceHistory = attendances.map((attendance) => {
            const createdAt = new Date(attendance.createdAt);
            const currentDate = createdAt.toLocaleDateString("en-CA", { timeZone: TIME_ZONE });

            let date = createdAt.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                timeZone: TIME_ZONE,
            });

            if (currentDate === today) date = "Today";
            if (currentDate === yesterday) date = "Yesterday";

            return {
                _id: attendance._id,
                date,
                day: createdAt.toLocaleDateString("en-US", {
                    weekday: "long",
                    timeZone: TIME_ZONE,
                }),
                time: createdAt.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                    timeZone: TIME_ZONE,
                }),
            };
        });

        return NextResponse.json(
            {
                success: true,
                data: {
                    member,
                    attendanceHistory,
                    isOwnHistory,
                },
            },
            { status: 200 },
        );
    } catch (error) {
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Failed to fetch attendance history" }, { status: 500 });
    }
};

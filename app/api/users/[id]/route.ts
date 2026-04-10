import { type NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { Types, isValidObjectId } from "mongoose";
import { auth } from "@/lib/auth";
import connectDB, { getDb } from "@/lib/db";
import Attendance from "@/models/Attendance";
import Member from "@/models/Member";

const TIME_ZONE = "Asia/Kolkata";

// GET => /api/users/[id], get another user's profile
export const GET = async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    try {
        await connectDB();

        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        if (!isValidObjectId(id)) {
            return NextResponse.json({ success: false, error: "Invalid user ID" }, { status: 400 });
        }

        const db = getDb();
        if (!db) {
            throw new Error("Database connection failed");
        }

        const user = await db.collection("user").findOne(
            { _id: new Types.ObjectId(id) },
            {
                projection: {
                    name: 1,
                    image: 1,
                    memberId: 1,
                    role: 1,
                    isProfileCompleted: 1,
                },
            },
        );

        if (!user || !user.isProfileCompleted || !user.memberId) {
            return NextResponse.json({ success: false, error: "User profile not found" }, { status: 404 });
        }

        const member = await Member.findById(user.memberId).select("_id fullName").lean();

        if (!member) {
            return NextResponse.json({ success: false, error: "Member not found" }, { status: 404 });
        }

        const attendances = await Attendance.find({
            member: new Types.ObjectId(user.memberId),
        })
            .sort({ createdAt: -1 })
            .lean();

        const today = new Date().toLocaleDateString("en-CA", { timeZone: TIME_ZONE });
        const thisMonth = new Date().toLocaleDateString("en-CA", {
            timeZone: TIME_ZONE,
            year: "numeric",
            month: "2-digit",
        });

        const totalAttendance = attendances.length;
        const thisMonthAttendance = attendances.filter((attendance) => {
            return (
                new Date(attendance.createdAt).toLocaleDateString("en-CA", {
                    timeZone: TIME_ZONE,
                    year: "numeric",
                    month: "2-digit",
                }) === thisMonth
            );
        }).length;

        const uniqueAttendanceDates = [...new Set(attendances.map((attendance) => new Date(attendance.createdAt).toLocaleDateString("en-CA", { timeZone: TIME_ZONE })))];

        let streak = 0;
        const streakDate = new Date();

        if (uniqueAttendanceDates[0] !== today) {
            streakDate.setDate(streakDate.getDate() - 1);
        }

        for (const attendanceDate of uniqueAttendanceDates) {
            const expectedDate = streakDate.toLocaleDateString("en-CA", { timeZone: TIME_ZONE });

            if (attendanceDate !== expectedDate) {
                break;
            }

            streak += 1;
            streakDate.setDate(streakDate.getDate() - 1);
        }

        const userResponse = {
            id: user._id.toString(),
            name: user.name,
            image: user.image,
            role: user.role,
            isProfileCompleted: user.isProfileCompleted,
            totalAttendance,
            thisMonthAttendance,
            streak,
            ...member,
        };

        return NextResponse.json({ success: true, user: userResponse }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Internal Server Error" }, { status: 500 });
    }
};

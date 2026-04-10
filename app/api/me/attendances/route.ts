import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getAttendanceHistory } from "@/lib/attendance-history";
import connectDB from "@/lib/db";
import Member from "@/models/Member";
import Attendance from "@/models/Attendance";

// POST => /api/me/attendances, mark an attendance
export const POST = async () => {
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

// GET => /api/me/attendances, get own attendance history
export const GET = async () => {
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

        const data = await getAttendanceHistory(session.user.memberId, true);

        if (!data) {
            return NextResponse.json({ success: false, error: "Member not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Failed to fetch attendance history" }, { status: 500 });
    }
};

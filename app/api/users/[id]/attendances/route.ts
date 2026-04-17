import { type NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { isValidObjectId } from "mongoose";
import { auth } from "@/lib/auth";
import { getAttendanceHistory } from "@/lib/attendance-history";
import connectDB from "@/lib/db";
import { getUserProfileSummaryById } from "@/lib/profile";

// GET => /api/users/[id]/attendances, get a user's attendance history
export const GET = async (_request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
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

        const user = await getUserProfileSummaryById(id);

        if (!user) {
            return NextResponse.json({ success: false, error: "User profile not found" }, { status: 404 });
        }

        const data = await getAttendanceHistory(user.memberId, id === session.user.id);

        if (!data) {
            return NextResponse.json({ success: false, error: "Member not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Failed to fetch attendance history" }, { status: 500 });
    }
};

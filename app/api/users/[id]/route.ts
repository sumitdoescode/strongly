import { type NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { isValidObjectId } from "mongoose";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import { getUserProfileSummaryById } from "@/lib/profile";

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

        const user = await getUserProfileSummaryById(id);

        if (!user) {
            return NextResponse.json({ success: false, error: "User profile not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, user }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Internal Server Error" }, { status: 500 });
    }
};

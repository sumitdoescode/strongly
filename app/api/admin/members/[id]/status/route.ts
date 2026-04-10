import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { isValidObjectId } from "mongoose";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Member from "@/models/Member";

// PATCH => /api/admin/members/[id]/toggle
export const PATCH = async (_request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    try {
        await connectDB();

        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        if (session.user.role !== "admin") {
            return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
        }

        const { id } = await params;

        if (!isValidObjectId(id)) {
            return NextResponse.json({ success: false, error: "Invalid member ID" }, { status: 400 });
        }

        const member = await Member.findById(id).select("_id isActive");

        if (!member) {
            return NextResponse.json({ success: false, error: "Member not found" }, { status: 404 });
        }

        member.isActive = !member.isActive;
        await member.save();

        return NextResponse.json({ success: true, message: `Member ${member.isActive ? "activated" : "deactivated"} successfully` }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Failed to toggle member status" }, { status: 500 });
    }
};

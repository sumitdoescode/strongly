import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { isValidObjectId } from "mongoose";
import { flattenError } from "zod";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Member from "@/models/Member";
import { updateMemberSchema } from "@/schemas/schema";

// GET => /api/admin/members/[id]
export const GET = async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
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

        const member = await Member.findById(id).select("_id fullName gymCode phone isActive").lean();

        if (!member) {
            return NextResponse.json({ success: false, error: "Member not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, member }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Failed to fetch member" }, { status: 500 });
    }
};

// PATCH => /api/admin/members/[id]
export const PATCH = async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
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

        const body = await request.json();
        const validation = updateMemberSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ success: false, error: flattenError(validation.error).fieldErrors }, { status: 400 });
        }

        const { fullName, gymCode, phone } = validation.data;

        // check if the gym code already exists
        const existingMember = await Member.findOne({
            gymCode,
            _id: { $ne: id },
        });

        if (existingMember) {
            return NextResponse.json({ success: false, error: "Member already exists with this gym code" }, { status: 400 });
        }

        // update the member
        const member = await Member.findByIdAndUpdate(
            id,
            {
                fullName,
                gymCode,
                phone: phone || undefined,
            },
            {
                new: true,
                runValidators: true,
            },
        ).select("_id fullName gymCode phone isActive");

        if (!member) {
            return NextResponse.json({ success: false, error: "Member not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Member updated successfully", updatedMember: member }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Failed to update member" }, { status: 500 });
    }
};

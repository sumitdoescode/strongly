import { type NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { addMemberSchema } from "@/schemas/schema";
import { flattenError } from "zod";
import Member from "@/models/Member";

// add member (can be accessed by admin only)
// POST => /api/admin/members
export const POST = async (request: NextRequest) => {
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

        const data = await request.json();
        const validation = addMemberSchema.safeParse(data);

        if (!validation.success) {
            return NextResponse.json({ success: false, error: flattenError(validation.error).fieldErrors }, { status: 400 });
        }

        const { fullName, gymCode, phone } = validation.data;

        const existingMember = await Member.findOne({ gymCode });
        if (existingMember) {
            return NextResponse.json({ success: false, error: "Member already exists with this gym code" }, { status: 400 });
        }

        const member = await Member.create({ fullName, gymCode, phone: phone || undefined, isActive: true });
        return NextResponse.json({ success: true, message: "Member added successfully", data: member }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Failed to add member" }, { status: 500 });
    }
};

// get all members (can be accessed by admin only)
// GET => /api/admin/members
export const GET = async (request: NextRequest) => {
    try {
        await connectDB();
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        if (session.user.role !== "admin") {
            return NextResponse.json({ success: false, error: "You are not authorized to perform this action" }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const q = searchParams.get("q");

        let filter = {};
        if (q && q.trim()) {
            filter = {
                $or: [{ fullName: { $regex: q.trim(), $options: "i" } }, { gymCode: { $regex: q.trim(), $options: "i" } }],
            };
        }

        const members = await Member.find(filter);
        const totalMembersCount = await Member.countDocuments();
        return NextResponse.json({ success: true, message: "Members retrieved successfully", data: { members, totalMembersCount } }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Failed to fetch members" }, { status: 500 });
    }
};

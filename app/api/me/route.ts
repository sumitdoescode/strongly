import { type NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { Types } from "mongoose";
import { flattenError } from "zod";
import { auth } from "@/lib/auth";
import connectDB, { getDb } from "@/lib/db";
import { getOwnProfileSummary } from "@/lib/profile";
import Member from "@/models/Member";
import { completeProfileSchema, updateProfileSchema } from "@/schemas/schema";

// GET => /api/me, get own profile
export const GET = async () => {
    try {
        await connectDB();

        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const profile = await getOwnProfileSummary(session.user);

        if (!profile) {
            return NextResponse.json({ success: false, error: "Profile is not completed" }, { status: 400 });
        }

        return NextResponse.json(
            {
                success: true,
                data: { user: profile },
            },
            { status: 200 },
        );
    } catch (error) {
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Internal Server Error" }, { status: 500 });
    }
};

// POST => /api/me, complete own profile
export const POST = async (request: NextRequest) => {
    try {
        await connectDB();

        const session = await auth.api.getSession({
            headers: await headers(),
        });
        if (!session) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        // if profile is already completed, return error
        if (session.user.isProfileCompleted) {
            return NextResponse.json({ success: false, error: "Profile is already completed" }, { status: 400 });
        }

        // validation
        const body = await request.json();
        const validation = completeProfileSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ success: false, error: flattenError(validation.error).fieldErrors }, { status: 400 });
        }

        const { fullName, gymCode } = validation.data;
        const member = await Member.findOne({ fullName, gymCode }).select("_id fullName gymCode phone").lean();

        // if member not found, return error
        if (!member) {
            return NextResponse.json({ success: false, error: "Member not found" }, { status: 404 });
        }

        const db = getDb();
        if (!db) {
            throw new Error("Database connection failed");
        }

        const existingUser = await db.collection("user").findOne({
            memberId: member._id.toString(),
            _id: { $ne: new Types.ObjectId(session.user.id) },
        });

        if (existingUser) {
            return NextResponse.json({ success: false, error: "This member is already linked with another user" }, { status: 400 });
        }

        await db.collection("user").updateOne(
            { _id: new Types.ObjectId(session.user.id) },
            {
                $set: {
                    memberId: member._id.toString(),
                    isProfileCompleted: true,
                },
            },
        );

        return NextResponse.json({ success: true, message: "Profile completed successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Failed to complete profile" }, { status: 500 });
    }
};

// PATCH => /api/me, update own profile
export const PATCH = async (request: NextRequest) => {
    try {
        await connectDB();

        const session = await auth.api.getSession({
            headers: await headers(),
        });
        if (!session) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        // if profile is not completed, return error
        if (!session.user.isProfileCompleted) {
            return NextResponse.json({ success: false, error: "Profile is not completed" }, { status: 400 });
        }

        // validation
        const body = await request.json();
        const validation = updateProfileSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ success: false, error: flattenError(validation.error).fieldErrors }, { status: 400 });
        }

        const { fullName, gymCode } = validation.data;
        const member = await Member.findOne({ fullName, gymCode }).select("_id fullName gymCode phone").lean();

        // if member not found, return error
        if (!member) {
            return NextResponse.json({ success: false, error: "Member not found" }, { status: 404 });
        }

        const db = getDb();
        if (!db) {
            throw new Error("Database connection failed");
        }

        const existingUser = await db.collection("user").findOne({
            memberId: member._id.toString(),
            _id: { $ne: new Types.ObjectId(session.user.id) },
        });

        if (existingUser) {
            return NextResponse.json({ success: false, error: "This member is already linked with another user" }, { status: 400 });
        }

        await db.collection("user").updateOne({ _id: new Types.ObjectId(session.user.id) }, { $set: { memberId: member._id.toString() } });

        return NextResponse.json({ success: true, message: "Profile updated successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Failed to update profile" }, { status: 500 });
    }
};

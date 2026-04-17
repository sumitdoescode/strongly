import { Types, isValidObjectId } from "mongoose";
import Attendance from "@/models/Attendance";
import Member from "@/models/Member";
import { getDb } from "@/lib/db";

const TIME_ZONE = "Asia/Kolkata";

type SessionLikeUser = {
    id: string;
    name?: string | null;
    image?: string | null;
    memberId?: string;
    role?: string;
    isProfileCompleted?: boolean;
};

type UserDocument = {
    _id: Types.ObjectId;
    id?: string;
    name?: string | null;
    image?: string | null;
    memberId?: string;
    role?: string;
    isProfileCompleted?: boolean;
};

export type UserProfileSummary = {
    id: string;
    name: string;
    image: string;
    role: string;
    isProfileCompleted: boolean;
    memberId: string;
    fullName: string;
    gymCode: string;
    phone?: string;
    isActive: boolean;
    totalAttendance: number;
    thisMonthAttendance: number;
    streak: number;
};

const getAttendanceStats = async (memberId: string) => {
    const attendances = await Attendance.find({
        member: new Types.ObjectId(memberId),
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

    return {
        totalAttendance,
        thisMonthAttendance,
        streak,
    };
};

const buildProfileSummary = async (user: UserDocument | SessionLikeUser) => {
    if (!user.memberId) {
        return null;
    }

    const member = await Member.findById(user.memberId).select("_id fullName gymCode phone isActive").lean();
    if (!member) {
        return null;
    }

    const stats = await getAttendanceStats(user.memberId);
    const userId = "id" in user && user.id ? user.id : "_id" in user ? user._id.toString() : "";

    return {
        id: userId,
        name: user.name || member.fullName,
        image: user.image || "",
        role: user.role || "member",
        isProfileCompleted: Boolean(user.isProfileCompleted),
        memberId: member._id.toString(),
        fullName: member.fullName,
        gymCode: member.gymCode,
        phone: member.phone || undefined,
        isActive: member.isActive,
        ...stats,
    } satisfies UserProfileSummary;
};

export const getOwnProfileSummary = async (user: SessionLikeUser) => {
    if (!user.isProfileCompleted || !user.memberId) {
        return null;
    }

    return buildProfileSummary(user);
};

export const getUserProfileSummaryById = async (id: string) => {
    if (!isValidObjectId(id)) {
        return null;
    }

    const db = getDb();
    if (!db) {
        throw new Error("Database connection failed");
    }

    const user = (await db.collection("user").findOne(
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
    )) as UserDocument | null;

    if (!user?.isProfileCompleted || !user.memberId) {
        return null;
    }

    return buildProfileSummary(user);
};

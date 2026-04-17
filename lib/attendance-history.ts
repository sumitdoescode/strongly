import { Types } from "mongoose";
import Attendance from "@/models/Attendance";
import Member from "@/models/Member";

const TIME_ZONE = "Asia/Kolkata";

export const getAttendanceHistory = async (memberId: string, isOwnHistory: boolean) => {
    const member = await Member.findById(memberId).select("_id fullName gymCode phone isActive").lean();

    if (!member) {
        return null;
    }

    const query: { member: Types.ObjectId; createdAt?: { $gte: Date } } = {
        member: new Types.ObjectId(memberId),
    };

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

    return {
        member,
        attendanceHistory,
        isOwnHistory,
    };
};

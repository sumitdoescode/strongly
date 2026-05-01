import Container from "@/components/Container";
import AttendanceHistory from "@/components/AttendanceHistory";
import ProfileStats from "@/components/ProfileStats";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import connectDB, { getDb } from "@/lib/db";
import Attendance from "@/models/Attendance";
import Member from "@/models/Member";
import { Types, isValidObjectId } from "mongoose";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

const TIME_ZONE = "Asia/Kolkata";

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

const getUserProfileSummaryById = async (id: string) => {
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
    )) as {
        _id: Types.ObjectId;
        name?: string | null;
        image?: string | null;
        memberId?: string;
        role?: string;
        isProfileCompleted?: boolean;
    } | null;

    if (!user?.isProfileCompleted || !user.memberId) {
        return null;
    }

    const member = await Member.findById(user.memberId).select("_id fullName gymCode phone isActive").lean();
    if (!member) {
        return null;
    }

    const stats = await getAttendanceStats(user.memberId);

    return {
        id: user._id.toString(),
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
    };
};

const getAttendanceHistory = async (memberId: string, isOwnHistory: boolean) => {
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

    return {
        member,
        attendanceHistory: attendances.map((attendance) => {
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
        }),
        isOwnHistory,
    };
};

const UserProfilePage = async ({ params }: { params: Promise<{ id: string }> }) => {
    await connectDB();

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/");
    }

    const { id } = await params;
    const profile = await getUserProfileSummaryById(id);

    if (!profile) {
        notFound();
    }

    const resolvedHistory = await getAttendanceHistory(profile.memberId, id === session.user.id);
    if (!resolvedHistory) {
        notFound();
    }

    return (
        <section className="pb-16">
            <Container>
                <Card className="overflow-hidden border border-border/60 bg-card/80">
                    <CardContent className="relative px-6 py-8 sm:px-8">
                        <div className="pointer-events-none absolute -left-10 -top-12 size-40 rounded-full bg-primary/10 blur-3xl" />
                        <div className="relative flex items-start gap-4">
                            <Avatar className="size-20" size="lg">
                                <AvatarImage src={profile.image} alt={profile.fullName} />
                                <AvatarFallback>{profile.fullName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <Badge variant="secondary">{profile.isActive ? "Active Member" : "Inactive Member"}</Badge>
                                    {profile.role === "admin" ? <Badge>Admin</Badge> : null}
                                </div>
                                <h1 className="mt-3 text-4xl font-black tracking-[-0.05em]">{profile.fullName}</h1>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <ProfileStats totalAttendance={profile.totalAttendance} thisMonthAttendance={profile.thisMonthAttendance} streak={profile.streak} />
                <AttendanceHistory
                    title={id === session.user.id ? "Attendance History" : "Recent Attendance"}
                    emptyMessage="No attendance records available for this member."
                    attendanceHistory={resolvedHistory.attendanceHistory.map((item) => ({ ...item, _id: item._id.toString() }))}
                />
            </Container>
        </section>
    );
};

export default UserProfilePage;

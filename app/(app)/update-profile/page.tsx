import Container from "@/components/Container";
import UpdateProfileForm from "@/components/UpdateProfileForm";
import Logo from "@/components/Logo";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Attendance from "@/models/Attendance";
import Member from "@/models/Member";
import { Types } from "mongoose";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

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

const getOwnProfileSummary = async (user: {
    id: string;
    name?: string | null;
    image?: string | null;
    memberId?: string;
    role?: string;
    isProfileCompleted?: boolean;
}) => {
    if (!user.isProfileCompleted || !user.memberId) {
        return null;
    }

    const member = await Member.findById(user.memberId).select("_id fullName gymCode phone isActive").lean();
    if (!member) {
        return null;
    }

    const stats = await getAttendanceStats(user.memberId);

    return {
        id: user.id,
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

const UpdateProfilePage = async () => {
    await connectDB();

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/");
    }

    if (!session.user.isProfileCompleted) {
        redirect("/complete-profile");
    }

    const profile = await getOwnProfileSummary(session.user);
    if (!profile) {
        redirect("/complete-profile");
    }

    return (
        <section className="pb-16">
            <Container>
                <div className="mx-auto max-w-lg">
                    <Card className="border border-border/60 bg-card/80">
                        <CardContent className="px-6 py-8 sm:px-8">
                            <div className="text-center">
                                <Logo />
                                <h1 className="mt-6 text-3xl font-black tracking-[-0.05em]">Update your profile</h1>
                                {/* <p className="mt-3 text-sm leading-6 text-muted-foreground">Update your profile</p> */}
                            </div>

                            <div className="mt-8">
                                <UpdateProfileForm initialValues={{ fullName: profile.fullName, gymCode: profile.gymCode }} />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </Container>
        </section>
    );
};

export default UpdateProfilePage;

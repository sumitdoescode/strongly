import Container from "@/components/Container";
import ProfileStats from "@/components/ProfileStats";
import AttendanceHistory from "@/components/AttendanceHistory";
import MarkAttendanceButton from "@/components/MarkAttendanceButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import { getOwnProfileSummary } from "@/lib/profile";
import { getAttendanceHistory } from "@/lib/attendance-history";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
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

    const [profile, history] = await Promise.all([getOwnProfileSummary(session.user), getAttendanceHistory(session.user.memberId, true)]);

    if (!profile || !history) {
        redirect("/complete-profile");
    }

    return (
        <section className="pb-16">
            <Container>
                <Card className="overflow-hidden border border-border/60 bg-card/80">
                    <CardContent className="relative px-6 py-8 sm:px-8">
                        <div className="pointer-events-none absolute -left-10 -top-12 size-40 rounded-full bg-primary/10 blur-3xl" />
                        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                            <div className="flex items-start gap-4">
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
                                    <p className="mt-2 max-w-2xl text-base leading-7 text-muted-foreground">Track your attendance, streak, and current member status in one place.</p>
                                </div>
                            </div>

                            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                                <div className="rounded-2xl border border-border/60 bg-background/60 px-4 py-3">
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Gym Code</p>
                                    <p className="mt-1 text-lg font-bold tracking-[0.08em] text-primary">{profile.gymCode}</p>
                                </div>
                                <MarkAttendanceButton className="h-11 rounded-full px-5 text-sm font-semibold uppercase tracking-[0.14em]" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <ProfileStats totalAttendance={profile.totalAttendance} thisMonthAttendance={profile.thisMonthAttendance} streak={profile.streak} />
                <AttendanceHistory attendanceHistory={history.attendanceHistory.map((item) => ({ ...item, _id: item._id.toString() }))} />
            </Container>
        </section>
    );
};

export default DashboardPage;

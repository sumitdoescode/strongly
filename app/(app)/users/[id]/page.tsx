import Container from "@/components/Container";
import AttendanceHistory from "@/components/AttendanceHistory";
import ProfileStats from "@/components/ProfileStats";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import { getAttendanceHistory } from "@/lib/attendance-history";
import { getUserProfileSummaryById } from "@/lib/profile";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

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

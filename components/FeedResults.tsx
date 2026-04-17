import Link from "next/link";
import { Clock3 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export type FeedAttendanceItem = {
    id: string;
    time: string;
    fullName: string;
    userId?: string;
    image?: string | null;
};

export type FeedGroup = {
    date: string;
    day: string;
    attendances: FeedAttendanceItem[];
};

type FeedResultsProps = {
    feed: FeedGroup[];
};

const FeedResults = ({ feed }: FeedResultsProps) => {
    if (feed.length === 0) {
        return (
            <Card className="mt-6 border border-dashed border-border/70 bg-card/60">
                <CardContent className="py-10 text-center text-sm text-muted-foreground">No attendance activity yet.</CardContent>
            </Card>
        );
    }

    return (
        <div className="mt-6 space-y-8">
            {feed.map((group) => (
                <section key={`${group.date}-${group.day}`}>
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-black tracking-[-0.04em]">{group.date}</h2>
                            <p className="text-sm text-muted-foreground">{group.day}</p>
                        </div>
                        <div className="inline-flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">{group.attendances.length}</div>
                    </div>

                    <div className="mt-4 grid gap-3">
                        {group.attendances.map((attendance) => {
                            const content = (
                                <Card className="border border-border/60 bg-card/80 transition-colors hover:bg-card">
                                    <CardHeader className="flex flex-row items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar size="lg">
                                                <AvatarImage src={attendance.image || ""} alt={attendance.fullName} />
                                                <AvatarFallback>{attendance.fullName.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h3 className="text-base font-semibold text-foreground">{attendance.fullName}</h3>
                                                <p className="text-sm text-muted-foreground">{attendance.userId ? "Open profile" : "Member check-in"}</p>
                                            </div>
                                        </div>

                                        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                                            <Clock3 className="size-4" />
                                            {attendance.time}
                                        </div>
                                    </CardHeader>
                                </Card>
                            );

                            if (!attendance.userId) {
                                return <div key={attendance.id}>{content}</div>;
                            }

                            return (
                                <Link key={attendance.id} href={`/users/${attendance.userId}`} className="block">
                                    {content}
                                </Link>
                            );
                        })}
                    </div>
                </section>
            ))}
        </div>
    );
};

export default FeedResults;

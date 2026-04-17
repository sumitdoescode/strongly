import { Calendar, Flame, Target } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";

type ProfileStatsProps = {
    totalAttendance: number;
    thisMonthAttendance: number;
    streak: number;
};

const statItems = [
    { key: "totalAttendance", label: "Total Attendance", icon: Target, tone: "text-primary bg-primary/10" },
    { key: "thisMonthAttendance", label: "This Month", icon: Calendar, tone: "text-sky-400 bg-sky-400/10" },
    { key: "streak", label: "Streak", icon: Flame, tone: "text-orange-400 bg-orange-400/10" },
] as const;

const ProfileStats = ({ totalAttendance, thisMonthAttendance, streak }: ProfileStatsProps) => {
    const values = { totalAttendance, thisMonthAttendance, streak };

    return (
        <div className="mt-8 grid gap-3 md:grid-cols-3">
            {statItems.map(({ key, label, icon: Icon, tone }) => (
                <Card key={key} className="border border-border/60 bg-card/80">
                    <CardHeader className="flex flex-row items-center justify-between py-5">
                        <div>
                            <p className="text-sm text-muted-foreground">{label}</p>
                            <h2 className="mt-2 text-3xl font-black tracking-[-0.04em]">{values[key]}</h2>
                        </div>
                        <div className={cn("flex size-12 items-center justify-center rounded-2xl", tone)}>
                            <Icon className="size-6" />
                        </div>
                    </CardHeader>
                </Card>
            ))}
        </div>
    );
};

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

export default ProfileStats;

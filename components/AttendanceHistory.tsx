import { Clock3 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const AttendanceHistory = ({
    attendanceHistory,
    title = "Attendance History",
    emptyMessage = "No attendance records yet.",
}: {
    title?: string;
    emptyMessage?: string;
    attendanceHistory: {
        _id: string;
        date: string;
        day: string;
        time: string;
    }[];
}) => {
    return (
        <section className="mt-10">
            <h2 className="text-2xl font-black tracking-[-0.04em]">{title}</h2>

            {attendanceHistory.length === 0 ? (
                <Card className="mt-4 border border-dashed border-border/70 bg-card/60">
                    <CardContent className="py-8 text-center text-sm text-muted-foreground">{emptyMessage}</CardContent>
                </Card>
            ) : (
                <div className="mt-4 grid gap-3">
                    {attendanceHistory.map((attendance) => (
                        <Card key={attendance._id} className="border border-border/60 bg-card/80">
                            <CardHeader className="flex flex-row items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground">{attendance.date}</h3>
                                    <p className="text-sm text-muted-foreground">{attendance.day}</p>
                                </div>
                                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                                    <Clock3 className="size-4" />
                                    {attendance.time}
                                </div>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            )}
        </section>
    );
};

export default AttendanceHistory;

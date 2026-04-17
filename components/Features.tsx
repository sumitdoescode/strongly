import Container from "./Container";
import { Activity, BarChart3, Search } from "lucide-react";

const highlights = [
    {
        title: "Attendance timeline",
        description: "Review check-ins in a format staff can scan quickly.",
        icon: <Activity className="h-5 w-5" />,
    },
    {
        title: "Member streaks",
        description: "Make consistency visible enough for members to care about it.",
        icon: <BarChart3 className="h-5 w-5" />,
    },
    {
        title: "Admin lookup",
        description: "Search and manage member records without extra clutter.",
        icon: <Search className="h-5 w-5" />,
    },
];

const Features = () => {
    return (
        <section id="features" className="py-20 sm:py-24">
            <Container>
                <div className="mx-auto max-w-2xl text-center">
                    <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Core features</p>
                    <h2 className="mt-4 text-4xl font-black tracking-[-0.03em] sm:text-5xl">A simpler way to run gym attendance.</h2>
                    <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">Strongly stays focused on the parts that matter: check-ins, visibility, and clean records.</p>
                </div>

                <div className="mt-12 grid gap-4 md:grid-cols-3">
                    {highlights.map((item) => (
                        <div
                            key={item.title}
                            className="rounded-[1.6rem] border border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-6 shadow-[0_24px_70px_-50px_rgba(0,0,0,1)] backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1"
                        >
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border/60 bg-muted/70 text-primary">{item.icon}</div>
                            <h3 className="mt-5 text-xl font-bold tracking-tight">{item.title}</h3>
                            <p className="mt-3 text-base leading-7 text-muted-foreground">{item.description}</p>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
};

export default Features;

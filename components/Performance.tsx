import Container from "./Container";
import { Card, CardContent, CardHeader } from "./ui/card";
import { UserCheck, Zap, BarChart3 } from "lucide-react";

const performance = [
    {
        id: 1,
        title: "Attendance History",
        description: "Track your check-ins easily with a clean, intuitive interface that shows your gym journey.",
        icon: <UserCheck className="w-8 h-8 text-primary" />,
    },
    {
        id: 2,
        title: "Streaks",
        description: "Stay motivated with consistency tracking that celebrates your dedication and progress.",
        icon: <Zap className="w-8 h-8 text-primary" />,
    },
    {
        id: 3,
        title: "Analytics",
        description: "Gym members see attendance insights with detailed analytics.",
        icon: <BarChart3 className="w-8 h-8 text-primary" />,
    },
];

const Performance = () => {
    return (
        <section className="py-20 bg-background/20 border">
            <Container>
                <div className="text-center">
                    <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground">
                        Built for <span className="text-primary">Performance</span>
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mt-32">
                    {performance.map((item) => (
                        <Card key={item.id} className={"border border-[#1F1F1F] hover:border-primary/30 transition-all duration-300 group gap-1.5"}>
                            <CardHeader>
                                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-all duration-300">{item.icon}</div>
                                <h3 className="text-xl font-bold">{item.title}</h3>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground text-lg">{item.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </Container>
        </section>
    );
};

export default Performance;

import Container from "./Container";
import { UserCheck, Zap, BarChart3 } from "lucide-react";

const howItWorks = [
    {
        id: 1,
        title: "Login with Google",
        description: "Quick and secure authentication with your Google account",
        icon: <UserCheck className="w-8 h-8 text-primary" />,
    },
    {
        id: 2,
        title: "Create Gym Profile",
        description: "Set up your profile with gym name and unique gym code",
        icon: <Zap className="w-8 h-8 text-primary" />,
    },
    {
        id: 3,
        title: "Mark Attendance",
        description: "One-click check-in system for effortless attendance tracking",
        icon: <BarChart3 className="w-8 h-8 text-primary" />,
    },
    {
        id: 4,
        title: "Track Progress",
        description: "View your streaks, history, and consistency metrics",
        icon: <BarChart3 className="w-8 h-8 text-primary" />,
    },
];

const How = () => {
    return (
        <section className="py-20 bg-background">
            <Container>
                <div className="text-center">
                    <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
                        How it <span className="text-primary">Works</span>
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mt-32">
                    {howItWorks.map((item) => (
                        <div key={item.id} className="text-center group">
                            <div className="w-20 h-20 bg-linear-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto border border-primary/30 group-hover:scale-110 transition-all duration-300">
                                <span className="text-2xl font-black text-primary">{item.id}</span>
                            </div>
                            <h3 className="text-xl font-bold mt-5">{item.title}</h3>
                            <p className="text-muted-foreground text-base mt-2">{item.description}</p>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
};

export default How;

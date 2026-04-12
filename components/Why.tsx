import React from "react";
import Container from "./Container";
import { CheckCircle, Users, Zap } from "lucide-react";

const whyItWorks = [
    {
        id: 1,
        title: "Cleaner than registers",
        description: "No more messy paper logs or lost attendance records",
        icon: <CheckCircle className="w-7 h-7 text-black" />,
    },
    {
        id: 2,
        title: "Easy for members",
        description: "Simple one-click check-in process that anyone can use",
        icon: <Users className="w-7 h-7 text-black" />,
    },
    {
        id: 3,
        title: "Boosts consistency",
        description: "Streaks and progress tracking motivates regular attendance",
        icon: <Zap className="w-7 h-7 text-black" />,
    },
];

const Why = () => {
    return (
        <section className="py-20">
            <Container>
                <div>
                    <h2 className="text-4xl sm:text-5xl font-black text-neutral-200 text-center">
                        Why Go <span className="text-primary">Digital?</span>
                    </h2>
                </div>

                <div className="flex flex-col md:flex-row gap-10 mt-32 justify-between">
                    {whyItWorks.map((item) => (
                        <div key={item.id} className="flex md:flex-col items-start gap-4">
                            <div>
                                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shrink-0 mt-1.5">{item.icon}</div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">{item.title}</h3>
                                <p className="text-base text-muted-foreground mt-1">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
};

export default Why;

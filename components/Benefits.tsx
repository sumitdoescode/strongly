import Container from "./Container";

const benefits = [
    {
        title: "Cleaner records",
        description: "Replace paper logs and scattered spreadsheets with one consistent flow.",
    },
    {
        title: "Faster desk experience",
        description: "Reduce the back-and-forth around attendance and member status.",
    },
    {
        title: "Better consistency",
        description: "Give members a clearer view of attendance habits and streaks.",
    },
];

const Benefits = () => {
    return (
        <section id="benefits" className="py-20 sm:py-24">
            <Container>
                <div className="mx-auto max-w-2xl text-center">
                    <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Why gyms use it</p>
                    <h2 className="mt-4 text-4xl font-black tracking-[-0.03em] sm:text-5xl">Less friction for staff and members.</h2>
                    <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">Strongly improves attendance tracking by keeping the product focused and readable.</p>
                </div>

                <div className="mt-12 grid gap-4 md:grid-cols-3">
                    {benefits.map((item) => (
                        <div key={item.title} className="rounded-[1.6rem] border border-border/70 bg-card/45 p-6 shadow-[0_24px_70px_-52px_rgba(0,0,0,1)] backdrop-blur-sm">
                            <div className="h-1.5 w-12 rounded-full bg-primary/70" />
                            <h3 className="mt-5 text-xl font-bold tracking-tight">{item.title}</h3>
                            <p className="mt-3 text-base leading-7 text-muted-foreground">{item.description}</p>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
};

export default Benefits;

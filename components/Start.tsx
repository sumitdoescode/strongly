import React from "react";
import Container from "./Container";
import { Button } from "./ui/button";
import Link from "next/link";

const Start = () => {
    return (
        <section className="py-20">
            <Container>
                <div className="text-center">
                    <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-neutral-200">
                        Ready to Start <span className="text-primary">Tracking?</span>
                    </h2>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mt-6">Thousands are transforming fitness with smart tracking—join them.</p>

                    <Link href="/feed" className="mt-8 inline-block">
                        <Button className={"rounded-full text-base text-primary-foreground font-semibold cursor-pointer"} size={"lg"}>
                            Get Started Now
                        </Button>
                    </Link>
                </div>
            </Container>
        </section>
    );
};

export default Start;

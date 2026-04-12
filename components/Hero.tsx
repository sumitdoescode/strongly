import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle, BarChart3, Zap, UserCheck, Users, TrendingUp, Shield, Clock } from "lucide-react";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { useSession, signIn } from "next-auth/react";
// import Loading from "@/components/Loading";

const Hero = () => {
    return (
        <section className="min-h-[80vh] flex items-center bg-background">
            <Container>
                <div className="max-w-md sm:max-w-lg  md:max-w-3xl mx-auto">
                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-center text-foreground tracking-tight">
                        Track <span className="text-primary">Attendance</span>
                        <br />
                        as it
                        <span className=""> happens</span>
                        {/* as it happens */}
                    </h1>
                    <p className="text-lg text-muted-foreground mt-3 text-center font-normal">See every member check-in as it happens — track attendance, trends, streaks in real time.</p>

                    {/* {session ? (
                        // if you are logged in
                        <Link href="/dashboard" className="mt-5 mx-auto flex w-fit text-base">
                            <Button size={"lg"} className={"bg-primary text-base rounded-full font-medium text-primary-foreground cursor-pointer"}>
                                Go to Dashboard
                            </Button>
                        </Link>
                    ) : (
                        <Button size={"lg"} className={"bg-primary text-base rounded-full font-medium text-primary-foreground cursor-pointer mt-5 mx-auto flex w-fit"} onClick={() => signIn("google", { callbackUrl: "/complete-profile" })}>
                            Get Started
                        </Button>
                    )} */}

                    <Link href="/feed" className="mt-5 mx-auto flex w-fit text-base">
                        <Button size={"lg"} className={"bg-primary text-base rounded-full font-medium text-primary-foreground cursor-pointer"}>
                            Go to Feed
                        </Button>
                    </Link>
                </div>
            </Container>
        </section>
    );
};

export default Hero;

"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";
import Link from "next/link";
import { Skeleton } from "./ui/skeleton";

const HeroButtons = () => {
    const { data: session, isPending } = authClient.useSession();

    const loginWithGoogle = async () => {
        await authClient.signIn.social({
            provider: "google",
            callbackURL: "/",
        });
    };

    if (isPending) {
        return <Skeleton className="mt-8 h-10 w-40 rounded-full" />;
    }

    if (!session) {
        return (
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-start">
                <Button
                    size={"lg"}
                    onClick={loginWithGoogle}
                    className={"h-11 rounded-full px-6 text-sm font-semibold uppercase tracking-[0.16em] cursor-pointer shadow-sm shadow-primary/20"}
                >
                    Get Started
                </Button>
                <Link href="#features" className="inline-flex">
                    <Button size={"lg"} variant={"outline"} className={"h-11 rounded-full px-6 text-sm font-semibold uppercase tracking-[0.16em] cursor-pointer"}>
                        Explore Features
                    </Button>
                </Link>
            </div>
        );
    }

    if (session.user.role === "admin") {
        return (
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-start">
                <Link href="/admin" className="inline-flex text-base">
                    <Button size={"lg"} variant={"default"} className={"h-11 rounded-full px-6 text-sm font-semibold uppercase tracking-[0.16em] cursor-pointer shadow-sm shadow-primary/20"}>
                        Open Admin
                    </Button>
                </Link>
                <Link href="#features" className="inline-flex">
                    <Button size={"lg"} variant={"outline"} className={"h-11 rounded-full px-6 text-sm font-semibold uppercase tracking-[0.16em] cursor-pointer"}>
                        Review Features
                    </Button>
                </Link>
            </div>
        );
    }

    if (!session.user.isProfileCompleted) {
        return (
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-start">
                <Link href="/complete-profile" className="inline-flex text-base">
                    <Button size={"lg"} variant={"default"} className={"h-11 rounded-full px-6 text-sm font-semibold uppercase tracking-[0.16em] cursor-pointer shadow-sm shadow-primary/20"}>
                        Complete Profile
                    </Button>
                </Link>
                <Link href="#workflow" className="inline-flex">
                    <Button size={"lg"} variant={"outline"} className={"h-11 rounded-full px-6 text-sm font-semibold uppercase tracking-[0.16em] cursor-pointer"}>
                        See How It Works
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-start">
            <Button size={"lg"} variant={"default"} disabled className={"h-11 rounded-full px-6 text-sm font-semibold uppercase tracking-[0.16em] shadow-sm shadow-primary/20"}>
                Profile Ready
            </Button>
            <Link href="#benefits" className="inline-flex">
                <Button size={"lg"} variant={"outline"} className={"h-11 rounded-full px-6 text-sm font-semibold uppercase tracking-[0.16em] cursor-pointer"}>
                    Why Strongly
                </Button>
            </Link>
        </div>
    );
};

export default HeroButtons;

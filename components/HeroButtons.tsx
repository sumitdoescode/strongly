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

    console.log(session);

    if (isPending) {
        return <Skeleton className="mt-5 mx-auto h-8 w-36 rounded-full" />;
    }

    return session ? (
        <Link href="/dashboard" className="mt-5 mx-auto flex w-fit text-base">
            <Button size={"lg"} variant={"default"} className={"text-base rounded-full cursor-pointer"}>
                Go to Dashboard
            </Button>
        </Link>
    ) : (
        <Button size={"lg"} onClick={loginWithGoogle} className={"rounded-full cursor-pointer text-base"}>
            Get Started
        </Button>
    );
};

export default HeroButtons;

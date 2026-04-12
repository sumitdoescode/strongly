"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";
import Link from "next/link";

const HeroButtons = () => {
    const { data: session, isPending } = authClient.useSession();
    const loginWithGoogle = async () => {
        await authClient.signIn.social({
            provider: "google",
            callbackURL: "/",
        });
    };

    if (isPending) {
        return (
            <Button size={"lg"} disabled className={"bg-primary text-base rounded-full font-medium text-primary-foreground cursor-pointer mt-5 mx-auto flex w-fit"}>
                Loading...
            </Button>
        );
    }

    return session ? (
        <Link href="/dashboard" className="mt-5 mx-auto flex w-fit text-base">
            <Button size={"lg"} className={"bg-primary text-base rounded-full font-medium text-primary-foreground cursor-pointer"}>
                Go to Dashboard
            </Button>
        </Link>
    ) : (
        <Button size={"lg"} onClick={loginWithGoogle} className={"bg-primary text-base rounded-full font-medium text-primary-foreground cursor-pointer mt-5 mx-auto flex w-fit"}>
            Get Started
        </Button>
    );
};

export default HeroButtons;

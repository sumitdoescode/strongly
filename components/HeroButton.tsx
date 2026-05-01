"use client";
import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";

const HeroButton = () => {
    const loginWithGoogle = async () => {
        await authClient.signIn.social({
            provider: "google",
            callbackURL: "/dashboard",
        });
    };
    return (
        <div className="mt-8 flex justify-center">
            <Button size="lg" onClick={loginWithGoogle} className="h-11 rounded-full px-6 text-sm font-semibold uppercase tracking-[0.16em] shadow-sm shadow-primary/20">
                Get Started
            </Button>
        </div>
    );
};

export default HeroButton;

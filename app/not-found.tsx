"use client";
import React from "react";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
    return (
        <div className="min-h-screen bg-black relative overflow-hidden grow">
            {/* Animated background grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-30"></div>

            {/* Floating orbs */}
            <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>

            <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
                <div className="text-center max-w-2xl">
                    {/* 404 Number */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-linear-to-r from-primary/20 to-primary/20 blur-3xl"></div>
                        <h1 className="relative text-8xl font-black leading-none bg-linear-to-b from-primary via-primary to-primary bg-clip-text text-transparent select-none">404</h1>
                    </div>

                    {/* Content */}
                    <div className="space-y-8 mt-6">
                        <div className="space-y-4">
                            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">Page Not Found</h2>
                            <p className="text-base text-muted-foreground font-medium max-w-lg mx-auto">The page you're looking for doesn't exist or has been moved to a different location.</p>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
                        <Button onClick={() => window.history.back()} className="group h-10 rounded-2xl text-base transition-all duration-300 backdrop-blur-sm hover:text-foreground" variant={"outline"}>
                            <ArrowLeft className="h-6 w-6 group-hover:-translate-x-1 transition-transform duration-300" />
                            Go Back
                        </Button>

                        <Button onClick={() => (window.location.href = "/")} className="group h-10 rounded-2xl shadow-2xl shadown-primary/25 transform transition-all duration-300 text-base">
                            <Home className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                            Go to Home
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;

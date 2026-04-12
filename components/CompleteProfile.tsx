"use client";
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Key, ArrowRight, PenTool } from "lucide-react";
import { useRouter } from "next/navigation";

const CompleteProfile = () => {
    const [formData, setFormData] = useState({
        username: "",
        fullName: "",
        gymCode: "",
    });

    const completeProfile = async () => {
        try {
            setMutating(true);
            const { data } = await axios.post("/api/user", {
                username,
                fullName,
                gymCode,
            });

            window.location.href = "/dashboard";
            toast.success("Profile completed successfully");
        } catch (error) {
            toast.error("Failed to complete profile", {
                description: error?.response?.data?.message || "Try again later",
            });
        } finally {
            setMutating(false);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(formData);
    };

    const isFormValid = fullName.trim().length > 3 && gymCode.trim().length > 0 && username.trim().length > 3;
    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <div className="relative group">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-500 w-4 h-4 transition-colors group-focus-within:text-primary" />
                    <Input
                        id="username"
                        type="text"
                        placeholder="Choose a username"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className={`pl-12 h-12 bg-zinc-900/50 border-zinc-800 text-foreground placeholder:text-zinc-500 focus:border-primary focus:ring focus:ring-primary/20 transition-all duration-200`}
                    />
                </div>
            </div>
            {/* Full Name */}
            <div className="space-y-2">
                <div className="relative group">
                    <PenTool className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-500 w-4 h-4 transition-colors group-focus-within:text-primary" />
                    <Input
                        id="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className={`pl-12 h-12 bg-zinc-900/50 border-zinc-800 text-foreground placeholder:text-zinc-500 focus:border-primary focus:ring focus:ring-primary/20 transition-all duration-200`}
                    />
                </div>
            </div>

            {/* Gym Code */}
            <div className="space-y-2">
                <div className="relative group">
                    <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-500 w-4 h-4 transition-colors group-focus-within:text-emerald-500" />
                    <Input
                        id="gymCode"
                        type="number"
                        placeholder="Enter your gym code"
                        value={formData.gymCode}
                        onChange={(e) => setFormData({ ...formData, gymCode: e.target.value })}
                        className={`pl-12 h-12 bg-zinc-900/50 border-zinc-800 text-foreground placeholder:text-zinc-500 focus:border-primary focus:ring focus:ring-primary/20 transition-all duration-200 `}
                    />
                </div>
                <p className="text-zinc-500 text-xs">Ask your gym staff for the access code</p>
            </div>

            {/* Submit Button */}
            <Button
                type="submit"
                disabled={!isFormValid || mutating}
                className="w-full h-12 bg-primary hover:bg-emerald-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-primary-foreground text-base font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none disabled:cursor-not-allowed mt-8"
            >
                {mutating ? (
                    <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Saving...</span>
                    </div>
                ) : (
                    <div className="flex items-center justify-center space-x-2">
                        <span>Save & Continue</span>
                        <ArrowRight className="w-4 h-4" />
                    </div>
                )}
            </Button>
        </form>
    );
};

export default CompleteProfile;

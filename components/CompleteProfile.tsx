"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Key, PenTool } from "lucide-react";
import axios, { AxiosError } from "axios";
import { completeProfileSchema } from "@/schemas/schema";
import { toast } from "sonner";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { flattenError } from "zod";

type FormData = {
    fullName: string;
    gymCode: string;
};

type FormErrors = Partial<Record<keyof FormData, string[]>>;

const CompleteProfile = () => {
    const [formData, setFormData] = useState<FormData>({
        fullName: "",
        gymCode: "",
    });
    const [isCompleting, setIsCompleting] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});

    const completeProfile = async () => {
        try {
            setIsCompleting(true);
            await axios.post("/api/me", formData);

            window.location.href = "/dashboard";
            toast.success("Profile completed successfully");
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data?.error || "Failed to complete profile");
            }
        } finally {
            setIsCompleting(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validation = completeProfileSchema.safeParse(formData);
        if (!validation.success) {
            setErrors(flattenError(validation.error).fieldErrors);
            return;
        }

        setErrors({});
        await completeProfile();
    };

    const isFormValid = completeProfileSchema.safeParse(formData).success;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <FieldGroup>
                <Field className="space-y-0">
                    <FieldLabel htmlFor="fullName" className="text-base">
                        Full Name
                    </FieldLabel>
                    <div className="relative">
                        <PenTool className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-500 w-4 h-4 transition-colors group-focus-within:text-primary" />
                        <Input
                            id="fullName"
                            type="text"
                            placeholder="Enter your full name"
                            required
                            value={formData.fullName}
                            onChange={(e) => {
                                setFormData({ ...formData, fullName: e.target.value });
                                setErrors({ ...errors, fullName: undefined });
                            }}
                            aria-invalid={Boolean(errors.fullName)}
                            className="pl-12 h-14 bg-zinc-900/50 border-zinc-800 text-foreground placeholder:text-zinc-500 placeholder:text-base focus:border-primary focus:ring focus:ring-primary/20 transition-all duration-200 md:text-lg"
                        />
                    </div>
                    {errors.fullName?.map((error) => (
                        <FieldError key={error}>{error}</FieldError>
                    ))}
                </Field>

                <Field className="">
                    <FieldLabel htmlFor="gymCode" className="text-base">
                        Gym Code
                    </FieldLabel>
                    <div className="relative">
                        <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-500 w-4 h-4 transition-colors group-focus-within:text-primary" />
                        <Input
                            id="gymCode"
                            type="text"
                            inputMode="numeric"
                            placeholder="Enter your gym code"
                            required
                            value={formData.gymCode}
                            onChange={(e) => {
                                setFormData({ ...formData, gymCode: e.target.value });
                                setErrors({ ...errors, gymCode: undefined });
                            }}
                            aria-invalid={Boolean(errors.gymCode)}
                            className="pl-12 h-14 bg-zinc-900/50 border-zinc-800 text-foreground placeholder:text-zinc-500 placeholder:text-base focus:border-primary focus:ring focus:ring-primary/20 transition-all duration-200 text-lg md:text-lg"
                        />
                    </div>
                    {errors.gymCode?.map((error) => (
                        <FieldError key={error}>{error}</FieldError>
                    ))}
                    {!errors.gymCode && <FieldDescription className="text-zinc-500 text-xs">Ask your gym staff for the access code</FieldDescription>}
                </Field>

                <Field>
                    <Button
                        type="submit"
                        disabled={!isFormValid || isCompleting}
                        className="w-full h-12 bg-primary hover:bg-emerald-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-primary-foreground text-base font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none disabled:cursor-not-allowed mt-8"
                    >
                        {isCompleting ? (
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
                </Field>
            </FieldGroup>
        </form>
    );
};

export default CompleteProfile;

"use client";

import { type FormEvent, useState } from "react";
import axios, { AxiosError } from "axios";
import { ArrowRight, Key, PenTool } from "lucide-react";
import { flattenError } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateProfileSchema } from "@/schemas/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";

const UpdateProfileForm = ({ initialValues }: { initialValues: { fullName: string; gymCode: string } }) => {
    const [formData, setFormData] = useState(initialValues);
    const [errors, setErrors] = useState({ fullName: "", gymCode: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const validation = updateProfileSchema.safeParse(formData);
        if (!validation.success) {
            const fieldErrors = flattenError(validation.error).fieldErrors;
            setErrors({
                fullName: fieldErrors.fullName?.[0] || "",
                gymCode: fieldErrors.gymCode?.[0] || "",
            });
            return;
        }

        try {
            setErrors({ fullName: "", gymCode: "" });
            setIsSubmitting(true);
            await axios.patch("/api/me", formData);
            toast.success("Profile updated successfully");
            router.push("/dashboard");
            router.refresh();
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data?.error || "Failed to update profile");
                return;
            }

            toast.error("Failed to update profile");
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid = updateProfileSchema.safeParse(formData).success;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <FieldGroup>
                <Field className="space-y-0">
                    <FieldLabel htmlFor="fullName" className="text-base">
                        Full Name
                    </FieldLabel>
                    <div className="relative">
                        <PenTool className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <Input
                            id="fullName"
                            value={formData.fullName}
                            onChange={(event) => {
                                setFormData((current) => ({ ...current, fullName: event.target.value }));
                                setErrors((current) => ({ ...current, fullName: "" }));
                            }}
                            className="h-14 border-zinc-800 bg-zinc-900/50 pl-12 text-base md:text-lg"
                            placeholder="Enter your full name"
                            aria-invalid={Boolean(errors.fullName)}
                        />
                    </div>
                    {errors.fullName ? <FieldError>{errors.fullName}</FieldError> : null}
                </Field>

                <Field>
                    <FieldLabel htmlFor="gymCode" className="text-base">
                        Gym Code
                    </FieldLabel>
                    <div className="relative">
                        <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <Input
                            id="gymCode"
                            value={formData.gymCode}
                            onChange={(event) => {
                                setFormData((current) => ({ ...current, gymCode: event.target.value }));
                                setErrors((current) => ({ ...current, gymCode: "" }));
                            }}
                            className="h-14 border-zinc-800 bg-zinc-900/50 pl-12 text-base md:text-lg"
                            placeholder="Enter your gym code"
                            aria-invalid={Boolean(errors.gymCode)}
                        />
                    </div>
                    {errors.gymCode ? <FieldError>{errors.gymCode}</FieldError> : null}
                    {!errors.gymCode ? <FieldDescription>Ask your gym staff if you need to switch codes.</FieldDescription> : null}
                </Field>

                <Field>
                    <Button type="submit" size="lg" disabled={!isFormValid || isSubmitting} className="mt-4 h-12 w-full rounded-lg text-sm font-semibold uppercase tracking-[0.14em]">
                        {isSubmitting ? "Saving..." : "Save Changes"}
                        {!isSubmitting ? <ArrowRight /> : null}
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    );
};

export default UpdateProfileForm;

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { flattenError } from "zod";
import { Key, Loader2, Phone, User } from "lucide-react";
import { toast } from "sonner";
import { addMemberSchema } from "@/schemas/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { z } from "zod";

type FormData = {
    fullName: string;
    gymCode: string;
    phone: string;
};

type FormErrors = Partial<Record<keyof FormData, string[]>>;

const initialFormData: FormData = {
    fullName: "",
    gymCode: "",
    phone: "",
};

const addMemberFormSchema = z.object({
    fullName: addMemberSchema.shape.fullName,
    gymCode: addMemberSchema.shape.gymCode,
    phone: z.union([z.literal(""), addMemberSchema.shape.phone]).optional(),
});

const AddMemberDialog = () => {
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSaving, setIsSaving] = useState(false);
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const normalizedFormData = {
        ...formData,
        phone: formData.phone.trim(),
    };

    const isFormValid = addMemberFormSchema.safeParse(normalizedFormData).success;

    const addMember = async () => {
        try {
            setIsSaving(true);
            await axios.post("/api/admin/members", {
                ...normalizedFormData,
                phone: normalizedFormData.phone || undefined,
            });
            toast.success("Member added successfully");
            setFormData(initialFormData);
            setErrors({});
            setOpen(false);
            router.refresh();
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data?.error || "Failed to add member");
                return;
            }

            toast.error("Failed to add member");
        } finally {
            setIsSaving(false);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const validation = addMemberFormSchema.safeParse(normalizedFormData);
        if (!validation.success) {
            setErrors(flattenError(validation.error).fieldErrors);
            return;
        }

        setErrors({});
        await addMember();
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(nextOpen) => {
                setOpen(nextOpen);

                if (!nextOpen) {
                    setErrors({});
                    setFormData(initialFormData);
                }
            }}
        >
            <DialogTrigger render={<Button className="mt-6 w-full cursor-pointer sm:w-auto" />}>Add member</DialogTrigger>
            <DialogContent>
                <DialogHeader className="mb-1">
                    <DialogTitle className="text-2xl">Add Member</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <FieldGroup>
                        <Field className="space-y-0">
                            <FieldLabel htmlFor="fullName" className="text-base">
                                Full Name
                            </FieldLabel>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                                <Input
                                    id="fullName"
                                    type="text"
                                    placeholder="Enter member full name"
                                    value={formData.fullName}
                                    onChange={(event) => {
                                        setFormData((current) => ({ ...current, fullName: event.target.value }));
                                        setErrors((current) => ({ ...current, fullName: undefined }));
                                    }}
                                    aria-invalid={Boolean(errors.fullName)}
                                    className="h-12 pl-12"
                                />
                            </div>
                            {errors.fullName?.map((error) => (
                                <FieldError key={error}>{error}</FieldError>
                            ))}
                        </Field>

                        <Field className="space-y-0">
                            <FieldLabel htmlFor="gymCode" className="text-base">
                                Gym Code
                            </FieldLabel>
                            <div className="relative">
                                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                                <Input
                                    id="gymCode"
                                    type="text"
                                    placeholder="Enter gym code"
                                    value={formData.gymCode}
                                    onChange={(event) => {
                                        setFormData((current) => ({ ...current, gymCode: event.target.value }));
                                        setErrors((current) => ({ ...current, gymCode: undefined }));
                                    }}
                                    aria-invalid={Boolean(errors.gymCode)}
                                    className="h-12 pl-12"
                                />
                            </div>
                            {errors.gymCode?.map((error) => (
                                <FieldError key={error}>{error}</FieldError>
                            ))}
                        </Field>

                        <Field className="space-y-0">
                            <FieldLabel htmlFor="phone" className="text-base">
                                Phone Number
                            </FieldLabel>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="Enter phone number"
                                    value={formData.phone}
                                    onChange={(event) => {
                                        setFormData((current) => ({ ...current, phone: event.target.value }));
                                        setErrors((current) => ({ ...current, phone: undefined }));
                                    }}
                                    aria-invalid={Boolean(errors.phone)}
                                    className="h-12 pl-12"
                                />
                            </div>
                            {errors.phone?.map((error) => (
                                <FieldError key={error}>{error}</FieldError>
                            ))}
                            {!errors.phone ? <FieldDescription>Leave this empty if you do not want to save a phone number yet.</FieldDescription> : null}
                        </Field>

                        <DialogFooter>
                            <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
                            <Button type="submit" disabled={!isFormValid || isSaving}>
                                {isSaving ? <Loader2 className="animate-spin" /> : null}
                                {isSaving ? "Saving..." : "Save changes"}
                            </Button>
                        </DialogFooter>
                    </FieldGroup>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddMemberDialog;

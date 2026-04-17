"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { flattenError } from "zod";
import { Key, Loader2, Pencil, Phone, Power, User, UserRound } from "lucide-react";
import { toast } from "sonner";
import { updateMemberSchema } from "@/schemas/schema";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";

const MemberCard = ({ _id, fullName, gymCode, phone, isActive }: { _id: string; fullName: string; gymCode: string; phone?: string; isActive: boolean }) => {
    const initialFormData = {
        fullName,
        gymCode,
        phone: phone || "",
    };

    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({ fullName: "", gymCode: "", phone: "" });
    const [isUpdating, setIsUpdating] = useState(false);
    const [isStatusLoading, setIsStatusLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const normalizedFormData = {
        ...formData,
        phone: formData.phone.trim() || undefined,
    };

    const isFormValid = updateMemberSchema.safeParse(normalizedFormData).success;

    const updateMember = async () => {
        try {
            setIsUpdating(true);
            await axios.patch(`/api/admin/members/${_id}`, normalizedFormData);
            toast.success("Member updated successfully");
            setOpen(false);
            router.refresh();
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data?.error || "Failed to update member");
                return;
            }

            toast.error("Failed to update member");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const validation = updateMemberSchema.safeParse(normalizedFormData);
        if (!validation.success) {
            const fieldErrors = flattenError(validation.error).fieldErrors;
            setErrors({
                fullName: fieldErrors.fullName?.[0] || "",
                gymCode: fieldErrors.gymCode?.[0] || "",
                phone: fieldErrors.phone?.[0] || "",
            });
            return;
        }

        setErrors({ fullName: "", gymCode: "", phone: "" });
        await updateMember();
    };

    const toggleMemberStatus = async () => {
        try {
            setIsStatusLoading(true);
            await axios.patch(`/api/admin/members/${_id}/status`);
            toast.success(`Member ${isActive ? "deactivated" : "activated"} successfully`);
            router.refresh();
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data?.error || "Failed to change member status");
                return;
            }

            toast.error("Failed to change member status");
        } finally {
            setIsStatusLoading(false);
        }
    };

    return (
        <Card className="border border-border/60 bg-card/80">
            <CardHeader className="gap-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
                            <UserRound className="size-6 text-primary" />
                        </div>
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <h2 className="text-lg font-bold tracking-tight sm:text-xl">{fullName}</h2>
                                <Badge variant={isActive ? "secondary" : "outline"}>{isActive ? "Active" : "Inactive"}</Badge>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">Gym code {gymCode}</p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Dialog
                            open={open}
                            onOpenChange={(nextOpen) => {
                                setOpen(nextOpen);

                                if (!nextOpen) {
                                    setErrors({ fullName: "", gymCode: "", phone: "" });
                                    setFormData(initialFormData);
                                }
                            }}
                        >
                            <DialogTrigger render={<Button size="icon-lg" variant="outline" className="rounded-xl" />}>
                                <Pencil className="text-orange-400" />
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader className="mb-1">
                                    <DialogTitle className="text-2xl">Update Member</DialogTitle>
                                </DialogHeader>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <FieldGroup>
                                        <Field className="space-y-0">
                                            <FieldLabel htmlFor={`fullName-${_id}`} className="text-base">
                                                Full Name
                                            </FieldLabel>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                                                <Input
                                                    id={`fullName-${_id}`}
                                                    type="text"
                                                    placeholder="Enter full name"
                                                    value={formData.fullName}
                                                    onChange={(event) => {
                                                        setFormData((current) => ({ ...current, fullName: event.target.value }));
                                                        setErrors((current) => ({ ...current, fullName: "" }));
                                                    }}
                                                    aria-invalid={Boolean(errors.fullName)}
                                                    className="h-12 pl-12"
                                                />
                                            </div>
                                            {errors.fullName ? <FieldError>{errors.fullName}</FieldError> : null}
                                        </Field>

                                        <Field className="space-y-0">
                                            <FieldLabel htmlFor={`gymCode-${_id}`} className="text-base">
                                                Gym Code
                                            </FieldLabel>
                                            <div className="relative">
                                                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                                                <Input
                                                    id={`gymCode-${_id}`}
                                                    type="text"
                                                    placeholder="Enter gym code"
                                                    value={formData.gymCode}
                                                    onChange={(event) => {
                                                        setFormData((current) => ({ ...current, gymCode: event.target.value }));
                                                        setErrors((current) => ({ ...current, gymCode: "" }));
                                                    }}
                                                    aria-invalid={Boolean(errors.gymCode)}
                                                    className="h-12 pl-12"
                                                />
                                            </div>
                                            {errors.gymCode ? <FieldError>{errors.gymCode}</FieldError> : null}
                                        </Field>

                                        <Field className="space-y-0">
                                            <FieldLabel htmlFor={`phone-${_id}`} className="text-base">
                                                Phone Number
                                            </FieldLabel>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                                                <Input
                                                    id={`phone-${_id}`}
                                                    type="tel"
                                                    placeholder="Enter phone number"
                                                    value={formData.phone}
                                                    onChange={(event) => {
                                                        setFormData((current) => ({ ...current, phone: event.target.value }));
                                                        setErrors((current) => ({ ...current, phone: "" }));
                                                    }}
                                                    aria-invalid={Boolean(errors.phone)}
                                                    className="h-12 pl-12"
                                                />
                                            </div>
                                            {errors.phone ? <FieldError>{errors.phone}</FieldError> : null}
                                            {!errors.phone ? <FieldDescription>Leave this empty if you do not want to save a phone number.</FieldDescription> : null}
                                        </Field>

                                        <DialogFooter>
                                            <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
                                            <Button type="submit" disabled={!isFormValid || isUpdating}>
                                                {isUpdating ? <Loader2 className="animate-spin" /> : null}
                                                {isUpdating ? "Updating..." : "Update"}
                                            </Button>
                                        </DialogFooter>
                                    </FieldGroup>
                                </form>
                            </DialogContent>
                        </Dialog>

                        <Button size="icon-lg" variant="outline" className="rounded-xl" onClick={toggleMemberStatus} disabled={isStatusLoading}>
                            {isStatusLoading ? <Loader2 className="animate-spin" /> : <Power className={isActive ? "text-red-400" : "text-emerald-400"} />}
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex flex-wrap items-center gap-2 pt-0">
                <Badge variant="outline" className="rounded-full px-3 py-1 text-sm tracking-[0.12em]">
                    {gymCode}
                </Badge>
                {phone ? (
                    <Badge variant="outline" className="rounded-full px-3 py-1 text-sm">
                        {phone}
                    </Badge>
                ) : (
                    <span className="text-sm text-muted-foreground">No phone number added</span>
                )}
            </CardContent>
        </Card>
    );
};

export default MemberCard;

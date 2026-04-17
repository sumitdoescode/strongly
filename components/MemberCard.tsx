"use client";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, UserRound, User, Key, Phone, Loader2, Power } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const getErrorMessage = (error: unknown) => {
    if (typeof error === "string") {
        return error;
    }

    if (error && typeof error === "object") {
        const messages = Object.values(error)
            .flatMap((value) => (Array.isArray(value) ? value : []))
            .filter((value): value is string => typeof value === "string");

        if (messages.length > 0) {
            return messages[0];
        }
    }

    return "Try again later";
};

type MemberCardProps = {
    _id: string;
    fullName: string;
    gymCode: string;
    phone?: string;
    isActive: boolean;
};

const MemberCard = ({ _id, fullName, gymCode, phone, isActive }: MemberCardProps) => {
    const [fullNameState, setFullNameState] = useState(fullName);
    const [gymCodeState, setGymCodeState] = useState(gymCode);
    const [phoneState, setPhoneState] = useState(phone || "");

    const [loading, setLoading] = useState(false);
    const [statusLoading, setStatusLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const isValid = fullNameState.trim().length >= 3 && gymCodeState.trim().length > 0;

    const updateMember = async () => {
        try {
            setLoading(true);
            await axios.patch(`/api/admin/members/${_id}`, {
                fullName: fullNameState,
                gymCode: gymCodeState,
                phone: phoneState.trim() || undefined,
            });
            toast.success("Member updated successfully");
            setOpen(false);
            router.refresh();
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                toast.error("Failed to update member", {
                    description: getErrorMessage(error.response?.data?.error),
                });
                return;
            }

            toast.error("Failed to update member");
        } finally {
            setLoading(false);
        }
    };

    const toggleMemberStatus = async () => {
        try {
            setStatusLoading(true);
            await axios.patch(`/api/admin/members/${_id}/status`);
            toast.success(`Member ${isActive ? "deactivated" : "activated"} successfully`);
            router.refresh();
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                toast.error("Failed to change member status", {
                    description: getErrorMessage(error.response?.data?.error),
                });
                return;
            }

            toast.error("Failed to change member status");
        } finally {
            setStatusLoading(false);
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
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger render={<Button size="icon-lg" variant="outline" className="rounded-xl" />}>
                                <Pencil className="text-orange-400" />
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader className="mb-5">
                                    <DialogTitle className="text-2xl">Update Member</DialogTitle>
                                </DialogHeader>

                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                                    <Input id="fullName" type="text" placeholder="Enter full name" value={fullNameState} onChange={(e) => setFullNameState(e.target.value)} className="pl-12 h-12" />
                                </div>

                                <div className="relative group">
                                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                                    <Input id="gymCode" type="text" placeholder="Enter gym code" value={gymCodeState} onChange={(e) => setGymCodeState(e.target.value)} className="pl-12 h-12" />
                                </div>

                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                                    <Input id="phone" type="tel" placeholder="Enter phone number" value={phoneState} onChange={(e) => setPhoneState(e.target.value)} className="pl-12 h-12" />
                                </div>

                                <DialogFooter>
                                    <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
                                    <Button onClick={updateMember} disabled={!isValid || loading}>
                                        {loading ? <Loader2 className="animate-spin" /> : null}
                                        {loading ? "Updating..." : "Update"}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Button size="icon-lg" variant="outline" className="rounded-xl" onClick={toggleMemberStatus} disabled={statusLoading}>
                            {statusLoading ? <Loader2 className="animate-spin" /> : <Power className={isActive ? "text-red-400" : "text-emerald-400"} />}
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

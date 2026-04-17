"use client";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, UserRound, User, Key, Phone, Loader2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const MemberCard = ({ _id, fullName, gymCode, phone }) => {
    const [fullNameState, setFullNameState] = useState(fullName);
    const [gymCodeState, setGymCodeState] = useState(gymCode);
    const [phoneState, setPhoneState] = useState(phone);

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const isValid = fullNameState.trim().length >= 3 && gymCodeState.trim().length > 0;

    const deleteMember = async () => {
        try {
            await axios.delete(`/api/admin/members/${_id}`);
            toast.success("Member deleted successfully");
            router.refresh();
        } catch (error) {
            toast.error("Failed to delete member", {
                description: error?.response?.data?.message || "Try again later",
            });
        }
    };
    const updateMember = async () => {
        try {
            setLoading(true);
            await axios.patch(`/api/admin/members/${_id}`, { fullName: fullNameState, gymCode: gymCodeState, phone: phoneState });
            toast.success("Member updated successfully");
            setOpen(false);
            router.refresh();
        } catch (error) {
            toast.error("Failed to update member", {
                description: error?.response?.data?.message || "Try again later",
            });
        } finally {
            setLoading(false);
        }
    };
    return (
        <Card className="mt-2 p-3 border-none">
            <CardHeader className="p-0 gap-0">
                <div className="flex items-center justify-between">
                    {/* userIcon + Name */}
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-500/10">
                            <UserRound className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <h2 className="text-foreground text-lg sm:text-xl font-bold">{fullName}</h2>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        {/* update button */}
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger>
                                <Button size="sm" className="h-12 w-12 p-0 bg-orange-500/10 hover:bg-orange-500/20 rounded-xl">
                                    <Pencil className="h-7 w-7 text-orange-500" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader className="mb-5">
                                    <DialogTitle className="text-2xl">Update Member</DialogTitle>
                                </DialogHeader>

                                {/* Full Name */}
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-500 w-4 h-4" />
                                    <Input id="fullName" type="text" placeholder="Enter full name" value={fullNameState} onChange={(e) => setFullNameState(e.target.value)} className="pl-12 h-12" />
                                </div>

                                {/* Gym Code */}
                                <div className="relative group">
                                    <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-500 w-4 h-4" />
                                    <Input id="gymCode" type="number" placeholder="Enter gym code" value={gymCodeState} onChange={(e) => setGymCodeState(e.target.value)} className="pl-12 h-12" />
                                </div>

                                {/* Phone */}
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-500 w-4 h-4" />
                                    <Input id="phone" type="tel" placeholder="Enter phone number" value={phoneState} onChange={(e) => setPhoneState(e.target.value)} className="pl-12 h-12" />
                                </div>

                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <Button onClick={updateMember} disabled={!isValid || loading}>
                                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                        {loading ? "Updating..." : "Update changes"}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        {/* delete button */}

                        <AlertDialog>
                            <AlertDialogTrigger>
                                <Button size="sm" className="h-12 w-12 p-0 bg-red-500/10 hover:bg-red-500/20 rounded-xl">
                                    <Trash2 className="h-7 w-7 text-red-500" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>This action cannot be undone. This will permanently delete gym member data.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={deleteMember}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="m-0 p-0">
                <div className="flex items-center justify-between">
                    <h2 className="px-2 py-1 text-xl bg-secondary rounded-xl text-sky-400 font-bold">{gymCode}</h2>
                    {phone && <h2 className="px-2 py-1 text-xl bg-secondary rounded-xl text-orange-500 font-bold">{phone}</h2>}
                </div>
            </CardContent>
        </Card>
    );
};

export default MemberCard;

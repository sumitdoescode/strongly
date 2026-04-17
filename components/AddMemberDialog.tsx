"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { User, Key, Phone, Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const AddMemberDialog = () => {
    const [fullName, setFullName] = useState("");
    const [gymCode, setGymCode] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const isValid = fullName.trim().length >= 3 && gymCode.trim().length > 0;

    const addMember = async () => {
        try {
            setLoading(true);
            await axios.post("/api/admin/members", { fullName, gymCode, phone });
            toast.success("Member added successfully!");
            router.refresh();

            setFullName("");
            setGymCode("");
            setPhone("");
            setOpen(false);
        } catch (error) {
            toast.error("Failed to add member", {
                description: error?.response?.data?.message || "Try again later",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <Button className="w-full sm:w-auto cursor-pointer mt-6">Add member</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader className="mb-5">
                    <DialogTitle className="text-2xl">Add Member</DialogTitle>
                </DialogHeader>

                <div className="relative group">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-500 w-4 h-4" />
                    <Input id="fullName" type="text" placeholder="Enter full name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="pl-12 h-12" />
                </div>

                <div className="relative group">
                    <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-500 w-4 h-4" />
                    <Input id="gymCode" type="number" placeholder="Enter gym code" value={gymCode} onChange={(e) => setGymCode(e.target.value)} className="pl-12 h-12" />
                </div>

                <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-500 w-4 h-4" />
                    <Input id="phone" type="tel" placeholder="Enter phone number" value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-12 h-12" />
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={addMember} disabled={!isValid || loading}>
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {loading ? "Saving..." : "Save changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddMemberDialog;

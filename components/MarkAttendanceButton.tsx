"use client";

import { useState } from "react";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type MarkAttendanceButtonProps = {
    onSuccess?: () => void;
    className?: string;
};

const MarkAttendanceButton = ({ onSuccess, className }: MarkAttendanceButtonProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleMarkAttendance = async () => {
        try {
            setIsLoading(true);
            await axios.post("/api/me/attendances");
            toast.success("Attendance marked successfully");
            router.refresh();
            onSuccess?.();
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data?.error || "Failed to mark attendance");
                return;
            }

            toast.error("Failed to mark attendance");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button size="lg" onClick={handleMarkAttendance} disabled={isLoading} className={className}>
            {isLoading ? <Loader2 className="animate-spin" /> : null}
            {isLoading ? "Marking..." : "Mark Attendance"}
        </Button>
    );
};

export default MarkAttendanceButton;

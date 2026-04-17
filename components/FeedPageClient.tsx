"use client";

import { useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import FeedResults, { type FeedGroup } from "@/components/FeedResults";
import MarkAttendanceButton from "@/components/MarkAttendanceButton";

type FeedPageClientProps = {
    initialFeed: FeedGroup[];
    initialPagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
};

const FeedPageClient = ({ initialFeed, initialPagination }: FeedPageClientProps) => {
    const [feed, setFeed] = useState(initialFeed);
    const [pagination, setPagination] = useState(initialPagination);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const loadMore = async () => {
        if (pagination.page >= pagination.totalPages) return;

        try {
            setIsLoadingMore(true);
            const nextPage = pagination.page + 1;
            const response = await axios.get(`/api/attendance-feed?page=${nextPage}&limit=${pagination.limit}`);

            setFeed((current) => [...current, ...response.data.data]);
            setPagination(response.data.pagination);
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data?.error || "Failed to load more activity");
                return;
            }

            toast.error("Failed to load more activity");
        } finally {
            setIsLoadingMore(false);
        }
    };

    return (
        <>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="max-w-2xl">
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Live activity</p>
                    <h1 className="mt-2 text-4xl font-black tracking-[-0.05em]">Attendance feed</h1>
                    <p className="mt-3 text-base leading-7 text-muted-foreground">This view carries over the old activity feed, but it now reads from Strongly&apos;s new grouped attendance endpoint.</p>
                </div>
                <MarkAttendanceButton className="h-11 rounded-full px-5 text-sm font-semibold uppercase tracking-[0.14em]" />
            </div>

            <FeedResults feed={feed} />

            {pagination.page < pagination.totalPages ? (
                <div className="mt-8 flex justify-center">
                    <Button variant="outline" size="lg" onClick={loadMore} disabled={isLoadingMore} className="rounded-full px-5">
                        {isLoadingMore ? "Loading..." : "Load More"}
                    </Button>
                </div>
            ) : null}
        </>
    );
};

export default FeedPageClient;

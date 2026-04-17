import { type NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import { getAttendanceFeedPage } from "@/lib/feed";

const getPage = (value: string | null) => {
    const page = Number(value);
    return Number.isInteger(page) && page > 0 ? page : 1;
};

const getLimit = (value: string | null) => {
    const limit = Number(value);
    if (!Number.isInteger(limit) || limit < 1) return 10;
    return Math.min(limit, 50);
};

// GET => /api/attendance-feed, get attendance feed
export const GET = async (request: NextRequest) => {
    try {
        await connectDB();

        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const page = getPage(request.nextUrl.searchParams.get("page"));
        const limit = getLimit(request.nextUrl.searchParams.get("limit"));
        const { feed, pagination } = await getAttendanceFeedPage(page, limit);

        return NextResponse.json({ success: true, data: feed, pagination }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Failed to fetch feed data" }, { status: 500 });
    }
};

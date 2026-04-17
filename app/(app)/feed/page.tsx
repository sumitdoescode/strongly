import Container from "@/components/Container";
import FeedPageClient from "@/components/FeedPageClient";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import { getAttendanceFeedPage } from "@/lib/feed";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const FeedPage = async () => {
    await connectDB();

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/");
    }

    const { feed, pagination } = await getAttendanceFeedPage(1, 10);

    return (
        <section className="pb-16">
            <Container>
                <FeedPageClient initialFeed={feed} initialPagination={pagination} />
            </Container>
        </section>
    );
};

export default FeedPage;

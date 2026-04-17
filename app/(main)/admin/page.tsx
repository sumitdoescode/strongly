import Container from "@/components/Container";
import AddMemberDialog from "@/components/AddMemberDialog";
import AdminSearch from "@/components/AdminSearch";
import MemberCard from "@/components/MemberCard";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Member from "@/models/Member";
import { Users } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const page = async ({ searchParams }) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/");
    }

    if (session.user.role !== "admin") {
        redirect("/dashboard");
    }

    const params = await searchParams;
    const search = params?.q?.trim() || "";

    await connectDB();

    let filter = {};

    if (search) {
        filter = {
            $or: [{ fullName: { $regex: search, $options: "i" } }, { gymCode: { $regex: search, $options: "i" } }],
        };
    }

    const members = await Member.find(filter).lean();
    const totalMembersCount = await Member.countDocuments();

    return (
        <section className="py-24 grow">
            <Container>
                <h1 className="text-4xl font-bold">Members</h1>

                <Card className="mt-5 gap-0 p-4 border-none">
                    <CardHeader className="m-0 p-0 gap-0">
                        <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center">
                            <Users className="w-6 h-6 text-rose-500" />
                        </div>
                    </CardHeader>
                    <CardContent className="text-right p-0 mt-0">
                        <h1 className="text-foreground font-bold text-4xl tracking-tight sm:mt-5">{totalMembersCount}</h1>
                        <h2 className="text-muted-foreground text-base">Total Members</h2>
                    </CardContent>
                </Card>

                <AddMemberDialog />

                <AdminSearch initialSearch={search} />

                {members.length === 0 && (
                    <div className="mt-10 ml-1 flex flex-col">
                        <h1 className="text-2xl font-bold">No members found</h1>
                        <p className="text-muted-foreground">
                            No members found with the search query <b>{search}</b>.
                        </p>
                    </div>
                )}

                <div className="mt-6 flex flex-col gap-2">
                    {members.map((member) => (
                        <MemberCard key={member._id.toString()} {...member} />
                    ))}
                </div>
            </Container>
        </section>
    );
};

export default page;

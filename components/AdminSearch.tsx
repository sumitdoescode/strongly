"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const AdminSearch = ({ initialSearch }) => {
    const [search, setSearch] = useState(initialSearch);
    const router = useRouter();

    const handleSearch = (e) => {
        e.preventDefault();

        const value = search.trim();

        if (!value) {
            router.push("/admin");
            return;
        }

        router.push(`/admin?q=${encodeURIComponent(value)}`);
    };

    return (
        <form onSubmit={handleSearch} className="flex w-full items-center gap-2 mt-6">
            <Input type="text" placeholder="Search by name.." className="text-lg md:text-lg px-3 py-2" value={search} onChange={(e) => setSearch(e.target.value)} />
            <Button type="submit" className="text-base">
                Search
            </Button>
        </form>
    );
};

export default AdminSearch;

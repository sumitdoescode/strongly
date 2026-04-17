import Member from "@/models/Member";

const getMemberSearchFilter = (search = "") => {
    const q = search.trim();

    if (!q) {
        return {};
    }

    return {
        $or: [{ fullName: { $regex: q, $options: "i" } }, { gymCode: { $regex: q, $options: "i" } }],
    };
};

export const getAdminMembers = async (search = "") => {
    const filter = getMemberSearchFilter(search);
    const members = await Member.find(filter).lean();
    const totalMembersCount = await Member.countDocuments();

    return { members, totalMembersCount };
};

export const getAdminMemberById = async (id: string) => {
    return Member.findById(id).select("_id fullName gymCode phone isActive").lean();
};

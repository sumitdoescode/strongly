import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient, ObjectId } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
}

const client = new MongoClient(MONGODB_URI);
const db = client.db();

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    database: mongodbAdapter(db),

    databaseHooks: {
        user: {
            create: {
                after: async (user) => {
                    const adminEmails = ["hi.sumitbro@gmail.com"];
                    const isAdmin = adminEmails.includes(user.email);
                    if (isAdmin) {
                        await db.collection("user").updateOne({ _id: new ObjectId(user.id) }, { $set: { role: "admin" } });
                    }
                },
            },
        },
    },

    user: {
        additionalFields: {
            memberId: {
                type: "string",
                defaultValue: "",
            },
            role: {
                type: "string", // admin, member
                defaultValue: "member",
            },
            isProfileCompleted: {
                type: "boolean",
                defaultValue: false,
            },
        },
        deleteUser: {
            enabled: true,
        },
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
    },
});

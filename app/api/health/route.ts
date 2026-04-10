import { NextResponse } from "next/server";

export const GET = async () => {
    return NextResponse.json({ status: "OK", message: "Server is running", timestamp: new Date().toISOString() });
};

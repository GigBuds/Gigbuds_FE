import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const accessToken = request.cookies.get("accessToken")?.value;
        if (!accessToken) {
            return NextResponse.json({ token: null }, { status: 401 });
        }
        return NextResponse.json({ token: accessToken });
    } catch {
        return NextResponse.json({ token: null }, { status: 401 });
    }
}
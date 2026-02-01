import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const companies = await prisma.company.findMany({
            orderBy: { name: "asc" },
        });
        return NextResponse.json(companies);
    } catch (error) {
        console.error("Failed to fetch companies:", error);
        return NextResponse.json({ error: "获取公司列表失败" }, { status: 500 });
    }
}

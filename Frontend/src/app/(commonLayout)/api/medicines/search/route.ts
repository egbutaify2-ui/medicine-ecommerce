import { mediService } from "@/services/medi.server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim();
  if (!query || query.length < 2) return NextResponse.json({ data: [] });
  try {
    const result = await mediService.getMedicines({ search: query, page: 1, limit: 8 }, { cache: "no-store" });
    const medicines = result?.data?.data;
    return NextResponse.json({ data: Array.isArray(medicines) ? medicines : [] });
  } catch (error) {
    console.error("Medicine search failed:", error);
    return NextResponse.json({ data: [], error: "Failed to fetch medicines." }, { status: 502 });
  }
}

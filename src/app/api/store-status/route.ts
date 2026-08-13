import { getStoreStatus } from "@/lib/store-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const body = JSON.stringify(await getStoreStatus());
  return new Response(body, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=30, s-maxage=60, stale-while-revalidate=300",
    },
  });
}

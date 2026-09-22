export const config = { runtime: "edge" }

export default function handler(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "-"
  console.log(ip)
  return new Response(null, { status: 204 })
}

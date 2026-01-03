import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL!;

async function handler(req: Request, ctx: { params: { path: string[] } }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  const url = new URL(req.url);
  const targetUrl = `${BACKEND_URL}/${ctx.params.path.join("/")}${url.search}`;

  const headers = new Headers(req.headers);
  headers.delete("host");
  headers.delete("content-length"); // to avoid mismatch
  // data passed must be in json
  headers.set("Content-Type", headers.get("Content-Type") || "application/json");

  if (token) headers.set("Authorization", `Bearer ${token}`);

  const body =
    req.method === "GET" || req.method === "HEAD"
      ? undefined
      : await req.text();

  const res = await fetch(targetUrl, {
    method: req.method,
    headers,
    body,
    redirect: "manual",
  });

  return new NextResponse(res.body, {
    status: res.status,
    headers: res.headers,
  });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;

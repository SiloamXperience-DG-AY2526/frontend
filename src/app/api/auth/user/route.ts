import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { AuthPayload } from "@/types/AuthData";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  console.log("Retrieved token:", token);

  if (!token) return NextResponse.json({ user: null }, { status: 200 });

  try {
    const payload = jwtDecode<AuthPayload>(token);

    // token expiry check
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return NextResponse.json({ userId: null, roles: [] }, { status: 200 });
    }

    console.log("Decoded token payload:", payload);
    return NextResponse.json(
      { userId: payload.userId, roles: payload.roles },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ userId: null, roles: [] }, { status: 200 });
  }
}

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL!;

type Ctx = { params: Promise<{ id: string }> | { id: string } };

export async function GET(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;

  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) {
    return NextResponse.json(
      { status: 'error', message: 'NO_ACCESS_TOKEN_COOKIE' },
      { status: 401 }
    );
  }

  const res = await fetch(`${BACKEND_URL}/volunteer-projects/${id}/details`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}

import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL!;

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // actual backend fetch profile endpoint
  const res = await fetch(`${BACKEND_URL}/profile/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const data = await res.json(); // user profile

  if (!res.ok) return NextResponse.json( data, { status: res.status });

  return NextResponse.json( data, { status: 200 });
}

import { fetchClient } from '@/lib/client';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const input = searchParams.get('url');
  if (!input) {
    return NextResponse.json(
      { error: 'url 정보가 없습니다.' },
      { status: 400 }
    );
  }
  try {
    const response = await fetch(
      `${fetchClient.baseUrl}/api/link?url=${input}`
    );
    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    return NextResponse.json({}, { status: 400 });
  }
}

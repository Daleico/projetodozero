import { NextResponse } from 'next/server';
import { getFeed } from '@/services/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const feed = await getFeed();
    return NextResponse.json(feed, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/feed:', error);
    return NextResponse.json(
      { error: 'Falha ao buscar o feed' },
      { status: 500 }
    );
  }
}

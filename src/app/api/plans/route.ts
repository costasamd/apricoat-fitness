import { NextResponse } from 'next/server';
import { listPlansByMemberId, createFitnessPlan } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const memberId = searchParams.get('memberId');

  if (!memberId) {
    return NextResponse.json({ error: 'memberId query param is required' }, { status: 400 });
  }

  const plans = await listPlansByMemberId(memberId);
  return NextResponse.json({ plans });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { memberId, createdBy, title, objectives, description, startDate, endDate } = body;

    if (!memberId || !createdBy || !title || !objectives) {
      return NextResponse.json(
        { error: 'memberId, createdBy, title, and objectives are required' },
        { status: 400 }
      );
    }

    const plan = await createFitnessPlan({
      memberId: String(memberId),
      createdBy: String(createdBy),
      title,
      objectives,
      description,
      startDate,
      endDate,
    });

    return NextResponse.json({ plan }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create plan';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

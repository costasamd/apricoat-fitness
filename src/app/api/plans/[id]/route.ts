import { NextResponse } from 'next/server';
import { getPlanById, listWorkoutsByPlanId } from '@/lib/db';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const plan = await getPlanById(id);

  if (!plan) {
    return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
  }

  const workouts = await listWorkoutsByPlanId(id);
  return NextResponse.json({ plan, workouts });
}

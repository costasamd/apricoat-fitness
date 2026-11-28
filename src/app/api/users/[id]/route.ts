import { NextResponse } from 'next/server';
import { getUserById, updateUserProfile, getMemberGoals, saveMemberGoals } from '@/lib/db';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getUserById(id);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const goals = await getMemberGoals(id);
  return NextResponse.json({ user, goals });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // 1. Update contact fields if provided
    const user = await updateUserProfile(id, {
      firstName: body.firstName,
      lastName: body.lastName,
      phone: body.phone,
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 2. Update member goals if any goal fields are provided
    let goals = await getMemberGoals(id);
    if (
      body.primaryGoal !== undefined ||
      body.fitnessLevel !== undefined ||
      body.daysAvailablePerWeek !== undefined ||
      body.preferredTrainingTypes !== undefined ||
      body.limitations !== undefined
    ) {
      goals = await saveMemberGoals(id, {
        primaryGoal: body.primaryGoal ?? goals?.primaryGoal ?? null,
        fitnessLevel: body.fitnessLevel ?? goals?.fitnessLevel ?? null,
        daysAvailablePerWeek: body.daysAvailablePerWeek ?? goals?.daysAvailablePerWeek ?? null,
        preferredTrainingTypes: body.preferredTrainingTypes ?? goals?.preferredTrainingTypes ?? [],
        limitations: body.limitations ?? goals?.limitations ?? null,
      });
    }

    return NextResponse.json({ user, goals });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update profile';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

const SELECT_COLS = `id, title, end_date as "endDate", completed, focus_area, created_at as "createdAt"`;

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json() as {
      title?: string;
      endDate?: string;
      focus_area?: string;
      completed?: boolean;
    };

    const setClauses: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (body.title !== undefined) {
      setClauses.push(`title = $${idx++}`);
      values.push(body.title);
    }
    if (body.endDate !== undefined) {
      setClauses.push(`end_date = $${idx++}`);
      values.push(body.endDate);
    }
    if (body.focus_area !== undefined) {
      setClauses.push(`focus_area = $${idx++}`);
      values.push(body.focus_area);
    }
    if (body.completed !== undefined) {
      setClauses.push(`completed = $${idx++}`);
      values.push(body.completed);
    }

    if (setClauses.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    values.push(id);
    const pool = getPool();
    const result = await pool.query(
      `UPDATE goals SET ${setClauses.join(', ')} WHERE id = $${idx} RETURNING ${SELECT_COLS}`,
      values
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error('[PATCH /api/goals/[id]]', err);
    return NextResponse.json({ error: 'Failed to update goal' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const pool = getPool();
    await pool.query('DELETE FROM goals WHERE id = $1', [id]);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error('[DELETE /api/goals/[id]]', err);
    return NextResponse.json({ error: 'Failed to delete goal' }, { status: 500 });
  }
}

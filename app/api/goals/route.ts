import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

const SELECT_COLS = `id, title, end_date as "endDate", completed, focus_area, created_at as "createdAt"`;

export async function GET() {
  try {
    const pool = getPool();
    const result = await pool.query(`SELECT ${SELECT_COLS} FROM goals ORDER BY created_at DESC`);
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error('[GET /api/goals]', err);
    return NextResponse.json({ error: 'Failed to fetch goals' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { title?: string; endDate?: string; focus_area?: string };
    const { title, endDate, focus_area } = body;

    if (!title || !endDate || !focus_area) {
      return NextResponse.json({ error: 'title, endDate, and focus_area are required' }, { status: 400 });
    }

    const pool = getPool();
    const result = await pool.query(
      `INSERT INTO goals (title, end_date, focus_area)
       VALUES ($1, $2, $3)
       RETURNING ${SELECT_COLS}`,
      [title, endDate, focus_area]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err) {
    console.error('[POST /api/goals]', err);
    return NextResponse.json({ error: 'Failed to create goal' }, { status: 500 });
  }
}

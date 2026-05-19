import type { StorageAdapter, Goal, CreateGoalInput, UpdateGoalInput } from '@/types/goal';

export class ApiAdapter implements StorageAdapter {
  async listGoals(): Promise<Goal[]> {
    const res = await fetch('/api/goals');
    if (!res.ok) throw new Error(`Failed to list goals: ${res.statusText}`);
    return res.json() as Promise<Goal[]>;
  }

  async createGoal(data: CreateGoalInput): Promise<Goal> {
    const res = await fetch('/api/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: data.title, endDate: data.endDate, focus_area: data.focus_area }),
    });
    if (!res.ok) throw new Error(`Failed to create goal: ${res.statusText}`);
    return res.json() as Promise<Goal>;
  }

  async updateGoal(id: string, data: UpdateGoalInput): Promise<Goal> {
    const res = await fetch(`/api/goals/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Failed to update goal: ${res.statusText}`);
    return res.json() as Promise<Goal>;
  }

  async deleteGoal(id: string): Promise<void> {
    const res = await fetch(`/api/goals/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Failed to delete goal: ${res.statusText}`);
  }
}

import type { StorageAdapter, Goal, CreateGoalInput, UpdateGoalInput } from '@/types/goal';

const STORAGE_KEY = 'doit_goals';

export class LocalStorageAdapter implements StorageAdapter {
  private readGoals(): Goal[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      return JSON.parse(raw) as Goal[];
    } catch {
      return [];
    }
  }

  private writeGoals(goals: Goal[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
  }

  async listGoals(): Promise<Goal[]> {
    return this.readGoals();
  }

  async createGoal(data: CreateGoalInput): Promise<Goal> {
    const goals = this.readGoals();
    const newGoal: Goal = {
      id: crypto.randomUUID(),
      title: data.title,
      endDate: data.endDate,
      completed: false,
      focus_area: data.focus_area,
      createdAt: new Date().toISOString(),
    };
    goals.push(newGoal);
    this.writeGoals(goals);
    return newGoal;
  }

  async updateGoal(id: string, data: UpdateGoalInput): Promise<Goal> {
    const goals = this.readGoals();
    const index = goals.findIndex((g) => g.id === id);
    if (index === -1) {
      throw new Error(`Goal with id "${id}" not found`);
    }
    const updated: Goal = {
      ...goals[index],
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.endDate !== undefined ? { endDate: data.endDate } : {}),
      ...(data.focus_area !== undefined ? { focus_area: data.focus_area } : {}),
      ...(data.completed !== undefined ? { completed: data.completed } : {}),
    };
    goals[index] = updated;
    this.writeGoals(goals);
    return updated;
  }

  async deleteGoal(id: string): Promise<void> {
    const goals = this.readGoals().filter((g) => g.id !== id);
    this.writeGoals(goals);
  }
}

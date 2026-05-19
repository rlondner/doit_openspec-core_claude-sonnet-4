export type FocusArea = 'personal' | 'professional';

export interface Goal {
  id: string;
  title: string;
  endDate: string; // ISO date string YYYY-MM-DD
  completed: boolean;
  focus_area: FocusArea;
  createdAt: string; // ISO timestamp
}

export interface CreateGoalInput {
  title: string;
  endDate: string;
  focus_area: FocusArea;
}

export interface UpdateGoalInput {
  title?: string;
  endDate?: string;
  focus_area?: FocusArea;
  completed?: boolean;
}

export interface StorageAdapter {
  listGoals(): Promise<Goal[]>;
  createGoal(data: CreateGoalInput): Promise<Goal>;
  updateGoal(id: string, data: UpdateGoalInput): Promise<Goal>;
  deleteGoal(id: string): Promise<void>;
}

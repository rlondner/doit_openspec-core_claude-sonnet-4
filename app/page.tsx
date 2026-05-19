'use client';
import { useState, useEffect, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { GoalCard } from '@/components/GoalCard';
import { GoalModal } from '@/components/GoalModal';
import { Button } from '@/components/ui/button';
import { getStorageAdapter } from '@/lib/storage';
import type { Goal, CreateGoalInput } from '@/types/goal';

export default function Home() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | undefined>();
  const [loading, setLoading] = useState(true);

  const adapter = useMemo(() => getStorageAdapter(), []);

  // Load goals on mount
  useEffect(() => {
    adapter
      .listGoals()
      .then(setGoals)
      .catch((err) => console.error('[doit] Failed to load goals', err))
      .finally(() => setLoading(false));
  }, [adapter]);

  const activeGoals = goals.filter((g) => !g.completed);
  const completedGoals = goals.filter((g) => g.completed);

  function handleOpenAdd() {
    setEditingGoal(undefined);
    setModalOpen(true);
  }

  function handleOpenEdit(goal: Goal) {
    setEditingGoal(goal);
    setModalOpen(true);
  }

  async function handleAddGoal(data: CreateGoalInput) {
    try {
      const newGoal = await adapter.createGoal(data);
      setGoals((prev) => [...prev, newGoal]);
    } catch (err) {
      console.error('[doit] Failed to create goal', err);
    }
  }

  async function handleEdit(data: CreateGoalInput, goal: Goal) {
    try {
      const updated = await adapter.updateGoal(goal.id, data);
      setGoals((prev) => prev.map((g) => (g.id === goal.id ? updated : g)));
    } catch (err) {
      console.error('[doit] Failed to update goal', err);
    }
  }

  async function handleToggleComplete(goal: Goal) {
    try {
      const updated = await adapter.updateGoal(goal.id, { completed: !goal.completed });
      setGoals((prev) => prev.map((g) => (g.id === goal.id ? updated : g)));
    } catch (err) {
      console.error('[doit] Failed to toggle goal', err);
    }
  }

  async function handleDelete(id: string) {
    try {
      await adapter.deleteGoal(id);
      setGoals((prev) => prev.filter((g) => g.id !== id));
    } catch (err) {
      console.error('[doit] Failed to delete goal', err);
    }
  }

  async function handleModalSubmit(data: CreateGoalInput) {
    if (editingGoal) {
      await handleEdit(data, editingGoal);
    } else {
      await handleAddGoal(data);
    }
    setModalOpen(false);
    setEditingGoal(undefined);
  }

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  return (
    <>
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-surface-container-lowest border-b border-surface-container">
        <div className="max-w-screen-2xl mx-auto px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-headline font-extrabold text-xl text-primary tracking-tight">
              Do It
            </span>
            <span className="w-2 h-2 rounded-full bg-radiant-primary inline-block mb-0.5" />
          </div>

          <nav className="flex items-center gap-6">
            <span className="text-sm font-label font-medium text-on-surface-variant">
              {activeGoals.length} active
            </span>
            <span className="text-sm font-label font-medium text-on-surface-variant">
              {completedGoals.length} done
            </span>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-screen-2xl mx-auto w-full px-8 py-12">
        {/* Hero */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="font-headline font-extrabold text-4xl text-on-background leading-tight">
              {greeting} 👋
            </h1>
            <p className="mt-2 font-body text-on-surface-variant text-base">
              {activeGoals.length === 0
                ? 'No active goals yet — add one to get started!'
                : `You have ${activeGoals.length} active goal${activeGoals.length !== 1 ? 's' : ''} in progress.`}
            </p>
          </div>

          <Button variant="primary" onClick={handleOpenAdd} className="mt-1 gap-2">
            <Plus size={18} />
            Add New Goal
          </Button>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 rounded-full border-4 border-primary-container border-t-primary animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Active Goals */}
            <section className="lg:col-span-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-headline font-bold text-xl text-on-surface">
                  Active Goals
                </h2>
                <span className="text-sm font-label text-on-surface-variant bg-surface-container px-3 py-1 rounded-full">
                  {activeGoals.length}
                </span>
              </div>

              {activeGoals.length === 0 ? (
                <div className="rounded-xl bg-surface-container-lowest p-12 flex flex-col items-center justify-center text-center gap-3">
                  <span className="material-symbols-outlined text-4xl text-primary-fixed-dim">
                    flag
                  </span>
                  <p className="font-headline font-semibold text-on-surface">
                    No active goals
                  </p>
                  <p className="text-sm font-body text-on-surface-variant max-w-xs">
                    Click "Add New Goal" to start tracking your ambitions.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {activeGoals.map((goal) => (
                    <GoalCard
                      key={goal.id}
                      goal={goal}
                      onToggleComplete={() => handleToggleComplete(goal)}
                      onEdit={() => handleOpenEdit(goal)}
                      onDelete={() => handleDelete(goal.id)}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Completed Goals */}
            <section className="lg:col-span-4">
              <div className="bg-surface-container-low rounded-3xl p-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-headline font-bold text-xl text-on-surface">
                    Completed
                  </h2>
                  <span className="text-sm font-label text-on-surface-variant bg-surface-container px-3 py-1 rounded-full">
                    {completedGoals.length}
                  </span>
                </div>

                {completedGoals.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center gap-2 py-8">
                    <span className="material-symbols-outlined text-3xl text-outline">
                      check_circle
                    </span>
                    <p className="text-sm font-body text-on-surface-variant">
                      Completed goals will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {completedGoals.map((goal) => (
                      <GoalCard
                        key={goal.id}
                        goal={goal}
                        onToggleComplete={() => handleToggleComplete(goal)}
                        onEdit={() => handleOpenEdit(goal)}
                        onDelete={() => handleDelete(goal.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Goal Modal */}
      <GoalModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingGoal(undefined);
        }}
        onSubmit={handleModalSubmit}
        goal={editingGoal}
      />
    </>
  );
}

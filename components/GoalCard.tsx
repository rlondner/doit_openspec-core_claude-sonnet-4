'use client';
import { differenceInCalendarDays } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import type { Goal } from '@/types/goal';

interface GoalCardProps {
  goal: Goal;
  onToggleComplete: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function getDaysInfo(endDate: string): { days: number; label: string } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  const days = differenceInCalendarDays(end, today);

  let label: string;
  if (days < 0) label = 'Overdue';
  else if (days === 0) label = 'Due Today';
  else if (days === 1) label = '1 Day Left';
  else label = `${days} Days Left`;

  return { days, label };
}

export function GoalCard({ goal, onToggleComplete, onEdit, onDelete }: GoalCardProps) {
  const { days, label } = getDaysInfo(goal.endDate);
  const isUrgent = !goal.completed && days <= 3;

  return (
    <div
      className={[
        'rounded-xl p-5 flex items-center gap-4 group transition-all duration-300',
        'shadow-[0_4px_16px_-4px_rgba(240,122,80,0.08)]',
        isUrgent
          ? 'bg-tertiary-container'
          : 'bg-surface-container-lowest',
      ].join(' ')}
    >
      {/* Checkbox */}
      <Checkbox
        checked={goal.completed}
        onChange={onToggleComplete}
        aria-label={goal.completed ? 'Mark incomplete' : 'Mark complete'}
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={[
            'font-headline font-bold text-base leading-snug truncate',
            goal.completed
              ? 'line-through text-on-surface-variant'
              : 'text-on-surface',
          ].join(' ')}
        >
          {goal.title}
        </p>

        {/* Days badge */}
        <div className="mt-1.5 inline-flex items-center gap-1">
          <span
            className={[
              'inline-flex items-center gap-1 text-xs font-label font-medium px-2.5 py-0.5 rounded-full',
              days < 0 || (isUrgent && days <= 1)
                ? 'bg-red-100 text-red-600'
                : isUrgent
                ? 'bg-red-100 text-red-600'
                : 'bg-surface-container text-on-surface-variant',
            ].join(' ')}
          >
            <span className="material-symbols-outlined text-[14px]">schedule</span>
            {label}
          </span>

          {/* Focus area badge */}
          <span className="inline-flex items-center text-xs font-label font-medium px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant capitalize">
            {goal.focus_area}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {!goal.completed && (
          <button
            onClick={onEdit}
            aria-label="Edit goal"
            className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary-container transition-colors duration-200"
          >
            <Pencil size={15} />
          </button>
        )}
        <button
          onClick={onDelete}
          aria-label="Delete goal"
          className="p-1.5 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container transition-colors duration-200"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}

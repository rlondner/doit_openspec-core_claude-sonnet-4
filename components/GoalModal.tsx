'use client';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { Goal, CreateGoalInput, FocusArea } from '@/types/goal';

interface GoalModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateGoalInput) => void;
  goal?: Goal;
}

export function GoalModal({ open, onClose, onSubmit, goal }: GoalModalProps) {
  const isEdit = !!goal;

  const [title, setTitle] = useState('');
  const [endDate, setEndDate] = useState('');
  const [focusArea, setFocusArea] = useState<FocusArea>('personal');
  const [errors, setErrors] = useState<{ title?: string; endDate?: string }>({});

  // Sync form when goal changes or modal opens
  useEffect(() => {
    if (open) {
      setTitle(goal?.title ?? '');
      setEndDate(goal?.endDate ?? '');
      setFocusArea(goal?.focus_area ?? 'personal');
      setErrors({});
    }
  }, [open, goal]);

  function validate(): boolean {
    const newErrors: { title?: string; endDate?: string } = {};
    if (!title.trim()) newErrors.title = 'Goal title is required.';
    if (!endDate) newErrors.endDate = 'End date is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    onSubmit({ title: title.trim(), endDate, focus_area: focusArea });
  }

  return (
    <Dialog open={open} onClose={onClose}>
      {/* Header — radiant gradient */}
      <div className="bg-radiant-primary relative px-8 pt-8 pb-10 overflow-hidden">
        {/* Decorative circle */}
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute top-4 right-16 w-16 h-16 rounded-full bg-white/10 pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors duration-200"
        >
          <X size={16} />
        </button>

        <p className="text-white/70 text-sm font-label font-medium mb-1">
          {isEdit ? 'Edit Goal' : 'New Goal'}
        </p>
        <h2 className="text-white font-headline font-bold text-2xl leading-tight">
          {isEdit ? 'Refine Your Ambition' : 'Ignite a New Path'}
        </h2>
        <p className="text-white/70 text-sm font-body mt-1">
          {isEdit
            ? 'Update the details for your goal below.'
            : 'Define a clear goal and set yourself up for success.'}
        </p>
      </div>

      {/* Body */}
      <div className="p-8 pt-8 space-y-6 bg-surface-container-lowest/90">
        {/* Title */}
        <div className="space-y-1.5">
          <label className="text-sm font-label font-semibold text-on-surface-variant">
            Goal Title
          </label>
          <Input
            placeholder="e.g. Launch my side project"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          {errors.title && (
            <p className="text-xs text-error font-label">{errors.title}</p>
          )}
        </div>

        {/* End Date + Focus Area */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-label font-semibold text-on-surface-variant">
              End Date
            </label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            {errors.endDate && (
              <p className="text-xs text-error font-label">{errors.endDate}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-label font-semibold text-on-surface-variant">
              Focus Area
            </label>
            <div className="flex gap-2">
              {(['professional', 'personal'] as FocusArea[]).map((area) => (
                <button
                  key={area}
                  type="button"
                  onClick={() => setFocusArea(area)}
                  className={[
                    'flex-1 py-2.5 px-3 rounded-full text-sm font-label font-semibold transition-all duration-200 capitalize',
                    focusArea === area
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-secondary-container text-on-secondary-container hover:bg-primary-container',
                  ].join(' ')}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <div>
            {isEdit && (
              <button
                type="button"
                onClick={onClose}
                className="text-sm font-label font-medium text-error hover:underline"
              >
                Delete Goal
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {isEdit ? 'Save Changes' : 'Create Goal'}
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

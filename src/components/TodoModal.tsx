import React, { useState, useEffect } from 'react';
import { Todo, TodoPriority } from '../types/index.ts';
import { DatePickerModal } from './DatePickerModal.tsx';
import { Calendar, Check, X, CheckSquare, Flag, Trash2 } from 'lucide-react';

interface TodoModalProps {
  isOpen: boolean;
  todo?: Todo | null;
  onSave: (todo: Todo) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
}

export const TodoModal: React.FC<TodoModalProps> = ({
  isOpen,
  todo,
  onSave,
  onDelete,
  onClose,
}) => {
  const [task, setTask] = useState('');
  const [dueDate, setDueDate] = useState<string>('');
  const [priority, setPriority] = useState<TodoPriority>('Medium');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [errors, setErrors] = useState<{ task?: string }>({});

  useEffect(() => {
    if (todo) {
      setTask(todo.task);
      setDueDate(todo.dueDate || '');
      setPriority(todo.priority || 'Medium');
    } else {
      setTask('');
      setDueDate('');
      setPriority('Medium');
    }
    setErrors({});
  }, [todo, isOpen]);

  if (!isOpen) return null;

  const priorityPresets: TodoPriority[] = ['Low', 'Medium', 'High'];

  const quickTaskPresets = [
    'Check swimming pool water & chlorine',
    'Cut lawn grass & clean garden',
    'Order water jars for guest arrival',
    'Pay monthly electricity bill',
    'Inspect bathroom geysers & lights',
    'Restock kitchen tea, sugar & milk',
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!task.trim()) {
      setErrors({ task: 'Please enter task description' });
      return;
    }

    const payload: Todo = {
      id: todo?.id || `td-${Date.now()}`,
      task: task.trim(),
      dueDate: dueDate || undefined,
      priority,
      isDone: todo?.isDone || false,
      createdAt: todo?.createdAt || Date.now(),
    };

    onSave(payload);
    onClose();
  };

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="todo-modal-title"
        className="fixed inset-0 z-40 flex items-center justify-center bg-black/75 p-3 sm:p-4 backdrop-blur-xs overflow-y-auto"
      >
        <div className="bg-white dark:bg-stone-900 rounded-3xl w-full max-w-xl shadow-2xl border-2 border-stone-300 dark:border-stone-700 flex flex-col my-auto max-h-[92vh] overflow-hidden">
          {/* Header */}
          <div className="bg-[#C62828] dark:bg-red-950 text-white p-5 flex items-center justify-between shrink-0">
            <div>
              <h2 id="todo-modal-title" className="text-2xl sm:text-3xl font-black">
                {todo ? 'Edit Task' : 'Add New Task'}
              </h2>
              <p className="text-red-100 text-lg font-medium">
                Zarf Farmhouse, Bhopal
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close form"
              className="p-2 text-white hover:bg-red-800 rounded-full min-w-[48px] min-h-[48px] flex items-center justify-center"
            >
              <X className="w-8 h-8" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSave} className="p-5 overflow-y-auto space-y-6 flex-1 text-stone-900 dark:text-stone-100">
            {/* Priority Chips */}
            <div>
              <label className="block text-xl font-black mb-2 flex items-center gap-2">
                <Flag className="w-6 h-6 text-[#C62828] dark:text-red-400" />
                Priority *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {priorityPresets.map((pr) => {
                  const isSelected = priority === pr;
                  const colorClass =
                    pr === 'High'
                      ? 'bg-[#C62828] text-white border-red-800'
                      : pr === 'Medium'
                      ? 'bg-amber-600 text-white border-amber-700'
                      : 'bg-stone-600 text-white border-stone-700';

                  return (
                    <button
                      key={pr}
                      type="button"
                      onClick={() => setPriority(pr)}
                      className={`min-h-[52px] py-3 px-2 rounded-2xl text-xl font-black transition-all flex items-center justify-center border-2 ${
                        isSelected
                          ? `${colorClass} shadow-md ring-4 ring-red-200 dark:ring-red-900`
                          : 'bg-stone-100 dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200'
                      }`}
                    >
                      {pr}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Task Presets */}
            <div>
              <label className="block text-xl font-black mb-2 flex items-center gap-2">
                <CheckSquare className="w-6 h-6 text-[#C62828] dark:text-red-400" />
                Task Text *
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="text-sm font-bold text-stone-500 w-full">Quick Common Tasks:</span>
                {quickTaskPresets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setTask(preset);
                      if (errors.task) setErrors({});
                    }}
                    className="px-3 py-1.5 bg-stone-200 dark:bg-stone-800 hover:bg-red-50 dark:hover:bg-red-950 text-stone-800 dark:text-stone-200 rounded-xl text-sm sm:text-base font-semibold text-left"
                  >
                    {preset}
                  </button>
                ))}
              </div>
              <textarea
                rows={3}
                value={task}
                onChange={(e) => {
                  setTask(e.target.value);
                  if (errors.task) setErrors({});
                }}
                placeholder="What needs to be done at the farmhouse?"
                className={`w-full text-xl px-4 py-3 rounded-2xl border-2 bg-stone-50 dark:bg-stone-800 font-medium ${
                  errors.task
                    ? 'border-red-600 focus:ring-4 focus:ring-red-200'
                    : 'border-stone-400 dark:border-stone-600 focus:border-[#C62828]'
                }`}
              />
              {errors.task && (
                <p className="text-red-600 font-bold text-lg mt-1">{errors.task}</p>
              )}
            </div>

            {/* Due Date (Optional) */}
            <div>
              <label className="block text-xl font-black mb-2 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-[#C62828] dark:text-red-400" />
                Due Date (Optional)
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsDatePickerOpen(true)}
                  className="flex-1 min-h-[56px] text-xl px-4 py-3 rounded-2xl border-2 border-stone-400 dark:border-stone-600 bg-stone-50 dark:bg-stone-800 text-left font-bold flex items-center justify-between"
                >
                  <span>{dueDate || 'No Due Date Set'}</span>
                  <span className="text-base text-[#C62828] dark:text-red-400 underline font-black">
                    Pick
                  </span>
                </button>
                {dueDate && (
                  <button
                    type="button"
                    onClick={() => setDueDate('')}
                    className="px-4 py-3 bg-stone-200 dark:bg-stone-800 hover:bg-red-100 text-stone-800 dark:text-stone-200 rounded-2xl min-h-[56px] text-lg font-bold"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Big Save & Cancel Buttons */}
            <div className="pt-4 border-t-2 border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row gap-3">
              {todo && onDelete && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Delete this task?')) {
                      onDelete(todo.id);
                      onClose();
                    }
                  }}
                  className="py-4 px-6 bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 border-2 border-red-400 rounded-2xl text-xl font-black min-h-[56px] flex items-center justify-center gap-2 active:scale-95"
                >
                  <Trash2 className="w-6 h-6" />
                  Delete
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-4 px-6 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 text-stone-900 dark:text-stone-100 rounded-2xl text-xl font-black min-h-[56px] flex items-center justify-center gap-2 active:scale-95 border-2 border-stone-400 dark:border-stone-600"
              >
                <X className="w-6 h-6" />
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-4 px-6 bg-[#C62828] hover:bg-red-800 text-white rounded-2xl text-xl font-black min-h-[56px] flex items-center justify-center gap-2 shadow-sm active:scale-95"
              >
                <Check className="w-7 h-7" />
                Save Task
              </button>
            </div>
          </form>
        </div>
      </div>

      <DatePickerModal
        isOpen={isDatePickerOpen}
        title="Select Due Date"
        initialDate={dueDate || undefined}
        onSelect={(date) => setDueDate(date)}
        onClose={() => setIsDatePickerOpen(false)}
      />
    </>
  );
};

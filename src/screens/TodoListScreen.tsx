import React from 'react';
import { Todo } from '../types/index.ts';
import { formatFriendlyDate, sortTodos } from '../utils/calculations.ts';
import {
  CheckSquare,
  Square,
  Plus,
  Calendar,
  Trash2,
  CheckCircle2,
} from 'lucide-react';

interface TodoListScreenProps {
  todos: Todo[];
  onAddTodo: () => void;
  onEditTodo: (todo: Todo) => void;
  onToggleTodo: (todo: Todo) => void;
  onDeleteTodo: (id: string) => void;
}

export const TodoListScreen: React.FC<TodoListScreenProps> = ({
  todos,
  onAddTodo,
  onEditTodo,
  onToggleTodo,
  onDeleteTodo,
}) => {
  const sorted = sortTodos(todos);
  const pendingCount = todos.filter((t) => !t.isDone).length;
  const completedCount = todos.filter((t) => t.isDone).length;

  return (
    <div className="space-y-5 text-stone-900 dark:text-stone-100">
      {/* Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-3xl font-black tracking-tight text-stone-900 dark:text-white">
            Farmhouse To-Do List
          </h3>
          <div className="h-0.5 w-12 bg-[#C62828] mt-1" />
          <p className="text-base sm:text-lg font-bold text-stone-600 dark:text-stone-400 mt-1">
            {pendingCount} pending task{pendingCount === 1 ? '' : 's'} • {completedCount} completed
          </p>
        </div>

        <button
          onClick={onAddTodo}
          className="py-3 px-6 bg-[#C62828] hover:bg-red-800 active:scale-95 text-white rounded-xl text-xl font-black shadow-sm flex items-center justify-center gap-2 min-h-[52px] transition-all"
        >
          <Plus className="w-6 h-6" />
          <span>Add Task</span>
        </button>
      </div>

      {/* List or Empty State */}
      {sorted.length === 0 ? (
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-8 border border-stone-200 dark:border-stone-800 text-center shadow-xs">
          <CheckSquare className="w-12 h-12 text-stone-300 dark:text-stone-600 mx-auto mb-3" />
          <p className="text-2xl font-black text-stone-800 dark:text-stone-200 mb-1">
            No tasks in your to-do list
          </p>
          <p className="text-lg text-stone-500 mb-6 font-medium">
            Keep track of pool chlorination, lawn mowing, bills, and guest preparations.
          </p>
          <button
            onClick={onAddTodo}
            className="py-3.5 px-6 bg-[#C62828] hover:bg-red-800 text-white rounded-xl text-xl font-black shadow-sm inline-flex items-center gap-2 min-h-[52px] active:scale-95"
          >
            <Plus className="w-6 h-6" />
            Add First Task
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((todo) => {
            const isDone = todo.isDone;
            return (
              <div
                key={todo.id}
                onClick={() => onEditTodo(todo)}
                className={`rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer flex items-start gap-4 ${
                  isDone
                    ? 'bg-stone-50 dark:bg-stone-900/50 border-stone-200 dark:border-stone-800 opacity-70'
                    : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-red-300 shadow-xs'
                }`}
              >
                {/* Big Checkbox Tap Target (min 48px x 48px) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleTodo(todo);
                  }}
                  aria-label={isDone ? `Mark "${todo.task}" incomplete` : `Mark "${todo.task}" complete`}
                  className={`min-w-[48px] min-h-[48px] rounded-xl border flex items-center justify-center transition-all shrink-0 active:scale-95 ${
                    isDone
                      ? 'bg-[#C62828] border-[#C62828] text-white'
                      : 'border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-800 hover:bg-red-50 text-stone-400'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-7 h-7" />
                  ) : (
                    <Square className="w-7 h-7" />
                  )}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-xl font-black leading-snug break-words ${
                      isDone
                        ? 'line-through text-stone-400 dark:text-stone-500 font-semibold'
                        : 'text-stone-900 dark:text-stone-100'
                    }`}
                  >
                    {todo.task}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {/* Priority Badge */}
                    <span
                      className={`px-2.5 py-0.5 rounded-lg text-sm font-bold border ${
                        todo.priority === 'High'
                          ? 'bg-red-50 text-[#C62828] border-red-200 dark:bg-red-950 dark:text-red-300'
                          : todo.priority === 'Medium'
                          ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-stone-100 text-stone-700 border-stone-200 dark:bg-stone-800 dark:text-stone-300'
                      }`}
                    >
                      {todo.priority} Priority
                    </span>

                    {/* Due Date */}
                    {todo.dueDate && (
                      <span className="text-sm font-semibold text-stone-500 dark:text-stone-400 flex items-center gap-1 bg-stone-50 dark:bg-stone-800 px-2.5 py-0.5 rounded-lg border border-stone-200 dark:border-stone-700">
                        <Calendar className="w-3.5 h-3.5 text-[#C62828]" />
                        Due: {formatFriendlyDate(todo.dueDate)}
                      </span>
                    )}

                    {isDone && (
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                        Done
                      </span>
                    )}
                  </div>
                </div>

                {/* Delete button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Delete this task?')) {
                      onDeleteTodo(todo.id);
                    }
                  }}
                  aria-label="Delete task"
                  className="p-2 text-stone-400 hover:text-red-600 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl min-w-[44px] min-h-[44px] flex items-center justify-center shrink-0"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

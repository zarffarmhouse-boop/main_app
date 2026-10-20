import React, { useState } from 'react';
import { Person } from '../types/index.ts';
import {
  Users,
  Plus,
  Phone,
  MessageCircle,
  FileText,
  Search,
  X,
} from 'lucide-react';

interface PeopleScreenProps {
  people: Person[];
  onAddPerson: () => void;
  onEditPerson: (person: Person) => void;
}

export const PeopleScreen: React.FC<PeopleScreenProps> = ({
  people,
  onAddPerson,
  onEditPerson,
}) => {
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const roles = ['All', 'Staff', 'Vendor', 'Guest Contact'];

  const filtered = people
    .filter((p) => {
      const matchesRole = roleFilter === 'All' || p.role === roleFilter;
      if (!matchesRole) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        (p.notes && p.notes.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="space-y-5 text-stone-900 dark:text-stone-100">
      {/* Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-3xl font-black tracking-tight text-stone-900 dark:text-white">
            People & Contacts
          </h3>
          <div className="h-0.5 w-12 bg-[#C62828] mt-1" />
          <p className="text-base sm:text-lg font-bold text-stone-600 dark:text-stone-400 mt-1">
            Staff, service vendors, and guest phone directory
          </p>
        </div>

        <button
          onClick={onAddPerson}
          className="py-3 px-6 bg-[#C62828] hover:bg-red-800 active:scale-95 text-white rounded-xl text-xl font-black shadow-sm flex items-center justify-center gap-2 min-h-[52px] transition-all"
        >
          <Plus className="w-6 h-6" />
          <span>Add Contact</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-6 h-6 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, phone, or work..."
          className="w-full min-h-[56px] pl-13 pr-10 text-xl font-bold bg-white dark:bg-stone-900 rounded-2xl border border-stone-300 dark:border-stone-700 shadow-xs focus:border-[#C62828] focus:ring-4 focus:ring-red-100"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-stone-400 hover:text-stone-700 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Role Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {roles.map((r) => {
          const isSelected = roleFilter === r;
          return (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`min-h-[46px] px-4 py-2 rounded-xl text-base sm:text-lg font-bold transition-all shrink-0 border ${
                isSelected
                  ? 'bg-[#C62828] border-[#C62828] text-white shadow-xs font-black'
                  : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100'
              }`}
            >
              {r}
            </button>
          );
        })}
      </div>

      {/* People Cards */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-8 border border-stone-200 dark:border-stone-800 text-center shadow-xs">
          <Users className="w-12 h-12 text-stone-300 dark:text-stone-600 mx-auto mb-3" />
          <p className="text-2xl font-black text-stone-800 dark:text-stone-200 mb-1">
            No contacts recorded yet
          </p>
          <p className="text-lg text-stone-500 mb-6 font-medium">
            Add farmhouse caretaker, electricians, plumbers, and caterers for instant calling.
          </p>
          <button
            onClick={onAddPerson}
            className="py-3.5 px-6 bg-[#C62828] hover:bg-red-800 text-white rounded-xl text-xl font-black shadow-sm inline-flex items-center gap-2 min-h-[52px] active:scale-95"
          >
            <Plus className="w-6 h-6" />
            Add First Contact
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => (
            <div
              key={p.id}
              onClick={() => onEditPerson(p)}
              className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 hover:border-red-300 shadow-xs transition-all active:scale-[0.99] cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-0.5 rounded-lg text-sm font-bold border ${
                        p.role === 'Staff'
                          ? 'bg-red-50 text-[#C62828] border-red-200 dark:bg-red-950 dark:text-red-300'
                          : p.role === 'Vendor'
                          ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-stone-100 text-stone-800 border-stone-200 dark:bg-stone-800 dark:text-stone-300'
                      }`}
                    >
                      {p.role}
                    </span>
                  </div>
                  <h4 className="text-2xl font-black text-stone-900 dark:text-white mt-1">
                    {p.name}
                  </h4>
                </div>

                {/* Call and WhatsApp Quick Actions */}
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <a
                    href={`tel:${p.phone}`}
                    className="px-4 py-2 bg-[#C62828] hover:bg-red-800 text-white rounded-xl text-base font-bold flex items-center gap-1.5 min-h-[44px] shadow-xs active:scale-95"
                  >
                    <Phone className="w-4 h-4" />
                    Call
                  </a>
                  <a
                    href={`https://wa.me/91${p.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-800 dark:text-stone-200 rounded-xl text-base font-bold flex items-center gap-1.5 min-h-[44px] border border-stone-200 dark:border-stone-700"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    WhatsApp
                  </a>
                </div>
              </div>

              {p.notes && (
                <div className="mt-1.5 p-2.5 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700 text-base font-medium text-stone-700 dark:text-stone-300 flex items-start gap-2">
                  <FileText className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                  <span>{p.notes}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-stone-100 dark:border-stone-800">
                <span className="text-sm font-semibold text-stone-500">
                  Phone: <strong className="text-stone-900 dark:text-stone-100">{p.phone}</strong>
                </span>
                <span className="text-sm font-bold text-[#C62828] dark:text-red-400 underline">
                  Tap to edit
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

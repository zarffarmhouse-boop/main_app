import React, { useState } from 'react';
import { Enquiry, EnquiryStatus } from '../types/index.ts';
import { filterEnquiries, formatFriendlyDate } from '../utils/calculations.ts';
import {
  Search,
  Plus,
  Phone,
  Calendar,
  Users,
  MessageSquareQuote,
  X,
  FileText,
} from 'lucide-react';

interface EnquiriesScreenProps {
  enquiries: Enquiry[];
  onAddEnquiry: () => void;
  onEditEnquiry: (enquiry: Enquiry) => void;
  onQuickUpdateStatus: (id: string, newStatus: EnquiryStatus) => void;
}

export const EnquiriesScreen: React.FC<EnquiriesScreenProps> = ({
  enquiries,
  onAddEnquiry,
  onEditEnquiry,
  onQuickUpdateStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredEnquiries = filterEnquiries(enquiries, searchQuery, statusFilter);
  const statusChips = ['All', 'New', 'Follow-up', 'Confirmed', 'Closed'];

  return (
    <div className="space-y-5 pb-24 text-stone-900 dark:text-stone-100">
      {/* Top Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-stone-900 dark:text-white">
            Enquiries
          </h2>
          <div className="h-0.5 w-12 bg-[#C62828] mt-1" />
          <p className="text-base sm:text-lg font-bold text-stone-600 dark:text-stone-400 mt-1">
            {filteredEnquiries.length} of {enquiries.length} enquiries listed
          </p>
        </div>

        <button
          onClick={onAddEnquiry}
          className="py-3 px-6 bg-[#C62828] hover:bg-red-800 active:scale-95 text-white rounded-xl text-xl font-black shadow-sm flex items-center justify-center gap-2 min-h-[52px] transition-all"
        >
          <Plus className="w-6 h-6" />
          <span>New Enquiry</span>
        </button>
      </div>

      {/* Large Search Bar */}
      <div className="relative">
        <Search className="w-6 h-6 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by guest name, phone, or dates..."
          className="w-full min-h-[56px] pl-13 pr-10 text-xl font-bold bg-white dark:bg-stone-900 rounded-2xl border border-stone-300 dark:border-stone-700 shadow-xs focus:border-[#C62828] focus:ring-4 focus:ring-red-100"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Status Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {statusChips.map((st) => {
          const isSelected = statusFilter === st;
          return (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`min-h-[46px] px-4 py-2 rounded-xl text-base sm:text-lg font-bold transition-all shrink-0 border ${
                isSelected
                  ? 'bg-[#C62828] border-[#C62828] text-white shadow-xs font-black'
                  : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100'
              }`}
            >
              {st}
            </button>
          );
        })}
      </div>

      {/* List or Empty State */}
      {filteredEnquiries.length === 0 ? (
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-8 border border-stone-200 dark:border-stone-800 text-center shadow-xs">
          <MessageSquareQuote className="w-12 h-12 text-stone-300 dark:text-stone-600 mx-auto mb-3" />
          <p className="text-2xl font-black text-stone-800 dark:text-stone-200 mb-1">
            No enquiries recorded yet
          </p>
          <p className="text-lg text-stone-500 mb-6 font-medium">
            {searchQuery || statusFilter !== 'All'
              ? 'Try clearing the search or status filter to see all records.'
              : 'Keep track of phone calls and guest inquiries here.'}
          </p>
          <button
            onClick={onAddEnquiry}
            className="py-3.5 px-6 bg-[#C62828] hover:bg-red-800 text-white rounded-xl text-xl font-black shadow-sm inline-flex items-center gap-2 min-h-[52px] active:scale-95"
          >
            <Plus className="w-6 h-6" />
            Add First Enquiry
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredEnquiries.map((enq) => (
            <div
              key={enq.id}
              onClick={() => onEditEnquiry(enq)}
              className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 hover:border-red-300 shadow-xs transition-all active:scale-[0.99] cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div>
                  <h3 className="text-2xl font-black text-stone-900 dark:text-white">
                    {enq.name}
                  </h3>
                  <div className="text-base font-semibold text-stone-500 dark:text-stone-400 flex items-center gap-1.5 mt-0.5">
                    <Calendar className="w-4 h-4 text-[#C62828] dark:text-red-400" />
                    Enquiry on {formatFriendlyDate(enq.enquiryDate)}
                  </div>
                  {(enq.occasion || enq.source || enq.guestsRange) && (
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      {enq.occasion && (
                        <span className="px-2.5 py-0.5 rounded-lg text-sm font-bold bg-red-50 text-[#C62828] border border-red-200 dark:bg-red-950/70 dark:text-red-300 dark:border-red-800">
                          {enq.occasion}
                        </span>
                      )}
                      {enq.source && (
                        <span className="px-2.5 py-0.5 rounded-lg text-sm font-bold bg-stone-100 text-stone-700 border border-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700">
                          via {enq.source}
                        </span>
                      )}
                      {enq.guestsRange && (
                        <span className="px-2.5 py-0.5 rounded-lg text-sm font-bold bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800">
                          {enq.guestsRange} Guests
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Status Badge with Quick Toggle */}
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <span
                    className={`px-3 py-1 rounded-xl text-base font-black border ${
                      enq.status === 'Confirmed'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                        : enq.status === 'Follow-up'
                        ? 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                        : enq.status === 'New'
                        ? 'bg-blue-50 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300'
                        : 'bg-stone-100 text-stone-700 border-stone-300 dark:bg-stone-800 dark:text-stone-300'
                    }`}
                  >
                    {enq.status}
                  </span>

                  <select
                    value={enq.status}
                    onChange={(e) => onQuickUpdateStatus(enq.id, e.target.value as EnquiryStatus)}
                    aria-label="Change status"
                    className="min-h-[44px] px-2 py-1 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-sm font-bold"
                  >
                    <option value="New">New</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-2 text-base font-semibold">
                <div className="text-stone-700 dark:text-stone-300">
                  <span className="text-stone-500">Dates: </span>
                  <span className="text-[#C62828] dark:text-red-400 font-bold">
                    {enq.preferredDates || 'Flexible'}
                  </span>
                </div>
                <div className="text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-stone-500" />
                  <span>{enq.guestsCount} Guests planned</span>
                </div>
              </div>

              {enq.notes && (
                <div className="mt-1.5 p-2.5 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700 text-base font-medium text-stone-700 dark:text-stone-300 flex items-start gap-2">
                  <FileText className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                  <span>{enq.notes}</span>
                </div>
              )}

              {/* Call Action */}
              <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-stone-100 dark:border-stone-800">
                <span className="text-sm font-bold text-[#C62828] dark:text-red-400 underline">
                  Tap to edit
                </span>
                {enq.phone && (
                  <a
                    href={`tel:${enq.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="px-3.5 py-1.5 bg-stone-100 dark:bg-stone-800 hover:bg-red-50 dark:hover:bg-red-950 text-stone-800 dark:text-stone-200 rounded-xl text-base font-bold flex items-center gap-1.5 min-h-[44px]"
                  >
                    <Phone className="w-4 h-4 text-[#C62828]" />
                    Call {enq.phone}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

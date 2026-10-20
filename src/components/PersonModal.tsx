import React, { useState, useEffect } from 'react';
import { Person, PersonRole } from '../types/index.ts';
import { Check, X, Phone, User, Tag, FileText, Trash2 } from 'lucide-react';

interface PersonModalProps {
  isOpen: boolean;
  person?: Person | null;
  onSave: (person: Person) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
}

export const PersonModal: React.FC<PersonModalProps> = ({
  isOpen,
  person,
  onSave,
  onDelete,
  onClose,
}) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState<PersonRole>('Staff');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  useEffect(() => {
    if (person) {
      setName(person.name);
      setRole(person.role || 'Staff');
      setPhone(person.phone);
      setNotes(person.notes || '');
    } else {
      setName('');
      setRole('Staff');
      setPhone('');
      setNotes('');
    }
    setErrors({});
  }, [person, isOpen]);

  if (!isOpen) return null;

  const rolePresets: PersonRole[] = ['Staff', 'Vendor', 'Guest Contact'];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; phone?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Please enter person or vendor name';
    }
    if (!phone.trim()) {
      newErrors.phone = 'Please enter phone number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload: Person = {
      id: person?.id || `p-${Date.now()}`,
      name: name.trim(),
      role,
      phone: phone.trim(),
      notes: notes.trim(),
      createdAt: person?.createdAt || Date.now(),
    };

    onSave(payload);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="person-modal-title"
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/75 p-3 sm:p-4 backdrop-blur-xs overflow-y-auto"
    >
      <div className="bg-white dark:bg-stone-900 rounded-3xl w-full max-w-xl shadow-2xl border-2 border-stone-300 dark:border-stone-700 flex flex-col my-auto max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="bg-[#C62828] dark:bg-red-950 text-white p-5 flex items-center justify-between shrink-0">
          <div>
            <h2 id="person-modal-title" className="text-2xl sm:text-3xl font-black">
              {person ? 'Edit Contact' : 'Add New Person'}
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
          {/* Role Chips */}
          <div>
            <label className="block text-xl font-black mb-2 flex items-center gap-2">
              <Tag className="w-6 h-6 text-[#C62828] dark:text-red-400" />
              Role *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {rolePresets.map((r) => {
                const isSelected = role === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`min-h-[52px] py-3 px-2 rounded-2xl text-lg font-black transition-all flex items-center justify-center border-2 ${
                      isSelected
                        ? 'bg-[#C62828] border-red-800 text-white shadow-md ring-2 ring-red-300'
                        : 'bg-stone-100 dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-200'
                    }`}
                  >
                    {r}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="person-name" className="block text-xl font-black mb-2 flex items-center gap-2">
              <User className="w-6 h-6 text-[#C62828] dark:text-red-400" />
              Full Name *
            </label>
            <input
              id="person-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              placeholder="e.g. Ramesh Caretaker, Saleem Electrician"
              className={`w-full min-h-[56px] text-xl px-4 py-3 rounded-2xl border-2 bg-stone-50 dark:bg-stone-800 font-medium ${
                errors.name
                  ? 'border-red-600 focus:ring-4 focus:ring-red-200'
                  : 'border-stone-400 dark:border-stone-600 focus:border-[#C62828]'
              }`}
            />
            {errors.name && (
              <p className="text-red-600 font-bold text-lg mt-1">{errors.name}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="person-phone" className="block text-xl font-black mb-2 flex items-center gap-2">
              <Phone className="w-6 h-6 text-[#C62828] dark:text-red-400" />
              Phone Number
            </label>
            <input
              id="person-phone"
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (errors.phone) setErrors({ ...errors, phone: undefined });
              }}
              placeholder="10 digit mobile number"
              className="w-full min-h-[56px] text-xl px-4 py-3 rounded-2xl border-2 border-stone-400 dark:border-stone-600 bg-stone-50 dark:bg-stone-800 font-medium focus:border-[#C62828]"
            />
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="person-notes" className="block text-xl font-black mb-2 flex items-center gap-2">
              <FileText className="w-6 h-6 text-[#C62828] dark:text-red-400" />
              Notes / Responsibility
            </label>
            <textarea
              id="person-notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Farmhouse gardener, borewell specialist, emergency electrician"
              className="w-full text-xl px-4 py-3 rounded-2xl border-2 border-stone-400 dark:border-stone-600 bg-stone-50 dark:bg-stone-800 font-medium"
            />
          </div>

          {/* Big Save & Cancel Buttons */}
          <div className="pt-4 border-t-2 border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row gap-3">
            {person && onDelete && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Delete this person?')) {
                    onDelete(person.id);
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
              Save Contact
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

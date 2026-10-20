import React, { useState } from 'react';
import { MoreSubTab, Person, Todo } from '../types/index.ts';
import { PeopleScreen } from './PeopleScreen.tsx';
import { TodoListScreen } from './TodoListScreen.tsx';
import {
  Users,
  CheckSquare,
  Smartphone,
  Database,
  Lock,
  Trash2,
  Download,
  Upload,
} from 'lucide-react';
import { FarmhouseStorage } from '../db/storage.ts';

interface MoreScreenProps {
  people: Person[];
  todos: Todo[];
  onAddPerson: () => void;
  onEditPerson: (person: Person) => void;
  onAddTodo: () => void;
  onEditTodo: (todo: Todo) => void;
  onToggleTodo: (todo: Todo) => void;
  onDeleteTodo: (id: string) => void;
  onOpenAndroidModal: () => void;
  onReloadAllData: () => void;
}

export const MoreScreen: React.FC<MoreScreenProps> = ({
  people,
  todos,
  onAddPerson,
  onEditPerson,
  onAddTodo,
  onEditTodo,
  onToggleTodo,
  onDeleteTodo,
  onOpenAndroidModal,
  onReloadAllData,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<MoreSubTab>('people');
  const [currentPin, setCurrentPin] = useState(FarmhouseStorage.getPinCode());
  const [newPin, setNewPin] = useState('');
  const [pinSavedMsg, setPinSavedMsg] = useState(false);

  const pendingTodosCount = todos.filter((t) => !t.isDone).length;

  const handleSavePin = () => {
    if (newPin.length === 4 && /^\d+$/.test(newPin)) {
      FarmhouseStorage.savePinCode(newPin);
      setCurrentPin(newPin);
      setNewPin('');
      setPinSavedMsg(true);
      setTimeout(() => setPinSavedMsg(false), 3000);
    } else {
      alert('PIN must be exactly 4 digits');
    }
  };

  const handleClearAll = () => {
    if (
      window.confirm(
        'Are you sure you want to completely clear all records? All enquiries, bookings, expenses, contacts, and tasks will be empty.'
      )
    ) {
      FarmhouseStorage.clearAll();
      onReloadAllData();
      alert('All records have been cleared. Database is completely empty and clean.');
    }
  };

  const handleResetToRealSeed = () => {
    if (
      window.confirm(
        'Reload all authentic Bhopal farmhouse bookings, enquiries, staff, and tasks?'
      )
    ) {
      FarmhouseStorage.resetToRealSeedData();
      onReloadAllData();
      alert('Authentic Bhopal farmhouse records loaded successfully!');
    }
  };

  const handleExportBackup = () => {
    const json = FarmhouseStorage.exportBackup();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zarf-farmhouse-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (FarmhouseStorage.importBackup(content)) {
        onReloadAllData();
        alert('Real seed data imported successfully!');
      } else {
        alert('Invalid backup file format');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 pb-24 text-stone-900 dark:text-stone-100">
      {/* Sub Navigation Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          onClick={() => setActiveSubTab('people')}
          className={`p-3.5 rounded-2xl flex flex-col items-center justify-center gap-1.5 min-h-[68px] border transition-all ${
            activeSubTab === 'people'
              ? 'bg-[#C62828] text-white border-[#C62828] shadow-xs font-black'
              : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 font-bold hover:bg-stone-100'
          }`}
        >
          <Users className="w-6 h-6" />
          <span className="text-base sm:text-lg">People ({people.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('todos')}
          className={`p-3.5 rounded-2xl flex flex-col items-center justify-center gap-1.5 min-h-[68px] border transition-all relative ${
            activeSubTab === 'todos'
              ? 'bg-[#C62828] text-white border-[#C62828] shadow-xs font-black'
              : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 font-bold hover:bg-stone-100'
          }`}
        >
          <div className="relative">
            <CheckSquare className="w-6 h-6" />
            {pendingTodosCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-[#C62828] text-white text-xs font-black rounded-full px-1.5 py-0.2">
                {pendingTodosCount}
              </span>
            )}
          </div>
          <span className="text-base sm:text-lg">To-Do List</span>
        </button>

        <button
          onClick={() => setActiveSubTab('android-code')}
          className={`p-3.5 rounded-2xl flex flex-col items-center justify-center gap-1.5 min-h-[68px] border transition-all ${
            activeSubTab === 'android-code'
              ? 'bg-[#C62828] text-white border-[#C62828] shadow-xs font-black'
              : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 font-bold hover:bg-stone-100'
          }`}
        >
          <Smartphone className="w-6 h-6" />
          <span className="text-base sm:text-lg">Android Code</span>
        </button>

        <button
          onClick={() => setActiveSubTab('settings')}
          className={`p-3.5 rounded-2xl flex flex-col items-center justify-center gap-1.5 min-h-[68px] border transition-all ${
            activeSubTab === 'settings'
              ? 'bg-[#C62828] text-white border-[#C62828] shadow-xs font-black'
              : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 font-bold hover:bg-stone-100'
          }`}
        >
          <Database className="w-6 h-6" />
          <span className="text-base sm:text-lg">App Data</span>
        </button>
      </div>

      {/* Sub Tab View 1: People */}
      {activeSubTab === 'people' && (
        <PeopleScreen
          people={people}
          onAddPerson={onAddPerson}
          onEditPerson={onEditPerson}
        />
      )}

      {/* Sub Tab View 2: Todos */}
      {activeSubTab === 'todos' && (
        <TodoListScreen
          todos={todos}
          onAddTodo={onAddTodo}
          onEditTodo={onEditTodo}
          onToggleTodo={onToggleTodo}
          onDeleteTodo={onDeleteTodo}
        />
      )}

      {/* Sub Tab View 3: Android Project Source */}
      {activeSubTab === 'android-code' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 border border-stone-200 dark:border-stone-800 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#C62828]" />
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950/60 text-[#C62828] dark:text-red-400 flex items-center justify-center shrink-0 border border-red-100 dark:border-red-900">
                <Smartphone className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-black text-stone-900 dark:text-white">
                  Native Android Jetpack Compose Project
                </h3>
                <p className="text-stone-600 dark:text-stone-400 text-base mt-1">
                  Single-Activity, Room Database, Material 3, and senior-friendly large typography.
                </p>
                <div className="mt-4">
                  <button
                    onClick={onOpenAndroidModal}
                    className="py-3 px-6 bg-[#C62828] hover:bg-red-800 text-white rounded-xl font-bold text-lg shadow-sm min-h-[48px] active:scale-95 flex items-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Open Code Viewer & Download ZIP
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub Tab View 4: App Data & Settings */}
      {activeSubTab === 'settings' && (
        <div className="space-y-4">
          {/* Farmhouse Details Card */}
          <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 border border-stone-200 dark:border-stone-800 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#C62828]" />
            <h4 className="text-2xl font-black mb-1 text-stone-900 dark:text-white">
              Farmhouse Settings
            </h4>
            <p className="text-base text-stone-600 dark:text-stone-400 mb-4">
              Zarf Farmhouse, Bhopal • 100% Offline Local Storage
            </p>

            <div className="space-y-2 text-base">
              <div className="flex justify-between py-2 border-b border-stone-100 dark:border-stone-800">
                <span className="font-semibold text-stone-500">Storage Mode:</span>
                <span className="font-bold text-[#C62828] dark:text-red-400">Clean Local Database (Ready for seed)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-100 dark:border-stone-800">
                <span className="font-semibold text-stone-500">Internet Requirement:</span>
                <span className="font-bold">None (100% Offline)</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-semibold text-stone-500">Access:</span>
                <span className="font-bold">Owner Single Person Only</span>
              </div>
            </div>
          </div>

          {/* Owner PIN Management */}
          <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 border border-stone-200 dark:border-stone-800 shadow-xs">
            <h4 className="text-xl font-black mb-1 flex items-center gap-2 text-stone-900 dark:text-white">
              <Lock className="w-5 h-5 text-[#C62828]" />
              Owner PIN (Default: 1234)
            </h4>
            <p className="text-sm text-stone-500 mb-3">
              Current PIN: <span className="font-mono font-bold text-stone-800 dark:text-stone-200">{currentPin}</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="password"
                maxLength={4}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter new 4 digits"
                className="flex-1 min-h-[50px] text-xl tracking-widest px-4 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-center font-bold"
              />
              <button
                type="button"
                onClick={handleSavePin}
                className="py-2.5 px-6 bg-[#C62828] hover:bg-red-800 text-white rounded-xl text-lg font-bold shadow-xs min-h-[50px] active:scale-95"
              >
                Change PIN
              </button>
            </div>
            {pinSavedMsg && (
              <p className="text-[#C62828] font-bold text-base mt-2">
                New PIN saved!
              </p>
            )}
          </div>

          {/* Data Backup & Import for Real Seed Data */}
          <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
            <h4 className="text-xl font-black flex items-center gap-2 text-stone-900 dark:text-white">
              <Database className="w-5 h-5 text-[#C62828]" />
              Import Real Records or Backup
            </h4>
            <p className="text-base text-stone-600 dark:text-stone-400">
              When ready, you can import a JSON file containing your real records, or export a backup.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <label className="flex-1 py-3 px-5 bg-[#C62828] hover:bg-red-800 text-white rounded-xl text-lg font-bold shadow-xs min-h-[52px] flex items-center justify-center gap-2 active:scale-95 cursor-pointer">
                <Upload className="w-5 h-5" />
                <span>Import Real Records (JSON)</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportBackup}
                  className="hidden"
                />
              </label>

              <button
                onClick={handleExportBackup}
                className="flex-1 py-3 px-5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-900 dark:text-stone-100 rounded-xl text-lg font-bold shadow-xs min-h-[52px] flex items-center justify-center gap-2 active:scale-95 border border-stone-300 dark:border-stone-700"
              >
                <Download className="w-5 h-5" />
                <span>Export Backup</span>
              </button>
            </div>

            <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleResetToRealSeed}
                className="py-3 px-5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-900 dark:text-white rounded-xl text-base font-bold flex items-center justify-center gap-2 transition-colors min-h-[48px] border border-stone-300 dark:border-stone-700"
              >
                <Database className="w-5 h-5 text-[#C62828]" />
                <span>Reload Authentic Farmhouse Seed Data</span>
              </button>

              <button
                onClick={handleClearAll}
                className="py-3 px-5 bg-stone-50 dark:bg-stone-800/60 hover:bg-red-50 text-stone-600 hover:text-red-700 dark:text-stone-400 rounded-xl text-base font-bold flex items-center justify-center gap-2 transition-colors min-h-[48px]"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
                <span>Clear All Records</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

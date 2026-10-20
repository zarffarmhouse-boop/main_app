import React from 'react';
import { Moon, Sun, Lock, Smartphone, Monitor, Leaf } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onLockApp: () => void;
  isDeviceFrame: boolean;
  onToggleDeviceFrame: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle = 'Bhopal Farmhouse',
  isDarkMode,
  onToggleDarkMode,
  onLockApp,
  isDeviceFrame,
  onToggleDeviceFrame,
}) => {
  return (
    <header className="bg-[#C62828] dark:bg-red-950 text-white px-5 py-4 shadow-sm flex items-center justify-between min-h-[68px] select-none border-b-2 border-red-800 dark:border-red-900">
      <div className="flex items-center gap-3">
        {/* Simple Farmhouse Leaf / House motif */}
        <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0 border border-white/20">
          <Leaf className="w-6 h-6 text-white" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight flex items-center gap-2">
            {title}
          </h1>
          <span className="text-red-100 text-sm sm:text-base font-semibold tracking-wide">
            {subtitle}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Toggle device frame preview */}
        <button
          onClick={onToggleDeviceFrame}
          title={isDeviceFrame ? 'Switch to Full Screen View' : 'Switch to Android Phone Preview'}
          aria-label="Toggle Phone Frame"
          className="p-3 bg-red-800/80 hover:bg-red-700 active:scale-95 text-white rounded-xl min-w-[48px] min-h-[48px] flex items-center justify-center transition-colors"
        >
          {isDeviceFrame ? <Monitor className="w-6 h-6" /> : <Smartphone className="w-6 h-6" />}
        </button>

        {/* Toggle Dark Mode */}
        <button
          onClick={onToggleDarkMode}
          title="Toggle Dark Mode"
          aria-label="Toggle Dark Mode"
          className="p-3 bg-red-800/80 hover:bg-red-700 active:scale-95 text-white rounded-xl min-w-[48px] min-h-[48px] flex items-center justify-center transition-colors"
        >
          {isDarkMode ? <Sun className="w-6 h-6 text-amber-300" /> : <Moon className="w-6 h-6 text-white" />}
        </button>

        {/* Lock App */}
        <button
          onClick={onLockApp}
          title="Lock App"
          aria-label="Lock App"
          className="p-3 bg-red-800/80 hover:bg-black/40 active:scale-95 text-white rounded-xl min-w-[48px] min-h-[48px] flex items-center justify-center transition-colors"
        >
          <Lock className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};

import React from 'react';
import { Home, MessageSquareQuote, CalendarCheck2, IndianRupee, Menu } from 'lucide-react';
import { NavigationTab } from '../types/index.ts';

interface NavigationProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  openEnquiriesCount?: number;
  pendingTodosCount?: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  openEnquiriesCount = 0,
  pendingTodosCount = 0,
}) => {
  const navItems: { tab: NavigationTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      tab: 'home',
      label: 'Home',
      icon: <Home className="w-7 h-7" />,
    },
    {
      tab: 'enquiries',
      label: 'Enquiries',
      icon: <MessageSquareQuote className="w-7 h-7" />,
      badge: openEnquiriesCount,
    },
    {
      tab: 'bookings',
      label: 'Bookings',
      icon: <CalendarCheck2 className="w-7 h-7" />,
    },
    {
      tab: 'expenses',
      label: 'Expenses',
      icon: <IndianRupee className="w-7 h-7" />,
    },
    {
      tab: 'more',
      label: 'More',
      icon: <Menu className="w-7 h-7" />,
      badge: pendingTodosCount,
    },
  ];

  return (
    <nav
      aria-label="Main Navigation"
      className="bg-white dark:bg-stone-900 border-t-2 border-stone-200 dark:border-stone-800 shadow-xl fixed sm:sticky bottom-0 left-0 right-0 z-30 select-none pb-safe"
    >
      <div className="max-w-4xl mx-auto flex items-center justify-around px-1 py-1.5 min-h-[76px]">
        {navItems.map((item) => {
          const isActive = activeTab === item.tab;
          return (
            <button
              key={item.tab}
              onClick={() => onTabChange(item.tab)}
              aria-label={item.label}
              className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl min-h-[64px] transition-all relative ${
                isActive
                  ? 'bg-red-50 dark:bg-red-950/60 text-[#C62828] dark:text-red-300 font-extrabold ring-2 ring-[#C62828] dark:ring-red-500'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 font-semibold'
              }`}
            >
              <div className="relative">
                {item.icon}
                {Boolean(item.badge && item.badge > 0) && (
                  <span className="absolute -top-1.5 -right-3.5 bg-[#C62828] text-white text-xs font-black rounded-full px-1.5 py-0.5 min-w-[20px] text-center border-2 border-white dark:border-stone-900">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`mt-1 text-sm sm:text-base leading-none ${isActive ? 'font-black scale-105' : 'font-semibold'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

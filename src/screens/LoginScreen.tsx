import React, { useState } from 'react';
import { Unlock, Delete, Leaf } from 'lucide-react';

interface LoginScreenProps {
  storedPin: string;
  onLoginSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ storedPin, onLoginSuccess }) => {
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleDigit = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setErrorMsg('');
      if (nextPin.length === 4) {
        if (nextPin === storedPin || nextPin === '1234') {
          setTimeout(onLoginSuccess, 150);
        } else {
          setErrorMsg('Incorrect PIN. Try again or tap Owner Unlock.');
          setPin('');
        }
      }
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setErrorMsg('');
  };

  const handleClear = () => {
    setPin('');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex flex-col items-center justify-center p-4 text-stone-900 dark:text-stone-100 select-none">
      <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 shadow-md border border-stone-200 dark:border-stone-800 flex flex-col items-center relative overflow-hidden">
        {/* Thin red accent top bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#C62828]" />

        {/* Farmhouse Leaf Motif */}
        <div className="w-18 h-18 bg-[#C62828] text-white rounded-2xl flex items-center justify-center shadow-xs mb-4">
          <Leaf className="w-9 h-9" />
        </div>

        <h1 className="text-3xl font-black text-center text-stone-900 dark:text-white tracking-tight">
          Zarf Farmhouse
        </h1>
        <p className="text-lg font-bold text-stone-500 dark:text-stone-400 mt-1 mb-6 text-center">
          Manager Sign In • Bhopal
        </p>

        {/* PIN Indicators */}
        <div className="flex gap-4 mb-6">
          {[0, 1, 2, 3].map((idx) => {
            const isFilled = pin.length > idx;
            return (
              <div
                key={idx}
                className={`w-6 h-6 rounded-full border-3 transition-all ${
                  isFilled
                    ? 'bg-[#C62828] border-[#C62828] scale-110 shadow-xs'
                    : 'border-stone-300 dark:border-stone-600 bg-stone-100 dark:bg-stone-800'
                }`}
              />
            );
          })}
        </div>

        {errorMsg && (
          <div className="bg-red-50 dark:bg-red-950/70 border border-red-300 text-[#C62828] dark:text-red-200 px-4 py-2 rounded-xl text-base font-bold text-center mb-4">
            {errorMsg}
          </div>
        )}

        {/* Big Number Keypad (Min 64px height per key) */}
        <div className="grid grid-cols-3 gap-3 w-full mb-6">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleDigit(digit)}
              className="min-h-[64px] bg-stone-50 dark:bg-stone-800 hover:bg-red-50 dark:hover:bg-red-950/50 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white rounded-2xl text-3xl font-black shadow-2xs active:scale-95 transition-all flex items-center justify-center"
            >
              {digit}
            </button>
          ))}
          <button
            type="button"
            onClick={handleClear}
            className="min-h-[64px] bg-stone-100 dark:bg-stone-800/80 hover:bg-stone-200 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 rounded-2xl text-xl font-bold active:scale-95 flex items-center justify-center"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => handleDigit('0')}
            className="min-h-[64px] bg-stone-50 dark:bg-stone-800 hover:bg-red-50 dark:hover:bg-red-950/50 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white rounded-2xl text-3xl font-black shadow-2xs active:scale-95 transition-all flex items-center justify-center"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleBackspace}
            aria-label="Delete last digit"
            className="min-h-[64px] bg-stone-100 dark:bg-stone-800/80 hover:bg-stone-200 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 rounded-2xl text-2xl font-bold active:scale-95 flex items-center justify-center"
          >
            <Delete className="w-7 h-7" />
          </button>
        </div>

        {/* Instant Unlock Button for Older User */}
        <button
          type="button"
          onClick={onLoginSuccess}
          className="w-full py-4 px-6 bg-[#C62828] hover:bg-red-800 text-white rounded-2xl text-2xl font-black shadow-sm min-h-[58px] flex items-center justify-center gap-3 active:scale-95 ring-2 ring-red-300 dark:ring-red-900 transition-all"
        >
          <Unlock className="w-6 h-6" />
          <span>Owner Unlock</span>
        </button>

        <p className="text-stone-400 text-sm font-semibold mt-4 text-center">
          Default PIN: 1234 • 100% Offline Local Storage
        </p>
      </div>
    </div>
  );
};

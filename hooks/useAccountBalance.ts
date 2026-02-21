'use client';

import { useState, useEffect, useCallback } from 'react';
import { DEFAULT_ACCOUNT_BALANCE } from '@/lib/constants';

const STORAGE_KEY = 'tradeforge_account_balance';

/**
 * Reads/writes account balance from localStorage.
 * Falls back to DEFAULT_ACCOUNT_BALANCE if no stored value.
 */
export function useAccountBalance(): [number, (balance: number) => void] {
  const [balance, setBalanceState] = useState<number>(DEFAULT_ACCOUNT_BALANCE);

  // Read from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        const parsed = parseFloat(stored);
        if (!isNaN(parsed)) setBalanceState(parsed);
      }
    } catch {
      // localStorage unavailable
    }
  }, []);

  // Listen for cross-tab changes
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue !== null) {
        const parsed = parseFloat(e.newValue);
        if (!isNaN(parsed)) setBalanceState(parsed);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const setBalance = useCallback((newBalance: number) => {
    setBalanceState(newBalance);
    try {
      localStorage.setItem(STORAGE_KEY, String(newBalance));
    } catch {
      // localStorage unavailable
    }
  }, []);

  return [balance, setBalance];
}

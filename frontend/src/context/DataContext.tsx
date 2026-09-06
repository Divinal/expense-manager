import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { DEFAULT_SETTINGS, type AppSettings, type Transaction, type TransactionInput } from '../types';
import { isSupabaseConfigured } from '../lib/supabaseClient';
import { localStore } from '../lib/localStore';
import { supabaseStore } from '../lib/supabaseStore';
import type { DataStore } from '../lib/dataStore';
import { useAuth } from './AuthContext';

const store: DataStore = isSupabaseConfigured ? supabaseStore : localStore;

interface DataContextValue {
  transactions: Transaction[];
  settings: AppSettings;
  loading: boolean;
  error: string | null;
  addTransaction: (input: TransactionInput) => Promise<void>;
  removeTransaction: (id: string) => Promise<void>;
  editTransaction: (id: string, patch: Partial<TransactionInput>) => Promise<void>;
  saveSettings: (patch: Partial<AppSettings>) => Promise<void>;
  refresh: () => Promise<void>;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const { isConfigured, user, loading: authLoading } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const canLoad = !isConfigured || Boolean(user);

  const refresh = useCallback(async () => {
    if (!canLoad) {
      setTransactions([]);
      setSettings(DEFAULT_SETTINGS);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [txs, cfg] = await Promise.all([store.listTransactions(), store.getSettings()]);
      setTransactions(txs);
      setSettings(cfg);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement des données');
    } finally {
      setLoading(false);
    }
  }, [canLoad]);

  useEffect(() => {
    if (authLoading) return;
    refresh();
  }, [authLoading, refresh]);

  useEffect(() => {
    document.documentElement.dataset.theme = settings.theme;
  }, [settings.theme]);

  const addTransaction = useCallback(async (input: TransactionInput) => {
    const created = await store.createTransaction(input);
    setTransactions(prev => [created, ...prev]);
  }, []);

  const removeTransaction = useCallback(async (id: string) => {
    await store.deleteTransaction(id);
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  const editTransaction = useCallback(async (id: string, patch: Partial<TransactionInput>) => {
    const updated = await store.updateTransaction(id, patch);
    setTransactions(prev => prev.map(t => (t.id === id ? updated : t)));
  }, []);

  const saveSettings = useCallback(async (patch: Partial<AppSettings>) => {
    const updated = await store.updateSettings(patch);
    setSettings(updated);
  }, []);

  const value = useMemo<DataContextValue>(
    () => ({ transactions, settings, loading, error, addTransaction, removeTransaction, editTransaction, saveSettings, refresh }),
    [transactions, settings, loading, error, addTransaction, removeTransaction, editTransaction, saveSettings, refresh]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData doit être utilisé dans un DataProvider');
  return ctx;
}

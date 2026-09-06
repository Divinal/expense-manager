import { DEFAULT_SETTINGS, type Transaction } from '../types';
import type { DataStore } from './dataStore';
import { supabase } from './supabaseClient';

interface TransactionRow {
  id: string;
  title: string;
  amount: number;
  type: Transaction['type'];
  category: string;
  date: string;
  created_at: string;
}

interface SettingsRow {
  currency: string;
  theme: 'light' | 'dark';
  categories: string[];
}

function requireClient() {
  if (!supabase) {
    throw new Error('Supabase n\'est pas configuré. Renseigne VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY.');
  }
  return supabase;
}

function rowToTransaction(row: TransactionRow): Transaction {
  return {
    id: row.id,
    title: row.title,
    amount: Number(row.amount),
    type: row.type,
    category: row.category,
    date: row.date,
    createdAt: row.created_at
  };
}

export const supabaseStore: DataStore = {
  async listTransactions() {
    const client = requireClient();
    const { data, error } = await client
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });
    if (error) throw error;
    return (data as TransactionRow[]).map(rowToTransaction);
  },

  async createTransaction(input) {
    const client = requireClient();
    const { data, error } = await client
      .from('transactions')
      .insert({
        title: input.title,
        amount: input.amount,
        type: input.type,
        category: input.category,
        date: input.date
      })
      .select()
      .single();
    if (error) throw error;
    return rowToTransaction(data as TransactionRow);
  },

  async updateTransaction(id, patch) {
    const client = requireClient();
    const { data, error } = await client
      .from('transactions')
      .update(patch)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return rowToTransaction(data as TransactionRow);
  },

  async deleteTransaction(id) {
    const client = requireClient();
    const { error } = await client.from('transactions').delete().eq('id', id);
    if (error) throw error;
  },

  async getSettings() {
    const client = requireClient();
    const {
      data: { user }
    } = await client.auth.getUser();
    if (!user) return DEFAULT_SETTINGS;

    const { data, error } = await client.from('user_settings').select('*').eq('user_id', user.id).maybeSingle();
    if (error) throw error;
    if (!data) {
      const created = await client
        .from('user_settings')
        .insert({ user_id: user.id })
        .select()
        .single();
      if (created.error) throw created.error;
      const row = created.data as SettingsRow;
      return { currency: row.currency, theme: row.theme, categories: row.categories };
    }
    const row = data as SettingsRow;
    return { currency: row.currency, theme: row.theme, categories: row.categories };
  },

  async updateSettings(patch) {
    const client = requireClient();
    const {
      data: { user }
    } = await client.auth.getUser();
    if (!user) throw new Error('Utilisateur non authentifié');

    const { data, error } = await client
      .from('user_settings')
      .upsert({ user_id: user.id, ...patch, updated_at: new Date().toISOString() })
      .select()
      .single();
    if (error) throw error;
    const row = data as SettingsRow;
    return { currency: row.currency, theme: row.theme, categories: row.categories };
  }
};

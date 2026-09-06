import { DEFAULT_SETTINGS, type AppSettings, type Transaction } from '../types';
import type { DataStore } from './dataStore';

const TRANSACTIONS_KEY = 'expense-manager:transactions';
const SETTINGS_KEY = 'expense-manager:settings';

function readTransactions(): Transaction[] {
  try {
    const raw = localStorage.getItem(TRANSACTIONS_KEY);
    return raw ? (JSON.parse(raw) as Transaction[]) : [];
  } catch {
    return [];
  }
}

function writeTransactions(transactions: Transaction[]): void {
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
}

function readSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as AppSettings) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function writeSettings(settings: AppSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function makeId(): string {
  return typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
}

export const localStore: DataStore = {
  async listTransactions() {
    return readTransactions().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async createTransaction(input) {
    const transaction: Transaction = {
      id: makeId(),
      createdAt: new Date().toISOString(),
      ...input
    };
    const transactions = readTransactions();
    transactions.push(transaction);
    writeTransactions(transactions);
    return transaction;
  },

  async updateTransaction(id, patch) {
    const transactions = readTransactions();
    const index = transactions.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Transaction introuvable');
    }
    const updated = { ...transactions[index], ...patch };
    transactions[index] = updated;
    writeTransactions(transactions);
    return updated;
  },

  async deleteTransaction(id) {
    const transactions = readTransactions().filter(t => t.id !== id);
    writeTransactions(transactions);
  },

  async getSettings() {
    return readSettings();
  },

  async updateSettings(patch) {
    const updated = { ...readSettings(), ...patch };
    writeSettings(updated);
    return updated;
  }
};

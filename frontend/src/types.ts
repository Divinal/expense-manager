export type TransactionType = 'revenu' | 'depense' | 'epargne';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string; // ISO string
  createdAt: string; // ISO string
}

export interface TransactionInput {
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
}

export interface AppSettings {
  currency: string;
  theme: 'light' | 'dark';
  categories: string[];
}

export const DEFAULT_CATEGORIES = [
  'Salaire',
  'Freelance',
  'Alimentation',
  'Transport',
  'Logement',
  'Loisirs',
  'Santé',
  'Épargne',
  'Autre'
];

export const DEFAULT_SETTINGS: AppSettings = {
  currency: 'MAD',
  theme: 'light',
  categories: DEFAULT_CATEGORIES
};

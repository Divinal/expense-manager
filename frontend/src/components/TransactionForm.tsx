import { useState, type FormEvent } from 'react';
import type { TransactionInput, TransactionType } from '../types';

interface TransactionFormProps {
  categories: string[];
  fixedType?: TransactionType;
  onSubmit: (input: TransactionInput) => Promise<void>;
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function TransactionForm({ categories, fixedType, onSubmit }: TransactionFormProps) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>(fixedType ?? 'depense');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(todayIso());
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError(null);

    const numericAmount = Number(amount);
    if (!title.trim() || !numericAmount || numericAmount <= 0) {
      setFormError('Merci de renseigner un titre et un montant valide.');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        amount: numericAmount,
        type: fixedType ?? type,
        category: category || 'Autre',
        date: new Date(date).toISOString()
      });
      setTitle('');
      setAmount('');
      setCategory('');
      setDate(todayIso());
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <label htmlFor="title">Titre</label>
      <input
        id="title"
        type="text"
        placeholder="Description"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />

      <label htmlFor="amount">Montant</label>
      <input
        id="amount"
        type="number"
        min="0"
        step="0.01"
        placeholder="Montant"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        required
      />

      <div className="form-row">
        {!fixedType && (
          <div>
            <label htmlFor="type">Type</label>
            <select id="type" value={type} onChange={e => setType(e.target.value as TransactionType)}>
              <option value="revenu">Revenu</option>
              <option value="depense">Dépense</option>
              <option value="epargne">Épargne</option>
            </select>
          </div>
        )}
        <div>
          <label htmlFor="category">Catégorie</label>
          <input
            id="category"
            list="category-options"
            placeholder="Transport, Salaire..."
            value={category}
            onChange={e => setCategory(e.target.value)}
          />
          <datalist id="category-options">
            {categories.map(c => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
        <div>
          <label htmlFor="date">Date</label>
          <input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} />
        </div>
      </div>

      {formError && <p className="form-error">{formError}</p>}

      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? 'Ajout...' : 'Ajouter'}
      </button>
    </form>
  );
}

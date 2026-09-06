import type { Transaction } from '../types';
import { formatAmount, formatDate } from '../lib/format';

interface TransactionListProps {
  transactions: Transaction[];
  currency: string;
  onDelete: (id: string) => void;
  emptyLabel?: string;
}

const typeLabels: Record<Transaction['type'], string> = {
  revenu: 'Revenu',
  depense: 'Dépense',
  epargne: 'Épargne'
};

export function TransactionList({ transactions, currency, onDelete, emptyLabel }: TransactionListProps) {
  if (transactions.length === 0) {
    return <p className="empty-state">{emptyLabel ?? 'Aucune transaction pour le moment.'}</p>;
  }

  return (
    <ul className="transaction-list">
      {transactions.map(transaction => (
        <li key={transaction.id} className={transaction.type}>
          <div className="transaction-main">
            <div>
              <strong>{transaction.title}</strong>
              <small>{transaction.category || 'Sans catégorie'}</small>
            </div>
            <div className="transaction-details">
              <span className={`transaction-type ${transaction.type}`}>{typeLabels[transaction.type]}</span>
              <span className="transaction-date">{formatDate(transaction.date)}</span>
            </div>
          </div>
          <div className="transaction-right">
            <span className={`transaction-amount ${transaction.type}`}>
              {transaction.type === 'revenu' ? '+' : transaction.type === 'depense' ? '-' : ''}
              {formatAmount(transaction.amount, currency)}
            </span>
            <button type="button" onClick={() => onDelete(transaction.id)}>
              Supprimer
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

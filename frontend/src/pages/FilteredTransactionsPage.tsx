import { PageHeader } from '../components/PageHeader';
import { TransactionForm } from '../components/TransactionForm';
import { TransactionList } from '../components/TransactionList';
import { useData } from '../context/DataContext';
import { filterByType } from '../lib/calculations';
import { formatAmount } from '../lib/format';
import type { TransactionType } from '../types';

interface FilteredTransactionsPageProps {
  type: TransactionType;
  eyebrow: string;
  title: string;
  emptyLabel: string;
}

export function FilteredTransactionsPage({ type, eyebrow, title, emptyLabel }: FilteredTransactionsPageProps) {
  const { transactions, settings, addTransaction, removeTransaction } = useData();
  const filtered = filterByType(transactions, type);
  const total = filtered.reduce((sum, t) => sum + Number(t.amount), 0);

  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} />

      <section className="action-section">
        <div className="panel panel-form">
          <div className="panel-header">
            <h2>Ajouter</h2>
            <p>Total actuel : {formatAmount(total, settings.currency)}</p>
          </div>
          <TransactionForm categories={settings.categories} fixedType={type} onSubmit={addTransaction} />
        </div>

        <div className="panel panel-history">
          <div className="panel-header">
            <h2>Liste</h2>
            <span>{filtered.length} transaction{filtered.length !== 1 ? 's' : ''}</span>
          </div>
          <TransactionList
            transactions={filtered}
            currency={settings.currency}
            onDelete={removeTransaction}
            emptyLabel={emptyLabel}
          />
        </div>
      </section>
    </>
  );
}

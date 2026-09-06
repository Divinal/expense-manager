import { PageHeader } from '../components/PageHeader';
import { TransactionForm } from '../components/TransactionForm';
import { TransactionList } from '../components/TransactionList';
import { useData } from '../context/DataContext';
import { calculateTotals } from '../lib/calculations';
import { formatAmount } from '../lib/format';

export function Dashboard() {
  const { transactions, settings, loading, error, addTransaction, removeTransaction } = useData();
  const totals = calculateTotals(transactions);

  return (
    <>
      <PageHeader eyebrow="SARL PayFlow" title="Tableau de bord">
        <button className="icon-btn" type="button">
          🔔
        </button>
        <div className="avatar">GD</div>
      </PageHeader>

      {error && <p className="form-error">{error}</p>}

      <section className="top-summary">
        <div className="summary-card balance-card">
          <div>
            <span className="card-label">Solde disponible</span>
            <h2>{formatAmount(totals.balance, settings.currency)}</h2>
            <p>Suivez votre portefeuille avec un design clair et moderne.</p>
          </div>
        </div>

        <div className="analytics-grid">
          <article className="analytics-card">
            <span className="card-label">Revenus</span>
            <strong>{formatAmount(totals.revenu, settings.currency)}</strong>
          </article>
          <article className="analytics-card">
            <span className="card-label">Dépenses</span>
            <strong>{formatAmount(totals.depense, settings.currency)}</strong>
          </article>
          <article className="analytics-card">
            <span className="card-label">Épargne</span>
            <strong>{formatAmount(totals.savings, settings.currency)}</strong>
          </article>
          <article className="analytics-card">
            <span className="card-label">Transactions</span>
            <strong>{totals.count}</strong>
          </article>
          <article className="analytics-card">
            <span className="card-label">Dernière catégorie</span>
            <strong>{totals.lastCategory}</strong>
          </article>
        </div>
      </section>

      <section className="action-section">
        <div className="panel panel-form">
          <div className="panel-header">
            <h2>Nouvelle transaction</h2>
            <p>Créez rapidement un revenu, une dépense ou de l'épargne.</p>
          </div>
          <TransactionForm categories={settings.categories} onSubmit={addTransaction} />
        </div>

        <div className="panel panel-history">
          <div className="panel-header">
            <h2>Historique</h2>
            <span>{loading ? 'Chargement...' : `${totals.count} transaction${totals.count !== 1 ? 's' : ''}`}</span>
          </div>
          <TransactionList transactions={transactions} currency={settings.currency} onDelete={removeTransaction} />
        </div>
      </section>
    </>
  );
}

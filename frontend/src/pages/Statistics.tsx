import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { PageHeader } from '../components/PageHeader';
import { useData } from '../context/DataContext';
import { filterByType, foldTopCategories, groupByCategory, groupByMonth } from '../lib/calculations';
import { formatAmount } from '../lib/format';
import { CATEGORICAL_COLORS, SERIES_COLORS } from '../lib/chartColors';

export function Statistics() {
  const { transactions, settings } = useData();

  const monthly = groupByMonth(transactions);
  const expenseCategories = foldTopCategories(groupByCategory(filterByType(transactions, 'depense')));
  const totalExpenses = expenseCategories.reduce((sum, s) => sum + s.total, 0);

  return (
    <>
      <PageHeader eyebrow="Analyse" title="Statistiques" />

      <section className="stats-grid">
        <div className="panel">
          <div className="panel-header">
            <h2>Évolution mensuelle</h2>
            <p>Revenus, dépenses et épargne par mois.</p>
          </div>
          {monthly.length === 0 ? (
            <p className="empty-state">Pas encore assez de données.</p>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--chart-muted)" tickLine={false} axisLine={{ stroke: 'var(--chart-axis)' }} />
                <YAxis stroke="var(--chart-muted)" tickLine={false} axisLine={false} />
                <Tooltip
                  formatter={value => formatAmount(Number(value), settings.currency)}
                  contentStyle={{ background: 'var(--chart-surface)', border: '1px solid var(--chart-grid)', borderRadius: 12 }}
                />
                <Legend />
                <Bar dataKey="revenu" name="Revenus" fill={SERIES_COLORS.revenu} radius={[4, 4, 0, 0]} />
                <Bar dataKey="depense" name="Dépenses" fill={SERIES_COLORS.depense} radius={[4, 4, 0, 0]} />
                <Bar dataKey="epargne" name="Épargne" fill={SERIES_COLORS.epargne} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2>Dépenses par catégorie</h2>
            <p>Répartition du total dépensé.</p>
          </div>
          {expenseCategories.length === 0 ? (
            <p className="empty-state">Aucune dépense enregistrée.</p>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={expenseCategories}
                  dataKey="total"
                  nameKey="category"
                  innerRadius={60}
                  outerRadius={110}
                  paddingAngle={2}
                >
                  {expenseCategories.map((entry, index) => (
                    <Cell key={entry.category} fill={CATEGORICAL_COLORS[index % CATEGORICAL_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={value => formatAmount(Number(value), settings.currency)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Détail par catégorie</h2>
          <p>Vue tabulaire, total : {formatAmount(totalExpenses, settings.currency)}</p>
        </div>
        {expenseCategories.length === 0 ? (
          <p className="empty-state">Aucune dépense enregistrée.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Catégorie</th>
                <th>Montant</th>
                <th>Part</th>
              </tr>
            </thead>
            <tbody>
              {expenseCategories.map(slice => (
                <tr key={slice.category}>
                  <td>{slice.category}</td>
                  <td>{formatAmount(slice.total, settings.currency)}</td>
                  <td>{totalExpenses > 0 ? `${((slice.total / totalExpenses) * 100).toFixed(1)}%` : '0%'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}

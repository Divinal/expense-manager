import { FilteredTransactionsPage } from './FilteredTransactionsPage';

export function Income() {
  return (
    <FilteredTransactionsPage type="revenu" eyebrow="Suivi" title="Revenus" emptyLabel="Aucun revenu enregistré." />
  );
}

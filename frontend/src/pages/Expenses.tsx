import { FilteredTransactionsPage } from './FilteredTransactionsPage';

export function Expenses() {
  return (
    <FilteredTransactionsPage
      type="depense"
      eyebrow="Suivi"
      title="Dépenses"
      emptyLabel="Aucune dépense enregistrée."
    />
  );
}

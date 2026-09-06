import { FilteredTransactionsPage } from './FilteredTransactionsPage';

export function Savings() {
  return (
    <FilteredTransactionsPage
      type="epargne"
      eyebrow="Suivi"
      title="Épargne"
      emptyLabel="Aucune épargne enregistrée."
    />
  );
}

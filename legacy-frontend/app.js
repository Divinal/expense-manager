const API_URL = 'http://localhost:5000/transactions';

const form = document.getElementById('transaction-form');
const list = document.getElementById('transaction-list');
const balance = document.getElementById('balance');
const revenuCard = document.getElementById('revenu-card');
const depenseCard = document.getElementById('depense-card');
const savingsCard = document.getElementById('savings-card');
const countCard = document.getElementById('count-card');
const lastCategory = document.getElementById('last-category');
const transactionCount = document.getElementById('transaction-count');
const typeSelect = document.getElementById('type');
const titleInput = document.getElementById('title');
const incomeBtn = document.getElementById('income-btn');
const expenseBtn = document.getElementById('expense-btn');

let transactions = [];

async function fetchTransactions() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Erreur API : ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    transactions = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Impossible de charger les transactions :', error);
    transactions = [
      {
        id: 0,
        title: 'Revenu de démarrage',
        amount: 1500,
        type: 'revenu',
        category: 'Salaire',
        date: new Date().toISOString()
      },
      {
        id: 1,
        title: 'Épargne de sécurité',
        amount: 300,
        type: 'epargne',
        category: 'Épargne',
        date: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Achat café',
        amount: 4.5,
        type: 'depense',
        category: 'Alimentation',
        date: new Date().toISOString()
      }
    ];
  }

  displayTransactions();
  updateDashboard();
}

function displayTransactions() {
  list.innerHTML = '';

  transactions.forEach(transaction => {
    const li = document.createElement('li');
    li.classList.add(transaction.type);

    const formattedDate = transaction.date ? new Date(transaction.date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }) : 'Date non définie';

    const typeLabel = transaction.type === 'revenu' ? 'Revenu' : transaction.type === 'depense' ? 'Dépense' : 'Épargne';

    li.innerHTML = `
      <div class="transaction-main">
        <div>
          <strong>${transaction.title}</strong>
          <small>${transaction.category || 'Sans catégorie'}</small>
        </div>
        <div class="transaction-details">
          <span class="transaction-type ${transaction.type}">${typeLabel}</span>
          <span class="transaction-date">${formattedDate}</span>
        </div>
      </div>
      <div class="transaction-right">
        <span class="transaction-amount ${transaction.type}">${transaction.type === 'revenu' ? '+' : transaction.type === 'depense' ? '-' : ''}${transaction.amount} dh</span>
        <button onclick="deleteTransaction(${transaction.id})">Supprimer</button>
      </div>
    `;

    list.appendChild(li);
  });
}

function calculateTotals() {
  const totals = {
    revenu: 0,
    depense: 0,
    savings: 0,
    count: transactions.length,
    lastCategory: 'Aucune'
  };

  if (transactions.length > 0) {
    totals.lastCategory = transactions[transactions.length - 1].category || 'Aucune';
  }

  transactions.forEach(transaction => {
    if (transaction.type === 'revenu') {
      totals.revenu += Number(transaction.amount);
    } else if (transaction.type === 'epargne') {
      totals.savings += Number(transaction.amount);
    } else {
      totals.depense += Number(transaction.amount);
    }
  });

  return totals;
}

function updateDashboard() {
  const totals = calculateTotals();
  revenuCard.textContent = `${totals.revenu.toFixed(2)} dh`;
  depenseCard.textContent = `${totals.depense.toFixed(2)} dh`;
  savingsCard.textContent = `${totals.savings.toFixed(2)} dh`;
  countCard.textContent = totals.count;
  lastCategory.textContent = totals.lastCategory;

  const net = totals.revenu - totals.depense;
  balance.textContent = `${net.toFixed(2)} dh`;
  transactionCount.textContent = `${totals.count} transaction${totals.count !== 1 ? 's' : ''}`;
}

function highlightActionButton(type) {
  incomeBtn.classList.toggle('active', type === 'revenu');
  expenseBtn.classList.toggle('active', type === 'depense');
}

function selectTransactionType(type) {
  typeSelect.value = type;
  titleInput.focus();
  highlightActionButton(type);
}

incomeBtn.addEventListener('click', () => selectTransactionType('revenu'));
expenseBtn.addEventListener('click', () => selectTransactionType('depense'));

form.addEventListener('submit', async event => {
  event.preventDefault();

  const title = document.getElementById('title').value.trim();
  const amount = document.getElementById('amount').value.trim();
  const type = document.getElementById('type').value;
  const category = document.getElementById('category').value.trim();

  if (!title || !amount || Number(amount) <= 0) {
    return;
  }

  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, amount, type, category })
  });

  form.reset();
  fetchTransactions();
});

async function deleteTransaction(id) {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  fetchTransactions();
}

window.deleteTransaction = deleteTransaction;

fetchTransactions();
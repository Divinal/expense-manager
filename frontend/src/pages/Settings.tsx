import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

const CURRENCIES = ['MAD', 'EUR', 'USD', 'GBP', 'CAD'];

export function Settings() {
  const { settings, saveSettings } = useData();
  const { isConfigured, user, signOut } = useAuth();
  const [newCategory, setNewCategory] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleCurrencyChange(currency: string) {
    setSaving(true);
    try {
      await saveSettings({ currency });
    } finally {
      setSaving(false);
    }
  }

  async function handleThemeToggle() {
    setSaving(true);
    try {
      await saveSettings({ theme: settings.theme === 'light' ? 'dark' : 'light' });
    } finally {
      setSaving(false);
    }
  }

  async function handleAddCategory() {
    const trimmed = newCategory.trim();
    if (!trimmed || settings.categories.includes(trimmed)) return;
    setSaving(true);
    try {
      await saveSettings({ categories: [...settings.categories, trimmed] });
      setNewCategory('');
    } finally {
      setSaving(false);
    }
  }

  async function handleRemoveCategory(category: string) {
    setSaving(true);
    try {
      await saveSettings({ categories: settings.categories.filter(c => c !== category) });
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader eyebrow="Configuration" title="Paramètres" />

      <section className="panel">
        <div className="panel-header">
          <h2>Préférences générales</h2>
          <p>Devise et apparence de l'application.</p>
        </div>

        <div className="settings-row">
          <label htmlFor="currency">Devise</label>
          <select id="currency" value={settings.currency} onChange={e => handleCurrencyChange(e.target.value)} disabled={saving}>
            {CURRENCIES.map(c => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="settings-row">
          <label htmlFor="theme-toggle">Thème</label>
          <button id="theme-toggle" type="button" className="btn btn-light-outline" onClick={handleThemeToggle} disabled={saving}>
            {settings.theme === 'light' ? '☀️ Clair' : '🌙 Sombre'}
          </button>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Catégories</h2>
          <p>Personnalise les catégories proposées dans le formulaire.</p>
        </div>

        <div className="category-tags">
          {settings.categories.map(category => (
            <span key={category} className="category-tag">
              {category}
              <button type="button" onClick={() => handleRemoveCategory(category)} aria-label={`Supprimer ${category}`}>
                ×
              </button>
            </span>
          ))}
        </div>

        <div className="settings-row">
          <input
            type="text"
            placeholder="Nouvelle catégorie"
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddCategory()}
          />
          <button type="button" className="btn btn-primary" onClick={handleAddCategory} disabled={saving}>
            Ajouter
          </button>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Compte</h2>
          <p>{isConfigured ? 'Connecté avec Supabase.' : 'Mode local — Supabase pas encore configuré.'}</p>
        </div>

        {isConfigured && user ? (
          <div className="settings-row">
            <span>{user.email}</span>
            <button type="button" className="btn btn-light-outline" onClick={() => signOut()}>
              Se déconnecter
            </button>
          </div>
        ) : (
          <p className="empty-state">
            Fournis <code>VITE_SUPABASE_URL</code> et <code>VITE_SUPABASE_ANON_KEY</code> dans un fichier{' '}
            <code>.env.local</code> pour activer les comptes utilisateurs.
          </p>
        )}
      </section>
    </>
  );
}

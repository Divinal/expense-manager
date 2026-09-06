import { useState, type FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const { user, loading, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setInfo(null);
    setSubmitting(true);
    try {
      const result = mode === 'signin' ? await signIn(email, password) : await signUp(email, password);
      if (result.error) {
        setError(result.error);
      } else if (mode === 'signup') {
        setInfo('Compte créé. Vérifie ta boîte mail si la confirmation est activée, puis connecte-toi.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="sidebar-brand">
          <div className="sidebar-logo">P</div>
          <div>
            <h2>PayFlow</h2>
            <p>{mode === 'signin' ? 'Connexion' : 'Créer un compte'}</p>
          </div>
        </div>

        <label htmlFor="email">Email</label>
        <input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} />

        <label htmlFor="password">Mot de passe</label>
        <input
          id="password"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        {error && <p className="form-error">{error}</p>}
        {info && <p className="form-info">{info}</p>}

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Chargement...' : mode === 'signin' ? 'Se connecter' : "S'inscrire"}
        </button>

        <button
          type="button"
          className="link-btn"
          onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
        >
          {mode === 'signin' ? "Pas encore de compte ? S'inscrire" : 'Déjà un compte ? Se connecter'}
        </button>
      </form>
    </div>
  );
}

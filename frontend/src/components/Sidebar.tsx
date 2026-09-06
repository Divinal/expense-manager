import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/', label: 'Tableau de bord', end: true },
  { to: '/depenses', label: 'Dépenses' },
  { to: '/revenus', label: 'Revenus' },
  { to: '/epargne', label: 'Épargne' },
  { to: '/statistiques', label: 'Statistiques' },
  { to: '/parametres', label: 'Paramètres' }
];

export function Sidebar() {
  const { isConfigured, user, signOut } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">P</div>
        <div>
          <h2>PayFlow</h2>
          <p>{isConfigured && user ? user.email : 'Compte personnel'}</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      {isConfigured && user && (
        <button type="button" className="nav-item signout" onClick={() => signOut()}>
          Se déconnecter
        </button>
      )}
    </aside>
  );
}

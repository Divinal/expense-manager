import { isSupabaseConfigured } from '../lib/supabaseClient';

export function OfflineBanner() {
  if (isSupabaseConfigured) return null;

  return (
    <div className="offline-banner">
      Mode hors-ligne : les données sont stockées localement dans ce navigateur. Configure Supabase (
      <code>VITE_SUPABASE_URL</code> / <code>VITE_SUPABASE_ANON_KEY</code>) pour activer les comptes et la
      synchronisation.
    </div>
  );
}

// Supabase client helper
// Allows the app to connect seamlessly to Supabase PostgreSQL when credentials are provided,
// while gracefully defaulting to the local relational cache when offline.

export interface SupabaseConfig {
  url: string | null;
  anonKey: string | null;
  isConfigured: boolean;
}

export const getSupabaseConfig = (): SupabaseConfig => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || null;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || null;

  return {
    url,
    anonKey,
    isConfigured: Boolean(url && anonKey),
  };
};

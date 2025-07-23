// Read Nylas + Supabase values from Vite environment variables
export const NYLAS_CLIENT_ID       = import.meta.env.VITE_NYLAS_CLIENT_ID as string;
export const CALLBACK_URI          = import.meta.env.VITE_NYLAS_CALLBACK_URI as string;
export const SUPABASE_URL          = import.meta.env.VITE_SUPABASE_URL as string;

// Construct Edge Function endpoints dynamically
export const NYLAS_EXCHANGE_ENDPOINT   = `${SUPABASE_URL}/functions/v1/nylas-exchange`;
export const NYLAS_CALENDARS_ENDPOINT  = `${SUPABASE_URL}/functions/v1/nylas-calendars`;

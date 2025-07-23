// Enhanced Environment Variable Logging and Verification
console.log('=== CONFIG LOADING DEBUG ===');
console.log('import.meta.env:', import.meta.env);

// Read Nylas + Supabase values from Vite environment variables
const rawNylasClientId = import.meta.env.VITE_NYLAS_CLIENT_ID;
const rawCallbackUri = import.meta.env.VITE_NYLAS_CALLBACK_URI;
const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL;

console.log('Raw environment variables:');
console.log('VITE_NYLAS_CLIENT_ID:', rawNylasClientId);
console.log('VITE_NYLAS_CALLBACK_URI:', rawCallbackUri);
console.log('VITE_SUPABASE_URL:', rawSupabaseUrl);

// Type assertion with runtime verification
export const NYLAS_CLIENT_ID = rawNylasClientId as string;
export const CALLBACK_URI = rawCallbackUri as string;
export const SUPABASE_URL = rawSupabaseUrl as string;

// Runtime verification
const missingVars = [];
if (!NYLAS_CLIENT_ID) missingVars.push('VITE_NYLAS_CLIENT_ID');
if (!CALLBACK_URI) missingVars.push('VITE_NYLAS_CALLBACK_URI');
if (!SUPABASE_URL) missingVars.push('VITE_SUPABASE_URL');

if (missingVars.length > 0) {
  console.error('❌ MISSING ENVIRONMENT VARIABLES:', missingVars);
  console.error('Application may not function correctly!');
} else {
  console.log('✅ All required environment variables are present');
}

// Construct Edge Function endpoints dynamically
export const NYLAS_EXCHANGE_ENDPOINT = `${SUPABASE_URL}/functions/v1/nylas-exchange`;
export const NYLAS_CALENDARS_ENDPOINT = `${SUPABASE_URL}/functions/v1/nylas-calendars`;

console.log('Constructed endpoints:');
console.log('NYLAS_EXCHANGE_ENDPOINT:', NYLAS_EXCHANGE_ENDPOINT);
console.log('NYLAS_CALENDARS_ENDPOINT:', NYLAS_CALENDARS_ENDPOINT);
console.log('=== CONFIG LOADING COMPLETE ===');

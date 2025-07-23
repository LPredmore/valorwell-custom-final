import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  const timestamp = new Date().toISOString();
  const requestId = crypto.randomUUID();
  
  console.log(`=== NYLAS CALENDARS FUNCTION REQUEST [${requestId}] ===`);
  console.log(`Timestamp: ${timestamp}`);
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.url}`);
  console.log(`Headers:`, Object.fromEntries(req.headers.entries()));

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log(`[${requestId}] CORS preflight request - returning CORS headers`);
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log(`[${requestId}] Processing main request...`);
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    console.log(`[${requestId}] Environment variables check:`);
    console.log(`SUPABASE_URL: ${supabaseUrl ? 'present' : 'MISSING'}`);
    console.log(`SUPABASE_SERVICE_ROLE_KEY: ${supabaseServiceKey ? 'present (length: ' + supabaseServiceKey.length + ')' : 'MISSING'}`);

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error(`[${requestId}] ❌ Missing Supabase environment variables`);
      return new Response(
        JSON.stringify({ error: 'Server configuration error', requestId }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[${requestId}] ✅ Environment variables validated`);

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    console.log(`[${requestId}] ✅ Supabase client initialized`);

    // Get the authenticated user from the request
    const authHeader = req.headers.get('Authorization');
    console.log(`[${requestId}] Auth header check: ${authHeader ? 'present' : 'MISSING'}`);
    if (!authHeader) {
      console.error(`[${requestId}] ❌ No Authorization header provided`);
      return new Response(
        JSON.stringify({ error: 'Authorization header required', requestId }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify the JWT token and get user
    const jwt = authHeader.replace('Bearer ', '');
    console.log(`[${requestId}] JWT extracted (length: ${jwt.length})`);
    
    console.log(`[${requestId}] Verifying user authentication...`);
    const { data: { user }, error: userError } = await supabase.auth.getUser(jwt);
    
    if (userError || !user) {
      console.error(`[${requestId}] ❌ User verification failed:`, userError);
      return new Response(
        JSON.stringify({ error: 'Invalid authentication', details: userError, requestId }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[${requestId}] ✅ User authenticated: ${user.id}`);
    console.log(`[${requestId}] Fetching Nylas account for user: ${user.id}`);

    // Get the user's Nylas account
    console.log(`[${requestId}] Querying nylas_accounts table for user_id: ${user.id}`);
    const { data: nylasAccount, error: accountError } = await supabase
      .from('nylas_accounts')
      .select('access_token, account_id')
      .eq('user_id', user.id)
      .single();

    console.log(`[${requestId}] Database query result:`, {
      hasData: !!nylasAccount,
      error: accountError,
      accountId: nylasAccount?.account_id,
      hasAccessToken: !!nylasAccount?.access_token
    });

    if (accountError || !nylasAccount) {
      console.error(`[${requestId}] ❌ Nylas account not found:`, accountError);
      return new Response(
        JSON.stringify({ 
          error: 'Calendar not connected. Please connect your calendar first.', 
          details: accountError,
          requestId 
        }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[${requestId}] ✅ Nylas account found for user`);
    console.log(`[${requestId}] Fetching calendars from Nylas API...`);

    // Fetch calendars from Nylas API
    const nylasUrl = 'https://api.nylas.com/calendars';
    const nylasHeaders = {
      'Authorization': `Bearer ${nylasAccount.access_token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    console.log(`[${requestId}] Making Nylas API request:`);
    console.log(`URL: ${nylasUrl}`);
    console.log(`Headers:`, {
      ...nylasHeaders,
      'Authorization': `Bearer ${nylasAccount.access_token.substring(0, 10)}...`
    });

    const calendarsResponse = await fetch(nylasUrl, {
      method: 'GET',
      headers: nylasHeaders,
    });

    console.log(`[${requestId}] Nylas API response status: ${calendarsResponse.status}`);
    console.log(`[${requestId}] Nylas API response headers:`, Object.fromEntries(calendarsResponse.headers.entries()));

    if (!calendarsResponse.ok) {
      const error = await calendarsResponse.text();
      console.error(`[${requestId}] ❌ Nylas calendars fetch failed:`, error);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to fetch calendars', 
          details: error, 
          status: calendarsResponse.status,
          requestId 
        }),
        { status: calendarsResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const calendarsData = await calendarsResponse.json();
    
    console.log(`[${requestId}] ✅ Successfully fetched calendars:`, {
      count: calendarsData.length || 'unknown',
      data: calendarsData
    });

    const responseData = { 
      success: true, 
      calendars: calendarsData,
      account_id: nylasAccount.account_id,
      requestId
    };

    console.log(`[${requestId}] Returning successful response`);
    return new Response(
      JSON.stringify(responseData),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error(`[${requestId || 'unknown'}] ❌ Unexpected error:`, error);
    console.error(`[${requestId || 'unknown'}] Error stack:`, error.stack);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message,
        requestId: requestId || 'unknown'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
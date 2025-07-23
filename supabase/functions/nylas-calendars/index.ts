import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase environment variables');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the authenticated user from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify the JWT token and get user
    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(jwt);
    
    if (userError || !user) {
      console.error('User verification failed:', userError);
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Fetching Nylas account for user:', user.id);

    // Get the user's Nylas account
    const { data: nylasAccount, error: accountError } = await supabase
      .from('nylas_accounts')
      .select('access_token, account_id')
      .eq('user_id', user.id)
      .single();

    if (accountError || !nylasAccount) {
      console.error('Nylas account not found:', accountError);
      return new Response(
        JSON.stringify({ error: 'Calendar not connected. Please connect your calendar first.' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Fetching calendars from Nylas API...');

    // Fetch calendars from Nylas API
    const calendarsResponse = await fetch('https://api.nylas.com/calendars', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${nylasAccount.access_token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!calendarsResponse.ok) {
      const error = await calendarsResponse.text();
      console.error('Nylas calendars fetch failed:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch calendars', details: error }),
        { status: calendarsResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const calendarsData = await calendarsResponse.json();
    
    console.log('Successfully fetched calendars:', calendarsData.length || 'unknown count');

    return new Response(
      JSON.stringify({ 
        success: true, 
        calendars: calendarsData,
        account_id: nylasAccount.account_id
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "https://deno.land/std@0.168.0/node/crypto.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-nylas-signature',
};

serve(async (req) => {
  // Handle Nylas challenge verification (GET request)
  if (req.method === 'GET') {
    const url = new URL(req.url);
    const challenge = url.searchParams.get('challenge');
    
    if (challenge) {
      console.log('Nylas webhook challenge received:', challenge);
      return new Response(challenge, {
        status: 200,
        headers: { 'Content-Type': 'text/plain' },
      });
    }
    
    return new Response('Challenge parameter missing', { status: 400 });
  }

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const nylasWebhookSecret = Deno.env.get('NYLAS_WEBHOOK_SECRET');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!nylasWebhookSecret || !supabaseUrl || !supabaseServiceKey) {
      console.error('Missing required environment variables');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get request body and signature
    const body = await req.text();
    const signature = req.headers.get('x-nylas-signature');

    if (!signature) {
      console.error('Missing Nylas signature');
      return new Response(
        JSON.stringify({ error: 'Missing webhook signature' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify webhook signature
    const expectedSignature = createHmac('sha256', nylasWebhookSecret)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.error('Invalid webhook signature');
      return new Response(
        JSON.stringify({ error: 'Invalid webhook signature' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Webhook signature verified');

    // Parse webhook payload
    const webhookData = JSON.parse(body);
    console.log('Webhook received:', webhookData.type);

    // Handle different webhook types
    switch (webhookData.type) {
      case 'event.created':
      case 'event.updated':
        await handleEventUpsert(supabase, webhookData.data);
        break;
      
      case 'event.deleted':
        await handleEventDelete(supabase, webhookData.data);
        break;
      
      case 'grant.created':
        console.log('Grant created for account:', webhookData.data.account_id);
        break;
      
      case 'grant.deleted':
        await handleGrantDelete(supabase, webhookData.data);
        break;
      
      default:
        console.log('Unhandled webhook type:', webhookData.type);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Webhook processing error:', error);
    return new Response(
      JSON.stringify({ error: 'Webhook processing failed', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function handleEventUpsert(supabase: any, eventData: any) {
  try {
    console.log('Handling event upsert:', eventData.id);

    // Find the user associated with this account
    const { data: account, error: accountError } = await supabase
      .from('nylas_accounts')
      .select('user_id')
      .eq('account_id', eventData.account_id)
      .single();

    if (accountError || !account) {
      console.error('Account not found for event:', eventData.account_id);
      return;
    }

    // Upsert the event
    const { error: eventError } = await supabase
      .from('nylas_events')
      .upsert({
        event_id: eventData.id,
        user_id: account.user_id,
        account_id: eventData.account_id,
        calendar_id: eventData.calendar_id,
        title: eventData.title || '',
        description: eventData.description || '',
        when_start: eventData.when?.start_time ? new Date(eventData.when.start_time * 1000).toISOString() : null,
        when_end: eventData.when?.end_time ? new Date(eventData.when.end_time * 1000).toISOString() : null,
        when_data: eventData.when || {},
        location: eventData.location || '',
        metadata: eventData,
      });

    if (eventError) {
      console.error('Failed to upsert event:', eventError);
    } else {
      console.log('Event upserted successfully:', eventData.id);
    }
  } catch (error) {
    console.error('Error in handleEventUpsert:', error);
  }
}

async function handleEventDelete(supabase: any, eventData: any) {
  try {
    console.log('Handling event delete:', eventData.id);

    const { error } = await supabase
      .from('nylas_events')
      .delete()
      .eq('event_id', eventData.id);

    if (error) {
      console.error('Failed to delete event:', error);
    } else {
      console.log('Event deleted successfully:', eventData.id);
    }
  } catch (error) {
    console.error('Error in handleEventDelete:', error);
  }
}

async function handleGrantDelete(supabase: any, grantData: any) {
  try {
    console.log('Handling grant delete:', grantData.account_id);

    // Delete the Nylas account and all associated events
    const { error: eventsError } = await supabase
      .from('nylas_events')
      .delete()
      .eq('account_id', grantData.account_id);

    if (eventsError) {
      console.error('Failed to delete events for account:', eventsError);
    }

    const { error: accountError } = await supabase
      .from('nylas_accounts')
      .delete()
      .eq('account_id', grantData.account_id);

    if (accountError) {
      console.error('Failed to delete account:', accountError);
    } else {
      console.log('Grant and associated data deleted successfully');
    }
  } catch (error) {
    console.error('Error in handleGrantDelete:', error);
  }
}
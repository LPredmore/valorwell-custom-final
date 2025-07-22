
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    const { email, password, firstName, lastName, phone, role = 'admin' } = await req.json()

    console.log('🔵 Creating admin user with data:', { email, firstName, lastName, phone, role })

    // Create the auth user
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        role: role
      }
    })

    if (authError) {
      console.error('❌ Auth user creation failed:', authError)
      return new Response(
        JSON.stringify({ error: 'Failed to create auth user', details: authError }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('✅ Auth user created successfully:', authUser.user.id)

    // Update the profile with additional data
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({
        phone,
        role,
        updated_at: new Date().toISOString()
      })
      .eq('id', authUser.user.id)

    if (profileError) {
      console.error('❌ Profile update failed:', profileError)
      return new Response(
        JSON.stringify({ error: 'Failed to update profile', details: profileError }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('✅ Profile updated successfully')

    // Create clinician record if role is clinician or admin
    if (role === 'clinician' || role === 'admin') {
      const { error: clinicianError } = await supabaseAdmin
        .from('clinicians')
        .insert({
          id: authUser.user.id,
          profile_id: authUser.user.id,
          clinician_professional_name: `Dr. ${firstName} ${lastName}`,
          clinician_type: 'Psychiatrist',
          clinician_accepting_new_clients: true,
          clinician_min_client_age: 18,
          clinician_time_zone: 'America/New_York',
          clinician_time_granularity: 'hour',
          clinician_calendar_start_time: '08:00:00',
          clinician_calendar_end_time: '21:00:00',
          clinician_max_advance_days: 30,
          clinician_min_notice_days: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (clinicianError) {
        console.error('❌ Clinician creation failed:', clinicianError)
        return new Response(
          JSON.stringify({ error: 'Failed to create clinician record', details: clinicianError }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      console.log('✅ Clinician record created successfully')
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        user: authUser.user,
        message: 'User created successfully with all required records'
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('💥 Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

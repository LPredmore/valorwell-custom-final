-- Row Level Security (RLS) Policies
-- Security policies for all tables

-- ======================
-- CMS1500_claims Policies
-- ======================
ALTER TABLE "CMS1500_claims" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clinicians can create claims" ON "CMS1500_claims"
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM (appointments a JOIN clinicians c ON ((a.clinician_id = c.id)))
    WHERE ((a.id = "CMS1500_claims".appointment_id) AND (c.profile_id = auth.uid()))
  )
);

CREATE POLICY "Clinicians can view their claims" ON "CMS1500_claims"
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM (appointments a JOIN clinicians c ON ((a.clinician_id = c.id)))
    WHERE ((a.id = "CMS1500_claims".appointment_id) AND (c.profile_id = auth.uid()))
  )
);

-- ======================
-- Appointment Audit Policies
-- ======================
ALTER TABLE appointment_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clinicians can view audit for their appointments" ON appointment_audit
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM (appointments a JOIN clinicians c ON ((a.clinician_id = c.id)))
    WHERE ((a.id = appointment_audit.appointment_id) AND (c.profile_id = auth.uid()))
  )
);

-- ======================
-- Appointment Duration Types Policies
-- ======================
ALTER TABLE appointment_duration_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view appointment duration types" ON appointment_duration_types
FOR SELECT USING (true);

CREATE POLICY "Only admins can modify appointment duration types" ON appointment_duration_types
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::user_role))
  )
);

-- ======================
-- Appointment Types Policies
-- ======================
ALTER TABLE appointment_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view appointment types" ON appointment_types
FOR SELECT USING (true);

CREATE POLICY "Only admins can modify appointment types" ON appointment_types
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::user_role))
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::user_role))
  )
);

-- ======================
-- Appointments Policies
-- ======================
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clinicians can create appointments" ON appointments
FOR INSERT WITH CHECK (
  auth.uid() IN (
    SELECT clinicians.profile_id FROM clinicians
    WHERE (clinicians.id = appointments.clinician_id)
  )
);

CREATE POLICY "Clinicians can delete appointments" ON appointments
FOR DELETE USING (
  auth.uid() IN (
    SELECT clinicians.profile_id FROM clinicians
    WHERE (clinicians.id = appointments.clinician_id)
  )
);

CREATE POLICY "Users can update their own appointments" ON appointments
FOR UPDATE USING (
  auth.uid() IN (
    SELECT clinicians.profile_id FROM clinicians
    WHERE (clinicians.id = appointments.clinician_id)
    UNION
    SELECT clients.profile_id FROM clients
    WHERE (clients.id = appointments.client_id)
  )
);

CREATE POLICY "Users can view appointments they are involved in" ON appointments
FOR SELECT USING (
  auth.uid() IN (
    SELECT clinicians.profile_id FROM clinicians
    WHERE (clinicians.id = appointments.clinician_id)
    UNION
    SELECT clients.profile_id FROM clients
    WHERE (clients.id = appointments.client_id)
  )
);

-- ======================
-- Clients Policies
-- ======================
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view their own record" ON clients
FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY "Clinicians can create clients" ON clients
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'clinician'::user_role))
  )
);

CREATE POLICY "Clinicians can update clients" ON clients
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'clinician'::user_role))
  )
);

CREATE POLICY "Clinicians can view all clients" ON clients
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'clinician'::user_role))
  )
);

-- ======================
-- Clinicians Policies
-- ======================
ALTER TABLE clinicians ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clinicians can update their own record" ON clinicians
FOR UPDATE USING (auth.uid() = profile_id);

CREATE POLICY "Users can view all clinicians" ON clinicians
FOR SELECT USING (true);

-- ======================
-- CPT Codes Policies
-- ======================
ALTER TABLE cpt_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view CPT codes" ON cpt_codes
FOR SELECT USING (true);

CREATE POLICY "Only admins can modify CPT codes" ON cpt_codes
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::user_role))
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::user_role))
  )
);

-- ======================
-- Form Submissions Policies
-- ======================
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clinicians can create form submissions" ON form_submissions
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM clinicians
    WHERE ((clinicians.id = form_submissions.clinician_id) AND (clinicians.profile_id = auth.uid()))
  )
);

CREATE POLICY "Clinicians can update their form submissions" ON form_submissions
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM clinicians
    WHERE ((clinicians.id = form_submissions.clinician_id) AND (clinicians.profile_id = auth.uid()))
  )
);

CREATE POLICY "Clinicians can view their form submissions" ON form_submissions
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM clinicians
    WHERE ((clinicians.id = form_submissions.clinician_id) AND (clinicians.profile_id = auth.uid()))
  )
);

-- ======================
-- ICD10 Policies
-- ======================
ALTER TABLE icd10 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view ICD10 codes" ON icd10
FOR SELECT USING (true);

-- ======================
-- Nylas Accounts Policies
-- ======================
ALTER TABLE nylas_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create their own Nylas accounts" ON nylas_accounts
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own Nylas accounts" ON nylas_accounts
FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own Nylas accounts" ON nylas_accounts
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own Nylas accounts" ON nylas_accounts
FOR SELECT USING (auth.uid() = user_id);

-- ======================
-- Nylas Events Policies
-- ======================
ALTER TABLE nylas_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create their own Nylas events" ON nylas_events
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own Nylas events" ON nylas_events
FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own Nylas events" ON nylas_events
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own Nylas events" ON nylas_events
FOR SELECT USING (auth.uid() = user_id);

-- ======================
-- Practice Info Policies
-- ======================
ALTER TABLE practiceinfo ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view practice info" ON practiceinfo
FOR SELECT USING (true);

CREATE POLICY "Only admins can modify practice info" ON practiceinfo
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::user_role))
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::user_role))
  )
);

-- ======================
-- Profiles Policies
-- ======================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "New users can insert their own profile" ON profiles
FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view their own profile" ON profiles
FOR SELECT USING (auth.uid() = id);

-- ======================
-- Templates Policies
-- ======================
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clinicians can create templates" ON templates
FOR INSERT WITH CHECK (
  (EXISTS (
    SELECT 1 FROM profiles
    WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['clinician'::user_role, 'admin'::user_role])))
  )) AND (auth.uid() = created_by)
);

CREATE POLICY "Clinicians can delete templates they created" ON templates
FOR DELETE USING (
  (created_by = auth.uid()) AND (EXISTS (
    SELECT 1 FROM profiles
    WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['clinician'::user_role, 'admin'::user_role])))
  ))
);

CREATE POLICY "Clinicians can update templates they created" ON templates
FOR UPDATE USING (
  (created_by = auth.uid()) AND (EXISTS (
    SELECT 1 FROM profiles
    WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['clinician'::user_role, 'admin'::user_role])))
  ))
);

CREATE POLICY "Clinicians can view all templates" ON templates
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['clinician'::user_role, 'admin'::user_role])))
  )
);
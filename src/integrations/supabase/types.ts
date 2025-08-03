export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      appointment_audit: {
        Row: {
          action: string
          appointment_id: string
          changed_at: string | null
          changed_by: string | null
          id: string
          new_data: Json | null
          old_data: Json | null
          reason: string | null
        }
        Insert: {
          action: string
          appointment_id: string
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          reason?: string | null
        }
        Update: {
          action?: string
          appointment_id?: string
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          reason?: string | null
        }
        Relationships: []
      }
      appointment_duration_types: {
        Row: {
          color_code: string | null
          created_at: string | null
          duration_minutes: number
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          color_code?: string | null
          created_at?: string | null
          duration_minutes: number
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          color_code?: string | null
          created_at?: string | null
          duration_minutes?: number
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      appointment_types: {
        Row: {
          created_at: string
          id: number
          is_active: boolean | null
          name: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          is_active?: boolean | null
          name?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          is_active?: boolean | null
          name?: string | null
        }
        Relationships: []
      }
      appointments: {
        Row: {
          appointment_recurring: boolean | null
          buffer_after: number | null
          buffer_before: number | null
          client_email: string | null
          client_id: string
          client_name: string | null
          client_timezone: Database["public"]["Enums"]["time_zones"] | null
          clinician_email: string | null
          clinician_id: string
          clinician_name: string | null
          created_at: string
          date_of_session: string | null
          end_at: string
          flexibility_window: Json | null
          id: string
          is_flexible: boolean | null
          last_real_time_update: string | null
          last_synced_at: string | null
          notes: string | null
          priority: number | null
          real_time_update_source: string | null
          recurring_group_id: string | null
          start_at: string
          status: Database["public"]["Enums"]["appointment_status"]
          template_id: string | null
          type: string
          updated_at: string
          video_room_url: string | null
        }
        Insert: {
          appointment_recurring?: boolean | null
          buffer_after?: number | null
          buffer_before?: number | null
          client_email?: string | null
          client_id: string
          client_name?: string | null
          client_timezone?: Database["public"]["Enums"]["time_zones"] | null
          clinician_email?: string | null
          clinician_id: string
          clinician_name?: string | null
          created_at?: string
          date_of_session?: string | null
          end_at: string
          flexibility_window?: Json | null
          id?: string
          is_flexible?: boolean | null
          last_real_time_update?: string | null
          last_synced_at?: string | null
          notes?: string | null
          priority?: number | null
          real_time_update_source?: string | null
          recurring_group_id?: string | null
          start_at: string
          status?: Database["public"]["Enums"]["appointment_status"]
          template_id?: string | null
          type: string
          updated_at?: string
          video_room_url?: string | null
        }
        Update: {
          appointment_recurring?: boolean | null
          buffer_after?: number | null
          buffer_before?: number | null
          client_email?: string | null
          client_id?: string
          client_name?: string | null
          client_timezone?: Database["public"]["Enums"]["time_zones"] | null
          clinician_email?: string | null
          clinician_id?: string
          clinician_name?: string | null
          created_at?: string
          date_of_session?: string | null
          end_at?: string
          flexibility_window?: Json | null
          id?: string
          is_flexible?: boolean | null
          last_real_time_update?: string | null
          last_synced_at?: string | null
          notes?: string | null
          priority?: number | null
          real_time_update_source?: string | null
          recurring_group_id?: string | null
          start_at?: string
          status?: Database["public"]["Enums"]["appointment_status"]
          template_id?: string | null
          type?: string
          updated_at?: string
          video_room_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_clinician_id_fkey"
            columns: ["clinician_id"]
            isOneToOne: false
            referencedRelation: "clinicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_appointments_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_appointments_clinician_id"
            columns: ["clinician_id"]
            isOneToOne: false
            referencedRelation: "clinicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_appointments_template_id"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          },
        ]
      }
      client_insurance: {
        Row: {
          authorization_payment: boolean | null
          claims_address_line1: string | null
          claims_address_line2: string | null
          claims_city: string | null
          claims_state: string | null
          claims_zip: string | null
          client_id: string
          condition_auto_accident: boolean | null
          condition_employment: boolean | null
          condition_other_accident: boolean | null
          copay_amount: number | null
          created_at: string
          group_number: string | null
          health_benefit_plan_indicator: string | null
          id: string
          insurance_company_id: string | null
          insurance_plan_program_name: string | null
          insurance_type: Database["public"]["Enums"]["insurance_type"]
          insured_employer_school_name: string | null
          insured_sex: string | null
          is_active: boolean
          member_id: string | null
          notes: string | null
          other_insured_date_of_birth: string | null
          other_insured_employer_school_name: string | null
          other_insured_name: string | null
          other_insured_plan_program_name: string | null
          other_insured_policy_group_number: string | null
          other_insured_sex: string | null
          phone_number: string | null
          plan_name: string | null
          plan_type: string | null
          policy_number: string | null
          signature_on_file: boolean | null
          subscriber_address_line1: string | null
          subscriber_address_line2: string | null
          subscriber_city: string | null
          subscriber_date_of_birth: string | null
          subscriber_name: string | null
          subscriber_relationship: string | null
          subscriber_state: string | null
          subscriber_zip: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          authorization_payment?: boolean | null
          claims_address_line1?: string | null
          claims_address_line2?: string | null
          claims_city?: string | null
          claims_state?: string | null
          claims_zip?: string | null
          client_id: string
          condition_auto_accident?: boolean | null
          condition_employment?: boolean | null
          condition_other_accident?: boolean | null
          copay_amount?: number | null
          created_at?: string
          group_number?: string | null
          health_benefit_plan_indicator?: string | null
          id?: string
          insurance_company_id?: string | null
          insurance_plan_program_name?: string | null
          insurance_type?: Database["public"]["Enums"]["insurance_type"]
          insured_employer_school_name?: string | null
          insured_sex?: string | null
          is_active?: boolean
          member_id?: string | null
          notes?: string | null
          other_insured_date_of_birth?: string | null
          other_insured_employer_school_name?: string | null
          other_insured_name?: string | null
          other_insured_plan_program_name?: string | null
          other_insured_policy_group_number?: string | null
          other_insured_sex?: string | null
          phone_number?: string | null
          plan_name?: string | null
          plan_type?: string | null
          policy_number?: string | null
          signature_on_file?: boolean | null
          subscriber_address_line1?: string | null
          subscriber_address_line2?: string | null
          subscriber_city?: string | null
          subscriber_date_of_birth?: string | null
          subscriber_name?: string | null
          subscriber_relationship?: string | null
          subscriber_state?: string | null
          subscriber_zip?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          authorization_payment?: boolean | null
          claims_address_line1?: string | null
          claims_address_line2?: string | null
          claims_city?: string | null
          claims_state?: string | null
          claims_zip?: string | null
          client_id?: string
          condition_auto_accident?: boolean | null
          condition_employment?: boolean | null
          condition_other_accident?: boolean | null
          copay_amount?: number | null
          created_at?: string
          group_number?: string | null
          health_benefit_plan_indicator?: string | null
          id?: string
          insurance_company_id?: string | null
          insurance_plan_program_name?: string | null
          insurance_type?: Database["public"]["Enums"]["insurance_type"]
          insured_employer_school_name?: string | null
          insured_sex?: string | null
          is_active?: boolean
          member_id?: string | null
          notes?: string | null
          other_insured_date_of_birth?: string | null
          other_insured_employer_school_name?: string | null
          other_insured_name?: string | null
          other_insured_plan_program_name?: string | null
          other_insured_policy_group_number?: string | null
          other_insured_sex?: string | null
          phone_number?: string | null
          plan_name?: string | null
          plan_type?: string | null
          policy_number?: string | null
          signature_on_file?: boolean | null
          subscriber_address_line1?: string | null
          subscriber_address_line2?: string | null
          subscriber_city?: string | null
          subscriber_date_of_birth?: string | null
          subscriber_name?: string | null
          subscriber_relationship?: string | null
          subscriber_state?: string | null
          subscriber_zip?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_insurance_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_insurance_insurance_company_id_fkey"
            columns: ["insurance_company_id"]
            isOneToOne: false
            referencedRelation: "insurance_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          client_address: string | null
          client_affect: string | null
          client_age: number | null
          client_appearance: string | null
          client_assigned_therapist: string | null
          client_attitude: string | null
          client_behavior: string | null
          client_branchOS: string | null
          client_champva: string | null
          client_city: string | null
          client_currentsymptoms: string | null
          client_diagnosis: string[] | null
          client_disabilityrating: string | null
          client_email: string | null
          client_first_name: string | null
          client_functioning: string | null
          client_gender: string | null
          client_gender_identity: string | null
          client_group_number_primary: string | null
          client_group_number_secondary: string | null
          client_group_number_tertiary: string | null
          client_homicidalideation: string | null
          client_insightjudgement: string | null
          client_insurance_company_primary: string | null
          client_insurance_company_secondary: string | null
          client_insurance_company_tertiary: string | null
          client_insurance_type_primary: string | null
          client_insurance_type_secondary: string | null
          client_insurance_type_tertiary: string | null
          client_intervention1: string | null
          client_intervention2: string | null
          client_intervention3: string | null
          client_intervention4: string | null
          client_intervention5: string | null
          client_intervention6: string | null
          client_is_profile_complete: string | null
          client_last_name: string | null
          client_medications: string | null
          client_memoryconcentration: string | null
          client_middle_name: string | null
          client_minor: string | null
          client_mood: string | null
          client_nexttreatmentplanupdate: string | null
          client_orientation: string | null
          client_perception: string | null
          client_personsinattendance: string | null
          client_phone: string | null
          client_planlength: string | null
          client_policy_number_primary: string | null
          client_policy_number_secondary: string | null
          client_policy_number_tertiary: string | null
          client_preferred_name: string | null
          client_primary_payer_id: string | null
          client_primaryobjective: string | null
          client_privatenote: string | null
          client_problem: string | null
          client_prognosis: string | null
          client_progress: string | null
          client_recentdischarge: string | null
          client_referral_source: string | null
          client_relationship: string | null
          client_secondary_payer_id: string | null
          client_secondaryobjective: string | null
          client_self_goal: string | null
          client_sessionnarrative: string | null
          client_speech: string | null
          client_ssn: string | null
          client_status: Database["public"]["Enums"]["client_status"] | null
          client_subscriber_dob_primary: string | null
          client_subscriber_dob_secondary: string | null
          client_subscriber_dob_tertiary: string | null
          client_subscriber_name_primary: string | null
          client_subscriber_name_secondary: string | null
          client_subscriber_name_tertiary: string | null
          client_subscriber_relationship_primary: string | null
          client_subscriber_relationship_secondary: string | null
          client_subscriber_relationship_tertiary: string | null
          client_substanceabuserisk: string | null
          client_suicidalideation: string | null
          client_temppassword: string | null
          client_tertiary_payer_id: string | null
          client_tertiaryobjective: string | null
          client_thoughtprocess: string | null
          client_time_zone: string | null
          client_treatmentfrequency: string | null
          client_treatmentgoal: string | null
          client_treatmentplan_startdate: string | null
          client_tricare_beneficiary_category: string | null
          client_tricare_has_referral: string | null
          client_tricare_plan: string | null
          client_tricare_policy_id: string | null
          client_tricare_referral_number: string | null
          client_tricare_region: string | null
          client_tricare_sponsor_branch: string | null
          client_tricare_sponsor_id: string | null
          client_tricare_sponsor_name: string | null
          client_vacoverage: string | null
          client_zip_code: string | null
          created_at: string
          date_of_birth: string | null
          eligibility_claimmd_id_primary: string | null
          eligibility_claimmd_id_secondary: string | null
          eligibility_claimmd_id_tertiary: string | null
          eligibility_coinsurance_primary_percent: number | null
          eligibility_coinsurance_secondary_percent: number | null
          eligibility_coinsurance_tertiary_percent: number | null
          eligibility_copay_primary: number | null
          eligibility_copay_secondary: number | null
          eligibility_copay_tertiary: number | null
          eligibility_deductible_primary: number | null
          eligibility_deductible_secondary: number | null
          eligibility_deductible_tertiary: number | null
          eligibility_last_checked_primary: string | null
          eligibility_last_checked_secondary: string | null
          eligibility_last_checked_tertiary: string | null
          eligibility_response_details_primary_json: Json | null
          eligibility_response_details_secondary_json: Json | null
          eligibility_response_details_tertiary_json: Json | null
          eligibility_status_primary: string | null
          eligibility_status_secondary: string | null
          eligibility_status_tertiary: string | null
          id: string
          profile_id: string | null
          state: Database["public"]["Enums"]["states"] | null
          stripe_customer_id: string | null
          updated_at: string
        }
        Insert: {
          client_address?: string | null
          client_affect?: string | null
          client_age?: number | null
          client_appearance?: string | null
          client_assigned_therapist?: string | null
          client_attitude?: string | null
          client_behavior?: string | null
          client_branchOS?: string | null
          client_champva?: string | null
          client_city?: string | null
          client_currentsymptoms?: string | null
          client_diagnosis?: string[] | null
          client_disabilityrating?: string | null
          client_email?: string | null
          client_first_name?: string | null
          client_functioning?: string | null
          client_gender?: string | null
          client_gender_identity?: string | null
          client_group_number_primary?: string | null
          client_group_number_secondary?: string | null
          client_group_number_tertiary?: string | null
          client_homicidalideation?: string | null
          client_insightjudgement?: string | null
          client_insurance_company_primary?: string | null
          client_insurance_company_secondary?: string | null
          client_insurance_company_tertiary?: string | null
          client_insurance_type_primary?: string | null
          client_insurance_type_secondary?: string | null
          client_insurance_type_tertiary?: string | null
          client_intervention1?: string | null
          client_intervention2?: string | null
          client_intervention3?: string | null
          client_intervention4?: string | null
          client_intervention5?: string | null
          client_intervention6?: string | null
          client_is_profile_complete?: string | null
          client_last_name?: string | null
          client_medications?: string | null
          client_memoryconcentration?: string | null
          client_middle_name?: string | null
          client_minor?: string | null
          client_mood?: string | null
          client_nexttreatmentplanupdate?: string | null
          client_orientation?: string | null
          client_perception?: string | null
          client_personsinattendance?: string | null
          client_phone?: string | null
          client_planlength?: string | null
          client_policy_number_primary?: string | null
          client_policy_number_secondary?: string | null
          client_policy_number_tertiary?: string | null
          client_preferred_name?: string | null
          client_primary_payer_id?: string | null
          client_primaryobjective?: string | null
          client_privatenote?: string | null
          client_problem?: string | null
          client_prognosis?: string | null
          client_progress?: string | null
          client_recentdischarge?: string | null
          client_referral_source?: string | null
          client_relationship?: string | null
          client_secondary_payer_id?: string | null
          client_secondaryobjective?: string | null
          client_self_goal?: string | null
          client_sessionnarrative?: string | null
          client_speech?: string | null
          client_ssn?: string | null
          client_status?: Database["public"]["Enums"]["client_status"] | null
          client_subscriber_dob_primary?: string | null
          client_subscriber_dob_secondary?: string | null
          client_subscriber_dob_tertiary?: string | null
          client_subscriber_name_primary?: string | null
          client_subscriber_name_secondary?: string | null
          client_subscriber_name_tertiary?: string | null
          client_subscriber_relationship_primary?: string | null
          client_subscriber_relationship_secondary?: string | null
          client_subscriber_relationship_tertiary?: string | null
          client_substanceabuserisk?: string | null
          client_suicidalideation?: string | null
          client_temppassword?: string | null
          client_tertiary_payer_id?: string | null
          client_tertiaryobjective?: string | null
          client_thoughtprocess?: string | null
          client_time_zone?: string | null
          client_treatmentfrequency?: string | null
          client_treatmentgoal?: string | null
          client_treatmentplan_startdate?: string | null
          client_tricare_beneficiary_category?: string | null
          client_tricare_has_referral?: string | null
          client_tricare_plan?: string | null
          client_tricare_policy_id?: string | null
          client_tricare_referral_number?: string | null
          client_tricare_region?: string | null
          client_tricare_sponsor_branch?: string | null
          client_tricare_sponsor_id?: string | null
          client_tricare_sponsor_name?: string | null
          client_vacoverage?: string | null
          client_zip_code?: string | null
          created_at?: string
          date_of_birth?: string | null
          eligibility_claimmd_id_primary?: string | null
          eligibility_claimmd_id_secondary?: string | null
          eligibility_claimmd_id_tertiary?: string | null
          eligibility_coinsurance_primary_percent?: number | null
          eligibility_coinsurance_secondary_percent?: number | null
          eligibility_coinsurance_tertiary_percent?: number | null
          eligibility_copay_primary?: number | null
          eligibility_copay_secondary?: number | null
          eligibility_copay_tertiary?: number | null
          eligibility_deductible_primary?: number | null
          eligibility_deductible_secondary?: number | null
          eligibility_deductible_tertiary?: number | null
          eligibility_last_checked_primary?: string | null
          eligibility_last_checked_secondary?: string | null
          eligibility_last_checked_tertiary?: string | null
          eligibility_response_details_primary_json?: Json | null
          eligibility_response_details_secondary_json?: Json | null
          eligibility_response_details_tertiary_json?: Json | null
          eligibility_status_primary?: string | null
          eligibility_status_secondary?: string | null
          eligibility_status_tertiary?: string | null
          id: string
          profile_id?: string | null
          state?: Database["public"]["Enums"]["states"] | null
          stripe_customer_id?: string | null
          updated_at?: string
        }
        Update: {
          client_address?: string | null
          client_affect?: string | null
          client_age?: number | null
          client_appearance?: string | null
          client_assigned_therapist?: string | null
          client_attitude?: string | null
          client_behavior?: string | null
          client_branchOS?: string | null
          client_champva?: string | null
          client_city?: string | null
          client_currentsymptoms?: string | null
          client_diagnosis?: string[] | null
          client_disabilityrating?: string | null
          client_email?: string | null
          client_first_name?: string | null
          client_functioning?: string | null
          client_gender?: string | null
          client_gender_identity?: string | null
          client_group_number_primary?: string | null
          client_group_number_secondary?: string | null
          client_group_number_tertiary?: string | null
          client_homicidalideation?: string | null
          client_insightjudgement?: string | null
          client_insurance_company_primary?: string | null
          client_insurance_company_secondary?: string | null
          client_insurance_company_tertiary?: string | null
          client_insurance_type_primary?: string | null
          client_insurance_type_secondary?: string | null
          client_insurance_type_tertiary?: string | null
          client_intervention1?: string | null
          client_intervention2?: string | null
          client_intervention3?: string | null
          client_intervention4?: string | null
          client_intervention5?: string | null
          client_intervention6?: string | null
          client_is_profile_complete?: string | null
          client_last_name?: string | null
          client_medications?: string | null
          client_memoryconcentration?: string | null
          client_middle_name?: string | null
          client_minor?: string | null
          client_mood?: string | null
          client_nexttreatmentplanupdate?: string | null
          client_orientation?: string | null
          client_perception?: string | null
          client_personsinattendance?: string | null
          client_phone?: string | null
          client_planlength?: string | null
          client_policy_number_primary?: string | null
          client_policy_number_secondary?: string | null
          client_policy_number_tertiary?: string | null
          client_preferred_name?: string | null
          client_primary_payer_id?: string | null
          client_primaryobjective?: string | null
          client_privatenote?: string | null
          client_problem?: string | null
          client_prognosis?: string | null
          client_progress?: string | null
          client_recentdischarge?: string | null
          client_referral_source?: string | null
          client_relationship?: string | null
          client_secondary_payer_id?: string | null
          client_secondaryobjective?: string | null
          client_self_goal?: string | null
          client_sessionnarrative?: string | null
          client_speech?: string | null
          client_ssn?: string | null
          client_status?: Database["public"]["Enums"]["client_status"] | null
          client_subscriber_dob_primary?: string | null
          client_subscriber_dob_secondary?: string | null
          client_subscriber_dob_tertiary?: string | null
          client_subscriber_name_primary?: string | null
          client_subscriber_name_secondary?: string | null
          client_subscriber_name_tertiary?: string | null
          client_subscriber_relationship_primary?: string | null
          client_subscriber_relationship_secondary?: string | null
          client_subscriber_relationship_tertiary?: string | null
          client_substanceabuserisk?: string | null
          client_suicidalideation?: string | null
          client_temppassword?: string | null
          client_tertiary_payer_id?: string | null
          client_tertiaryobjective?: string | null
          client_thoughtprocess?: string | null
          client_time_zone?: string | null
          client_treatmentfrequency?: string | null
          client_treatmentgoal?: string | null
          client_treatmentplan_startdate?: string | null
          client_tricare_beneficiary_category?: string | null
          client_tricare_has_referral?: string | null
          client_tricare_plan?: string | null
          client_tricare_policy_id?: string | null
          client_tricare_referral_number?: string | null
          client_tricare_region?: string | null
          client_tricare_sponsor_branch?: string | null
          client_tricare_sponsor_id?: string | null
          client_tricare_sponsor_name?: string | null
          client_vacoverage?: string | null
          client_zip_code?: string | null
          created_at?: string
          date_of_birth?: string | null
          eligibility_claimmd_id_primary?: string | null
          eligibility_claimmd_id_secondary?: string | null
          eligibility_claimmd_id_tertiary?: string | null
          eligibility_coinsurance_primary_percent?: number | null
          eligibility_coinsurance_secondary_percent?: number | null
          eligibility_coinsurance_tertiary_percent?: number | null
          eligibility_copay_primary?: number | null
          eligibility_copay_secondary?: number | null
          eligibility_copay_tertiary?: number | null
          eligibility_deductible_primary?: number | null
          eligibility_deductible_secondary?: number | null
          eligibility_deductible_tertiary?: number | null
          eligibility_last_checked_primary?: string | null
          eligibility_last_checked_secondary?: string | null
          eligibility_last_checked_tertiary?: string | null
          eligibility_response_details_primary_json?: Json | null
          eligibility_response_details_secondary_json?: Json | null
          eligibility_response_details_tertiary_json?: Json | null
          eligibility_status_primary?: string | null
          eligibility_status_secondary?: string | null
          eligibility_status_tertiary?: string | null
          id?: string
          profile_id?: string | null
          state?: Database["public"]["Enums"]["states"] | null
          stripe_customer_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clients_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      clinicians: {
        Row: {
          city: string | null
          clinician_accepting_new_clients: boolean | null
          clinician_availability_end_friday_1: string | null
          clinician_availability_end_friday_2: string | null
          clinician_availability_end_friday_3: string | null
          clinician_availability_end_monday_1: string | null
          clinician_availability_end_monday_2: string | null
          clinician_availability_end_monday_3: string | null
          clinician_availability_end_saturday_1: string | null
          clinician_availability_end_saturday_2: string | null
          clinician_availability_end_saturday_3: string | null
          clinician_availability_end_sunday_1: string | null
          clinician_availability_end_sunday_2: string | null
          clinician_availability_end_sunday_3: string | null
          clinician_availability_end_thursday_1: string | null
          clinician_availability_end_thursday_2: string | null
          clinician_availability_end_thursday_3: string | null
          clinician_availability_end_tuesday_1: string | null
          clinician_availability_end_tuesday_2: string | null
          clinician_availability_end_tuesday_3: string | null
          clinician_availability_end_wednesday_1: string | null
          clinician_availability_end_wednesday_2: string | null
          clinician_availability_end_wednesday_3: string | null
          clinician_availability_start_friday_1: string | null
          clinician_availability_start_friday_2: string | null
          clinician_availability_start_friday_3: string | null
          clinician_availability_start_monday_1: string | null
          clinician_availability_start_monday_2: string | null
          clinician_availability_start_monday_3: string | null
          clinician_availability_start_saturday_1: string | null
          clinician_availability_start_saturday_2: string | null
          clinician_availability_start_saturday_3: string | null
          clinician_availability_start_sunday_1: string | null
          clinician_availability_start_sunday_2: string | null
          clinician_availability_start_sunday_3: string | null
          clinician_availability_start_thursday_1: string | null
          clinician_availability_start_thursday_2: string | null
          clinician_availability_start_thursday_3: string | null
          clinician_availability_start_tuesday_1: string | null
          clinician_availability_start_tuesday_2: string | null
          clinician_availability_start_tuesday_3: string | null
          clinician_availability_start_wednesday_1: string | null
          clinician_availability_start_wednesday_2: string | null
          clinician_availability_start_wednesday_3: string | null
          clinician_bio: string | null
          clinician_calendar_end_time: string | null
          clinician_calendar_start_time: string | null
          clinician_image_url: string | null
          clinician_license_type: string | null
          clinician_licensed_states: string[] | null
          clinician_max_advance_days: number | null
          clinician_min_client_age: number | null
          clinician_min_notice_days: number | null
          clinician_nameinsurance: string | null
          clinician_npi_number: string | null
          clinician_professional_name: string | null
          clinician_taxonomy_code: string | null
          clinician_temppassword: string | null
          clinician_time_granularity: string | null
          clinician_time_zone: string | null
          clinician_timezone: Database["public"]["Enums"]["time_zones"][] | null
          clinician_treatment_approaches: string[] | null
          clinician_type: string | null
          created_at: string
          date_of_birth: string | null
          first_name: string | null
          id: string
          last_google_sync: string | null
          last_name: string | null
          phone: string | null
          profile_id: string
          state: string | null
          updated_at: string
          zip_code: string | null
        }
        Insert: {
          city?: string | null
          clinician_accepting_new_clients?: boolean | null
          clinician_availability_end_friday_1?: string | null
          clinician_availability_end_friday_2?: string | null
          clinician_availability_end_friday_3?: string | null
          clinician_availability_end_monday_1?: string | null
          clinician_availability_end_monday_2?: string | null
          clinician_availability_end_monday_3?: string | null
          clinician_availability_end_saturday_1?: string | null
          clinician_availability_end_saturday_2?: string | null
          clinician_availability_end_saturday_3?: string | null
          clinician_availability_end_sunday_1?: string | null
          clinician_availability_end_sunday_2?: string | null
          clinician_availability_end_sunday_3?: string | null
          clinician_availability_end_thursday_1?: string | null
          clinician_availability_end_thursday_2?: string | null
          clinician_availability_end_thursday_3?: string | null
          clinician_availability_end_tuesday_1?: string | null
          clinician_availability_end_tuesday_2?: string | null
          clinician_availability_end_tuesday_3?: string | null
          clinician_availability_end_wednesday_1?: string | null
          clinician_availability_end_wednesday_2?: string | null
          clinician_availability_end_wednesday_3?: string | null
          clinician_availability_start_friday_1?: string | null
          clinician_availability_start_friday_2?: string | null
          clinician_availability_start_friday_3?: string | null
          clinician_availability_start_monday_1?: string | null
          clinician_availability_start_monday_2?: string | null
          clinician_availability_start_monday_3?: string | null
          clinician_availability_start_saturday_1?: string | null
          clinician_availability_start_saturday_2?: string | null
          clinician_availability_start_saturday_3?: string | null
          clinician_availability_start_sunday_1?: string | null
          clinician_availability_start_sunday_2?: string | null
          clinician_availability_start_sunday_3?: string | null
          clinician_availability_start_thursday_1?: string | null
          clinician_availability_start_thursday_2?: string | null
          clinician_availability_start_thursday_3?: string | null
          clinician_availability_start_tuesday_1?: string | null
          clinician_availability_start_tuesday_2?: string | null
          clinician_availability_start_tuesday_3?: string | null
          clinician_availability_start_wednesday_1?: string | null
          clinician_availability_start_wednesday_2?: string | null
          clinician_availability_start_wednesday_3?: string | null
          clinician_bio?: string | null
          clinician_calendar_end_time?: string | null
          clinician_calendar_start_time?: string | null
          clinician_image_url?: string | null
          clinician_license_type?: string | null
          clinician_licensed_states?: string[] | null
          clinician_max_advance_days?: number | null
          clinician_min_client_age?: number | null
          clinician_min_notice_days?: number | null
          clinician_nameinsurance?: string | null
          clinician_npi_number?: string | null
          clinician_professional_name?: string | null
          clinician_taxonomy_code?: string | null
          clinician_temppassword?: string | null
          clinician_time_granularity?: string | null
          clinician_time_zone?: string | null
          clinician_timezone?:
            | Database["public"]["Enums"]["time_zones"][]
            | null
          clinician_treatment_approaches?: string[] | null
          clinician_type?: string | null
          created_at?: string
          date_of_birth?: string | null
          first_name?: string | null
          id?: string
          last_google_sync?: string | null
          last_name?: string | null
          phone?: string | null
          profile_id: string
          state?: string | null
          updated_at?: string
          zip_code?: string | null
        }
        Update: {
          city?: string | null
          clinician_accepting_new_clients?: boolean | null
          clinician_availability_end_friday_1?: string | null
          clinician_availability_end_friday_2?: string | null
          clinician_availability_end_friday_3?: string | null
          clinician_availability_end_monday_1?: string | null
          clinician_availability_end_monday_2?: string | null
          clinician_availability_end_monday_3?: string | null
          clinician_availability_end_saturday_1?: string | null
          clinician_availability_end_saturday_2?: string | null
          clinician_availability_end_saturday_3?: string | null
          clinician_availability_end_sunday_1?: string | null
          clinician_availability_end_sunday_2?: string | null
          clinician_availability_end_sunday_3?: string | null
          clinician_availability_end_thursday_1?: string | null
          clinician_availability_end_thursday_2?: string | null
          clinician_availability_end_thursday_3?: string | null
          clinician_availability_end_tuesday_1?: string | null
          clinician_availability_end_tuesday_2?: string | null
          clinician_availability_end_tuesday_3?: string | null
          clinician_availability_end_wednesday_1?: string | null
          clinician_availability_end_wednesday_2?: string | null
          clinician_availability_end_wednesday_3?: string | null
          clinician_availability_start_friday_1?: string | null
          clinician_availability_start_friday_2?: string | null
          clinician_availability_start_friday_3?: string | null
          clinician_availability_start_monday_1?: string | null
          clinician_availability_start_monday_2?: string | null
          clinician_availability_start_monday_3?: string | null
          clinician_availability_start_saturday_1?: string | null
          clinician_availability_start_saturday_2?: string | null
          clinician_availability_start_saturday_3?: string | null
          clinician_availability_start_sunday_1?: string | null
          clinician_availability_start_sunday_2?: string | null
          clinician_availability_start_sunday_3?: string | null
          clinician_availability_start_thursday_1?: string | null
          clinician_availability_start_thursday_2?: string | null
          clinician_availability_start_thursday_3?: string | null
          clinician_availability_start_tuesday_1?: string | null
          clinician_availability_start_tuesday_2?: string | null
          clinician_availability_start_tuesday_3?: string | null
          clinician_availability_start_wednesday_1?: string | null
          clinician_availability_start_wednesday_2?: string | null
          clinician_availability_start_wednesday_3?: string | null
          clinician_bio?: string | null
          clinician_calendar_end_time?: string | null
          clinician_calendar_start_time?: string | null
          clinician_image_url?: string | null
          clinician_license_type?: string | null
          clinician_licensed_states?: string[] | null
          clinician_max_advance_days?: number | null
          clinician_min_client_age?: number | null
          clinician_min_notice_days?: number | null
          clinician_nameinsurance?: string | null
          clinician_npi_number?: string | null
          clinician_professional_name?: string | null
          clinician_taxonomy_code?: string | null
          clinician_temppassword?: string | null
          clinician_time_granularity?: string | null
          clinician_time_zone?: string | null
          clinician_timezone?:
            | Database["public"]["Enums"]["time_zones"][]
            | null
          clinician_treatment_approaches?: string[] | null
          clinician_type?: string | null
          created_at?: string
          date_of_birth?: string | null
          first_name?: string | null
          id?: string
          last_google_sync?: string | null
          last_name?: string | null
          phone?: string | null
          profile_id?: string
          state?: string | null
          updated_at?: string
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_clinicians_profile_id"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      CMS1500_claims: {
        Row: {
          accept_assign: string
          appointment_id: string | null
          batch_status: string | null
          bill_addr_1: string
          bill_addr_2: string | null
          bill_city: string
          bill_name: string
          bill_npi: string
          bill_state: string
          bill_taxid: string
          bill_taxid_type: string
          bill_taxonomy: string
          bill_zip: string
          charge: number
          claim_md_batch_id: string | null
          claim_md_id: string | null
          created_at: string | null
          diag_1: string | null
          diag_10: string | null
          diag_11: string | null
          diag_12: string | null
          diag_2: string | null
          diag_3: string | null
          diag_4: string | null
          diag_5: string | null
          diag_6: string | null
          diag_7: string | null
          diag_8: string | null
          diag_9: string | null
          diag_ref: string
          from_date: string
          id: string
          ins_addr_1: string
          ins_city: string
          ins_dob: string
          ins_group: string | null
          ins_name_f: string
          ins_name_l: string
          ins_number: string
          ins_state: string
          ins_zip: string
          last_batch_error: string | null
          last_status_check: string | null
          last_submission: string | null
          mod_1: string | null
          mod_2: string | null
          mod_3: string | null
          mod_4: string | null
          pat_addr_1: string
          pat_city: string
          pat_dob: string
          pat_name_f: string
          pat_name_l: string
          pat_rel: string
          pat_sex: string
          pat_state: string
          pat_zip: string
          payerid: string
          pcn: string
          place_of_service: string
          proc_code: string
          prov_name_f: string
          prov_name_l: string
          prov_npi: string
          prov_taxonomy: string | null
          remote_claimid: string
          response_json: Json | null
          status: string | null
          submission_attempts: number | null
          submission_history: Json | null
          thru_date: string
          total_charge: number
          units: number
          updated_at: string | null
        }
        Insert: {
          accept_assign?: string
          appointment_id?: string | null
          batch_status?: string | null
          bill_addr_1: string
          bill_addr_2?: string | null
          bill_city: string
          bill_name: string
          bill_npi: string
          bill_state: string
          bill_taxid: string
          bill_taxid_type: string
          bill_taxonomy: string
          bill_zip: string
          charge: number
          claim_md_batch_id?: string | null
          claim_md_id?: string | null
          created_at?: string | null
          diag_1?: string | null
          diag_10?: string | null
          diag_11?: string | null
          diag_12?: string | null
          diag_2?: string | null
          diag_3?: string | null
          diag_4?: string | null
          diag_5?: string | null
          diag_6?: string | null
          diag_7?: string | null
          diag_8?: string | null
          diag_9?: string | null
          diag_ref: string
          from_date: string
          id?: string
          ins_addr_1: string
          ins_city: string
          ins_dob: string
          ins_group?: string | null
          ins_name_f: string
          ins_name_l: string
          ins_number: string
          ins_state: string
          ins_zip: string
          last_batch_error?: string | null
          last_status_check?: string | null
          last_submission?: string | null
          mod_1?: string | null
          mod_2?: string | null
          mod_3?: string | null
          mod_4?: string | null
          pat_addr_1: string
          pat_city: string
          pat_dob: string
          pat_name_f: string
          pat_name_l: string
          pat_rel: string
          pat_sex: string
          pat_state: string
          pat_zip: string
          payerid: string
          pcn: string
          place_of_service: string
          proc_code: string
          prov_name_f: string
          prov_name_l: string
          prov_npi: string
          prov_taxonomy?: string | null
          remote_claimid: string
          response_json?: Json | null
          status?: string | null
          submission_attempts?: number | null
          submission_history?: Json | null
          thru_date: string
          total_charge: number
          units?: number
          updated_at?: string | null
        }
        Update: {
          accept_assign?: string
          appointment_id?: string | null
          batch_status?: string | null
          bill_addr_1?: string
          bill_addr_2?: string | null
          bill_city?: string
          bill_name?: string
          bill_npi?: string
          bill_state?: string
          bill_taxid?: string
          bill_taxid_type?: string
          bill_taxonomy?: string
          bill_zip?: string
          charge?: number
          claim_md_batch_id?: string | null
          claim_md_id?: string | null
          created_at?: string | null
          diag_1?: string | null
          diag_10?: string | null
          diag_11?: string | null
          diag_12?: string | null
          diag_2?: string | null
          diag_3?: string | null
          diag_4?: string | null
          diag_5?: string | null
          diag_6?: string | null
          diag_7?: string | null
          diag_8?: string | null
          diag_9?: string | null
          diag_ref?: string
          from_date?: string
          id?: string
          ins_addr_1?: string
          ins_city?: string
          ins_dob?: string
          ins_group?: string | null
          ins_name_f?: string
          ins_name_l?: string
          ins_number?: string
          ins_state?: string
          ins_zip?: string
          last_batch_error?: string | null
          last_status_check?: string | null
          last_submission?: string | null
          mod_1?: string | null
          mod_2?: string | null
          mod_3?: string | null
          mod_4?: string | null
          pat_addr_1?: string
          pat_city?: string
          pat_dob?: string
          pat_name_f?: string
          pat_name_l?: string
          pat_rel?: string
          pat_sex?: string
          pat_state?: string
          pat_zip?: string
          payerid?: string
          pcn?: string
          place_of_service?: string
          proc_code?: string
          prov_name_f?: string
          prov_name_l?: string
          prov_npi?: string
          prov_taxonomy?: string | null
          remote_claimid?: string
          response_json?: Json | null
          status?: string | null
          submission_attempts?: number | null
          submission_history?: Json | null
          thru_date?: string
          total_charge?: number
          units?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "claims_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      cpt_codes: {
        Row: {
          active: boolean | null
          code: string
          created_at: string
          description: string | null
          fee: number
          name: string
          online_scheduling: boolean | null
          specialty_type: Database["public"]["Enums"]["specialty_type"] | null
          time_reserved: number | null
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          code: string
          created_at?: string
          description?: string | null
          fee: number
          name: string
          online_scheduling?: boolean | null
          specialty_type?: Database["public"]["Enums"]["specialty_type"] | null
          time_reserved?: number | null
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          code?: string
          created_at?: string
          description?: string | null
          fee?: number
          name?: string
          online_scheduling?: boolean | null
          specialty_type?: Database["public"]["Enums"]["specialty_type"] | null
          time_reserved?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      form_submissions: {
        Row: {
          appointment_id: string | null
          client_id: string
          clinician_id: string
          created_at: string
          form_data: Json
          id: string
          submitted_at: string
          template_id: string
          updated_at: string
        }
        Insert: {
          appointment_id?: string | null
          client_id: string
          clinician_id: string
          created_at?: string
          form_data: Json
          id?: string
          submitted_at?: string
          template_id: string
          updated_at?: string
        }
        Update: {
          appointment_id?: string | null
          client_id?: string
          clinician_id?: string
          created_at?: string
          form_data?: Json
          id?: string
          submitted_at?: string
          template_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      icd10: {
        Row: {
          diagnosis_name: string
          icd10: string
          id: number
        }
        Insert: {
          diagnosis_name: string
          icd10: string
          id?: number
        }
        Update: {
          diagnosis_name?: string
          icd10?: string
          id?: number
        }
        Relationships: []
      }
      insurance_accepted: {
        Row: {
          claims_address_line1: string | null
          claims_address_line2: string | null
          claims_city: string | null
          claims_state: string | null
          claims_zip: string | null
          copay_amount: number | null
          created_at: string
          electronic_claims_supported: boolean
          group_number: string | null
          id: string
          insurance_company_id: string
          is_active: boolean
          notes: string | null
          payer_id: string | null
          phone_number: string | null
          plan_name: string
          prior_authorization_required: boolean
          requires_claims_address_line1: boolean | null
          requires_claims_address_line2: boolean | null
          requires_claims_city: boolean | null
          requires_claims_state: boolean | null
          requires_claims_zip: boolean | null
          requires_copay_amount: boolean | null
          requires_group_number: boolean | null
          requires_health_benefit_plan_indicator: boolean | null
          requires_insurance_plan_program_name: boolean | null
          requires_insurance_plan_type: boolean | null
          requires_insured_address: boolean | null
          requires_insured_authorization_payment: boolean | null
          requires_insured_date_of_birth: boolean | null
          requires_insured_employer_school_name: boolean | null
          requires_insured_id_number: boolean | null
          requires_insured_name: boolean | null
          requires_insured_sex: boolean | null
          requires_notes: boolean | null
          requires_other_insured_date_of_birth: boolean | null
          requires_other_insured_employer_school_name: boolean | null
          requires_other_insured_name: boolean | null
          requires_other_insured_plan_program_name: boolean | null
          requires_other_insured_policy_group_number: boolean | null
          requires_other_insured_sex: boolean | null
          requires_patient_condition_auto_accident: boolean | null
          requires_patient_condition_employment: boolean | null
          requires_patient_condition_other_accident: boolean | null
          requires_patient_relationship_to_insured: boolean | null
          requires_phone_number: boolean | null
          requires_signature_on_file: boolean | null
          requires_website: boolean | null
          updated_at: string
          website: string | null
        }
        Insert: {
          claims_address_line1?: string | null
          claims_address_line2?: string | null
          claims_city?: string | null
          claims_state?: string | null
          claims_zip?: string | null
          copay_amount?: number | null
          created_at?: string
          electronic_claims_supported?: boolean
          group_number?: string | null
          id?: string
          insurance_company_id: string
          is_active?: boolean
          notes?: string | null
          payer_id?: string | null
          phone_number?: string | null
          plan_name: string
          prior_authorization_required?: boolean
          requires_claims_address_line1?: boolean | null
          requires_claims_address_line2?: boolean | null
          requires_claims_city?: boolean | null
          requires_claims_state?: boolean | null
          requires_claims_zip?: boolean | null
          requires_copay_amount?: boolean | null
          requires_group_number?: boolean | null
          requires_health_benefit_plan_indicator?: boolean | null
          requires_insurance_plan_program_name?: boolean | null
          requires_insurance_plan_type?: boolean | null
          requires_insured_address?: boolean | null
          requires_insured_authorization_payment?: boolean | null
          requires_insured_date_of_birth?: boolean | null
          requires_insured_employer_school_name?: boolean | null
          requires_insured_id_number?: boolean | null
          requires_insured_name?: boolean | null
          requires_insured_sex?: boolean | null
          requires_notes?: boolean | null
          requires_other_insured_date_of_birth?: boolean | null
          requires_other_insured_employer_school_name?: boolean | null
          requires_other_insured_name?: boolean | null
          requires_other_insured_plan_program_name?: boolean | null
          requires_other_insured_policy_group_number?: boolean | null
          requires_other_insured_sex?: boolean | null
          requires_patient_condition_auto_accident?: boolean | null
          requires_patient_condition_employment?: boolean | null
          requires_patient_condition_other_accident?: boolean | null
          requires_patient_relationship_to_insured?: boolean | null
          requires_phone_number?: boolean | null
          requires_signature_on_file?: boolean | null
          requires_website?: boolean | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          claims_address_line1?: string | null
          claims_address_line2?: string | null
          claims_city?: string | null
          claims_state?: string | null
          claims_zip?: string | null
          copay_amount?: number | null
          created_at?: string
          electronic_claims_supported?: boolean
          group_number?: string | null
          id?: string
          insurance_company_id?: string
          is_active?: boolean
          notes?: string | null
          payer_id?: string | null
          phone_number?: string | null
          plan_name?: string
          prior_authorization_required?: boolean
          requires_claims_address_line1?: boolean | null
          requires_claims_address_line2?: boolean | null
          requires_claims_city?: boolean | null
          requires_claims_state?: boolean | null
          requires_claims_zip?: boolean | null
          requires_copay_amount?: boolean | null
          requires_group_number?: boolean | null
          requires_health_benefit_plan_indicator?: boolean | null
          requires_insurance_plan_program_name?: boolean | null
          requires_insurance_plan_type?: boolean | null
          requires_insured_address?: boolean | null
          requires_insured_authorization_payment?: boolean | null
          requires_insured_date_of_birth?: boolean | null
          requires_insured_employer_school_name?: boolean | null
          requires_insured_id_number?: boolean | null
          requires_insured_name?: boolean | null
          requires_insured_sex?: boolean | null
          requires_notes?: boolean | null
          requires_other_insured_date_of_birth?: boolean | null
          requires_other_insured_employer_school_name?: boolean | null
          requires_other_insured_name?: boolean | null
          requires_other_insured_plan_program_name?: boolean | null
          requires_other_insured_policy_group_number?: boolean | null
          requires_other_insured_sex?: boolean | null
          requires_patient_condition_auto_accident?: boolean | null
          requires_patient_condition_employment?: boolean | null
          requires_patient_condition_other_accident?: boolean | null
          requires_patient_relationship_to_insured?: boolean | null
          requires_phone_number?: boolean | null
          requires_signature_on_file?: boolean | null
          requires_website?: boolean | null
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "insurance_accepted_insurance_company_id_fkey"
            columns: ["insurance_company_id"]
            isOneToOne: false
            referencedRelation: "insurance_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      insurance_companies: {
        Row: {
          created_at: string
          id: string
          is_custom: boolean
          name: string
          payer_id: string | null
          requires_claims_address_line1: boolean | null
          requires_claims_address_line2: boolean | null
          requires_claims_city: boolean | null
          requires_claims_state: boolean | null
          requires_claims_zip: boolean | null
          requires_copay_amount: boolean | null
          requires_group_number: boolean | null
          requires_health_benefit_plan_indicator: boolean | null
          requires_insurance_plan_program_name: boolean | null
          requires_insurance_plan_type: boolean | null
          requires_insured_address: boolean | null
          requires_insured_authorization_payment: boolean | null
          requires_insured_date_of_birth: boolean | null
          requires_insured_employer_school_name: boolean | null
          requires_insured_id_number: boolean | null
          requires_insured_name: boolean | null
          requires_insured_sex: boolean | null
          requires_notes: boolean | null
          requires_other_insured_date_of_birth: boolean | null
          requires_other_insured_employer_school_name: boolean | null
          requires_other_insured_name: boolean | null
          requires_other_insured_plan_program_name: boolean | null
          requires_other_insured_policy_group_number: boolean | null
          requires_other_insured_sex: boolean | null
          requires_patient_condition_auto_accident: boolean | null
          requires_patient_condition_employment: boolean | null
          requires_patient_condition_other_accident: boolean | null
          requires_patient_relationship_to_insured: boolean | null
          requires_phone_number: boolean | null
          requires_signature_on_file: boolean | null
          requires_website: boolean | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_custom?: boolean
          name: string
          payer_id?: string | null
          requires_claims_address_line1?: boolean | null
          requires_claims_address_line2?: boolean | null
          requires_claims_city?: boolean | null
          requires_claims_state?: boolean | null
          requires_claims_zip?: boolean | null
          requires_copay_amount?: boolean | null
          requires_group_number?: boolean | null
          requires_health_benefit_plan_indicator?: boolean | null
          requires_insurance_plan_program_name?: boolean | null
          requires_insurance_plan_type?: boolean | null
          requires_insured_address?: boolean | null
          requires_insured_authorization_payment?: boolean | null
          requires_insured_date_of_birth?: boolean | null
          requires_insured_employer_school_name?: boolean | null
          requires_insured_id_number?: boolean | null
          requires_insured_name?: boolean | null
          requires_insured_sex?: boolean | null
          requires_notes?: boolean | null
          requires_other_insured_date_of_birth?: boolean | null
          requires_other_insured_employer_school_name?: boolean | null
          requires_other_insured_name?: boolean | null
          requires_other_insured_plan_program_name?: boolean | null
          requires_other_insured_policy_group_number?: boolean | null
          requires_other_insured_sex?: boolean | null
          requires_patient_condition_auto_accident?: boolean | null
          requires_patient_condition_employment?: boolean | null
          requires_patient_condition_other_accident?: boolean | null
          requires_patient_relationship_to_insured?: boolean | null
          requires_phone_number?: boolean | null
          requires_signature_on_file?: boolean | null
          requires_website?: boolean | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_custom?: boolean
          name?: string
          payer_id?: string | null
          requires_claims_address_line1?: boolean | null
          requires_claims_address_line2?: boolean | null
          requires_claims_city?: boolean | null
          requires_claims_state?: boolean | null
          requires_claims_zip?: boolean | null
          requires_copay_amount?: boolean | null
          requires_group_number?: boolean | null
          requires_health_benefit_plan_indicator?: boolean | null
          requires_insurance_plan_program_name?: boolean | null
          requires_insurance_plan_type?: boolean | null
          requires_insured_address?: boolean | null
          requires_insured_authorization_payment?: boolean | null
          requires_insured_date_of_birth?: boolean | null
          requires_insured_employer_school_name?: boolean | null
          requires_insured_id_number?: boolean | null
          requires_insured_name?: boolean | null
          requires_insured_sex?: boolean | null
          requires_notes?: boolean | null
          requires_other_insured_date_of_birth?: boolean | null
          requires_other_insured_employer_school_name?: boolean | null
          requires_other_insured_name?: boolean | null
          requires_other_insured_plan_program_name?: boolean | null
          requires_other_insured_policy_group_number?: boolean | null
          requires_other_insured_sex?: boolean | null
          requires_patient_condition_auto_accident?: boolean | null
          requires_patient_condition_employment?: boolean | null
          requires_patient_condition_other_accident?: boolean | null
          requires_patient_relationship_to_insured?: boolean | null
          requires_phone_number?: boolean | null
          requires_signature_on_file?: boolean | null
          requires_website?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      nylas_accounts: {
        Row: {
          access_token: string
          account_id: string
          created_at: string
          expires_at: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token: string
          account_id: string
          created_at?: string
          expires_at?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string
          account_id?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "nylas_accounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      nylas_events: {
        Row: {
          account_id: string
          calendar_id: string
          created_at: string
          description: string | null
          event_id: string
          location: string | null
          metadata: Json | null
          title: string | null
          updated_at: string
          user_id: string
          when_data: Json | null
          when_end: string | null
          when_start: string | null
        }
        Insert: {
          account_id: string
          calendar_id: string
          created_at?: string
          description?: string | null
          event_id: string
          location?: string | null
          metadata?: Json | null
          title?: string | null
          updated_at?: string
          user_id: string
          when_data?: Json | null
          when_end?: string | null
          when_start?: string | null
        }
        Update: {
          account_id?: string
          calendar_id?: string
          created_at?: string
          description?: string | null
          event_id?: string
          location?: string | null
          metadata?: Json | null
          title?: string | null
          updated_at?: string
          user_id?: string
          when_data?: Json | null
          when_end?: string | null
          when_start?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nylas_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      practiceinfo: {
        Row: {
          banner_url: string | null
          created_at: string
          id: string
          logo_url: string | null
          practice_address1: string | null
          practice_address2: string | null
          practice_city: string | null
          practice_name: string | null
          practice_npi: string | null
          practice_state: string | null
          practice_taxid: string | null
          practice_taxonomy: string | null
          practice_zip: string | null
          primary_specialty:
            | Database["public"]["Enums"]["specialty_type"]
            | null
          updated_at: string
        }
        Insert: {
          banner_url?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          practice_address1?: string | null
          practice_address2?: string | null
          practice_city?: string | null
          practice_name?: string | null
          practice_npi?: string | null
          practice_state?: string | null
          practice_taxid?: string | null
          practice_taxonomy?: string | null
          practice_zip?: string | null
          primary_specialty?:
            | Database["public"]["Enums"]["specialty_type"]
            | null
          updated_at?: string
        }
        Update: {
          banner_url?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          practice_address1?: string | null
          practice_address2?: string | null
          practice_city?: string | null
          practice_name?: string | null
          practice_npi?: string | null
          practice_state?: string | null
          practice_taxid?: string | null
          practice_taxonomy?: string | null
          practice_zip?: string | null
          primary_specialty?:
            | Database["public"]["Enums"]["specialty_type"]
            | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          password: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          password?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          password?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      templates: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          schema_json: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          schema_json: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          schema_json?: Json
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_client_age: {
        Args: { birth_date: string }
        Returns: number
      }
      check_appointment_conflicts: {
        Args: {
          p_clinician_id: string
          p_start_at: string
          p_end_at: string
          p_exclude_appointment_id?: string
        }
        Returns: boolean
      }
      get_template_structure: {
        Args: { p_template_id: string }
        Returns: Json
      }
    }
    Enums: {
      appointment_status: "scheduled" | "documented" | "no show" | "cancelled"
      "Biological Sex": "Male" | "Female"
      client_status:
        | "Interested"
        | "New"
        | "Complete"
        | "Assigned"
        | "Scheduled"
        | "Established"
        | "At Risk"
        | "Cold"
        | "Re-Engaged"
      insurance_type: "primary" | "secondary" | "tertiary"
      specialty_type: "Mental Health" | "Speech Therapy"
      states:
        | "Alabama"
        | "Alaska"
        | "American Samoa"
        | "Arizona"
        | "Arkansas"
        | "California"
        | "Colorado"
        | "Connecticut"
        | "Delaware"
        | "District of Columbia"
        | "Florida"
        | "Georgia"
        | "Guam"
        | "Hawaii"
        | "Idaho"
        | "Illinois"
        | "Indiana"
        | "Iowa"
        | "Kansas"
        | "Kentucky"
        | "Louisiana"
        | "Maine"
        | "Maryland"
        | "Massachusetts"
        | "Michigan"
        | "Minnesota"
        | "Mississippi"
        | "Missouri"
        | "Montana"
        | "Nebraska"
        | "Nevada"
        | "New Hampshire"
        | "New Jersey"
        | "New Mexico"
        | "New York"
        | "North Carolina"
        | "North Dakota"
        | "Northern Mariana Islands"
        | "Ohio"
        | "Oklahoma"
        | "Oregon"
        | "Pennsylvania"
        | "Puerto Rico"
        | "Rhode Island"
        | "South Carolina"
        | "South Dakota"
        | "Tennessee"
        | "Texas"
        | "Utah"
        | "Vermont"
        | "Virgin Islands"
        | "Virginia"
        | "Washington"
        | "West Virginia"
        | "Wisconsin"
        | "Wyoming"
      time_zones:
        | "America/New_York"
        | "America/Chicago"
        | "America/Denver"
        | "America/Los_Angeles"
        | "America/Anchorage"
        | "Pacific/Honolulu"
        | "America/Phoenix"
      user_role: "client" | "clinician" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      appointment_status: ["scheduled", "documented", "no show", "cancelled"],
      "Biological Sex": ["Male", "Female"],
      client_status: [
        "Interested",
        "New",
        "Complete",
        "Assigned",
        "Scheduled",
        "Established",
        "At Risk",
        "Cold",
        "Re-Engaged",
      ],
      insurance_type: ["primary", "secondary", "tertiary"],
      specialty_type: ["Mental Health", "Speech Therapy"],
      states: [
        "Alabama",
        "Alaska",
        "American Samoa",
        "Arizona",
        "Arkansas",
        "California",
        "Colorado",
        "Connecticut",
        "Delaware",
        "District of Columbia",
        "Florida",
        "Georgia",
        "Guam",
        "Hawaii",
        "Idaho",
        "Illinois",
        "Indiana",
        "Iowa",
        "Kansas",
        "Kentucky",
        "Louisiana",
        "Maine",
        "Maryland",
        "Massachusetts",
        "Michigan",
        "Minnesota",
        "Mississippi",
        "Missouri",
        "Montana",
        "Nebraska",
        "Nevada",
        "New Hampshire",
        "New Jersey",
        "New Mexico",
        "New York",
        "North Carolina",
        "North Dakota",
        "Northern Mariana Islands",
        "Ohio",
        "Oklahoma",
        "Oregon",
        "Pennsylvania",
        "Puerto Rico",
        "Rhode Island",
        "South Carolina",
        "South Dakota",
        "Tennessee",
        "Texas",
        "Utah",
        "Vermont",
        "Virgin Islands",
        "Virginia",
        "Washington",
        "West Virginia",
        "Wisconsin",
        "Wyoming",
      ],
      time_zones: [
        "America/New_York",
        "America/Chicago",
        "America/Denver",
        "America/Los_Angeles",
        "America/Anchorage",
        "Pacific/Honolulu",
        "America/Phoenix",
      ],
      user_role: ["client", "clinician", "admin"],
    },
  },
} as const

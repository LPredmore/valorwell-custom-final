export interface Template {
  id: string;
  name: string;
  description?: string;
  schema_json: any; // Using any to match Supabase Json type
  created_by: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface CreateTemplateRequest {
  name: string;
  description?: string;
  schema_json: any;
}

export interface UpdateTemplateRequest {
  name?: string;
  description?: string;
  schema_json?: any;
  is_active?: boolean;
}
export interface FormContext {
  client_id?: string;
  clinician_id?: string;
  appointment_id?: string;
  context_type: 'session_documentation' | 'client_form' | 'assessment' | 'general';
}

export interface FormData {
  [key: string]: any;
}

export interface DataBoundField {
  id: string;
  tableName: string;
  columnName: string;
  value: any;
  isReadOnly: boolean;
}
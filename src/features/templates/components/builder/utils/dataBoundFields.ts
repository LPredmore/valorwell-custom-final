import { User, Users, Calendar, FileText, Shield, CreditCard, Brain, Activity } from 'lucide-react';

export interface DataBoundFieldMapping {
  id: string;
  name: string;
  category: 'client' | 'clinician' | 'appointment';
  subcategory: string;
  tableName: string;
  columnName: string;
  dataType: 'text' | 'date' | 'number' | 'boolean' | 'array' | 'json';
  surveyType: string;
  icon: typeof User;
  isReadOnly?: boolean;
  description?: string;
}

// Client field mappings organized by subcategories
export const CLIENT_FIELD_MAPPINGS: DataBoundFieldMapping[] = [
  // Personal Information
  {
    id: 'client_first_name',
    name: 'First Name',
    category: 'client',
    subcategory: 'Personal Information',
    tableName: 'clients',
    columnName: 'first_name',
    dataType: 'text',
    surveyType: 'text',
    icon: User,
    isReadOnly: true,
    description: 'Client\'s first name from their profile'
  },
  {
    id: 'client_last_name',
    name: 'Last Name',
    category: 'client',
    subcategory: 'Personal Information',
    tableName: 'clients',
    columnName: 'last_name',
    dataType: 'text',
    surveyType: 'text',
    icon: User,
    isReadOnly: true,
    description: 'Client\'s last name from their profile'
  },
  {
    id: 'client_preferred_name',
    name: 'Preferred Name',
    category: 'client',
    subcategory: 'Personal Information',
    tableName: 'clients',
    columnName: 'client_preferred_name',
    dataType: 'text',
    surveyType: 'text',
    icon: User,
    description: 'Client\'s preferred name'
  },
  {
    id: 'client_middle_name',
    name: 'Middle Name',
    category: 'client',
    subcategory: 'Personal Information',
    tableName: 'clients',
    columnName: 'client_middle_name',
    dataType: 'text',
    surveyType: 'text',
    icon: User,
    description: 'Client\'s middle name'
  },
  {
    id: 'client_date_of_birth',
    name: 'Date of Birth',
    category: 'client',
    subcategory: 'Personal Information',
    tableName: 'clients',
    columnName: 'date_of_birth',
    dataType: 'date',
    surveyType: 'text',
    icon: Calendar,
    isReadOnly: true,
    description: 'Client\'s date of birth'
  },
  {
    id: 'client_age',
    name: 'Age',
    category: 'client',
    subcategory: 'Personal Information',
    tableName: 'clients',
    columnName: 'client_age',
    dataType: 'number',
    surveyType: 'text',
    icon: User,
    isReadOnly: true,
    description: 'Client\'s age'
  },
  {
    id: 'client_gender',
    name: 'Gender',
    category: 'client',
    subcategory: 'Personal Information',
    tableName: 'clients',
    columnName: 'client_gender',
    dataType: 'text',
    surveyType: 'text',
    icon: User,
    description: 'Client\'s gender'
  },
  {
    id: 'client_gender_identity',
    name: 'Gender Identity',
    category: 'client',
    subcategory: 'Personal Information',
    tableName: 'clients',
    columnName: 'client_gender_identity',
    dataType: 'text',
    surveyType: 'text',
    icon: User,
    description: 'Client\'s gender identity'
  },
  {
    id: 'client_email',
    name: 'Email',
    category: 'client',
    subcategory: 'Personal Information',
    tableName: 'clients',
    columnName: 'email',
    dataType: 'text',
    surveyType: 'text',
    icon: User,
    isReadOnly: true,
    description: 'Client\'s email address'
  },
  {
    id: 'client_phone',
    name: 'Phone',
    category: 'client',
    subcategory: 'Personal Information',
    tableName: 'clients',
    columnName: 'phone',
    dataType: 'text',
    surveyType: 'text',
    icon: User,
    description: 'Client\'s phone number'
  },
  {
    id: 'client_address',
    name: 'Address',
    category: 'client',
    subcategory: 'Personal Information',
    tableName: 'clients',
    columnName: 'client_address',
    dataType: 'text',
    surveyType: 'comment',
    icon: User,
    description: 'Client\'s home address'
  },
  {
    id: 'client_city',
    name: 'City',
    category: 'client',
    subcategory: 'Personal Information',
    tableName: 'clients',
    columnName: 'city',
    dataType: 'text',
    surveyType: 'text',
    icon: User,
    description: 'Client\'s city'
  },
  {
    id: 'client_state',
    name: 'State',
    category: 'client',
    subcategory: 'Personal Information',
    tableName: 'clients',
    columnName: 'state',
    dataType: 'text',
    surveyType: 'text',
    icon: User,
    description: 'Client\'s state'
  },
  {
    id: 'client_zip_code',
    name: 'Zip Code',
    category: 'client',
    subcategory: 'Personal Information',
    tableName: 'clients',
    columnName: 'zip_code',
    dataType: 'text',
    surveyType: 'text',
    icon: User,
    description: 'Client\'s zip code'
  },

  // Clinical Information
  {
    id: 'client_diagnosis',
    name: 'Diagnosis',
    category: 'client',
    subcategory: 'Clinical Information',
    tableName: 'clients',
    columnName: 'client_diagnosis',
    dataType: 'array',
    surveyType: 'checkbox',
    icon: Brain,
    description: 'Client\'s current diagnoses'
  },
  {
    id: 'client_medications',
    name: 'Current Medications',
    category: 'client',
    subcategory: 'Clinical Information',
    tableName: 'clients',
    columnName: 'client_medications',
    dataType: 'text',
    surveyType: 'comment',
    icon: Activity,
    description: 'Client\'s current medications'
  },
  {
    id: 'client_problem',
    name: 'Presenting Problem',
    category: 'client',
    subcategory: 'Clinical Information',
    tableName: 'clients',
    columnName: 'client_problem',
    dataType: 'text',
    surveyType: 'comment',
    icon: FileText,
    description: 'Client\'s presenting problem'
  },
  {
    id: 'client_treatmentgoal',
    name: 'Treatment Goal',
    category: 'client',
    subcategory: 'Clinical Information',
    tableName: 'clients',
    columnName: 'client_treatmentgoal',
    dataType: 'text',
    surveyType: 'comment',
    icon: FileText,
    description: 'Client\'s treatment goals'
  },

  // Session Notes Fields
  {
    id: 'client_appearance',
    name: 'Appearance',
    category: 'client',
    subcategory: 'Session Notes',
    tableName: 'clients',
    columnName: 'client_appearance',
    dataType: 'text',
    surveyType: 'comment',
    icon: User,
    description: 'Client\'s appearance during session'
  },
  {
    id: 'client_mood',
    name: 'Mood',
    category: 'client',
    subcategory: 'Session Notes',
    tableName: 'clients',
    columnName: 'client_mood',
    dataType: 'text',
    surveyType: 'text',
    icon: Brain,
    description: 'Client\'s mood during session'
  },
  {
    id: 'client_behavior',
    name: 'Behavior',
    category: 'client',
    subcategory: 'Session Notes',
    tableName: 'clients',
    columnName: 'client_behavior',
    dataType: 'text',
    surveyType: 'comment',
    icon: Activity,
    description: 'Client\'s behavior during session'
  },
  {
    id: 'client_progress',
    name: 'Progress Notes',
    category: 'client',
    subcategory: 'Session Notes',
    tableName: 'clients',
    columnName: 'client_progress',
    dataType: 'text',
    surveyType: 'comment',
    icon: FileText,
    description: 'Client\'s progress notes'
  },
  {
    id: 'client_sessionnarrative',
    name: 'Session Narrative',
    category: 'client',
    subcategory: 'Session Notes',
    tableName: 'clients',
    columnName: 'client_sessionnarrative',
    dataType: 'text',
    surveyType: 'comment',
    icon: FileText,
    description: 'Narrative description of the session'
  },

  // Insurance Information
  {
    id: 'client_insurance_company_primary',
    name: 'Primary Insurance Company',
    category: 'client',
    subcategory: 'Insurance Information',
    tableName: 'clients',
    columnName: 'client_insurance_company_primary',
    dataType: 'text',
    surveyType: 'text',
    icon: CreditCard,
    description: 'Primary insurance company'
  },
  {
    id: 'client_policy_number_primary',
    name: 'Primary Policy Number',
    category: 'client',
    subcategory: 'Insurance Information',
    tableName: 'clients',
    columnName: 'client_policy_number_primary',
    dataType: 'text',
    surveyType: 'text',
    icon: CreditCard,
    description: 'Primary insurance policy number'
  }
];

// Clinician field mappings
export const CLINICIAN_FIELD_MAPPINGS: DataBoundFieldMapping[] = [
  {
    id: 'clinician_first_name',
    name: 'First Name',
    category: 'clinician',
    subcategory: 'Personal Information',
    tableName: 'clinicians',
    columnName: 'first_name',
    dataType: 'text',
    surveyType: 'text',
    icon: Users,
    isReadOnly: true,
    description: 'Clinician\'s first name'
  },
  {
    id: 'clinician_last_name',
    name: 'Last Name',
    category: 'clinician',
    subcategory: 'Personal Information',
    tableName: 'clinicians',
    columnName: 'last_name',
    dataType: 'text',
    surveyType: 'text',
    icon: Users,
    isReadOnly: true,
    description: 'Clinician\'s last name'
  },
  {
    id: 'clinician_professional_name',
    name: 'Professional Name',
    category: 'clinician',
    subcategory: 'Professional Information',
    tableName: 'clinicians',
    columnName: 'clinician_professional_name',
    dataType: 'text',
    surveyType: 'text',
    icon: Shield,
    isReadOnly: true,
    description: 'Clinician\'s professional name'
  },
  {
    id: 'clinician_license_type',
    name: 'License Type',
    category: 'clinician',
    subcategory: 'Professional Information',
    tableName: 'clinicians',
    columnName: 'clinician_license_type',
    dataType: 'text',
    surveyType: 'text',
    icon: Shield,
    isReadOnly: true,
    description: 'Clinician\'s license type'
  },
  {
    id: 'clinician_npi_number',
    name: 'NPI Number',
    category: 'clinician',
    subcategory: 'Professional Information',
    tableName: 'clinicians',
    columnName: 'clinician_npi_number',
    dataType: 'text',
    surveyType: 'text',
    icon: Shield,
    isReadOnly: true,
    description: 'Clinician\'s NPI number'
  }
];

// Get all data-bound field mappings
export const ALL_DATA_BOUND_FIELDS = [...CLIENT_FIELD_MAPPINGS, ...CLINICIAN_FIELD_MAPPINGS];

// Helper functions
export function getDataBoundFieldsByCategory(category: 'client' | 'clinician') {
  return ALL_DATA_BOUND_FIELDS.filter(field => field.category === category);
}

export function getDataBoundFieldsBySubcategory(category: 'client' | 'clinician', subcategory: string) {
  return ALL_DATA_BOUND_FIELDS.filter(field => 
    field.category === category && field.subcategory === subcategory
  );
}

export function getDataBoundFieldById(id: string) {
  return ALL_DATA_BOUND_FIELDS.find(field => field.id === id);
}

export function getUniqueSubcategories(category: 'client' | 'clinician') {
  const fields = getDataBoundFieldsByCategory(category);
  return [...new Set(fields.map(field => field.subcategory))];
}

// Categories for organizing data-bound fields
export const DATA_BOUND_CATEGORIES = [
  { id: 'client', name: 'Client Fields', icon: User },
  { id: 'clinician', name: 'Clinician Fields', icon: Users }
] as const;
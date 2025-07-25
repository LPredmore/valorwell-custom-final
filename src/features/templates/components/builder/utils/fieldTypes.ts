import { 
  Type, 
  MessageSquare, 
  ChevronDown, 
  CheckCircle, 
  Calendar, 
  Mail, 
  Phone, 
  Hash, 
  Star, 
  PenTool, 
  Grid3X3, 
  Folder,
  RadioIcon,
  User,
  Users
} from 'lucide-react';

export interface FieldType {
  id: string;
  name: string;
  icon: typeof Type;
  category: 'basic' | 'selection' | 'advanced' | 'client' | 'clinician';
  surveyType: string;
  defaultProps: Record<string, any>;
  isDataBound?: boolean;
  tableName?: string;
  columnName?: string;
  dataType?: string;
}

export const FIELD_TYPES: FieldType[] = [
  // Basic Fields
  {
    id: 'text',
    name: 'Short Text',
    icon: Type,
    category: 'basic',
    surveyType: 'text',
    defaultProps: {
      title: 'Short Text Field',
      name: 'text_field',
      isRequired: false
    }
  },
  {
    id: 'comment',
    name: 'Long Text',
    icon: MessageSquare,
    category: 'basic',
    surveyType: 'comment',
    defaultProps: {
      title: 'Long Text Field',
      name: 'comment_field',
      isRequired: false,
      rows: 4
    }
  },
  {
    id: 'email',
    name: 'Email',
    icon: Mail,
    category: 'basic',
    surveyType: 'text',
    defaultProps: {
      title: 'Email Address',
      name: 'email_field',
      inputType: 'email',
      isRequired: false
    }
  },
  {
    id: 'phone',
    name: 'Phone',
    icon: Phone,
    category: 'basic',
    surveyType: 'text',
    defaultProps: {
      title: 'Phone Number',
      name: 'phone_field',
      inputType: 'tel',
      isRequired: false
    }
  },
  {
    id: 'number',
    name: 'Number',
    icon: Hash,
    category: 'basic',
    surveyType: 'text',
    defaultProps: {
      title: 'Number Field',
      name: 'number_field',
      inputType: 'number',
      isRequired: false
    }
  },
  {
    id: 'date',
    name: 'Date',
    icon: Calendar,
    category: 'basic',
    surveyType: 'text',
    defaultProps: {
      title: 'Date Field',
      name: 'date_field',
      inputType: 'date',
      isRequired: false
    }
  },

  // Selection Fields
  {
    id: 'dropdown',
    name: 'Dropdown',
    icon: ChevronDown,
    category: 'selection',
    surveyType: 'dropdown',
    defaultProps: {
      title: 'Dropdown Field',
      name: 'dropdown_field',
      isRequired: false,
      choices: ['Option 1', 'Option 2', 'Option 3']
    }
  },
  {
    id: 'radiogroup',
    name: 'Radio Group',
    icon: RadioIcon,
    category: 'selection',
    surveyType: 'radiogroup',
    defaultProps: {
      title: 'Radio Group Field',
      name: 'radio_field',
      isRequired: false,
      choices: ['Option 1', 'Option 2', 'Option 3']
    }
  },
  {
    id: 'checkbox',
    name: 'Checkboxes',
    icon: CheckCircle,
    category: 'selection',
    surveyType: 'checkbox',
    defaultProps: {
      title: 'Checkbox Field',
      name: 'checkbox_field',
      isRequired: false,
      choices: ['Option 1', 'Option 2', 'Option 3']
    }
  },

  // Advanced Fields
  {
    id: 'rating',
    name: 'Rating',
    icon: Star,
    category: 'advanced',
    surveyType: 'rating',
    defaultProps: {
      title: 'Rating Field',
      name: 'rating_field',
      isRequired: false,
      rateMin: 1,
      rateMax: 5
    }
  },
  {
    id: 'signaturepad',
    name: 'Signature',
    icon: PenTool,
    category: 'advanced',
    surveyType: 'signaturepad',
    defaultProps: {
      title: 'Signature Field',
      name: 'signature_field',
      isRequired: false
    }
  },
  {
    id: 'matrix',
    name: 'Matrix',
    icon: Grid3X3,
    category: 'advanced',
    surveyType: 'matrix',
    defaultProps: {
      title: 'Matrix Field',
      name: 'matrix_field',
      isRequired: false,
      columns: ['Column 1', 'Column 2', 'Column 3'],
      rows: ['Row 1', 'Row 2', 'Row 3']
    }
  },
  {
    id: 'panel',
    name: 'Panel',
    icon: Folder,
    category: 'advanced',
    surveyType: 'panel',
    defaultProps: {
      title: 'Panel',
      name: 'panel_field',
      elements: []
    }
  }
];

export const FIELD_CATEGORIES = [
  { id: 'basic', name: 'Basic Fields', icon: Type },
  { id: 'selection', name: 'Selection Fields', icon: ChevronDown },
  { id: 'advanced', name: 'Advanced Fields', icon: Grid3X3 },
  { id: 'client', name: 'Client Fields', icon: User },
  { id: 'clinician', name: 'Clinician Fields', icon: Users }
] as const;

export function getFieldTypeById(id: string): FieldType | undefined {
  return FIELD_TYPES.find(type => type.id === id);
}

export function getFieldTypesByCategory(category: string): FieldType[] {
  return FIELD_TYPES.filter(type => type.category === category);
}
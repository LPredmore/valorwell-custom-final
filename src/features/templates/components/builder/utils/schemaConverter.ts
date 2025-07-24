import { v4 as uuidv4 } from 'uuid';

export interface FormField {
  id: string;
  type: string;
  name: string;
  title: string;
  isRequired?: boolean;
  placeholder?: string;
  description?: string;
  choices?: string[];
  inputType?: string;
  rows?: number;
  rateMin?: number;
  rateMax?: number;
  columns?: string[];
  rowsData?: string[];
  elements?: FormField[];
  [key: string]: any;
}

export interface FormSchema {
  title: string;
  description?: string;
  fields: FormField[];
}

export function createNewField(fieldType: string, defaultProps: Record<string, any>): FormField {
  return {
    id: uuidv4(),
    type: fieldType,
    name: defaultProps.name || `field_${Date.now()}`,
    title: defaultProps.title || 'New Field',
    ...defaultProps
  };
}

export function convertToSurveyJS(schema: FormSchema): any {
  const surveySchema = {
    title: schema.title,
    description: schema.description,
    showQuestionNumbers: 'off',
    widthMode: 'responsive',
    elements: schema.fields.map(convertFieldToSurveyJS)
  };

  return surveySchema;
}

function convertFieldToSurveyJS(field: FormField): any {
  const baseField = {
    type: field.type,
    name: field.name,
    title: field.title,
    isRequired: field.isRequired || false
  };

  // Add type-specific properties
  switch (field.type) {
    case 'text':
      return {
        ...baseField,
        inputType: field.inputType,
        placeholder: field.placeholder
      };

    case 'comment':
      return {
        ...baseField,
        rows: field.rows || 4,
        placeholder: field.placeholder
      };

    case 'dropdown':
    case 'radiogroup':
    case 'checkbox':
      return {
        ...baseField,
        choices: field.choices || []
      };

    case 'rating':
      return {
        ...baseField,
        rateMin: field.rateMin || 1,
        rateMax: field.rateMax || 5
      };

    case 'matrix':
      return {
        ...baseField,
        columns: field.columns || [],
        rows: field.rowsData || []
      };

    case 'panel':
      return {
        ...baseField,
        elements: (field.elements || []).map(convertFieldToSurveyJS)
      };

    default:
      return baseField;
  }
}

export function convertFromSurveyJS(surveySchema: any): FormSchema {
  return {
    title: surveySchema.title || 'Untitled Form',
    description: surveySchema.description,
    fields: (surveySchema.elements || []).map(convertFieldFromSurveyJS)
  };
}

function convertFieldFromSurveyJS(element: any): FormField {
  const baseField: FormField = {
    id: uuidv4(),
    type: element.type,
    name: element.name,
    title: element.title,
    isRequired: element.isRequired || false
  };

  // Add type-specific properties
  switch (element.type) {
    case 'text':
      return {
        ...baseField,
        inputType: element.inputType,
        placeholder: element.placeholder
      };

    case 'comment':
      return {
        ...baseField,
        rows: element.rows || 4,
        placeholder: element.placeholder
      };

    case 'dropdown':
    case 'radiogroup':
    case 'checkbox':
      return {
        ...baseField,
        choices: element.choices || []
      };

    case 'rating':
      return {
        ...baseField,
        rateMin: element.rateMin || 1,
        rateMax: element.rateMax || 5
      };

    case 'matrix':
      return {
        ...baseField,
        columns: element.columns || [],
        rowsData: element.rows || []
      };

    case 'panel':
      return {
        ...baseField,
        elements: (element.elements || []).map(convertFieldFromSurveyJS)
      };

    default:
      return baseField;
  }
}
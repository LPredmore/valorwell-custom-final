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
  columnSpan?: number;
  rowId?: string;
  // Data binding properties
  isDataBound?: boolean;
  tableName?: string;
  columnName?: string;
  dataType?: string;
  isReadOnly?: boolean;
  [key: string]: any;
}

export interface FormColumn {
  id: string;
  width: number; // percentage (e.g., 50 for 50%)
  fields: FormField[];
}

export interface RowSettings {
  columnCount: number;
  columnWidths: number[];
  gap: number;
  alignment: 'start' | 'center' | 'end';
}

export interface FormRow {
  id: string;
  columns: FormColumn[];
  settings: RowSettings;
}

export interface FormSchema {
  title: string;
  description?: string;
  rows: FormRow[];
  // Keep fields for backward compatibility during migration
  fields?: FormField[];
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

export function createDataBoundField(
  fieldType: string, 
  defaultProps: Record<string, any>,
  tableName: string,
  columnName: string,
  dataType: string,
  isReadOnly: boolean = false
): FormField {
  return {
    id: `databound_${tableName}_${columnName}_${Date.now()}`,
    type: fieldType,
    name: defaultProps.name || columnName,
    title: defaultProps.title || columnName,
    isDataBound: true,
    tableName,
    columnName,
    dataType,
    isReadOnly,
    ...defaultProps
  };
}

export function createDefaultRow(): FormRow {
  return {
    id: uuidv4(),
    columns: [{
      id: uuidv4(),
      width: 100,
      fields: []
    }],
    settings: {
      columnCount: 1,
      columnWidths: [100],
      gap: 16,
      alignment: 'start'
    }
  };
}

export function createRowWithColumns(columnCount: number): FormRow {
  const columnWidth = Math.floor(100 / columnCount);
  const columns = Array.from({ length: columnCount }, () => ({
    id: uuidv4(),
    width: columnWidth,
    fields: []
  }));

  return {
    id: uuidv4(),
    columns,
    settings: {
      columnCount,
      columnWidths: Array(columnCount).fill(columnWidth),
      gap: 16,
      alignment: 'start'
    }
  };
}

export function convertToSurveyJS(schema: FormSchema): any {
  // Handle both new row-based schema and legacy field-based schema
  let elements: any[] = [];
  
  if (schema.rows && schema.rows.length > 0) {
    // New row-based schema
    elements = schema.rows.flatMap(convertRowToSurveyJS);
  } else if (schema.fields && schema.fields.length > 0) {
    // Legacy field-based schema
    elements = schema.fields.map(convertFieldToSurveyJS);
  }

  const surveySchema = {
    title: schema.title,
    description: schema.description,
    showQuestionNumbers: 'off',
    widthMode: 'responsive',
    elements
  };

  return surveySchema;
}

function convertRowToSurveyJS(row: FormRow): any[] {
  // If single column, return fields directly
  if (row.columns.length === 1) {
    return row.columns[0].fields.map(convertFieldToSurveyJS);
  }

  // For multi-column, create a panel with columns
  const panelElements = row.columns.map(column => ({
    type: 'panel',
    name: `panel_${column.id}`,
    elements: column.fields.map(convertFieldToSurveyJS),
    startWithNewLine: false,
    width: `${column.width}%`
  }));

  return [{
    type: 'panel',
    name: `row_${row.id}`,
    elements: panelElements,
    startWithNewLine: true
  }];
}

function convertFieldToSurveyJS(field: FormField): any {
  const baseField: any = {
    type: field.type,
    name: field.name,
    title: field.title,
    isRequired: field.isRequired || false
  };

  // Add data binding information
  if (field.isDataBound) {
    baseField.dataBound = {
      tableName: field.tableName,
      columnName: field.columnName,
      dataType: field.dataType,
      isReadOnly: field.isReadOnly
    };
    
    if (field.isReadOnly) {
      baseField.readOnly = true;
    }
  }

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
  const fields = (surveySchema.elements || []).map(convertFieldFromSurveyJS);
  
  // Convert legacy fields to row-based structure
  const rows = fields.length > 0 ? [createRowWithFields(fields)] : [];
  
  return {
    title: surveySchema.title || 'Untitled Form',
    description: surveySchema.description,
    rows,
    fields // Keep for backward compatibility
  };
}

function createRowWithFields(fields: FormField[]): FormRow {
  return {
    id: uuidv4(),
    columns: [{
      id: uuidv4(),
      width: 100,
      fields
    }],
    settings: {
      columnCount: 1,
      columnWidths: [100],
      gap: 16,
      alignment: 'start'
    }
  };
}

// Migration helper for existing schemas
export function migrateFieldsToRows(fields: FormField[]): FormRow[] {
  if (fields.length === 0) return [];
  
  return [createRowWithFields(fields)];
}

// Helper to get all fields from a row-based schema
export function getAllFieldsFromRows(rows: FormRow[]): FormField[] {
  return rows.flatMap(row => 
    row.columns.flatMap(column => column.fields)
  );
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
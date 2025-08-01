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
  console.log('🔄 [CONVERT_TO_SURVEYJS] Starting conversion:', {
    schemaTitle: schema.title,
    rowsCount: schema.rows?.length || 0,
    fieldsCount: schema.fields?.length || 0,
    totalFields: schema.rows?.reduce((sum, row) => 
      sum + row.columns.reduce((colSum, col) => colSum + col.fields.length, 0), 0) || 0
  });
  
  // Handle both new row-based schema and legacy field-based schema
  let elements: any[] = [];
  
  if (schema.rows && schema.rows.length > 0) {
    console.log('📋 [CONVERT_TO_SURVEYJS] Converting row-based schema');
    // New row-based schema
    elements = schema.rows.flatMap(convertRowToSurveyJS);
  } else if (schema.fields && schema.fields.length > 0) {
    console.log('📋 [CONVERT_TO_SURVEYJS] Converting legacy field-based schema');
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

  console.log('✅ [CONVERT_TO_SURVEYJS] Conversion complete:', {
    outputElementsCount: elements.length,
    outputTitle: surveySchema.title,
    outputKeys: Object.keys(surveySchema)
  });

  return surveySchema;
}

function convertRowToSurveyJS(row: FormRow): any[] {
  console.log('🔧 [CONVERT_ROW] Processing row:', {
    rowId: row.id,
    columnsCount: row.columns.length,
    columnWidths: row.columns.map(c => c.width),
    totalFields: row.columns.reduce((sum, col) => sum + col.fields.length, 0)
  });

  // If single column, return fields directly
  if (row.columns.length === 1) {
    console.log('📝 [CONVERT_ROW] Single column row, returning fields directly');
    return row.columns[0].fields.map(convertFieldToSurveyJS);
  }

  // For multi-column, create a panel with columns
  const panelElements = row.columns.map((column, index) => {
    console.log('🏗️ [CONVERT_ROW] Creating column panel:', {
      columnId: column.id,
      columnWidth: column.width,
      fieldsCount: column.fields.length,
      isFirstColumn: index === 0
    });
    
    return {
      type: 'panel',
      name: `panel_${column.id}`,
      elements: column.fields.map(convertFieldToSurveyJS),
      startWithNewLine: index === 0, // Only first column starts new line
      width: `${column.width}%`,
      // Add CSS class for multi-column styling
      cssClasses: {
        panel: {
          container: "sv_multi_column_panel"
        }
      }
    };
  });

  const rowPanel = {
    type: 'panel',
    name: `row_${row.id}`,
    elements: panelElements,
    startWithNewLine: true,
    // Configure panel for proper multi-column layout
    cssClasses: {
      panel: {
        container: "sv_row_panel"
      }
    }
  };

  console.log('✅ [CONVERT_ROW] Row panel created:', {
    rowPanelName: rowPanel.name,
    childPanelsCount: panelElements.length,
    totalElements: panelElements.reduce((sum, p) => sum + p.elements.length, 0)
  });

  return [rowPanel];
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
  console.log('🔄 [CONVERT_FROM_SURVEYJS] Starting conversion:', {
    surveyTitle: surveySchema.title,
    elementsCount: surveySchema.elements?.length || 0,
    elementsTypes: surveySchema.elements?.map((e: any) => e.type) || []
  });
  
  // PHASE 2: Fix nested panel handling for database-stored schemas
  const rows: FormRow[] = [];
  
  for (const element of surveySchema.elements || []) {
    if (element.type === 'panel' && element.name?.startsWith('row_')) {
      // This is a row panel with columns
      console.log('📋 [CONVERT_FROM_SURVEYJS] Processing row panel:', element.name);
      
      const columns: FormColumn[] = [];
      
      for (const childElement of element.elements || []) {
        if (childElement.type === 'panel' && childElement.name?.startsWith('panel_')) {
          // This is a column panel
          console.log('📦 [CONVERT_FROM_SURVEYJS] Processing column panel:', childElement.name);
          
          const fields = (childElement.elements || []).map(convertFieldFromSurveyJS);
          const columnId = childElement.name.replace('panel_', '');
          
          columns.push({
            id: columnId,
            width: parseFloat(childElement.width?.replace('%', '') || '100'),
            fields
          });
        } else {
          // Direct field in row (single column case)
          const field = convertFieldFromSurveyJS(childElement);
          
          if (columns.length === 0) {
            columns.push({
              id: uuidv4(),
              width: 100,
              fields: [field]
            });
          } else {
            columns[0].fields.push(field);
          }
        }
      }
      
      const rowId = element.name.replace('row_', '');
      rows.push({
        id: rowId,
        columns,
        settings: {
          columnCount: columns.length,
          columnWidths: columns.map(c => c.width),
          gap: 16,
          alignment: 'start'
        }
      });
    } else {
      // Regular field (legacy format or single field)
      console.log('📝 [CONVERT_FROM_SURVEYJS] Processing regular field:', element.type);
      const field = convertFieldFromSurveyJS(element);
      
      // Add to a single-column row
      rows.push({
        id: uuidv4(),
        columns: [{
          id: uuidv4(),
          width: 100,
          fields: [field]
        }],
        settings: {
          columnCount: 1,
          columnWidths: [100],
          gap: 16,
          alignment: 'start'
        }
      });
    }
  }
  
  // Legacy fallback for old format
  const legacyFields = (surveySchema.elements || []).filter((e: any) => 
    e.type !== 'panel' || !e.name?.startsWith('row_')
  ).map(convertFieldFromSurveyJS);
  
  const result = {
    title: surveySchema.title || 'Untitled Form',
    description: surveySchema.description,
    rows: rows.length > 0 ? rows : (legacyFields.length > 0 ? [createRowWithFields(legacyFields)] : []),
    fields: legacyFields // Keep for backward compatibility
  };
  
  console.log('✅ [CONVERT_FROM_SURVEYJS] Conversion complete:', {
    resultTitle: result.title,
    resultRowsCount: result.rows.length,
    resultFieldsCount: result.fields.length,
    resultTotalFields: result.rows.reduce((sum, row) => 
      sum + row.columns.reduce((colSum, col) => colSum + col.fields.length, 0), 0),
    rows: result.rows.map(r => ({
      id: r.id,
      columnsCount: r.columns.length,
      totalFields: r.columns.reduce((sum, col) => sum + col.fields.length, 0)
    }))
  });

  return result;
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
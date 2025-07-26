import React, { useState, useCallback } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { FieldPalette } from './FieldPalette';
import { FormCanvas } from './FormCanvas';
import { FieldEditor } from './FieldEditor';
import { FormField, FormSchema, FormRow, createNewField, createDataBoundField, convertToSurveyJS, convertFromSurveyJS, createDefaultRow, migrateFieldsToRows, getAllFieldsFromRows } from './utils/schemaConverter';
import { getFieldTypeById } from './utils/fieldTypes';
import { useToast } from '@/hooks/use-toast';

interface FormBuilderProps {
  schema: FormSchema;
  onChange: (schema: FormSchema) => void;
}

export function FormBuilder({ schema, onChange }: FormBuilderProps) {
  const [selectedField, setSelectedField] = useState<FormField | null>(null);
  const [draggedField, setDraggedField] = useState<string | null>(null);
  const { toast } = useToast();

  // Add validation for drop targets
  const validateDropTarget = useCallback((dropTarget: string, schema: FormSchema) => {
    if (dropTarget === 'form-canvas') return true;
    
    if (dropTarget.startsWith('column_')) {
      const parts = dropTarget.split('_');
      if (parts.length !== 3) return false;
      
      const [, rowId, columnId] = parts;
      const row = schema.rows.find(r => r.id === rowId);
      if (!row) return false;
      
      const column = row.columns.find(c => c.id === columnId);
      return !!column;
    }
    
    return false;
  }, []);

  // Ensure schema has rows (migrate from legacy format if needed)
  const currentSchema = React.useMemo(() => {
    if (!schema.rows || schema.rows.length === 0) {
      if (schema.fields && schema.fields.length > 0) {
        return {
          ...schema,
          rows: migrateFieldsToRows(schema.fields)
        };
      } else {
        return {
          ...schema,
          rows: []
        };
      }
    }
    return schema;
  }, [schema]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setDraggedField(event.active.id as string);
  }, []);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    // Handle drag over events if needed
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setDraggedField(null);

    console.log('🎯 [DRAG_END] === EVENT START ===');
    console.log('🎯 [DRAG_END] Active ID:', active.id);
    console.log('🎯 [DRAG_END] Over ID:', over?.id);
    console.log('🎯 [DRAG_END] Active data:', active.data.current);
    console.log('🎯 [DRAG_END] Over data:', over?.data?.current);
    console.log('🔄 [SCHEMA] Current rows count:', currentSchema.rows.length);
    console.log('🔄 [SCHEMA] Current rows:', currentSchema.rows.map(r => ({ 
      id: r.id, 
      columns: r.columns.length,
      columnIds: r.columns.map(c => c.id)
    })));

    if (!over) {
      console.log('❌ [DRAG_END] NO DROP TARGET - drag cancelled');
      return;
    }

    console.log('✅ [DRAG_END] Valid drop target found:', over.id);

    // Only handle new field drops from palette
    if (!active.data.current?.fieldType && !active.data.current?.dataBoundField) {
      console.log('❌ [DRAG_END] Not a field from palette');
      return;
    }

    let newField;
    
    try {
      if (active.data.current?.dataBoundField) {
        const dataBoundField = active.data.current.dataBoundField;
        console.log('📝 [FIELD_CREATE] Creating data-bound field:', dataBoundField.label);
        
        const defaultProps = {
          title: dataBoundField.label,
          name: dataBoundField.columnName,
          isRequired: false,
          isReadOnly: dataBoundField.isReadOnly || false,
          inputType: dataBoundField.dataType === 'date' ? 'date' : 
                    dataBoundField.dataType === 'number' ? 'number' : 'text'
        };
        
        newField = createDataBoundField(
          dataBoundField.fieldType,
          defaultProps,
          dataBoundField.tableName,
          dataBoundField.columnName,
          dataBoundField.dataType,
          dataBoundField.isReadOnly || false
        );
      } else {
        const fieldType = active.data.current.fieldType;
        console.log('📝 [FIELD_CREATE] Creating regular field:', fieldType.surveyType);
        newField = createNewField(fieldType.surveyType, fieldType.defaultProps || {});
      }
      
      console.log('✅ [FIELD_CREATE] Field created successfully:', newField.id, newField.title);
    } catch (error) {
      console.error('❌ [FIELD_CREATE] Field creation failed:', error);
      return;
    }
    
    const dropTarget = over.id.toString();
    console.log('🎯 [DROP_TARGET] Target identified:', dropTarget);
    
    if (dropTarget === 'form-canvas') {
      console.log('📋 [CANVAS_DROP] Dropping on empty canvas');
      const newRow = createDefaultRow();
      newRow.columns[0].fields = [newField];
      
      const updatedSchema = {
        ...currentSchema,
        rows: [...currentSchema.rows, newRow]
      };
      
      console.log('📋 [CANVAS_DROP] New schema:', updatedSchema.rows.length, 'rows');
      onChange(updatedSchema);
      setSelectedField(newField);
      return;
    }
    
    if (dropTarget.startsWith('column_')) {
      console.log('📦 [COLUMN_DROP] Dropping on column');
      const parts = dropTarget.split('_');
      console.log('🔍 [COLUMN_DROP] Parsing target:', parts);
      
      if (parts.length !== 3) {
        console.error('❌ [COLUMN_DROP] Invalid column target format:', dropTarget, 'Expected 3 parts, got:', parts.length);
        toast({
          title: 'Drop Failed',
          description: 'Invalid column format. Please try again.',
          variant: 'destructive',
        });
        return;
      }
      
      const [, rowId, columnId] = parts;
      console.log('🎯 [COLUMN_DROP] Target Row ID:', rowId, 'Column ID:', columnId);
      
      // Verify row and column exist BEFORE attempting update
      const targetRow = currentSchema.rows.find(row => row.id === rowId);
      if (!targetRow) {
        console.error('❌ [COLUMN_DROP] Target row not found:', rowId);
        console.error('❌ [COLUMN_DROP] Available rows:', currentSchema.rows.map(r => r.id));
        toast({
          title: 'Drop Failed',
          description: 'Target row no longer exists. The form layout may have changed.',
          variant: 'destructive',
        });
        return;
      }

      const targetColumn = targetRow.columns.find(col => col.id === columnId);
      if (!targetColumn) {
        console.error('❌ [COLUMN_DROP] Target column not found:', columnId);
        console.error('❌ [COLUMN_DROP] Available columns in row:', targetRow.columns.map(c => c.id));
        toast({
          title: 'Drop Failed', 
          description: 'Target column no longer exists. Try refreshing the form layout.',
          variant: 'destructive',
        });
        return;
      }
      
      // Find and update the target row/column
      let updated = false;
      const newRows = currentSchema.rows.map(row => {
        if (row.id === rowId) {
          console.log('✅ [COLUMN_DROP] Found target row');
          const newColumns = row.columns.map(column => {
            if (column.id === columnId) {
              console.log('✅ [COLUMN_DROP] Found target column, adding field');
              updated = true;
              return {
                ...column,
                fields: [...column.fields, newField]
              };
            }
            return column;
          });
          return { ...row, columns: newColumns };
        }
        return row;
      });
      
      if (!updated) {
        console.error('❌ [COLUMN_DROP] Could not find target row/column:', rowId, columnId);
        toast({
          title: 'Drop Failed',
          description: 'Could not add field. Please try again.',
          variant: 'destructive',
        });
        return;
      }
      
      const updatedSchema = {
        ...currentSchema,
        rows: newRows
      };
      
      console.log('📦 [COLUMN_DROP] Field added successfully');
      console.log('🔄 [SCHEMA] Updated schema rows count:', updatedSchema.rows.length);
      onChange(updatedSchema);
      setSelectedField(newField);
      return;
    }
    
    console.log('❌ [DRAG_END] Unknown drop target:', dropTarget);
  }, [currentSchema, onChange]);

  const handleSelectField = useCallback((field: FormField) => {
    setSelectedField(field);
  }, []);

  const handleUpdateField = useCallback((updatedField: FormField) => {
    const newRows = currentSchema.rows.map(row => ({
      ...row,
      columns: row.columns.map(column => ({
        ...column,
        fields: column.fields.map(field =>
          field.id === updatedField.id ? updatedField : field
        )
      }))
    }));
    
    onChange({
      ...currentSchema,
      rows: newRows
    });
    
    setSelectedField(updatedField);
  }, [currentSchema, onChange]);

  const handleDeleteField = useCallback((fieldId: string) => {
    const newRows = currentSchema.rows.map(row => ({
      ...row,
      columns: row.columns.map(column => ({
        ...column,
        fields: column.fields.filter(field => field.id !== fieldId)
      }))
    }));
    
    onChange({
      ...currentSchema,
      rows: newRows
    });
    
    if (selectedField?.id === fieldId) {
      setSelectedField(null);
    }
  }, [currentSchema, onChange, selectedField]);

  const handleCloseEditor = useCallback(() => {
    setSelectedField(null);
  }, []);

  // PHASE 3: Memoized callback functions to prevent unnecessary re-renders
  const handleAddRow = useCallback(() => {
    onChange({
      ...currentSchema,
      rows: [...currentSchema.rows, createDefaultRow()]
    });
  }, [currentSchema, onChange]);

  const handleUpdateRow = useCallback((rowId: string, updatedRow: FormRow) => {
    const newRows = currentSchema.rows.map(row =>
      row.id === rowId ? updatedRow : row
    );
    onChange({
      ...currentSchema,
      rows: newRows
    });
  }, [currentSchema, onChange]);

  const handleDeleteRow = useCallback((rowId: string) => {
    const newRows = currentSchema.rows.filter(row => row.id !== rowId);
    onChange({
      ...currentSchema,
      rows: newRows
    });
  }, [currentSchema, onChange]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full min-h-[600px] bg-background">
        <FieldPalette />
        <FormCanvas
          rows={currentSchema.rows}
          selectedField={selectedField}
          onSelectField={handleSelectField}
          onDeleteField={handleDeleteField}
          onAddRow={handleAddRow}
          onUpdateRow={handleUpdateRow}
          onDeleteRow={handleDeleteRow}
        />
        <FieldEditor
          field={selectedField}
          onUpdateField={handleUpdateField}
          onClose={handleCloseEditor}
        />
      </div>
    </DndContext>
  );
}

// Helper function to initialize FormBuilder with existing SurveyJS schema
export function createFormBuilderSchema(surveySchema?: any): FormSchema {
  console.log('🔄 [CREATE_BUILDER_SCHEMA] Converting existing schema:', {
    schemaExists: !!surveySchema,
    schemaType: typeof surveySchema,
    schemaKeys: surveySchema ? Object.keys(surveySchema) : [],
    elementsCount: surveySchema?.elements?.length || 0
  });

  if (surveySchema && surveySchema.elements) {
    const result = convertFromSurveyJS(surveySchema);
    console.log('✅ [CREATE_BUILDER_SCHEMA] Conversion complete:', {
      resultRowsCount: result.rows?.length || 0,
      resultTitle: result.title,
      resultRows: result.rows?.map(r => ({
        id: r.id,
        columnsCount: r.columns?.length || 0,
        totalFields: r.columns?.reduce((sum, col) => sum + (col.fields?.length || 0), 0) || 0
      })) || []
    });
    return result;
  }
  
  console.log('📝 [CREATE_BUILDER_SCHEMA] Creating new empty schema');
  return {
    title: 'Untitled Form',
    description: '',
    rows: []
  };
}

// Helper function to convert FormBuilder schema to SurveyJS
export function getFormBuilderOutput(schema: FormSchema): any {
  console.log('🔄 [FORM_BUILDER_OUTPUT] Converting schema:', {
    inputRowsCount: schema.rows?.length || 0,
    inputTitle: schema.title,
    inputRows: schema.rows?.map(r => ({
      id: r.id,
      columnsCount: r.columns?.length || 0,
      totalFields: r.columns?.reduce((sum, col) => sum + (col.fields?.length || 0), 0) || 0
    })) || []
  });

  const output = convertToSurveyJS(schema);
  
  console.log('✅ [FORM_BUILDER_OUTPUT] Conversion complete:', {
    outputElementsCount: output?.elements?.length || 0,
    outputTitle: output?.title,
    outputKeys: output ? Object.keys(output) : [],
    fullOutput: JSON.stringify(output, null, 2)
  });

  return output;
}
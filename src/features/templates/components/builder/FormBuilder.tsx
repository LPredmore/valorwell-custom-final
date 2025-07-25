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

    console.log('=== DRAG END EVENT ===');
    console.log('Active ID:', active.id);
    console.log('Over ID:', over?.id);
    console.log('Active data:', active.data.current);
    console.log('Over data:', over?.data?.current);

    if (!over) {
      console.log('❌ NO DROP TARGET - drag cancelled');
      return;
    }

    console.log('✅ Valid drop target found:', over.id);

    // Only handle new field drops from palette
    if (!active.data.current?.fieldType && !active.data.current?.dataBoundField) {
      console.log('❌ Not a field from palette');
      return;
    }

    let newField;
    
    try {
      if (active.data.current?.dataBoundField) {
        const dataBoundField = active.data.current.dataBoundField;
        console.log('📝 Creating data-bound field:', dataBoundField.label);
        
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
        console.log('📝 Creating regular field:', fieldType.surveyType);
        newField = createNewField(fieldType.surveyType, fieldType.defaultProps || {});
      }
      
      console.log('✅ Field created successfully:', newField.id, newField.title);
    } catch (error) {
      console.error('❌ Field creation failed:', error);
      return;
    }
    
    const dropTarget = over.id.toString();
    console.log('🎯 Drop target:', dropTarget);
    
    if (dropTarget === 'form-canvas') {
      console.log('📋 Dropping on empty canvas');
      const newRow = createDefaultRow();
      newRow.columns[0].fields = [newField];
      
      const updatedSchema = {
        ...currentSchema,
        rows: [...currentSchema.rows, newRow]
      };
      
      console.log('📋 Canvas drop - new schema:', updatedSchema.rows.length, 'rows');
      onChange(updatedSchema);
      setSelectedField(newField);
      return;
    }
    
    if (dropTarget.startsWith('column_')) {
      console.log('📦 Dropping on column');
      const parts = dropTarget.split('_');
      console.log('🔍 Parsing target:', parts);
      
      if (parts.length !== 3) {
        console.error('❌ Invalid column target format:', dropTarget);
        toast({
          title: 'Drop Failed',
          description: 'Invalid column format. Please try again.',
          variant: 'destructive',
        });
        return;
      }
      
      const [, rowId, columnId] = parts;
      console.log('🎯 Target Row ID:', rowId, 'Column ID:', columnId);
      
      // Verify row and column exist BEFORE attempting update
      const targetRow = currentSchema.rows.find(row => row.id === rowId);
      if (!targetRow) {
        console.error('❌ Target row not found:', rowId);
        toast({
          title: 'Drop Failed',
          description: 'Target row no longer exists. The form layout may have changed.',
          variant: 'destructive',
        });
        return;
      }

      const targetColumn = targetRow.columns.find(col => col.id === columnId);
      if (!targetColumn) {
        console.error('❌ Target column not found:', columnId);
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
          console.log('✅ Found target row');
          const newColumns = row.columns.map(column => {
            if (column.id === columnId) {
              console.log('✅ Found target column, adding field');
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
        console.error('❌ Could not find target row/column:', rowId, columnId);
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
      
      console.log('📦 Column drop - field added successfully');
      onChange(updatedSchema);
      setSelectedField(newField);
      return;
    }
    
    console.log('❌ Unknown drop target:', dropTarget);
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
          onAddRow={() => {
            onChange({
              ...currentSchema,
              rows: [...currentSchema.rows, createDefaultRow()]
            });
          }}
          onUpdateRow={(rowId: string, updatedRow: FormRow) => {
            const newRows = currentSchema.rows.map(row =>
              row.id === rowId ? updatedRow : row
            );
            onChange({
              ...currentSchema,
              rows: newRows
            });
          }}
          onDeleteRow={(rowId: string) => {
            const newRows = currentSchema.rows.filter(row => row.id !== rowId);
            onChange({
              ...currentSchema,
              rows: newRows
            });
          }}
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
  if (surveySchema && surveySchema.elements) {
    return convertFromSurveyJS(surveySchema);
  }
  
  return {
    title: 'Untitled Form',
    description: '',
    rows: []
  };
}

// Helper function to convert FormBuilder schema to SurveyJS
export function getFormBuilderOutput(schema: FormSchema): any {
  return convertToSurveyJS(schema);
}
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

interface FormBuilderProps {
  schema: FormSchema;
  onChange: (schema: FormSchema) => void;
}

export function FormBuilder({ schema, onChange }: FormBuilderProps) {
  const [selectedField, setSelectedField] = useState<FormField | null>(null);
  const [draggedField, setDraggedField] = useState<string | null>(null);

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
    console.log('Active:', { id: active.id, data: active.data.current });
    console.log('Over:', { id: over?.id, data: over?.data?.current });
    console.log('Current Schema:', currentSchema);

    if (!over) {
      console.log('No drop target found');
      return;
    }

    // Handle dropping a new field from palette
    if (active.data.current?.fieldType || active.data.current?.dataBoundField) {
      let newField;
      
      try {
        // Check if it's a data-bound field
        if (active.data.current?.dataBoundField) {
          const dataBoundField = active.data.current.dataBoundField;
          console.log('Creating data-bound field:', dataBoundField);
          
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
          // Regular field type
          const fieldType = active.data.current.fieldType;
          console.log('Creating regular field:', fieldType);
          newField = createNewField(fieldType.surveyType, fieldType.defaultProps);
        }
        
        console.log('Successfully created field:', newField);
      } catch (error) {
        console.error('Error creating field:', error);
        return;
      }
      
      // Find the target drop zone
      const dropTarget = over.id.toString();
      console.log('Drop target:', dropTarget);
      
      if (dropTarget === 'form-canvas') {
        // Drop on empty canvas - create new row
        console.log('Dropping on empty canvas');
        const newRow = createDefaultRow();
        newRow.columns[0].fields = [newField];
        
        const updatedSchema = {
          ...currentSchema,
          rows: [...currentSchema.rows, newRow]
        };
        console.log('New schema after canvas drop:', updatedSchema);
        onChange(updatedSchema);
      } else if (dropTarget.startsWith('column-')) {
        // Drop on specific column
        console.log('Dropping on column');
        const [, rowId, columnId] = dropTarget.split('-');
        console.log('Target row:', rowId, 'Target column:', columnId);
        
        // Create a deep copy of the schema to ensure React sees the change
        const newRows = currentSchema.rows.map(row => {
          if (row.id === rowId) {
            console.log('Found target row:', row);
            return {
              ...row,
              columns: row.columns.map(column => {
                if (column.id === columnId) {
                  console.log('Found target column:', column);
                  const updatedColumn = {
                    ...column,
                    fields: [...column.fields, newField]
                  };
                  console.log('Updated column:', updatedColumn);
                  return updatedColumn;
                }
                return { ...column };
              })
            };
          }
          return { ...row };
        });
        
        const updatedSchema = {
          ...currentSchema,
          rows: newRows
        };
        console.log('New schema after column drop:', updatedSchema);
        
        // Force a state update by using a callback
        onChange(updatedSchema);
        
        // Set a timeout to ensure the update is processed
        setTimeout(() => {
          console.log('Delayed schema check:', updatedSchema);
        }, 100);
      }
      
      setSelectedField(newField);
      return;
    }

    // Handle reordering existing fields
    const allFields = getAllFieldsFromRows(currentSchema.rows);
    if (active.id !== over.id && allFields.find(f => f.id === active.id)) {
      console.log('Handling field reordering (not implemented)');
      // For now, just maintain the same structure
      // TODO: Implement proper row/column reordering
    }
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
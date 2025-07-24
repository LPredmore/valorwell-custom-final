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
import { FormField, FormSchema, createNewField, convertToSurveyJS, convertFromSurveyJS } from './utils/schemaConverter';
import { getFieldTypeById } from './utils/fieldTypes';

interface FormBuilderProps {
  schema: FormSchema;
  onChange: (schema: FormSchema) => void;
}

export function FormBuilder({ schema, onChange }: FormBuilderProps) {
  const [selectedField, setSelectedField] = useState<FormField | null>(null);
  const [draggedField, setDraggedField] = useState<string | null>(null);

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

    if (!over) return;

    // Handle dropping a new field from palette
    if (over.id === 'form-canvas' && active.data.current?.fieldType) {
      const fieldType = active.data.current.fieldType;
      const newField = createNewField(fieldType.surveyType, fieldType.defaultProps);
      
      onChange({
        ...schema,
        fields: [...schema.fields, newField]
      });
      
      setSelectedField(newField);
      return;
    }

    // Handle reordering existing fields
    if (active.id !== over.id && schema.fields.find(f => f.id === active.id)) {
      const oldIndex = schema.fields.findIndex(f => f.id === active.id);
      const newIndex = schema.fields.findIndex(f => f.id === over.id);
      
      const newFields = arrayMove(schema.fields, oldIndex, newIndex);
      
      onChange({
        ...schema,
        fields: newFields
      });
    }
  }, [schema, onChange]);

  const handleSelectField = useCallback((field: FormField) => {
    setSelectedField(field);
  }, []);

  const handleUpdateField = useCallback((updatedField: FormField) => {
    const newFields = schema.fields.map(field =>
      field.id === updatedField.id ? updatedField : field
    );
    
    onChange({
      ...schema,
      fields: newFields
    });
    
    setSelectedField(updatedField);
  }, [schema, onChange]);

  const handleDeleteField = useCallback((fieldId: string) => {
    const newFields = schema.fields.filter(field => field.id !== fieldId);
    
    onChange({
      ...schema,
      fields: newFields
    });
    
    if (selectedField?.id === fieldId) {
      setSelectedField(null);
    }
  }, [schema, onChange, selectedField]);

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
          fields={schema.fields}
          selectedField={selectedField}
          onSelectField={handleSelectField}
          onDeleteField={handleDeleteField}
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
    fields: []
  };
}

// Helper function to convert FormBuilder schema to SurveyJS
export function getFormBuilderOutput(schema: FormSchema): any {
  return convertToSurveyJS(schema);
}
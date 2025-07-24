import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { FormField } from './utils/schemaConverter';
import { FieldRenderer } from './FieldRenderer';
import { Plus } from 'lucide-react';

interface FormCanvasProps {
  fields: FormField[];
  selectedField: FormField | null;
  onSelectField: (field: FormField) => void;
  onDeleteField: (fieldId: string) => void;
}

export function FormCanvas({ fields, selectedField, onSelectField, onDeleteField }: FormCanvasProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: 'form-canvas'
  });

  const isEmpty = fields.length === 0;

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 p-6 transition-colors ${
        isOver ? 'bg-primary/5' : 'bg-background'
      } ${isEmpty ? 'flex items-center justify-center' : ''}`}
    >
      {isEmpty ? (
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Plus className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Start Building Your Form
          </h3>
          <p className="text-muted-foreground">
            Drag field types from the left panel to add them to your form. 
            You can reorder fields by dragging them within this area.
          </p>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto w-full">
          <SortableContext 
            items={fields.map(f => f.id)} 
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {fields.map((field) => (
                <FieldRenderer
                  key={field.id}
                  field={field}
                  isSelected={selectedField?.id === field.id}
                  onSelect={onSelectField}
                  onDelete={onDeleteField}
                />
              ))}
            </div>
          </SortableContext>
        </div>
      )}
    </div>
  );
}
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { FormField, FormColumn } from './utils/schemaConverter';
import { FieldRenderer } from './FieldRenderer';
import { Plus } from 'lucide-react';

interface ColumnDropZoneProps {
  column: FormColumn;
  rowId: string;
  selectedField: FormField | null;
  onSelectField: (field: FormField) => void;
  onDeleteField: (fieldId: string) => void;
}

export function ColumnDropZone({ 
  column, 
  rowId, 
  selectedField, 
  onSelectField, 
  onDeleteField
}: ColumnDropZoneProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: `column-${rowId}-${column.id}`,
    data: {
      type: 'column',
      rowId,
      columnId: column.id
    }
  });

  const isEmpty = column.fields.length === 0;

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[100px] border-2 border-dashed rounded-lg transition-all duration-200 ${
        isOver 
          ? 'border-primary bg-primary/5' 
          : isEmpty 
            ? 'border-muted-foreground/20 hover:border-muted-foreground/40' 
            : 'border-transparent'
      }`}
    >
      {isEmpty ? (
        <div className="flex items-center justify-center h-full p-4 text-center">
          <div className="text-muted-foreground">
            <Plus className="h-6 w-6 mx-auto mb-2" />
            <p className="text-sm">Drop fields here</p>
          </div>
        </div>
      ) : (
        <div className="p-3">
          <SortableContext
            items={column.fields.map(f => f.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {column.fields.map((field) => (
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
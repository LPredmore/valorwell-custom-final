import React, { memo, useCallback } from 'react';
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

// PHASE 3: Memoized component to prevent unnecessary re-renders
export const ColumnDropZone = memo(function ColumnDropZone({ 
  column, 
  rowId, 
  selectedField, 
  onSelectField, 
  onDeleteField
}: ColumnDropZoneProps) {
  const dropZoneId = `column_${rowId}_${column.id}`;
  
  console.log('🏗️ [COLUMN_DROP_ZONE] Rendering:', {
    dropZoneId,
    columnId: column.id,
    rowId,
    fieldsCount: column.fields.length,
    fields: column.fields.map(f => ({ id: f.id, title: f.title }))
  });
  
  const { isOver, setNodeRef } = useDroppable({
    id: dropZoneId,
    data: {
      type: 'column',
      rowId,
      columnId: column.id
    }
  });
  
  // Log when drop zone registration changes
  React.useEffect(() => {
    console.log('📍 [DROP_ZONE] Registered:', dropZoneId);
    return () => {
      console.log('📍 [DROP_ZONE] Unregistered:', dropZoneId);
    };
  }, [dropZoneId]);

  const isEmpty = column.fields.length === 0;

  // PHASE 3: Memoized callbacks to prevent prop changes
  const handleSelectField = useCallback((field: FormField) => {
    onSelectField(field);
  }, [onSelectField]);

  const handleDeleteField = useCallback((fieldId: string) => {
    onDeleteField(fieldId);
  }, [onDeleteField]);

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
                  onSelect={handleSelectField}
                  onDelete={handleDeleteField}
                />
              ))}
            </div>
          </SortableContext>
        </div>
      )}
    </div>
  );
});
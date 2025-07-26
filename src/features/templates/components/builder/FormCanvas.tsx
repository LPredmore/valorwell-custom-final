import React, { memo, useCallback } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { FormField, FormRow } from './utils/schemaConverter';
import { RowRenderer } from './SortableRowRenderer';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FormCanvasProps {
  rows: FormRow[];
  selectedField: FormField | null;
  onSelectField: (field: FormField) => void;
  onDeleteField: (fieldId: string) => void;
  onAddRow: () => void;
  onUpdateRow: (rowId: string, updatedRow: FormRow) => void;
  onDeleteRow: (rowId: string) => void;
}

// PHASE 3: Memoized component to prevent unnecessary re-renders
const FormCanvas = memo(function FormCanvas({ 
  rows, 
  selectedField, 
  onSelectField, 
  onDeleteField, 
  onAddRow, 
  onUpdateRow, 
  onDeleteRow
}: FormCanvasProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: 'form-canvas'
  });

  const isEmpty = rows.length === 0;

  // PHASE 3: Memoized callbacks to prevent prop changes
  const handleSelectField = useCallback((field: FormField) => {
    onSelectField(field);
  }, [onSelectField]);

  const handleDeleteField = useCallback((fieldId: string) => {
    onDeleteField(fieldId);
  }, [onDeleteField]);

  const handleUpdateRow = useCallback((rowId: string, updatedRow: FormRow) => {
    onUpdateRow(rowId, updatedRow);
  }, [onUpdateRow]);

  const handleDeleteRow = useCallback((rowId: string) => {
    onDeleteRow(rowId);
  }, [onDeleteRow]);

  const handleAddRow = useCallback(() => {
    onAddRow();
  }, [onAddRow]);

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
          <p className="text-muted-foreground mb-4">
            Drag field types from the left panel to add them to your form. 
            You can create multiple columns and reorder fields within rows.
          </p>
          <Button onClick={handleAddRow} variant="outline" className="mx-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add First Row
          </Button>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto w-full space-y-4">
          <SortableContext 
            items={rows.map(r => r.id)} 
            strategy={verticalListSortingStrategy}
          >
            {rows.map((row) => (
              <RowRenderer
                key={row.id}
                row={row}
                selectedField={selectedField}
                onSelectField={handleSelectField}
                onDeleteField={handleDeleteField}
                onUpdateRow={handleUpdateRow}
                onDeleteRow={handleDeleteRow}
              />
            ))}
          </SortableContext>
          
          <div className="flex justify-center pt-4">
            <Button onClick={handleAddRow} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Row
            </Button>
          </div>
        </div>
      )}
    </div>
  );
});

export { FormCanvas };
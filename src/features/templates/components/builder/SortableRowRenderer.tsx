import React, { memo, useCallback } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Card } from '@/components/ui/card';
import { GripVertical, Settings, Trash2, Columns } from 'lucide-react';
import { ColumnDropZone } from './ColumnDropZone';
import { FormRow, FormField, createRowWithColumns } from './utils/schemaConverter';

interface RowControlsProps {
  row: FormRow;
  onUpdateRow: (updatedRow: FormRow) => void;
  onDeleteRow: () => void;
}

function RowControls({ row, onUpdateRow, onDeleteRow }: RowControlsProps) {
  const handleColumnCountChange = (columnCount: number) => {
    const currentColumnCount = row.columns.length;
    
    console.log('🏗️ [COLUMN_CHANGE] Changing column count from', currentColumnCount, 'to', columnCount);
    console.log('🏗️ [COLUMN_CHANGE] Current columns:', row.columns.map(c => ({ id: c.id, fields: c.fields.length })));
    
    if (columnCount === currentColumnCount) {
      console.log('🏗️ [COLUMN_CHANGE] No change needed');
      return; // No change needed
    }
    
    // Create new columns array, preserving existing columns where possible
    const newColumns = [];
    
    for (let i = 0; i < columnCount; i++) {
      if (i < row.columns.length) {
        // Preserve existing column with same ID
        const preservedColumn = {
          ...row.columns[i],
          width: Math.floor(100 / columnCount)
        };
        newColumns.push(preservedColumn);
        console.log('🏗️ [COLUMN_CHANGE] Preserved column:', preservedColumn.id);
      } else {
        // Create new column only when needed
        const newColumn = {
          id: crypto.randomUUID(),
          width: Math.floor(100 / columnCount),
          fields: []
        };
        newColumns.push(newColumn);
        console.log('🏗️ [COLUMN_CHANGE] Created new column:', newColumn.id);
      }
    }
    
    // Handle field redistribution when reducing columns
    if (columnCount < currentColumnCount) {
      const orphanedFields = row.columns.slice(columnCount).flatMap(col => col.fields);
      console.log('🏗️ [COLUMN_CHANGE] Redistributing orphaned fields:', orphanedFields.length);
      newColumns[0].fields.push(...orphanedFields);
    }
    
    const updatedRow = {
      ...row,
      columns: newColumns,
      settings: {
        ...row.settings,
        columnCount,
        columnWidths: Array(columnCount).fill(Math.floor(100 / columnCount))
      }
    };
    
    console.log('🏗️ [COLUMN_CHANGE] Updated row columns:', updatedRow.columns.map(c => ({ id: c.id, fields: c.fields.length })));
    onUpdateRow(updatedRow);
  };

  return (
    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      {/* Column Count Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Columns className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => handleColumnCountChange(1)}>
            1 Column
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleColumnCountChange(2)}>
            2 Columns
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleColumnCountChange(3)}>
            3 Columns
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Row */}
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
        onClick={() => onDeleteRow()}
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      {/* Drag Handle */}
      <div className="cursor-grab active:cursor-grabbing">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  );
}

interface SortableRowRendererProps {
  row: FormRow;
  selectedField: FormField | null;
  onSelectField: (field: FormField) => void;
  onDeleteField: (fieldId: string) => void;
  onUpdateRow: (rowId: string, updatedRow: FormRow) => void;
  onDeleteRow: (rowId: string) => void;
}

// PHASE 3: Memoized component to prevent unnecessary re-renders
export const RowRenderer = memo(function RowRenderer({
  row,
  selectedField,
  onSelectField,
  onDeleteField,
  onUpdateRow,
  onDeleteRow
}: SortableRowRendererProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: row.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // PHASE 3: Memoized callbacks to prevent prop changes
  const handleSelectField = useCallback((field: FormField) => {
    onSelectField(field);
  }, [onSelectField]);

  const handleDeleteField = useCallback((fieldId: string) => {
    onDeleteField(fieldId);
  }, [onDeleteField]);

  const handleUpdateRow = useCallback((updatedRow: FormRow) => {
    onUpdateRow(row.id, updatedRow);
  }, [onUpdateRow, row.id]);

  const handleDeleteRow = useCallback(() => {
    onDeleteRow(row.id);
  }, [onDeleteRow, row.id]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group ${isDragging ? 'opacity-50' : ''}`}
      {...attributes}
    >
      <Card className="p-4 border-dashed border-2 border-muted-foreground/20 hover:border-muted-foreground/40 transition-colors">
        {/* Row Header with Controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Row ({row.columns.length} column{row.columns.length !== 1 ? 's' : ''})
            </span>
          </div>
          
          <div {...listeners}>
            <RowControls 
              row={row} 
              onUpdateRow={handleUpdateRow} 
              onDeleteRow={handleDeleteRow} 
            />
          </div>
        </div>

        {/* Columns Grid */}
        <div 
          className="grid gap-4"
          style={{
            gridTemplateColumns: `repeat(${row.columns.length}, 1fr)`
          }}
        >
          {row.columns.map((column) => (
            <ColumnDropZone
              key={column.id}
              column={column}
              rowId={row.id}
              selectedField={selectedField}
              onSelectField={handleSelectField}
              onDeleteField={handleDeleteField}
            />
          ))}
        </div>
      </Card>
    </div>
  );
});
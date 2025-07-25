import React from 'react';
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
  onUpdateRow: (rowId: string, updatedRow: FormRow) => void;
  onDeleteRow: (rowId: string) => void;
}

function RowControls({ row, onUpdateRow, onDeleteRow }: RowControlsProps) {
  const handleColumnCountChange = (columnCount: number) => {
    const updatedRow = createRowWithColumns(columnCount);
    // Preserve existing fields by distributing them across columns
    const allFields = row.columns.flatMap(col => col.fields);
    const fieldsPerColumn = Math.ceil(allFields.length / columnCount);
    
    for (let i = 0; i < columnCount; i++) {
      const startIdx = i * fieldsPerColumn;
      const endIdx = startIdx + fieldsPerColumn;
      updatedRow.columns[i].fields = allFields.slice(startIdx, endIdx);
    }
    
    updatedRow.id = row.id; // Keep the same ID
    onUpdateRow(row.id, updatedRow);
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
        onClick={() => onDeleteRow(row.id)}
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

export function RowRenderer({
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
              onUpdateRow={onUpdateRow} 
              onDeleteRow={onDeleteRow} 
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
          {row.columns.map((column, index) => (
            <ColumnDropZone
              key={`column-${row.id}-${column.id}-${index}`}
              column={column}
              rowId={row.id}
              selectedField={selectedField}
              onSelectField={onSelectField}
              onDeleteField={onDeleteField}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
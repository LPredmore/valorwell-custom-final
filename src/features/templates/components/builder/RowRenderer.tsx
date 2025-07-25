import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FormField, FormRow, createRowWithColumns } from './utils/schemaConverter';
import { ColumnDropZone } from './ColumnDropZone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { GripVertical, Plus, Settings, Trash2, Columns2, Columns3, Columns4 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface RowRendererProps {
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
}: RowRendererProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: row.id,
    data: {
      type: 'row',
      row,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleChangeColumns = (columnCount: number) => {
    const newRow = createRowWithColumns(columnCount);
    // Preserve existing fields in first column if possible
    if (row.columns.length > 0 && newRow.columns.length > 0) {
      newRow.columns[0].fields = row.columns[0].fields;
    }
    onUpdateRow(row.id, { ...newRow, id: row.id });
  };

  const handleDeleteRow = () => {
    onDeleteRow(row.id);
  };

  const hasFields = row.columns.some(column => column.fields.length > 0);

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`relative group transition-all duration-200 ${
        isDragging ? 'opacity-50 shadow-2xl' : 'hover:shadow-md'
      }`}
    >
      {/* Row Controls */}
      <div className="absolute -top-3 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-1 bg-background border rounded-md shadow-sm p-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 cursor-grab"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-3 w-3" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Settings className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => handleChangeColumns(1)}>
                <div className="h-3 w-3 mr-2 border rounded" />
                1 Column
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleChangeColumns(2)}>
                <Columns2 className="h-3 w-3 mr-2" />
                2 Columns
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleChangeColumns(3)}>
                <Columns3 className="h-3 w-3 mr-2" />
                3 Columns
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleChangeColumns(4)}>
                <Columns4 className="h-3 w-3 mr-2" />
                4 Columns
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
            onClick={handleDeleteRow}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Row Content */}
      <div className="p-4">
        {row.columns.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Plus className="h-8 w-8 mx-auto mb-2" />
            <p>Empty row - configure columns above</p>
          </div>
        ) : (
          <div 
            className="grid gap-4"
            style={{
              gridTemplateColumns: row.columns.map(col => `${col.width}fr`).join(' ')
            }}
          >
            {row.columns.map((column) => (
              <ColumnDropZone
                key={column.id}
                column={column}
                rowId={row.id}
                selectedField={selectedField}
                onSelectField={onSelectField}
                onDeleteField={onDeleteField}
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
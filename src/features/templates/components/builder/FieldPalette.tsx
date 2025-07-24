import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { FIELD_TYPES, FIELD_CATEGORIES, getFieldTypesByCategory } from './utils/fieldTypes';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface DraggableFieldProps {
  fieldType: typeof FIELD_TYPES[0];
}

function DraggableField({ fieldType }: DraggableFieldProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: fieldType.id,
    data: { fieldType }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const Icon = fieldType.icon;

  return (
    <Button
      ref={setNodeRef}
      variant="outline"
      className={`w-full justify-start gap-2 h-auto p-3 cursor-grab active:cursor-grabbing ${
        isDragging ? 'opacity-50' : ''
      }`}
      style={style}
      {...listeners}
      {...attributes}
    >
      <Icon className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm">{fieldType.name}</span>
    </Button>
  );
}

export function FieldPalette() {
  return (
    <div className="w-60 border-r bg-muted/30 flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-sm text-foreground">Field Types</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Drag fields to add them to your form
        </p>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {FIELD_CATEGORIES.map((category) => (
            <div key={category.id}>
              <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                {category.name}
              </h4>
              <div className="space-y-2">
                {getFieldTypesByCategory(category.id).map((fieldType) => (
                  <DraggableField key={fieldType.id} fieldType={fieldType} />
                ))}
              </div>
              <Separator className="mt-4" />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
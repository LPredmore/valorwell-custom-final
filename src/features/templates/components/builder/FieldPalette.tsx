import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { FIELD_TYPES, FIELD_CATEGORIES, getFieldTypesByCategory } from './utils/fieldTypes';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { DataBoundFieldPalette } from './DataBoundFieldPalette';

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

interface CategorySectionProps {
  category: { readonly id: string; readonly name: string; readonly icon: any };
}

function CategorySection({ category }: CategorySectionProps) {
  const [isOpen, setIsOpen] = useState(category.id === 'basic'); // Basic fields open by default
  const fieldTypes = getFieldTypesByCategory(category.id);
  const Icon = category.icon;

  // Skip rendering data-bound categories here (they're handled separately)
  if (category.id === 'client' || category.id === 'clinician') {
    return null;
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between p-3 h-auto font-medium"
        >
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4" />
            <span className="text-sm">{category.name}</span>
          </div>
          {isOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2 mt-2 ml-2">
        {fieldTypes.map((fieldType) => (
          <DraggableField key={fieldType.id} fieldType={fieldType} />
        ))}
      </CollapsibleContent>
    </Collapsible>
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
          {/* Regular field categories */}
          {FIELD_CATEGORIES.filter(cat => cat.id !== 'client' && cat.id !== 'clinician').map((category) => (
            <div key={category.id}>
              <CategorySection category={category} />
              <Separator className="mt-4" />
            </div>
          ))}
          
          {/* Data-bound field categories */}
          <DataBoundFieldPalette />
        </div>
      </ScrollArea>
    </div>
  );
}
import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { 
  getDataBoundFieldsByCategory, 
  getUniqueSubcategories, 
  getDataBoundFieldsBySubcategory,
  DataBoundFieldMapping,
  DATA_BOUND_CATEGORIES
} from './utils/dataBoundFields';

interface DraggableDataBoundFieldProps {
  field: DataBoundFieldMapping;
}

function DraggableDataBoundField({ field }: DraggableDataBoundFieldProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `databound_${field.id}`,
    data: { 
      dataBoundField: {
        tableName: field.tableName,
        columnName: field.columnName,
        fieldType: field.surveyType,
        label: field.name,
        dataType: field.dataType,
        isReadOnly: field.isReadOnly || false
      }
    }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const Icon = field.icon;

  return (
    <Button
      ref={setNodeRef}
      variant="outline"
      className={`w-full justify-start gap-2 h-auto p-3 cursor-grab active:cursor-grabbing ${
        isDragging ? 'opacity-50' : ''
      } ${field.isReadOnly ? 'border-dashed text-muted-foreground' : ''}`}
      style={style}
      {...listeners}
      {...attributes}
    >
      <Icon className="h-4 w-4 text-muted-foreground" />
      <div className="flex flex-col items-start">
        <span className="text-sm">{field.name}</span>
        {field.isReadOnly && (
          <span className="text-xs text-muted-foreground">Read-only</span>
        )}
      </div>
    </Button>
  );
}

interface SubcategoryProps {
  category: 'client' | 'clinician';
  subcategory: string;
}

function SubcategorySection({ category, subcategory }: SubcategoryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const fields = getDataBoundFieldsBySubcategory(category, subcategory);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between p-2 h-auto font-normal"
        >
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {subcategory}
          </span>
          {isOpen ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2 mt-2 ml-2">
        {fields.map((field) => (
          <DraggableDataBoundField key={field.id} field={field} />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

interface CategoryProps {
  category: { readonly id: 'client' | 'clinician'; readonly name: string; readonly icon: any };
}

function CategorySection({ category }: CategoryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const subcategories = getUniqueSubcategories(category.id);
  const Icon = category.icon;

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
      <CollapsibleContent className="space-y-2 mt-2">
        {subcategories.map((subcategory) => (
          <SubcategorySection 
            key={subcategory} 
            category={category.id} 
            subcategory={subcategory} 
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

export function DataBoundFieldPalette() {
  return (
    <div className="space-y-2">
      {DATA_BOUND_CATEGORIES.map((category) => (
        <div key={category.id}>
          <CategorySection category={category} />
          <Separator className="mt-4" />
        </div>
      ))}
    </div>
  );
}
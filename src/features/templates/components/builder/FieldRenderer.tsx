import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Edit } from 'lucide-react';
import { FormField } from './utils/schemaConverter';
import { getFieldTypeById } from './utils/fieldTypes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface FieldRendererProps {
  field: FormField;
  isSelected: boolean;
  onSelect: (field: FormField) => void;
  onDelete: (fieldId: string) => void;
}

export function FieldRenderer({ field, isSelected, onSelect, onDelete }: FieldRendererProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: field.id,
    data: { field }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const fieldType = getFieldTypeById(field.type);
  const Icon = fieldType?.icon;

  const renderFieldPreview = () => {
    switch (field.type) {
      case 'text':
        return (
          <input
            type={field.inputType || 'text'}
            placeholder={field.placeholder || 'Enter text...'}
            className="w-full px-3 py-2 border rounded-md bg-background"
            disabled
          />
        );

      case 'comment':
        return (
          <textarea
            rows={field.rows || 4}
            placeholder={field.placeholder || 'Enter your response...'}
            className="w-full px-3 py-2 border rounded-md bg-background resize-none"
            disabled
          />
        );

      case 'dropdown':
        return (
          <select className="w-full px-3 py-2 border rounded-md bg-background" disabled>
            <option>Select an option...</option>
            {field.choices?.map((choice, index) => (
              <option key={index} value={choice}>{choice}</option>
            ))}
          </select>
        );

      case 'radiogroup':
        return (
          <div className="space-y-2">
            {field.choices?.slice(0, 3).map((choice, index) => (
              <label key={index} className="flex items-center gap-2 text-sm">
                <input type="radio" disabled className="text-primary" />
                {choice}
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.choices?.slice(0, 3).map((choice, index) => (
              <label key={index} className="flex items-center gap-2 text-sm">
                <input type="checkbox" disabled className="text-primary" />
                {choice}
              </label>
            ))}
          </div>
        );

      case 'rating':
        return (
          <div className="flex gap-1">
            {Array.from({ length: field.rateMax || 5 }, (_, i) => (
              <span key={i} className="text-lg text-muted-foreground">☆</span>
            ))}
          </div>
        );

      case 'signaturepad':
        return (
          <div className="w-full h-24 border-2 border-dashed border-muted-foreground/30 rounded-md flex items-center justify-center text-sm text-muted-foreground">
            Signature Area
          </div>
        );

      default:
        return (
          <div className="w-full p-4 border-2 border-dashed border-muted-foreground/30 rounded-md text-center text-sm text-muted-foreground">
            {fieldType?.name || field.type} field preview
          </div>
        );
    }
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`relative group transition-all duration-200 ${
        isSelected ? 'ring-2 ring-primary' : ''
      } ${isDragging ? 'opacity-50' : ''}`}
      onClick={() => onSelect(field)}
    >
      <div className="p-4">
        {/* Field Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
            <span className="font-medium text-sm">
              {field.title}
              {field.isRequired && <span className="text-destructive ml-1">*</span>}
            </span>
          </div>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 cursor-grab active:cursor-grabbing"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 text-muted-foreground hover:text-primary"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(field);
              }}
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(field.id);
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Field Preview */}
        <div className="pointer-events-none">
          {renderFieldPreview()}
        </div>
      </div>
    </Card>
  );
}
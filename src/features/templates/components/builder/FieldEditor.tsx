import React from 'react';
import { FormField } from './utils/schemaConverter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { getFieldTypeById } from './utils/fieldTypes';

interface FieldEditorProps {
  field: FormField | null;
  onUpdateField: (field: FormField) => void;
  onClose: () => void;
}

export function FieldEditor({ field, onUpdateField, onClose }: FieldEditorProps) {
  if (!field) {
    return (
      <div className="w-80 border-l bg-muted/30 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <p className="text-sm">Select a field to edit its properties</p>
        </div>
      </div>
    );
  }

  const fieldType = getFieldTypeById(field.type);

  const updateField = (updates: Partial<FormField>) => {
    onUpdateField({ ...field, ...updates });
  };

  const updateChoice = (index: number, value: string) => {
    const newChoices = [...(field.choices || [])];
    newChoices[index] = value;
    updateField({ choices: newChoices });
  };

  const addChoice = () => {
    const newChoices = [...(field.choices || []), `Option ${(field.choices?.length || 0) + 1}`];
    updateField({ choices: newChoices });
  };

  const removeChoice = (index: number) => {
    const newChoices = field.choices?.filter((_, i) => i !== index) || [];
    updateField({ choices: newChoices });
  };

  const hasChoices = ['dropdown', 'radiogroup', 'checkbox'].includes(field.type);
  const hasInputType = field.type === 'text';
  const hasRows = field.type === 'comment';
  const hasRating = field.type === 'rating';

  return (
    <div className="w-80 border-l bg-muted/30 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-sm text-foreground">Field Properties</h3>
          <p className="text-xs text-muted-foreground mt-1">
            {fieldType?.name || field.type}
          </p>
        </div>
        <Button size="sm" variant="ghost" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Basic Properties */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="field-title" className="text-xs font-medium">
                Field Label
              </Label>
              <Input
                id="field-title"
                value={field.title}
                onChange={(e) => updateField({ title: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="field-name" className="text-xs font-medium">
                Field Name
              </Label>
              <Input
                id="field-name"
                value={field.name}
                onChange={(e) => updateField({ name: e.target.value })}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Used for data collection and API responses
              </p>
            </div>

            <div>
              <Label htmlFor="field-description" className="text-xs font-medium">
                Description (optional)
              </Label>
              <Textarea
                id="field-description"
                value={field.description || ''}
                onChange={(e) => updateField({ description: e.target.value })}
                rows={2}
                className="mt-1"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Required Field</Label>
              <Switch
                checked={field.isRequired || false}
                onCheckedChange={(checked) => updateField({ isRequired: checked })}
              />
            </div>
          </div>

          <Separator />

          {/* Type-specific Properties */}
          {hasInputType && (
            <div>
              <Label htmlFor="input-type" className="text-xs font-medium">
                Input Type
              </Label>
              <select
                id="input-type"
                value={field.inputType || 'text'}
                onChange={(e) => updateField({ inputType: e.target.value })}
                className="w-full mt-1 px-3 py-2 border rounded-md bg-background text-sm"
              >
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="tel">Phone</option>
                <option value="number">Number</option>
                <option value="date">Date</option>
              </select>
            </div>
          )}

          {hasRows && (
            <div>
              <Label htmlFor="textarea-rows" className="text-xs font-medium">
                Number of Rows
              </Label>
              <Input
                id="textarea-rows"
                type="number"
                min="2"
                max="10"
                value={field.rows || 4}
                onChange={(e) => updateField({ rows: parseInt(e.target.value) || 4 })}
                className="mt-1"
              />
            </div>
          )}

          {hasRating && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="rate-min" className="text-xs font-medium">
                  Minimum Rating
                </Label>
                <Input
                  id="rate-min"
                  type="number"
                  min="0"
                  value={field.rateMin || 1}
                  onChange={(e) => updateField({ rateMin: parseInt(e.target.value) || 1 })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="rate-max" className="text-xs font-medium">
                  Maximum Rating
                </Label>
                <Input
                  id="rate-max"
                  type="number"
                  min="1"
                  value={field.rateMax || 5}
                  onChange={(e) => updateField({ rateMax: parseInt(e.target.value) || 5 })}
                  className="mt-1"
                />
              </div>
            </div>
          )}

          {(field.type === 'text' || field.type === 'comment') && (
            <div>
              <Label htmlFor="field-placeholder" className="text-xs font-medium">
                Placeholder Text
              </Label>
              <Input
                id="field-placeholder"
                value={field.placeholder || ''}
                onChange={(e) => updateField({ placeholder: e.target.value })}
                className="mt-1"
              />
            </div>
          )}

          {hasChoices && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-xs font-medium">Options</Label>
                <Button size="sm" variant="outline" onClick={addChoice}>
                  <Plus className="h-3 w-3 mr-1" />
                  Add
                </Button>
              </div>
              <div className="space-y-2">
                {field.choices?.map((choice, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={choice}
                      onChange={(e) => updateChoice(index, e.target.value)}
                      className="flex-1"
                      placeholder={`Option ${index + 1}`}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeChoice(index)}
                      disabled={field.choices?.length === 1}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
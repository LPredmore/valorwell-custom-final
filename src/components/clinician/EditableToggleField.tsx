import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface EditableToggleFieldProps {
  label: string;
  value: boolean | null | undefined;
  onSave: (value: boolean) => void;
  isLoading?: boolean;
}

export const EditableToggleField: React.FC<EditableToggleFieldProps> = ({
  label,
  value,
  onSave,
  isLoading = false
}) => {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-muted-foreground">
        {label}
      </Label>
      <div className="flex items-center space-x-2">
        <Switch
          checked={Boolean(value)}
          onCheckedChange={onSave}
          disabled={isLoading}
        />
        <span className="text-foreground">
          {value ? 'Yes' : 'No'}
        </span>
      </div>
    </div>
  );
};
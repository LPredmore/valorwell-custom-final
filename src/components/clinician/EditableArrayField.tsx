import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Edit, Check, X, Plus, Trash2 } from 'lucide-react';

interface EditableArrayFieldProps {
  label: string;
  value: string[] | null | undefined;
  onSave: (value: string[]) => void;
  placeholder?: string;
  isLoading?: boolean;
}

export const EditableArrayField: React.FC<EditableArrayFieldProps> = ({
  label,
  value,
  onSave,
  placeholder,
  isLoading = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState<string[]>(value || []);
  const [newItem, setNewItem] = useState('');

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value || []);
    setNewItem('');
    setIsEditing(false);
  };

  const addItem = () => {
    if (newItem.trim() && !editValue.includes(newItem.trim())) {
      setEditValue([...editValue, newItem.trim()]);
      setNewItem('');
    }
  };

  const removeItem = (index: number) => {
    setEditValue(editValue.filter((_, i) => i !== index));
  };

  if (isEditing) {
    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">
          {label}
        </Label>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder={placeholder}
              className="flex-1"
              disabled={isLoading}
              onKeyPress={(e) => e.key === 'Enter' && addItem()}
            />
            <Button
              size="sm"
              onClick={addItem}
              disabled={isLoading || !newItem.trim()}
              className="px-3"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {editValue.map((item, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {item}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeItem(index)}
                  className="h-auto p-0 ml-1"
                  disabled={isLoading}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isLoading}
              className="px-3"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="px-3"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-muted-foreground">
          {label}
        </Label>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsEditing(true)}
          className="h-auto p-1"
        >
          <Edit className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {value && value.length > 0 ? (
          value.map((item, index) => (
            <Badge key={index} variant="secondary">
              {item}
            </Badge>
          ))
        ) : (
          <p className="text-muted-foreground">Not set</p>
        )}
      </div>
    </div>
  );
};
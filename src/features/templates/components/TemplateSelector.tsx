import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus } from 'lucide-react';
import { prebuiltTemplates, templateCategories, PrebuiltTemplate } from '../data/prebuiltTemplates';

interface TemplateSelectorProps {
  onSelectTemplate: (template: PrebuiltTemplate | null) => void;
  selectedTemplateId?: string;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  onSelectTemplate,
  selectedTemplateId
}) => {
  const getCategoryName = (categoryId: string) => {
    return templateCategories.find(cat => cat.id === categoryId)?.name || categoryId;
  };

  const groupedTemplates = prebuiltTemplates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, PrebuiltTemplate[]>);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-2">Choose a Template</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Select a pre-built template to get started, or create a custom form from scratch.
        </p>
        
        <Card className={`cursor-pointer border-2 transition-colors ${
          selectedTemplateId === null ? 'border-primary' : 'border-border hover:border-primary/50'
        }`} onClick={() => onSelectTemplate(null)}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <CardTitle className="text-sm">Start from Scratch</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Create a completely custom form using JSON editor
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {Object.entries(groupedTemplates).map(([category, templates]) => (
        <div key={category}>
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-4 w-4" />
            <h4 className="font-medium">{getCategoryName(category)}</h4>
          </div>
          <div className="grid gap-3">
            {templates.map((template) => (
              <Card
                key={template.id}
                className={`cursor-pointer border-2 transition-colors ${
                  selectedTemplateId === template.id 
                    ? 'border-primary' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => onSelectTemplate(template)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-sm">{template.name}</CardTitle>
                      <CardDescription className="text-xs mt-1">
                        {template.description}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {getCategoryName(template.category)}
                    </Badge>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
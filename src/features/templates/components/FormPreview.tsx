import React from 'react';
import { Survey } from 'survey-react-ui';
import { Model } from 'survey-core';
import { FormContext, FormData } from '../types/formContext';
import { useFormData } from '../hooks/useFormData';

interface FormPreviewProps {
  schema: any;
  context?: FormContext;
}

export const FormPreview: React.FC<FormPreviewProps> = ({ schema, context }) => {
  const { data: formData, isLoading } = useFormData(context || { context_type: 'general' });

  const survey = React.useMemo(() => {
    try {
      const model = new Model(schema);
      model.mode = 'display'; // Read-only mode
      
      // Auto-populate data-bound fields
      if (formData && schema.elements) {
        const populatedData: Record<string, any> = {};
        
        const populateElements = (elements: any[]) => {
          elements.forEach((element: any) => {
            if (element.dataBound && formData) {
              const { tableName, columnName } = element.dataBound;
              const fieldKey = `${tableName}_${columnName}`;
              
              if (formData[fieldKey] !== undefined) {
                populatedData[element.name] = formData[fieldKey];
              }
            }
            
            // Handle nested elements (panels, etc.)
            if (element.elements) {
              populateElements(element.elements);
            }
          });
        };
        
        populateElements(schema.elements);
        model.data = populatedData;
      }
      
      return model;
    } catch (error) {
      console.error('Error creating survey model:', error);
      return null;
    }
  }, [schema, formData]);

  if (isLoading) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <p>Loading form data...</p>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <p>Invalid form schema. Please check your JSON format.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Survey model={survey} />
    </div>
  );
};
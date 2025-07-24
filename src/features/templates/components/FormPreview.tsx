import React from 'react';
import { Survey } from 'survey-react-ui';
import { Model } from 'survey-core';
import 'survey-core/survey.css';

interface FormPreviewProps {
  schema: any;
}

export const FormPreview: React.FC<FormPreviewProps> = ({ schema }) => {
  const survey = React.useMemo(() => {
    try {
      const model = new Model(schema);
      model.mode = 'display'; // Read-only mode
      return model;
    } catch (error) {
      console.error('Error creating survey model:', error);
      return null;
    }
  }, [schema]);

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
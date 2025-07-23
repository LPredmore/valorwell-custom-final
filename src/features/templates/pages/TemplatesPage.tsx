import React from 'react';
import { TemplatesList } from '../components/TemplatesList';

export const TemplatesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Documentation</h1>
        <p className="text-muted-foreground">
          Manage your practice's form templates and documentation
        </p>
      </div>
      <TemplatesList />
    </div>
  );
};
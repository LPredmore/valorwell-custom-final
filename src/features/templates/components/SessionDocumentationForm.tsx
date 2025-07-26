
import React, { useState, useMemo } from 'react';
import { Survey } from 'survey-react-ui';
import { Model } from 'survey-core';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, Loader2 } from 'lucide-react';
import { convertToSurveyJS } from '../components/builder/utils/schemaConverter';
import { FormContext, FormData } from '../types/formContext';
import { useFormData } from '../hooks/useFormData';
import { useFormSubmission } from '../hooks/useFormSubmission';
import { useUpdateAppointment } from '@/features/calendar/hooks/useAppointments';
import { useToast } from '@/hooks/use-toast';

interface Template {
  id: string;
  name: string;
  schema_json: any;
}

interface SessionDocumentationFormProps {
  template: Template;
  context: FormContext;
  onComplete: () => void;
}

export const SessionDocumentationForm: React.FC<SessionDocumentationFormProps> = ({
  template,
  context,
  onComplete
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const { data: formData, isLoading } = useFormData(context);
  const { submitForm } = useFormSubmission();
  const updateAppointment = useUpdateAppointment();

  const survey = useMemo(() => {
    try {
      const surveySchema = convertToSurveyJS(template.schema_json);
      const model = new Model(surveySchema);
      
      // Auto-populate data-bound fields
      if (formData && surveySchema.elements) {
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
        
        populateElements(surveySchema.elements);
        model.data = populatedData;
      }
      
      return model;
    } catch (error) {
      console.error('Error creating survey model:', error);
      return null;
    }
  }, [template.schema_json, formData]);

  const handleSubmit = async () => {
    if (!survey || !context.client_id || !context.clinician_id || !context.appointment_id) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Missing required information for form submission.',
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Submit the form
      await submitForm({
        templateId: template.id,
        clientId: context.client_id,
        clinicianId: context.clinician_id,
        appointmentId: context.appointment_id,
        formData: survey.data
      });

      // Update appointment status to documented
      await updateAppointment.mutateAsync({
        id: context.appointment_id,
        status: 'documented'
      });

      toast({
        title: 'Success',
        description: 'Session documentation completed successfully.',
      });

      onComplete();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to submit session documentation. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Loading form data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!survey) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <p>Unable to load the session documentation form. Please try again.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{template.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Survey model={survey} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="min-w-[120px]"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {isSubmitting ? 'Saving...' : 'Save Documentation'}
        </Button>
      </div>
    </div>
  );
};

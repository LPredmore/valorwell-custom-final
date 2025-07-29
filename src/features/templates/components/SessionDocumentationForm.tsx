import React, { useState, useMemo } from 'react';
import { Survey } from 'survey-react-ui';
import { Model } from 'survey-core';
import 'survey-core/defaultV2.css';
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
      console.log('🔄 [SESSION_FORM] Creating survey with template:', {
        templateId: template.id,
        templateName: template.name,
        schemaType: typeof template.schema_json,
        hasElements: !!template.schema_json?.elements,
        hasRows: !!template.schema_json?.rows
      });

      let surveySchema;
      
      // Check if schema is already in SurveyJS format (has elements property)
      if (template.schema_json?.elements) {
        console.log('📋 [SESSION_FORM] Schema already in SurveyJS format, using directly');
        surveySchema = template.schema_json;
      } else if (template.schema_json?.rows || template.schema_json?.fields) {
        console.log('📋 [SESSION_FORM] Schema in custom format, converting to SurveyJS');
        surveySchema = convertToSurveyJS(template.schema_json);
      } else {
        console.error('❌ [SESSION_FORM] Unknown schema format:', template.schema_json);
        throw new Error('Unknown schema format');
      }

      const model = new Model(surveySchema);
      
      // Configure survey for better layout
      model.widthMode = "responsive";
      model.showQuestionNumbers = "off";
      
      // Auto-populate data-bound fields with deep recursive traversal
      if (formData && surveySchema.elements) {
        console.log('🔄 [SESSION_FORM] Auto-populating fields with data:', formData);
        const populatedData: Record<string, any> = {};
        
        const populateElements = (elements: any[], depth = 0) => {
          const indent = '  '.repeat(depth);
          console.log(`${indent}🔍 [SESSION_FORM] Processing ${elements.length} elements at depth ${depth}`);
          
          elements.forEach((element: any, index: number) => {
            console.log(`${indent}📝 [SESSION_FORM] Element ${index}:`, {
              name: element.name,
              type: element.type,
              hasDataBound: !!element.dataBound,
              hasElements: !!element.elements,
              width: element.width
            });

            // Handle data-bound fields
            if (element.dataBound && formData) {
              const { tableName, columnName } = element.dataBound;
              const fieldKey = `${tableName}_${columnName}`;
              
              console.log(`${indent}📊 [SESSION_FORM] Data-bound field:`, {
                elementName: element.name,
                tableName,
                columnName,
                fieldKey,
                value: formData[fieldKey],
                isReadOnly: element.dataBound.isReadOnly
              });
              
              if (formData[fieldKey] !== undefined) {
                populatedData[element.name] = formData[fieldKey];
                
                // Make data-bound fields read-only
                if (element.dataBound.isReadOnly) {
                  element.readOnly = true;
                }
              }
            }
            
            // Recursively handle nested elements (panels, etc.)
            if (element.elements && Array.isArray(element.elements)) {
              console.log(`${indent}🔄 [SESSION_FORM] Recursing into ${element.elements.length} nested elements`);
              populateElements(element.elements, depth + 1);
            }
          });
        };
        
        populateElements(surveySchema.elements);
        
        console.log('✅ [SESSION_FORM] Auto-populated data:', populatedData);
        model.data = populatedData;
      }
      
      return model;
    } catch (error) {
      console.error('❌ [SESSION_FORM] Error creating survey model:', error);
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
      console.log('🚀 [SESSION_FORM] Submitting form with data:', survey.data);

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
      console.error('❌ [SESSION_FORM] Error submitting form:', error);
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

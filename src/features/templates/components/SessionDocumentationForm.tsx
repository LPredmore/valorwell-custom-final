import React, { useState, useMemo } from 'react';
import { Survey } from 'survey-react-ui';
import { Model } from 'survey-core';
import 'survey-core/survey-core.min.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, Loader2 } from 'lucide-react';
import { convertToSurveyJS } from '../components/builder/utils/schemaConverter';
import { FormContext, FormData } from '../types/formContext';
import { useFormData } from '../hooks/useFormData';
import { useFormSubmission } from '../hooks/useFormSubmission';
import { useUpdateAppointment } from '@/features/calendar/hooks/useAppointments';
import { useToast } from '@/hooks/use-toast';
import { logger, performanceLogger } from '@/utils/loggingService';
import { templateDebugger } from '@/utils/templateDebugger';
import { ErrorBoundary } from '@/components/ErrorBoundary';

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
    const timer = performanceLogger.startTimer('Survey model creation');
    
    logger.info('Creating survey with template', {
      component: 'SessionDocumentationForm',
      templateId: template.id,
      templateName: template.name,
      schemaType: typeof template.schema_json,
      hasElements: !!template.schema_json?.elements,
      hasRows: !!template.schema_json?.rows
    });

    try {
      let surveySchema;
      
      // Check if schema is already in SurveyJS format (has elements property)
      if (template.schema_json?.elements) {
        logger.debug('Schema already in SurveyJS format, using directly', {
          component: 'SessionDocumentationForm',
          templateId: template.id,
          elementsCount: template.schema_json.elements.length
        });
        surveySchema = template.schema_json;
      } else if (template.schema_json?.rows || template.schema_json?.fields) {
        logger.debug('Schema in custom format, converting to SurveyJS', {
          component: 'SessionDocumentationForm',
          templateId: template.id
        });
        surveySchema = convertToSurveyJS(template.schema_json);
      } else {
        logger.error('Unknown schema format', {
          component: 'SessionDocumentationForm',
          templateId: template.id,
          schemaKeys: Object.keys(template.schema_json || {})
        });
        throw new Error('Unknown schema format');
      }

      const model = new Model(surveySchema);
      
      // Configure survey for multi-column responsive layout
      model.widthMode = "responsive";
      model.showQuestionNumbers = "off";
      model.showProgressBar = "off";
      model.questionTitleLocation = "top";
      
      // Enhanced layout configuration for multi-column support
      model.css = {
        ...model.css,
        panel: {
          ...model.css.panel,
          container: "sv_panel_container sv_multi_column_panel"
        }
      };
      
      logger.debug('Survey model configured with multi-column support', {
        component: 'SessionDocumentationForm',
        templateId: template.id,
        widthMode: model.widthMode,
        questionTitleLocation: model.questionTitleLocation
      });
      
      // Auto-populate data-bound fields with deep recursive traversal
      if (formData && surveySchema.elements) {
        logger.info('Auto-populating fields with data', {
          component: 'SessionDocumentationForm',
          templateId: template.id,
          formDataKeys: Object.keys(formData)
        });
        
        const populatedData: Record<string, any> = {};
        let populatedCount = 0;
        
        const populateElements = (elements: any[], depth = 0) => {
          elements.forEach((element: any, index: number) => {
            logger.debug('Processing element', {
              component: 'SessionDocumentationForm',
              elementName: element.name,
              elementType: element.type,
              depth,
              hasDataBound: !!element.dataBound,
              hasNestedElements: !!element.elements
            });

            // Handle data-bound fields
            if (element.dataBound && formData) {
              const { tableName, columnName } = element.dataBound;
              const fieldKey = `${tableName}_${columnName}`;
              
              if (formData[fieldKey] !== undefined) {
                populatedData[element.name] = formData[fieldKey];
                populatedCount++;
                
                logger.debug('Populated data-bound field', {
                  component: 'SessionDocumentationForm',
                  elementName: element.name,
                  tableName,
                  columnName,
                  fieldKey,
                  valueType: typeof formData[fieldKey]
                });
                
                // Make data-bound fields read-only
                if (element.dataBound.isReadOnly) {
                  element.readOnly = true;
                }
              }
            }
            
            // Recursively handle nested elements (panels, etc.)
            if (element.elements && Array.isArray(element.elements)) {
              populateElements(element.elements, depth + 1);
            }
          });
        };
        
        populateElements(surveySchema.elements);
        
        logger.info('Auto-population completed', {
          component: 'SessionDocumentationForm',
          templateId: template.id,
          populatedCount,
          totalDataKeys: Object.keys(populatedData).length
        });
        
        model.data = populatedData;
      }
      
      timer.end({ success: true, templateId: template.id });
      return model;
    } catch (error) {
      timer.end({ success: false, templateId: template.id });
      logger.error('Error creating survey model', {
        component: 'SessionDocumentationForm',
        templateId: template.id
      }, error as Error);
      return null;
    }
  }, [template.schema_json, formData]);

  const handleSubmit = async () => {
    const timer = performanceLogger.startTimer('Form submission');
    
    logger.info('Starting form submission', {
      component: 'SessionDocumentationForm',
      action: 'submit',
      templateId: template.id,
      hasContext: !!context,
      hasSurvey: !!survey
    });

    if (!survey || !context.client_id || !context.clinician_id || !context.appointment_id) {
      const missingFields = [];
      if (!survey) missingFields.push('survey');
      if (!context.client_id) missingFields.push('client_id');
      if (!context.clinician_id) missingFields.push('clinician_id');
      if (!context.appointment_id) missingFields.push('appointment_id');

      logger.error('Missing required information for form submission', {
        component: 'SessionDocumentationForm',
        missingFields
      });

      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Missing required information for form submission.',
      });
      timer.end({ success: false, reason: 'missing_data' });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const formDataSize = JSON.stringify(survey.data).length;
      
      logger.info('Submitting form with data', {
        component: 'SessionDocumentationForm',
        templateId: template.id,
        appointmentId: context.appointment_id,
        formDataSize,
        fieldCount: Object.keys(survey.data).length
      });

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

      timer.end({ success: true });

      toast({
        title: 'Success',
        description: 'Session documentation completed successfully.',
      });

      onComplete();
    } catch (error) {
      timer.end({ success: false });
      logger.error('Error submitting form', {
        component: 'SessionDocumentationForm',
        templateId: template.id,
        appointmentId: context.appointment_id
      }, error as Error);

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
    <ErrorBoundary context="SessionDocumentationForm">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{template.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden survey-container">
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
    </ErrorBoundary>
  );
};


import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { logger, performanceLogger } from '@/utils/loggingService';
import { handleAppointmentError, ERROR_CODES } from '@/utils/errorHandling';

interface FormSubmissionData {
  templateId: string;
  clientId: string;
  clinicianId: string;
  appointmentId?: string;
  formData: Record<string, any>;
}

export const useFormSubmission = () => {
  const { toast } = useToast();

  const submitForm = useMutation({
    mutationFn: async (data: FormSubmissionData) => {
      const timer = performanceLogger.startTimer('Form submission');
      
      logger.info('Starting form submission', {
        component: 'useFormSubmission',
        action: 'submit',
        templateId: data.templateId,
        clientId: data.clientId,
        clinicianId: data.clinicianId,
        appointmentId: data.appointmentId,
        formDataSize: JSON.stringify(data.formData).length
      });

      try {
        const { data: result, error } = await supabase
          .from('form_submissions')
          .insert([
            {
              template_id: data.templateId,
              client_id: data.clientId,
              clinician_id: data.clinicianId,
              appointment_id: data.appointmentId,
              form_data: data.formData,
            },
          ])
          .select()
          .single();

        if (error) {
          logger.error('Supabase form submission error', {
            component: 'useFormSubmission',
            action: 'submit',
            templateId: data.templateId,
            supabaseError: error
          }, error);
          throw error;
        }

        timer.end({ success: true, submissionId: result.id });
        
        logger.info('Form submission successful', {
          component: 'useFormSubmission',
          action: 'submit',
          submissionId: result.id,
          templateId: data.templateId
        });

        return result;
      } catch (error) {
        timer.end({ success: false });
        const appError = handleAppointmentError(error);
        
        logger.error('Form submission failed', {
          component: 'useFormSubmission',
          action: 'submit',
          templateId: data.templateId,
          errorCode: appError.code
        }, error as Error);
        
        throw error;
      }
    },
    onSuccess: (result) => {
      logger.info('Form submission mutation success', {
        component: 'useFormSubmission',
        submissionId: result.id
      });
      
      toast({
        title: 'Success',
        description: 'Form submitted successfully.',
      });
    },
    onError: (error) => {
      const appError = handleAppointmentError(error);
      
      logger.error('Form submission mutation error', {
        component: 'useFormSubmission',
        errorCode: appError.code
      }, error as Error);

      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: appError.message,
      });
    },
  });

  return {
    submitForm: submitForm.mutateAsync,
    isSubmitting: submitForm.isPending,
  };
};

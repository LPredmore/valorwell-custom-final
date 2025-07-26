
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

      if (error) throw error;
      return result;
    },
    onError: (error) => {
      console.error('Form submission error:', error);
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: 'Failed to submit form. Please try again.',
      });
    },
  });

  return {
    submitForm: submitForm.mutateAsync,
    isSubmitting: submitForm.isPending,
  };
};

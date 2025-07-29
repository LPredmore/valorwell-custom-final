
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, FileText } from 'lucide-react';
import { useTemplates } from '@/features/templates/hooks/useTemplates';
import { useProfile } from '@/hooks/useProfile';
import { useClinicians } from '@/hooks/useClinicians';
import { FormContext } from '@/features/templates/types/formContext';
import { SessionDocumentationForm } from '@/features/templates/components/SessionDocumentationForm';
import { useToast } from '@/hooks/use-toast';

export const SessionDocumentation: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: profile } = useProfile();
  const { data: clinicians = [] } = useClinicians();
  const { data: templates = [] } = useTemplates();

  const clientId = searchParams.get('client_id');
  const appointmentId = searchParams.get('appointment_id');

  // Find current clinician
  const currentClinician = clinicians.find(c => c.profile_id === profile?.id);

  // Use the specific Session Note template by ID
  const sessionTemplate = templates.find(t => 
    t.id === '558cf9b6-0d66-403e-b24b-af63647cd160'
  ) || templates.find(t => 
    t.name === 'Session Note'
  );

  // Create form context
  const formContext: FormContext = {
    client_id: clientId || undefined,
    clinician_id: currentClinician?.id || undefined,
    appointment_id: appointmentId || undefined,
    context_type: 'session_documentation'
  };

  // Validation
  useEffect(() => {
    if (!clientId || !appointmentId) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Client ID and Appointment ID are required for session documentation.',
      });
      navigate('/dashboard');
    }
  }, [clientId, appointmentId, navigate, toast]);

  if (!clientId || !appointmentId) {
    return null;
  }

  if (!sessionTemplate) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No Session Note template found. Please create a Session Note template first.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Session Documentation</h1>
          <p className="text-muted-foreground">Complete the session notes for this appointment</p>
        </div>
      </div>

      <SessionDocumentationForm 
        template={sessionTemplate}
        context={formContext}
        onComplete={() => navigate('/dashboard')}
      />
    </div>
  );
};


import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Edit, User, Mail, Phone, MapPin, Calendar } from 'lucide-react';

export const ClientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: client, isLoading, error } = useQuery({
    queryKey: ['client', id],
    queryFn: async () => {
      if (!id) throw new Error('Client ID is required');
      
      const { data, error } = await supabase
        .from('clients')
        .select(`
          id, first_name, last_name, preferred_name, email, phone, address, city, state, zip_code,
          date_of_birth, age, gender, time_zone, status, assigned_therapist, diagnosis, referral_source,
          treatmentgoal, insurance_company_primary, insurance_type_primary, policy_number_primary,
          group_number_primary, insurance_company_secondary, insurance_type_secondary, policy_number_secondary
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as any;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Error loading client details. Please try again.</p>
        <Button variant="outline" onClick={() => navigate('/clients')} className="mt-4">
          Back to Clients
        </Button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/clients')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Clients
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <User className="h-8 w-8 mr-3" />
              {client.first_name || 'Unknown'} {client.last_name || 'User'}
            </h1>
            <Badge className={getStatusColor(client.status)}>
              {client.status || 'Unknown'}
            </Badge>
          </div>
        </div>
        <Button onClick={() => navigate(`/clients/${id}/edit`)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Client
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">First Name</p>
                <p className="font-medium">{client.first_name || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Name</p>
                <p className="font-medium">{client.last_name || 'Not provided'}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Preferred Name</p>
              <p className="font-medium">{client.preferred_name || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date of Birth</p>
              <p className="font-medium">{client.date_of_birth || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Gender</p>
              <p className="font-medium">{client.gender || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Age</p>
              <p className="font-medium">{client.age || 'Not calculated'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">Not provided</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{client.phone || 'Not provided'}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <div className="font-medium">
                  {client.address && (
                    <>
                      <p>{client.address}</p>
                      <p>
                        {client.city}, {client.state} {client.zip_code}
                      </p>
                    </>
                  )}
                  {!client.address && 'Not provided'}
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Time Zone</p>
              <p className="font-medium">{client.time_zone || 'Not provided'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Clinical Information */}
        <Card>
          <CardHeader>
            <CardTitle>Clinical Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Assigned Therapist</p>
              <p className="font-medium">{client.assigned_therapist || 'Unassigned'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Diagnosis</p>
              <div className="font-medium">
                {client.diagnosis && client.diagnosis.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {client.diagnosis.map((diagnosis: string, index: number) => (
                      <Badge key={index} variant="secondary">{diagnosis}</Badge>
                    ))}
                  </div>
                ) : (
                  'Not provided'
                )}
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Referral Source</p>
              <p className="font-medium">{client.referral_source || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Treatment Goal</p>
              <p className="font-medium">{client.treatmentgoal || 'Not provided'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Insurance Information */}
        <Card>
          <CardHeader>
            <CardTitle>Insurance Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Primary Insurance</p>
              <div className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">Company:</span> {client.insurance_company_primary || 'Not provided'}</p>
                <p><span className="text-muted-foreground">Type:</span> {client.insurance_type_primary || 'Not provided'}</p>
                <p><span className="text-muted-foreground">Policy Number:</span> {client.policy_number_primary || 'Not provided'}</p>
                <p><span className="text-muted-foreground">Group Number:</span> {client.group_number_primary || 'Not provided'}</p>
              </div>
            </div>
            
            {client.insurance_company_secondary && (
              <>
                <Separator />
                <div>
                  <p className="text-sm font-medium mb-2">Secondary Insurance</p>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-muted-foreground">Company:</span> {client.insurance_company_secondary}</p>
                    <p><span className="text-muted-foreground">Type:</span> {client.insurance_type_secondary || 'Not provided'}</p>
                    <p><span className="text-muted-foreground">Policy Number:</span> {client.policy_number_secondary || 'Not provided'}</p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

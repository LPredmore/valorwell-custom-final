import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Edit } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useCurrentClinician, useUpdateCurrentClinician } from '@/hooks/useCurrentClinician';
import { ImageUpload } from '@/components/ui/image-upload';
import { EditableField } from '@/components/clinician/EditableField';
import { EditableToggleField } from '@/components/clinician/EditableToggleField';
import { EditableArrayField } from '@/components/clinician/EditableArrayField';

export const ClinicianProfile: React.FC = () => {
  const { data: profile } = useProfile();
  const { data: clinician, isLoading } = useCurrentClinician();
  const updateClinician = useUpdateCurrentClinician();

  const handleImageChange = (url: string | null) => {
    updateClinician.mutate({ clinician_image_url: url });
  };

  const handleFieldUpdate = (field: string, value: any) => {
    updateClinician.mutate({ [field]: value });
  };

  const getInitials = () => {
    const firstName = clinician?.first_name || '';
    const lastName = clinician?.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getDisplayName = () => {
    const firstName = clinician?.first_name || '';
    const lastName = clinician?.last_name || '';
    return `${firstName} ${lastName}`.trim() || 'Unnamed Clinician';
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="animate-pulse space-y-6">
          <div className="bg-muted rounded-lg h-32"></div>
          <div className="bg-muted rounded-lg h-64"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header Section */}
      <div className="mb-8 bg-card rounded-lg p-6">
        <div className="flex items-center gap-6 mb-6">
          <div className="relative">
            {clinician?.clinician_image_url ? (
              <div className="relative group">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={clinician.clinician_image_url} />
                  <AvatarFallback className="text-lg font-semibold">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Edit className="h-5 w-5 text-white" />
                </div>
              </div>
            ) : (
              <div className="w-20 h-20">
                <ImageUpload
                  label=""
                  bucket="clinician-avatars"
                  currentImageUrl={clinician?.clinician_image_url}
                  onImageChange={handleImageChange}
                  userId={clinician?.id}
                />
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-foreground">
                {getDisplayName()}
              </h1>
            </div>
            <p className="text-muted-foreground mb-3">
              {clinician?.clinician_professional_name || 'Professional name not set'}
            </p>
            <div className="flex gap-2">
              <Badge variant="default" className="bg-emerald-500 text-white">
                {clinician?.clinician_accepting_new_clients ? 'Accepting Clients' : 'Not Accepting'}
              </Badge>
              <Badge variant="secondary">Mental Health</Badge>
            </div>
          </div>
        </div>
        
        {/* Image Upload Section */}
        {clinician?.clinician_image_url && (
          <div className="mt-4">
            <ImageUpload
              label="Update Profile Image"
              bucket="clinician-avatars"
              currentImageUrl={clinician.clinician_image_url}
              onImageChange={handleImageChange}
              userId={clinician.id}
            />
          </div>
        )}
      </div>

      {/* Profile Information Section */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <EditableField
              label="First Name"
              value={clinician?.first_name}
              onSave={(value) => handleFieldUpdate('first_name', value)}
              isLoading={updateClinician.isPending}
            />
            
            <EditableField
              label="Last Name"
              value={clinician?.last_name}
              onSave={(value) => handleFieldUpdate('last_name', value)}
              isLoading={updateClinician.isPending}
            />
            
            <EditableField
              label="Professional Name"
              value={clinician?.clinician_professional_name}
              onSave={(value) => handleFieldUpdate('clinician_professional_name', value)}
              isLoading={updateClinician.isPending}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EditableField
              label="Phone"
              value={clinician?.phone}
              onSave={(value) => handleFieldUpdate('phone', value)}
              type="tel"
              isLoading={updateClinician.isPending}
            />
            
            <EditableField
              label="Date of Birth"
              value={clinician?.date_of_birth}
              onSave={(value) => handleFieldUpdate('date_of_birth', value)}
              type="text"
              placeholder="YYYY-MM-DD"
              isLoading={updateClinician.isPending}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <EditableField
              label="City"
              value={clinician?.city}
              onSave={(value) => handleFieldUpdate('city', value)}
              isLoading={updateClinician.isPending}
            />
            
            <EditableField
              label="State"
              value={clinician?.state}
              onSave={(value) => handleFieldUpdate('state', value)}
              isLoading={updateClinician.isPending}
            />
            
            <EditableField
              label="Zip Code"
              value={clinician?.zip_code}
              onSave={(value) => handleFieldUpdate('zip_code', value)}
              isLoading={updateClinician.isPending}
            />
          </div>
          
          <EditableField
            label="Bio"
            value={clinician?.clinician_bio}
            onSave={(value) => handleFieldUpdate('clinician_bio', value)}
            type="textarea"
            placeholder="Tell us about yourself and your practice..."
            isLoading={updateClinician.isPending}
          />
        </CardContent>
      </Card>

      {/* Clinical Information Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Clinical Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EditableField
              label="NPI Number"
              value={clinician?.clinician_npi_number}
              onSave={(value) => handleFieldUpdate('clinician_npi_number', value)}
              placeholder="10-digit NPI number"
              isLoading={updateClinician.isPending}
            />
            
            <EditableField
              label="License Type"
              value={clinician?.clinician_license_type}
              onSave={(value) => handleFieldUpdate('clinician_license_type', value)}
              placeholder="e.g., LCSW, LPC, LMFT"
              isLoading={updateClinician.isPending}
            />
            
            <EditableField
              label="Taxonomy Code"
              value={clinician?.clinician_taxonomy_code}
              onSave={(value) => handleFieldUpdate('clinician_taxonomy_code', value)}
              placeholder="Healthcare provider taxonomy code"
              isLoading={updateClinician.isPending}
            />
            
            <EditableField
              label="Clinician Type"
              value={clinician?.clinician_type}
              onSave={(value) => handleFieldUpdate('clinician_type', value)}
              placeholder="e.g., Therapist, Counselor, Psychologist"
              isLoading={updateClinician.isPending}
            />
            
            <EditableField
              label="Minimum Client Age"
              value={clinician?.clinician_min_client_age}
              onSave={(value) => handleFieldUpdate('clinician_min_client_age', value)}
              type="number"
              placeholder="18"
              isLoading={updateClinician.isPending}
            />
            
            <EditableField
              label="Time Zone"
              value={clinician?.clinician_time_zone}
              onSave={(value) => handleFieldUpdate('clinician_time_zone', value)}
              placeholder="America/New_York"
              isLoading={updateClinician.isPending}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EditableToggleField
              label="Accepting New Clients"
              value={clinician?.clinician_accepting_new_clients}
              onSave={(value) => handleFieldUpdate('clinician_accepting_new_clients', value)}
              isLoading={updateClinician.isPending}
            />
          </div>
          
          <EditableArrayField
            label="Licensed States"
            value={clinician?.clinician_licensed_states}
            onSave={(value) => handleFieldUpdate('clinician_licensed_states', value)}
            placeholder="Add state abbreviation (e.g., CA, NY)"
            isLoading={updateClinician.isPending}
          />
          
          <EditableArrayField
            label="Treatment Approaches"
            value={clinician?.clinician_treatment_approaches}
            onSave={(value) => handleFieldUpdate('clinician_treatment_approaches', value)}
            placeholder="Add treatment approach (e.g., CBT, DBT)"
            isLoading={updateClinician.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
};
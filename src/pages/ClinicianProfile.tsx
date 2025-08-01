import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Edit } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useCurrentClinician, useUpdateCurrentClinician } from '@/hooks/useCurrentClinician';
import { ImageUpload } from '@/components/ui/image-upload';

export const ClinicianProfile: React.FC = () => {
  const { data: profile } = useProfile();
  const { data: clinician, isLoading } = useCurrentClinician();
  const updateClinician = useUpdateCurrentClinician();

  const handleImageChange = (url: string | null) => {
    updateClinician.mutate({ clinician_image_url: url });
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
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground">First Name</label>
                <Edit className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-foreground">{clinician?.first_name || 'Not set'}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground">Last Name</label>
                <Edit className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-foreground">{clinician?.last_name || 'Not set'}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground">Professional Name</label>
                <Edit className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-foreground">{clinician?.clinician_professional_name || 'Not set'}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <Edit className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-foreground">{profile?.email || 'Not set'}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground">Phone</label>
                <Edit className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-foreground">{clinician?.phone || 'Not set'}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-muted-foreground">Bio</label>
              <Edit className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-foreground">{clinician?.clinician_bio || 'No bio added yet'}</p>
          </div>
        </CardContent>
      </Card>

      {/* Clinical Information Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Clinical Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground">NPI Number</label>
                <Edit className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-foreground">{clinician?.clinician_npi_number || 'Not set'}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground">License Type</label>
                <Edit className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-foreground">{clinician?.clinician_license_type || 'Not set'}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground">Licensed States</label>
                <Edit className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-foreground">
                {clinician?.clinician_licensed_states?.join(', ') || 'Not set'}
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground">Taxonomy Code</label>
                <Edit className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-foreground">{clinician?.clinician_taxonomy_code || 'Not set'}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground">Accepting New Clients</label>
                <Edit className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-foreground">
                {clinician?.clinician_accepting_new_clients ? 'Yes' : 'No'}
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground">Minimum Client Age</label>
                <Edit className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-foreground">
                {clinician?.clinician_min_client_age ? `${clinician.clinician_min_client_age} years` : 'Not set'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
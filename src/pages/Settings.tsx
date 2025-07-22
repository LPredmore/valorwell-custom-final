import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ImageUpload } from '@/components/ui/image-upload';
import { usePracticeInfo, usePracticeUpdate, PracticeInfo } from '@/hooks/usePracticeInfo';
import { Building, Users, CreditCard, FileText, Shield, Edit3, Save, X, Plus, Trash2, Phone, Mail } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useClinicians, useDeleteClinician } from '@/hooks/useClinicians';
import { Link } from 'react-router-dom';

const StaffManagement = () => {
  const { data: clinicians, isLoading } = useClinicians();
  const deleteClinician = useDeleteClinician();

  const handleDelete = async (clinicianId: string) => {
    if (window.confirm('Are you sure you want to delete this clinician?')) {
      await deleteClinician.mutateAsync(clinicianId);
    }
  };

  const getStatusVariant = (accepting: boolean | undefined) => {
    return accepting ? 'default' : 'secondary';
  };

  const getStatusText = (accepting: boolean | undefined) => {
    return accepting ? 'Active' : 'New';
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading clinicians...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Clinician Management</CardTitle>
          <CardDescription>
            Manage clinicians and their access to the system.
          </CardDescription>
        </div>
        <Button className="bg-green-700 hover:bg-green-800 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Clinician
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Header Row */}
          <div className="grid grid-cols-6 gap-4 py-3 border-b border-border font-medium text-muted-foreground text-sm">
            <div>Name</div>
            <div>Email</div>
            <div>Phone</div>
            <div>Status</div>
            <div>Actions</div>
            <div></div>
          </div>

          {/* Data Rows */}
          {clinicians?.map((clinician) => (
            <div key={clinician.id} className="grid grid-cols-6 gap-4 py-3 border-b border-border items-center">
              <div>
                <Link 
                  to="/clinicianprof" 
                  className="text-foreground hover:text-primary font-medium cursor-pointer"
                >
                  {clinician.profile?.first_name} {clinician.profile?.last_name}
                </Link>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                {clinician.profile?.email}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                {clinician.profile?.phone || '—'}
              </div>
              <div>
                <Badge variant={getStatusVariant(clinician.clinician_accepting_new_clients)}>
                  {getStatusText(clinician.clinician_accepting_new_clients)}
                </Badge>
              </div>
              <div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(clinician.id)}
                  disabled={deleteClinician.isPending}
                >
                  Delete
                </Button>
              </div>
              <div></div>
            </div>
          ))}

          {(!clinicians || clinicians.length === 0) && (
            <div className="text-center py-8 text-muted-foreground">
              No clinicians found. Add your first clinician to get started.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const Settings = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<PracticeInfo>>({});
  
  const { data: practiceInfo, isLoading } = usePracticeInfo();
  const updatePractice = usePracticeUpdate();

  useEffect(() => {
    if (practiceInfo) {
      setFormData(practiceInfo);
    } else {
      setFormData({
        practice_name: '',
        practice_taxid: '',
        practice_npi: '',
        practice_taxonomy: '',
        practice_address1: '',
        practice_address2: '',
        practice_city: '',
        practice_state: '',
        practice_zip: '',
        logo_url: null,
        banner_url: null,
      });
    }
  }, [practiceInfo]);

  const handleSave = async () => {
    await updatePractice.mutateAsync(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (practiceInfo) {
      setFormData(practiceInfo);
    }
    setIsEditing(false);
  };

  const handleFieldChange = (field: keyof PracticeInfo, value: string | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your practice settings and configuration</p>
      </div>

      <Tabs defaultValue="practice" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="practice" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Practice
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Staff
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="documentation" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Documentation
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="practice" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Practice Information</CardTitle>
                <CardDescription>
                  Manage your practice details and billing information.
                </CardDescription>
              </div>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancel}
                      disabled={updatePractice.isPending}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      disabled={updatePractice.isPending}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Loading practice information...</div>
              ) : (
                <div className="space-y-6">
                  {/* Branding Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Branding</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <ImageUpload
                        label="Practice Logo"
                        bucket="practice-logos"
                        currentImageUrl={formData.logo_url}
                        onImageChange={(url) => handleFieldChange('logo_url', url)}
                        disabled={!isEditing}
                      />
                      <ImageUpload
                        label="Practice Banner"
                        bucket="practice-banners"
                        currentImageUrl={formData.banner_url}
                        onImageChange={(url) => handleFieldChange('banner_url', url)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  {/* Practice Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Practice Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="practiceName">Practice Name</Label>
                        <Input
                          id="practiceName"
                          value={formData.practice_name || ''}
                          onChange={(e) => handleFieldChange('practice_name', e.target.value)}
                          placeholder="Enter practice name"
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="taxId">Tax ID</Label>
                        <Input
                          id="taxId"
                          value={formData.practice_taxid || ''}
                          onChange={(e) => handleFieldChange('practice_taxid', e.target.value)}
                          placeholder="Enter tax ID"
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="npi">Practice NPI Number</Label>
                        <Input
                          id="npi"
                          value={formData.practice_npi || ''}
                          onChange={(e) => handleFieldChange('practice_npi', e.target.value)}
                          placeholder="Enter NPI number"
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="taxonomy">Group Taxonomy</Label>
                        <Input
                          id="taxonomy"
                          value={formData.practice_taxonomy || ''}
                          onChange={(e) => handleFieldChange('practice_taxonomy', e.target.value)}
                          placeholder="Enter group taxonomy"
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Practice Billing Address */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Practice Billing Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          value={formData.practice_address1 || ''}
                          onChange={(e) => handleFieldChange('practice_address1', e.target.value)}
                          placeholder="Enter address"
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address2">Address 2</Label>
                        <Input
                          id="address2"
                          value={formData.practice_address2 || ''}
                          onChange={(e) => handleFieldChange('practice_address2', e.target.value)}
                          placeholder="Enter address 2 (optional)"
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={formData.practice_city || ''}
                          onChange={(e) => handleFieldChange('practice_city', e.target.value)}
                          placeholder="Enter city"
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={formData.practice_state || ''}
                          onChange={(e) => handleFieldChange('practice_state', e.target.value)}
                          placeholder="Enter state"
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">Zip Code</Label>
                        <Input
                          id="zipCode"
                          value={formData.practice_zip || ''}
                          onChange={(e) => handleFieldChange('practice_zip', e.target.value)}
                          placeholder="Enter zip code"
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <StaffManagement />
        </TabsContent>

        <TabsContent value="billing" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Billing configuration features coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documentation" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Documentation Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Documentation configuration features coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Security configuration features coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
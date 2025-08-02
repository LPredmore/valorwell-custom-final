import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { useAcceptedInsurance } from '@/hooks/useInsurance';
import type { Database } from '@/integrations/supabase/types';

export const AddClientInfo: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [hasInsurance, setHasInsurance] = useState(false);
  const [selectedInsurance, setSelectedInsurance] = useState<string>('');
  const [insuranceData, setInsuranceData] = useState<{[key: string]: string}>({});
  
  // Fetch accepted insurance companies
  const { data: acceptedInsurance, isLoading: isLoadingInsurance } = useAcceptedInsurance();
  const [formData, setFormData] = useState({
    // Names and basic info - using client_* columns
    client_first_name: '',
    client_last_name: '',
    client_email: user?.email || '',
    // Personal Information
    client_preferred_name: '',
    client_middle_name: '',
    client_address: '',
    client_city: '',
    state: '',
    client_zip_code: '',
    client_phone: '',
    date_of_birth: '',
    client_gender: '',
    client_gender_identity: '',
    client_time_zone: 'America/New_York',
    client_minor: 'No',
    
    // Insurance - Primary
    client_insurance_type_primary: '',
    client_insurance_company_primary: '',
    client_policy_number_primary: '',
    client_group_number_primary: '',
    client_subscriber_name_primary: '',
    client_subscriber_relationship_primary: 'Self',
    client_subscriber_dob_primary: '',
    
    // Clinical Information
    client_referral_source: '',
    client_self_goal: '',
    client_status: 'Active',
    client_diagnosis: [],
    
    // Treatment Planning
    client_planlength: '',
    client_treatmentfrequency: '',
    client_problem: '',
    client_treatmentgoal: '',
    client_primaryobjective: '',
    client_intervention1: '',
    client_secondaryobjective: '',
    client_intervention2: '',
  });

  // Fetch existing client data to auto-populate fields
  const { data: clientData, isLoading } = useQuery({
    queryKey: ['client-data', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('profile_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = not found
        throw error;
      }
      
      return data;
    },
    enabled: !!user,
  });

  // Auto-populate form when client data is loaded
  useEffect(() => {
    if (clientData) {
      setFormData(prev => ({
        ...prev,
        client_first_name: clientData.client_first_name || '',
        client_last_name: clientData.client_last_name || '', 
        client_email: clientData.client_email || user?.email || '',
        client_preferred_name: clientData.client_preferred_name || '',
        client_middle_name: clientData.client_middle_name || '',
        client_address: clientData.client_address || '',
        client_city: clientData.client_city || '',
        state: clientData.state || '',
        client_zip_code: clientData.client_zip_code || '',
        client_phone: clientData.client_phone || '',
        date_of_birth: clientData.date_of_birth || '',
        client_gender: clientData.client_gender || '',
        client_gender_identity: clientData.client_gender_identity || '',
        client_time_zone: clientData.client_time_zone || 'America/New_York',
        client_minor: clientData.client_minor || 'No',
        client_insurance_type_primary: clientData.client_insurance_type_primary || '',
        client_insurance_company_primary: clientData.client_insurance_company_primary || '',
        client_policy_number_primary: clientData.client_policy_number_primary || '',
        client_group_number_primary: clientData.client_group_number_primary || '',
        client_subscriber_name_primary: clientData.client_subscriber_name_primary || '',
        client_subscriber_relationship_primary: clientData.client_subscriber_relationship_primary || 'Self',
        client_subscriber_dob_primary: clientData.client_subscriber_dob_primary || '',
        client_referral_source: clientData.client_referral_source || '',
        client_self_goal: clientData.client_self_goal || '',
        client_status: clientData.client_status || 'Active',
        client_planlength: clientData.client_planlength || '',
        client_treatmentfrequency: clientData.client_treatmentfrequency || '',
        client_problem: clientData.client_problem || '',
        client_treatmentgoal: clientData.client_treatmentgoal || '',
        client_primaryobjective: clientData.client_primaryobjective || '',
        client_intervention1: clientData.client_intervention1 || '',
        client_secondaryobjective: clientData.client_secondaryobjective || '',
        client_intervention2: clientData.client_intervention2 || '',
      }));
    }
  }, [clientData, user?.email]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePersonalSave = async () => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('clients')
        .update({
          client_first_name: formData.client_first_name,
          client_last_name: formData.client_last_name,
          client_email: formData.client_email,
          client_middle_name: formData.client_middle_name,
          client_preferred_name: formData.client_preferred_name,
          date_of_birth: formData.date_of_birth,
          client_address: formData.client_address,
          client_city: formData.client_city,
          state: formData.state as Database["public"]["Enums"]["states"] | null,
          client_zip_code: formData.client_zip_code,
          client_phone: formData.client_phone,
          client_time_zone: formData.client_time_zone,
          client_gender: formData.client_gender,
          client_gender_identity: formData.client_gender_identity,
        })
        .eq('profile_id', user.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Personal Information Saved",
        description: "Your personal details have been saved successfully.",
      });

      // Move to Insurance tab
      setActiveTab('insurance');
    } catch (error) {
      console.error('Error saving personal info:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save personal information. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteProfile = async () => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('clients')
        .update({
          client_first_name: formData.client_first_name,
          client_last_name: formData.client_last_name,
          client_email: formData.client_email,
          client_preferred_name: formData.client_preferred_name,
          client_middle_name: formData.client_middle_name,
          client_address: formData.client_address,
          client_city: formData.client_city,
          state: formData.state as Database["public"]["Enums"]["states"] | null,
          client_zip_code: formData.client_zip_code,
          client_phone: formData.client_phone,
          date_of_birth: formData.date_of_birth,
          client_gender: formData.client_gender,
          client_gender_identity: formData.client_gender_identity,
          client_time_zone: formData.client_time_zone,
          client_minor: formData.client_minor,
          client_insurance_type_primary: formData.client_insurance_type_primary,
          client_insurance_company_primary: formData.client_insurance_company_primary,
          client_policy_number_primary: formData.client_policy_number_primary,
          client_group_number_primary: formData.client_group_number_primary,
          client_subscriber_name_primary: formData.client_subscriber_name_primary,
          client_subscriber_relationship_primary: formData.client_subscriber_relationship_primary,
          client_subscriber_dob_primary: formData.client_subscriber_dob_primary,
          client_referral_source: formData.client_referral_source,
          client_self_goal: formData.client_self_goal,
          client_status: formData.client_status,
          client_planlength: formData.client_planlength,
          client_treatmentfrequency: formData.client_treatmentfrequency,
          client_problem: formData.client_problem,
          client_treatmentgoal: formData.client_treatmentgoal,
          client_primaryobjective: formData.client_primaryobjective,
          client_intervention1: formData.client_intervention1,
          client_secondaryobjective: formData.client_secondaryobjective,
          client_intervention2: formData.client_intervention2,
          client_is_profile_complete: 'Yes'
        })
        .eq('profile_id', user.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Profile Completed",
        description: "Your information has been saved successfully.",
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save your information. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Complete Your Profile</h1>
          <p className="text-muted-foreground">Please provide additional information to complete your client profile.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="insurance">Insurance</TabsTrigger>
            <TabsTrigger value="clinical">Clinical</TabsTrigger>
            <TabsTrigger value="treatment">Treatment</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Please provide your personal details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Row 1: Legal Name Heading + Fields */}
                <div className="space-y-4">
                  <div className="border-l-4 border-primary pl-4">
                    <h3 className="font-semibold text-foreground">Legal Name for Insurance Billing</h3>
                    <p className="text-sm text-muted-foreground">Please provide your full legal name exactly as it appears on your insurance card and government-issued ID.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div className="space-y-2">
                       <Label htmlFor="client_first_name">First Name *</Label>
                       <Input
                         id="client_first_name"
                         name="client_first_name"
                         value={formData.client_first_name}
                         onChange={handleInputChange}
                         required
                       />
                     </div>
                    <div className="space-y-2">
                      <Label htmlFor="client_middle_name">Middle Name *</Label>
                      <Input
                        id="client_middle_name"
                        name="client_middle_name"
                        value={formData.client_middle_name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                     <div className="space-y-2">
                       <Label htmlFor="client_last_name">Last Name *</Label>
                       <Input
                         id="client_last_name"
                         name="client_last_name"
                         value={formData.client_last_name}
                         onChange={handleInputChange}
                         required
                       />
                     </div>
                  </div>
                </div>

                {/* Row 2: Preferred Name, Date of Birth */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="client_preferred_name">Preferred Name *</Label>
                    <Input
                      id="client_preferred_name"
                      name="client_preferred_name"
                      value={formData.client_preferred_name}
                      onChange={handleInputChange}
                      placeholder="How you'd like to be addressed"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date_of_birth">Date of Birth *</Label>
                    <Input
                      id="date_of_birth"
                      name="date_of_birth"
                      type="date"
                      value={formData.date_of_birth}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                {/* Row 3: Address */}
                <div className="space-y-2">
                  <Label htmlFor="client_address">Address *</Label>
                  <Input
                    id="client_address"
                    name="client_address"
                    value={formData.client_address}
                    onChange={handleInputChange}
                    placeholder="Street address"
                    required
                  />
                </div>

                {/* Row 4: City, State, ZIP Code */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div className="space-y-2">
                     <Label htmlFor="client_city">City *</Label>
                     <Input
                       id="client_city"
                       name="client_city"
                       value={formData.client_city}
                       onChange={handleInputChange}
                       required
                     />
                   </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Select value={formData.state} onValueChange={(value) => handleSelectChange('state', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Alabama">Alabama</SelectItem>
                        <SelectItem value="Alaska">Alaska</SelectItem>
                        <SelectItem value="Arizona">Arizona</SelectItem>
                        <SelectItem value="Arkansas">Arkansas</SelectItem>
                        <SelectItem value="California">California</SelectItem>
                        <SelectItem value="Colorado">Colorado</SelectItem>
                        <SelectItem value="Connecticut">Connecticut</SelectItem>
                        <SelectItem value="Delaware">Delaware</SelectItem>
                        <SelectItem value="Florida">Florida</SelectItem>
                        <SelectItem value="Georgia">Georgia</SelectItem>
                        <SelectItem value="Hawaii">Hawaii</SelectItem>
                        <SelectItem value="Idaho">Idaho</SelectItem>
                        <SelectItem value="Illinois">Illinois</SelectItem>
                        <SelectItem value="Indiana">Indiana</SelectItem>
                        <SelectItem value="Iowa">Iowa</SelectItem>
                        <SelectItem value="Kansas">Kansas</SelectItem>
                        <SelectItem value="Kentucky">Kentucky</SelectItem>
                        <SelectItem value="Louisiana">Louisiana</SelectItem>
                        <SelectItem value="Maine">Maine</SelectItem>
                        <SelectItem value="Maryland">Maryland</SelectItem>
                        <SelectItem value="Massachusetts">Massachusetts</SelectItem>
                        <SelectItem value="Michigan">Michigan</SelectItem>
                        <SelectItem value="Minnesota">Minnesota</SelectItem>
                        <SelectItem value="Mississippi">Mississippi</SelectItem>
                        <SelectItem value="Missouri">Missouri</SelectItem>
                        <SelectItem value="Montana">Montana</SelectItem>
                        <SelectItem value="Nebraska">Nebraska</SelectItem>
                        <SelectItem value="Nevada">Nevada</SelectItem>
                        <SelectItem value="New Hampshire">New Hampshire</SelectItem>
                        <SelectItem value="New Jersey">New Jersey</SelectItem>
                        <SelectItem value="New Mexico">New Mexico</SelectItem>
                        <SelectItem value="New York">New York</SelectItem>
                        <SelectItem value="North Carolina">North Carolina</SelectItem>
                        <SelectItem value="North Dakota">North Dakota</SelectItem>
                        <SelectItem value="Ohio">Ohio</SelectItem>
                        <SelectItem value="Oklahoma">Oklahoma</SelectItem>
                        <SelectItem value="Oregon">Oregon</SelectItem>
                        <SelectItem value="Pennsylvania">Pennsylvania</SelectItem>
                        <SelectItem value="Rhode Island">Rhode Island</SelectItem>
                        <SelectItem value="South Carolina">South Carolina</SelectItem>
                        <SelectItem value="South Dakota">South Dakota</SelectItem>
                        <SelectItem value="Tennessee">Tennessee</SelectItem>
                        <SelectItem value="Texas">Texas</SelectItem>
                        <SelectItem value="Utah">Utah</SelectItem>
                        <SelectItem value="Vermont">Vermont</SelectItem>
                        <SelectItem value="Virginia">Virginia</SelectItem>
                        <SelectItem value="Washington">Washington</SelectItem>
                        <SelectItem value="West Virginia">West Virginia</SelectItem>
                        <SelectItem value="Wisconsin">Wisconsin</SelectItem>
                        <SelectItem value="Wyoming">Wyoming</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                   <div className="space-y-2">
                     <Label htmlFor="client_zip_code">ZIP Code *</Label>
                     <Input
                       id="client_zip_code"
                       name="client_zip_code"
                       value={formData.client_zip_code}
                       onChange={handleInputChange}
                       required
                     />
                   </div>
                </div>

                {/* Row 5: Email, Phone, Time Zone */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div className="space-y-2">
                     <Label htmlFor="client_email">Email *</Label>
                     <Input
                       id="client_email"
                       name="client_email"
                       type="email"
                       value={formData.client_email}
                       onChange={handleInputChange}
                       required
                     />
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="client_phone">Phone *</Label>
                     <Input
                       id="client_phone"
                       name="client_phone"
                       type="tel"
                       value={formData.client_phone}
                       onChange={handleInputChange}
                       placeholder="(555) 123-4567"
                       required
                     />
                   </div>
                  <div className="space-y-2">
                    <Label htmlFor="client_time_zone">Time Zone *</Label>
                    <Select value={formData.client_time_zone} onValueChange={(value) => handleSelectChange('client_time_zone', value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time zone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">Eastern Time</SelectItem>
                        <SelectItem value="America/Chicago">Central Time</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                        <SelectItem value="America/Anchorage">Alaska Time</SelectItem>
                        <SelectItem value="Pacific/Honolulu">Hawaii Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Row 6: Gender, Gender Identity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="client_gender">Gender *</Label>
                    <Select value={formData.client_gender} onValueChange={(value) => handleSelectChange('client_gender', value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Non-binary">Non-binary</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                        <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client_gender_identity">Gender Identity</Label>
                    <Input
                      id="client_gender_identity"
                      name="client_gender_identity"
                      value={formData.client_gender_identity}
                      onChange={handleInputChange}
                      placeholder="Optional"
                    />
                  </div>
                </div>

                {/* Row 7: Placeholder for future fields */}
                <div className="space-y-2">
                  {/* Reserved for additional fields if needed */}
                </div>

                {/* Next Button */}
                <div className="flex justify-end pt-4">
                  <Button
                    type="button"
                    onClick={handlePersonalSave}
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Next'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insurance">
            <Card>
              <CardHeader>
                <CardTitle>Insurance Information</CardTitle>
                <CardDescription>Let us know if you have insurance coverage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!hasInsurance ? (
                  <div className="text-center space-y-4">
                    <p className="text-muted-foreground">Do you have health insurance?</p>
                    <Button
                      onClick={() => setHasInsurance(true)}
                      variant="outline"
                      size="lg"
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      I have insurance
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Add Insurance</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setHasInsurance(false);
                          setSelectedInsurance('');
                          setInsuranceData({});
                        }}
                      >
                        Remove
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label>Select Your Insurance Company</Label>
                      {isLoadingInsurance ? (
                        <div className="text-sm text-muted-foreground">Loading insurance companies...</div>
                      ) : (
                        <Select value={selectedInsurance} onValueChange={setSelectedInsurance}>
                          <SelectTrigger>
                            <SelectValue placeholder="Search and select your insurance company..." />
                          </SelectTrigger>
                          <SelectContent>
                            {acceptedInsurance?.map((insurance) => (
                              <SelectItem key={insurance.id} value={insurance.id}>
                                {insurance.insurance_companies?.name} - {insurance.plan_name}
                                {insurance.payer_id && ` (${insurance.payer_id})`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>

                    {selectedInsurance && (
                      <div className="space-y-4 border-t pt-4">
                        {(() => {
                          const selected = acceptedInsurance?.find(ins => ins.id === selectedInsurance);
                          if (!selected) return null;

                          const companyData = selected.insurance_companies;
                          const fields = [];

                          // Add company name (always shown)
                          fields.push(
                            <div key="company-name" className="space-y-2">
                              <Label>Insurance Company</Label>
                              <Input 
                                value={companyData?.name || ''} 
                                disabled 
                                className="bg-muted"
                              />
                            </div>
                          );

                          // Add plan name (always shown)
                          fields.push(
                            <div key="plan-name" className="space-y-2">
                              <Label>Plan Name</Label>
                              <Input 
                                value={selected.plan_name} 
                                disabled 
                                className="bg-muted"
                              />
                            </div>
                          );

                          // Add payer ID if available
                          if (selected.payer_id) {
                            fields.push(
                              <div key="payer-id" className="space-y-2">
                                <Label>Payer ID</Label>
                                <Input 
                                  value={selected.payer_id} 
                                  disabled 
                                  className="bg-muted"
                                />
                              </div>
                            );
                          }

                          // Add group number field if required or available
                          if (companyData?.requires_group_number || selected.group_number) {
                            fields.push(
                              <div key="group-number" className="space-y-2">
                                <Label htmlFor="group_number">
                                  Group Number {companyData?.requires_group_number ? '*' : ''}
                                </Label>
                                <Input
                                  id="group_number"
                                  value={insuranceData.group_number || ''}
                                  onChange={(e) => setInsuranceData(prev => ({...prev, group_number: e.target.value}))}
                                  placeholder={selected.group_number || 'Enter group number'}
                                  required={companyData?.requires_group_number}
                                />
                              </div>
                            );
                          }

                          // Add phone number field if required or available
                          if (companyData?.requires_phone_number || selected.phone_number) {
                            fields.push(
                              <div key="phone-number" className="space-y-2">
                                <Label htmlFor="phone_number">
                                  Phone Number {companyData?.requires_phone_number ? '*' : ''}
                                </Label>
                                <Input
                                  id="phone_number"
                                  value={insuranceData.phone_number || ''}
                                  onChange={(e) => setInsuranceData(prev => ({...prev, phone_number: e.target.value}))}
                                  placeholder={selected.phone_number || 'Enter phone number'}
                                  required={companyData?.requires_phone_number}
                                />
                              </div>
                            );
                          }

                          // Add copay amount field if required or available
                          if (companyData?.requires_copay_amount || selected.copay_amount) {
                            fields.push(
                              <div key="copay-amount" className="space-y-2">
                                <Label htmlFor="copay_amount">
                                  Copay Amount {companyData?.requires_copay_amount ? '*' : ''}
                                </Label>
                                <Input
                                  id="copay_amount"
                                  type="number"
                                  step="0.01"
                                  value={insuranceData.copay_amount || ''}
                                  onChange={(e) => setInsuranceData(prev => ({...prev, copay_amount: e.target.value}))}
                                  placeholder={selected.copay_amount?.toString() || 'Enter copay amount'}
                                  required={companyData?.requires_copay_amount}
                                />
                              </div>
                            );
                          }

                          // Add claims address if available
                          if (selected.claims_address_line1) {
                            fields.push(
                              <div key="claims-address" className="space-y-2">
                                <Label>Claims Address</Label>
                                <div className="text-sm p-3 bg-muted rounded">
                                  <p>{selected.claims_address_line1}</p>
                                  {selected.claims_address_line2 && <p>{selected.claims_address_line2}</p>}
                                  {selected.claims_city && selected.claims_state && selected.claims_zip && (
                                    <p>{selected.claims_city}, {selected.claims_state} {selected.claims_zip}</p>
                                  )}
                                </div>
                              </div>
                            );
                          }

                          // Add website if available
                          if (selected.website) {
                            fields.push(
                              <div key="website" className="space-y-2">
                                <Label>Website</Label>
                                <Input 
                                  value={selected.website} 
                                  disabled 
                                  className="bg-muted"
                                />
                              </div>
                            );
                          }

                          // Show coverage details
                          const coverageInfo = [];
                          if (selected.electronic_claims_supported) {
                            coverageInfo.push("Electronic claims supported");
                          }
                          if (selected.prior_authorization_required) {
                            coverageInfo.push("Prior authorization required");
                          }

                          if (coverageInfo.length > 0) {
                            fields.push(
                              <div key="coverage-info" className="space-y-2">
                                <Label>Coverage Information</Label>
                                <div className="text-sm p-3 bg-muted rounded">
                                  <ul className="list-disc list-inside space-y-1">
                                    {coverageInfo.map((info, index) => (
                                      <li key={index}>{info}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            );
                          }

                          // Add notes if available
                          if (selected.notes) {
                            fields.push(
                              <div key="notes" className="space-y-2">
                                <Label>Notes</Label>
                                <div className="text-sm p-3 bg-muted rounded">
                                  {selected.notes}
                                </div>
                              </div>
                            );
                          }

                          return (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {fields}
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clinical">
            <Card>
              <CardHeader>
                <CardTitle>Clinical Information</CardTitle>
                <CardDescription>Background and referral information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="client_referral_source">Referral Source</Label>
                  <Input
                    id="client_referral_source"
                    name="client_referral_source"
                    value={formData.client_referral_source}
                    onChange={handleInputChange}
                    placeholder="How did you hear about us?"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client_self_goal">Personal Goals</Label>
                  <Textarea
                    id="client_self_goal"
                    name="client_self_goal"
                    value={formData.client_self_goal}
                    onChange={handleInputChange}
                    placeholder="What are your goals for therapy?"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="treatment">
            <Card>
              <CardHeader>
                <CardTitle>Treatment Planning</CardTitle>
                <CardDescription>Treatment goals and objectives</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="client_planlength">Plan Length</Label>
                    <Select value={formData.client_planlength} onValueChange={(value) => handleSelectChange('client_planlength', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select plan length" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Short-term (1-3 months)">Short-term (1-3 months)</SelectItem>
                        <SelectItem value="Medium-term (3-6 months)">Medium-term (3-6 months)</SelectItem>
                        <SelectItem value="Long-term (6+ months)">Long-term (6+ months)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client_treatmentfrequency">Treatment Frequency</Label>
                    <Select value={formData.client_treatmentfrequency} onValueChange={(value) => handleSelectChange('client_treatmentfrequency', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Weekly">Weekly</SelectItem>
                        <SelectItem value="Bi-weekly">Bi-weekly</SelectItem>
                        <SelectItem value="Monthly">Monthly</SelectItem>
                        <SelectItem value="As needed">As needed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client_problem">Primary Problem/Concern</Label>
                  <Textarea
                    id="client_problem"
                    name="client_problem"
                    value={formData.client_problem}
                    onChange={handleInputChange}
                    placeholder="Describe the main issue you'd like to address"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client_treatmentgoal">Treatment Goal</Label>
                  <Textarea
                    id="client_treatmentgoal"
                    name="client_treatmentgoal"
                    value={formData.client_treatmentgoal}
                    onChange={handleInputChange}
                    placeholder="What would you like to achieve through treatment?"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client_primaryobjective">Primary Objective</Label>
                  <Textarea
                    id="client_primaryobjective"
                    name="client_primaryobjective"
                    value={formData.client_primaryobjective}
                    onChange={handleInputChange}
                    placeholder="Specific, measurable objective"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client_intervention1">Primary Intervention</Label>
                  <Input
                    id="client_intervention1"
                    name="client_intervention1"
                    value={formData.client_intervention1}
                    onChange={handleInputChange}
                    placeholder="e.g., CBT, DBT, mindfulness"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client_secondaryobjective">Secondary Objective</Label>
                  <Textarea
                    id="client_secondaryobjective"
                    name="client_secondaryobjective"
                    value={formData.client_secondaryobjective}
                    onChange={handleInputChange}
                    placeholder="Additional objective (optional)"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client_intervention2">Secondary Intervention</Label>
                  <Input
                    id="client_intervention2"
                    name="client_intervention2"
                    value={formData.client_intervention2}
                    onChange={handleInputChange}
                    placeholder="Additional intervention (optional)"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Complete Profile Button - shown only on final tab */}
          {activeTab === 'treatment' && (
            <div className="mt-6 flex justify-end">
              <Button
                type="button"
                onClick={handleCompleteProfile}
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Completing Profile...
                  </>
                ) : (
                  'Complete Profile'
                )}
              </Button>
            </div>
          )}
        </Tabs>
      </div>
    </div>
  );
};
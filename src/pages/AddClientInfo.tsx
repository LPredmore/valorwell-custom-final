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
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import type { Database } from '@/integrations/supabase/types';

export const AddClientInfo: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({
    // Names and basic info
    first_name: '',
    last_name: '',
    email: user?.email || '',
    // Personal Information
    client_preferred_name: '',
    client_middle_name: '',
    client_address: '',
    city: '',
    state: '',
    zip_code: '',
    phone: '',
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
        first_name: clientData.first_name || '',
        last_name: clientData.last_name || '', 
        email: clientData.email || user?.email || '',
        client_preferred_name: clientData.client_preferred_name || '',
        client_middle_name: clientData.client_middle_name || '',
        client_address: clientData.client_address || '',
        city: clientData.city || '',
        state: clientData.state || '',
        zip_code: clientData.zip_code || '',
        phone: clientData.phone || '',
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
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          client_middle_name: formData.client_middle_name,
          client_preferred_name: formData.client_preferred_name,
          date_of_birth: formData.date_of_birth,
          client_address: formData.client_address,
          city: formData.city,
          state: formData.state as Database["public"]["Enums"]["states"] | null,
          zip_code: formData.zip_code,
          phone: formData.phone,
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
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          client_preferred_name: formData.client_preferred_name,
          client_middle_name: formData.client_middle_name,
          client_address: formData.client_address,
          city: formData.city,
          state: formData.state as Database["public"]["Enums"]["states"] | null,
          zip_code: formData.zip_code,
          phone: formData.phone,
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
                      <Label htmlFor="first_name">First Name *</Label>
                      <Input
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
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
                      <Label htmlFor="last_name">Last Name *</Label>
                      <Input
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
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
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
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
                    <Label htmlFor="zip_code">ZIP Code *</Label>
                    <Input
                      id="zip_code"
                      name="zip_code"
                      value={formData.zip_code}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                {/* Row 5: Email, Phone, Time Zone */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
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
                <CardDescription>Primary insurance details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="client_insurance_type_primary">Insurance Type</Label>
                    <Select value={formData.client_insurance_type_primary} onValueChange={(value) => handleSelectChange('client_insurance_type_primary', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select insurance type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Private">Private Insurance</SelectItem>
                        <SelectItem value="Medicare">Medicare</SelectItem>
                        <SelectItem value="Medicaid">Medicaid</SelectItem>
                        <SelectItem value="Tricare">Tricare</SelectItem>
                        <SelectItem value="VA">VA Benefits</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client_insurance_company_primary">Insurance Company</Label>
                    <Input
                      id="client_insurance_company_primary"
                      name="client_insurance_company_primary"
                      value={formData.client_insurance_company_primary}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="client_policy_number_primary">Policy Number</Label>
                    <Input
                      id="client_policy_number_primary"
                      name="client_policy_number_primary"
                      value={formData.client_policy_number_primary}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client_group_number_primary">Group Number</Label>
                    <Input
                      id="client_group_number_primary"
                      name="client_group_number_primary"
                      value={formData.client_group_number_primary}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="client_subscriber_name_primary">Subscriber Name</Label>
                    <Input
                      id="client_subscriber_name_primary"
                      name="client_subscriber_name_primary"
                      value={formData.client_subscriber_name_primary}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client_subscriber_relationship_primary">Relationship to Subscriber</Label>
                    <Select value={formData.client_subscriber_relationship_primary} onValueChange={(value) => handleSelectChange('client_subscriber_relationship_primary', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Self">Self</SelectItem>
                        <SelectItem value="Spouse">Spouse</SelectItem>
                        <SelectItem value="Child">Child</SelectItem>
                        <SelectItem value="Parent">Parent</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client_subscriber_dob_primary">Subscriber Date of Birth</Label>
                  <Input
                    id="client_subscriber_dob_primary"
                    name="client_subscriber_dob_primary"
                    type="date"
                    value={formData.client_subscriber_dob_primary}
                    onChange={handleInputChange}
                  />
                </div>
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
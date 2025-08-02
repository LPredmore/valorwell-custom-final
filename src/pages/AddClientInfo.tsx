import React, { useState } from 'react';
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

export const AddClientInfo: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      // Update the client record with additional information
      const { error } = await supabase
        .from('clients')
        .update({
          client_preferred_name: formData.client_preferred_name,
          client_middle_name: formData.client_middle_name,
          client_address: formData.client_address,
          city: formData.city,
          state: formData.state,
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
        title: "Profile Updated",
        description: "Your information has been saved successfully.",
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating client info:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save your information. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Complete Your Profile</h1>
          <p className="text-muted-foreground">Please provide additional information to complete your client profile.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="personal" className="w-full">
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
                  <CardDescription>Basic personal details and contact information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="client_preferred_name">Preferred Name</Label>
                      <Input
                        id="client_preferred_name"
                        name="client_preferred_name"
                        value={formData.client_preferred_name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="client_middle_name">Middle Name</Label>
                      <Input
                        id="client_middle_name"
                        name="client_middle_name"
                        value={formData.client_middle_name}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="client_address">Address</Label>
                    <Input
                      id="client_address"
                      name="client_address"
                      value={formData.client_address}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Select onValueChange={(value) => handleSelectChange('state', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AL">Alabama</SelectItem>
                          <SelectItem value="CA">California</SelectItem>
                          <SelectItem value="FL">Florida</SelectItem>
                          <SelectItem value="NY">New York</SelectItem>
                          <SelectItem value="TX">Texas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip_code">ZIP Code</Label>
                      <Input
                        id="zip_code"
                        name="zip_code"
                        value={formData.zip_code}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date_of_birth">Date of Birth</Label>
                      <Input
                        id="date_of_birth"
                        name="date_of_birth"
                        type="date"
                        value={formData.date_of_birth}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="client_gender">Gender</Label>
                      <Select onValueChange={(value) => handleSelectChange('client_gender', value)}>
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
                      <Select onValueChange={(value) => handleSelectChange('client_insurance_type_primary', value)}>
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
                      <Select onValueChange={(value) => handleSelectChange('client_subscriber_relationship_primary', value)}>
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
                      <Select onValueChange={(value) => handleSelectChange('client_planlength', value)}>
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
                      <Select onValueChange={(value) => handleSelectChange('client_treatmentfrequency', value)}>
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
          </Tabs>

          <div className="mt-6 flex justify-end">
            <Button 
              type="submit" 
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Complete Profile'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
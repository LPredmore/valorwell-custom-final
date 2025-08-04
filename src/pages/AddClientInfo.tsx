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
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAcceptedInsurance } from '@/hooks/useInsurance';
import { useClientInsurance, useCreateClientInsurance, useUpdateClientInsurance, ClientInsurance } from '@/hooks/useClientInsurance';
import { InsuranceFormSection } from '@/components/insurance/InsuranceFormSection';
import type { Database } from '@/integrations/supabase/types';

export const AddClientInfo: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [showSecondaryInsurance, setShowSecondaryInsurance] = useState(false);
  const [primaryInsuranceData, setPrimaryInsuranceData] = useState<Partial<ClientInsurance>>({});
  const [secondaryInsuranceData, setSecondaryInsuranceData] = useState<Partial<ClientInsurance>>({});
  const [selectedPrimaryInsuranceId, setSelectedPrimaryInsuranceId] = useState<string>('');
  const [selectedSecondaryInsuranceId, setSelectedSecondaryInsuranceId] = useState<string>('');
  
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
  
  // Fetch accepted insurance companies and client insurance data
  const { data: acceptedInsurance, isLoading: isLoadingInsurance } = useAcceptedInsurance();
  const { data: existingInsurance } = useClientInsurance(clientData?.id);
  const createInsurance = useCreateClientInsurance();
  const updateInsurance = useUpdateClientInsurance();
  
  const [formData, setFormData] = useState({
    // Names and basic info - using client_* columns
    client_first_name: '',
    client_last_name: '',
    client_email: user?.email || '',
    client_ssn: '',
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

  // Insurance-related state
  const [clientSSN, setClientSSN] = useState('');
  const [wantInsurance, setWantInsurance] = useState<boolean | null>(null);
  const [agreeOutOfPocket, setAgreeOutOfPocket] = useState(false);

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
      
      // Set SSN and insurance preference if they exist
      setClientSSN((clientData as any).client_ssn || '');
      if ((clientData as any).wants_insurance !== null && (clientData as any).wants_insurance !== undefined) {
        setWantInsurance((clientData as any).wants_insurance);
      }
      setAgreeOutOfPocket((clientData as any).agrees_out_of_pocket || false);
    }
  }, [clientData, user?.email]);

  // Auto-populate insurance data when existing insurance is loaded
  useEffect(() => {
    if (existingInsurance && existingInsurance.length > 0 && acceptedInsurance) {
      const primaryIns = existingInsurance.find(ins => ins.insurance_type === 'primary');
      const secondaryIns = existingInsurance.find(ins => ins.insurance_type === 'secondary');
      
      if (primaryIns) {
        setPrimaryInsuranceData(primaryIns);
        // Find the corresponding accepted insurance record
        const acceptedPrimary = acceptedInsurance.find(
          acc => acc.insurance_company_id === primaryIns.insurance_company_id
        );
        if (acceptedPrimary) {
          setSelectedPrimaryInsuranceId(acceptedPrimary.id);
        }
      }
      
      if (secondaryIns) {
        setSecondaryInsuranceData(secondaryIns);
        setShowSecondaryInsurance(true);
        // Find the corresponding accepted insurance record
        const acceptedSecondary = acceptedInsurance.find(
          acc => acc.insurance_company_id === secondaryIns.insurance_company_id
        );
        if (acceptedSecondary) {
          setSelectedSecondaryInsuranceId(acceptedSecondary.id);
        }
      }
    }
  }, [existingInsurance, acceptedInsurance]);

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

  const formatSSN = (value: string) => {
    // Remove all non-numeric characters
    const numericValue = value.replace(/\D/g, '');
    
    // Limit to 9 digits
    const limitedValue = numericValue.slice(0, 9);
    
    // Add dashes
    if (limitedValue.length >= 5) {
      return `${limitedValue.slice(0, 3)}-${limitedValue.slice(3, 5)}-${limitedValue.slice(5)}`;
    } else if (limitedValue.length >= 3) {
      return `${limitedValue.slice(0, 3)}-${limitedValue.slice(3)}`;
    }
    return limitedValue;
  };

  const handleSSNChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatSSN(e.target.value);
    setClientSSN(formatted);
  };

  const handlePrimaryInsuranceSelect = (insuranceId: string) => {
    const selectedInsurance = acceptedInsurance?.find(ins => ins.id === insuranceId);
    if (selectedInsurance) {
      setSelectedPrimaryInsuranceId(insuranceId);
      setPrimaryInsuranceData({
        insurance_company_id: selectedInsurance.insurance_company_id,
        insurance_type: 'primary',
        client_id: clientData?.id,
        plan_name: selectedInsurance.plan_name,
      });
    }
  };

  const handleSecondaryInsuranceSelect = (insuranceId: string) => {
    const selectedInsurance = acceptedInsurance?.find(ins => ins.id === insuranceId);
    if (selectedInsurance) {
      setSelectedSecondaryInsuranceId(insuranceId);
      setSecondaryInsuranceData({
        insurance_company_id: selectedInsurance.insurance_company_id,
        insurance_type: 'secondary',
        client_id: clientData?.id,
        plan_name: selectedInsurance.plan_name,
      });
    }
  };

  const handlePrimaryInsuranceFieldChange = (field: string, value: any) => {
    setPrimaryInsuranceData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSecondaryInsuranceFieldChange = (field: string, value: any) => {
    setSecondaryInsuranceData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async (tab: string) => {
    if (!user || !clientData) return;

    try {
      let updateData = {};

      if (tab === 'personal') {
        updateData = {
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
          client_ssn: clientSSN.replace(/\D/g, ''),
        };
      } else if (tab === 'insurance') {
        updateData = {
          client_ssn: clientSSN.replace(/\D/g, ''),
        };
        // Add insurance save logic here (to be implemented in next chunk)
      } else if (tab === 'final') {
        updateData = {
          client_referral_source: formData.client_referral_source,
          client_self_goal: formData.client_self_goal,
          client_planlength: formData.client_planlength,
          client_treatmentfrequency: formData.client_treatmentfrequency,
          client_problem: formData.client_problem,
          client_treatmentgoal: formData.client_treatmentgoal,
          client_primaryobjective: formData.client_primaryobjective,
          client_intervention1: formData.client_intervention1,
          client_secondaryobjective: formData.client_secondaryobjective,
          client_intervention2: formData.client_intervention2,
        };
      }

      const { error } = await supabase
        .from('clients')
        .update(updateData)
        .eq('profile_id', user.id);

      if (error) throw error;

      toast({
        title: "Saved",
        description: "Changes saved successfully.",
      });
    } catch (error) {
      console.error('Save error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save changes.",
      });
    }
  };

  const handleSaveInsurance = async () => {
    if (!clientData?.id || !user) return;

    // Validate SSN
    const ssnDigits = clientSSN.replace(/\D/g, '');
    if (ssnDigits.length !== 9) {
      toast({
        variant: "destructive",
        title: "Invalid SSN",
        description: "Please enter a valid 9-digit Social Security Number.",
      });
      return;
    }

    // Validate insurance preference selection
    if (wantInsurance === null) {
      toast({
        variant: "destructive",
        title: "Insurance Selection Required",
        description: "Please select whether you want to use insurance or not.",
      });
      return;
    }

    // If they want insurance, validate primary insurance is selected
    if (wantInsurance && !primaryInsuranceData.insurance_company_id) {
      toast({
        variant: "destructive",
        title: "Insurance Company Required",
        description: "Please select your primary insurance company.",
      });
      return;
    }

    // If they don't want insurance, validate they agreed to out-of-pocket
    if (!wantInsurance && !agreeOutOfPocket) {
      toast({
        variant: "destructive",
        title: "Agreement Required",
        description: "Please check the agreement box for out-of-pocket payment.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Save SSN to client record
      const { error: clientError } = await supabase
        .from('clients')
        .update({
          client_ssn: ssnDigits,
        })
        .eq('profile_id', user.id);

      if (clientError) throw clientError;

      // Only save insurance data if they want insurance
      if (wantInsurance) {
        // Save primary insurance
        if (primaryInsuranceData.insurance_company_id) {
          const primaryExists = existingInsurance?.find(ins => ins.insurance_type === 'primary');
          
          if (primaryExists) {
            await updateInsurance.mutateAsync({
              id: primaryExists.id,
              ...primaryInsuranceData,
            });
          } else {
            await createInsurance.mutateAsync({
              ...primaryInsuranceData,
              client_id: clientData.id,
              insurance_type: 'primary',
            });
          }
        }

        // Save secondary insurance if exists
        if (secondaryInsuranceData.insurance_company_id) {
          const secondaryExists = existingInsurance?.find(ins => ins.insurance_type === 'secondary');
          
          if (secondaryExists) {
            await updateInsurance.mutateAsync({
              id: secondaryExists.id,
              ...secondaryInsuranceData,
            });
          } else {
            await createInsurance.mutateAsync({
              ...secondaryInsuranceData,
              client_id: clientData.id,
              insurance_type: 'secondary',
            });
          }
        }
      }

      toast({
        title: "Information Saved",
        description: wantInsurance ? "Insurance information saved successfully." : "Out-of-pocket payment preference saved.",
      });

      // Move to Clinical tab
      setActiveTab('clinical');
    } catch (error) {
      console.error('Error saving insurance information:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save information. Please try again.",
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
          // Personal Information
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
          // Clinical Information
          client_referral_source: formData.client_referral_source,
          client_self_goal: formData.client_self_goal,
          client_planlength: formData.client_planlength,
          client_treatmentfrequency: formData.client_treatmentfrequency,
          client_problem: formData.client_problem,
          client_treatmentgoal: formData.client_treatmentgoal,
          client_primaryobjective: formData.client_primaryobjective,
          client_intervention1: formData.client_intervention1,
          client_secondaryobjective: formData.client_secondaryobjective,
          client_intervention2: formData.client_intervention2,
          // Status update
          client_status: 'New' as Database["public"]["Enums"]["client_status"]
        })
        .eq('profile_id', user.id);

      if (error) {
        throw error;
      }

      // Invalidate the client status cache to trigger re-fetch
      queryClient.invalidateQueries({ queryKey: ['client-status'] });
      queryClient.invalidateQueries({ queryKey: ['client-data'] });

      toast({
        title: "Profile Completed",
        description: "Your information has been saved successfully.",
      });
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

  // Get selected insurance objects for the form sections
  const selectedPrimaryInsurance = acceptedInsurance?.find(
    ins => ins.id === selectedPrimaryInsuranceId
  );
  const selectedSecondaryInsurance = acceptedInsurance?.find(
    ins => ins.id === selectedSecondaryInsuranceId
  );

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Complete Your Profile</h1>
          <p className="text-muted-foreground">Please provide additional information to complete your client profile.</p>
        </div>

        <Tabs value={activeTab} onValueChange={(newTab) => {
          handleSave(activeTab);
          setActiveTab(newTab);
        }} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="insurance">Insurance</TabsTrigger>
            <TabsTrigger value="final">Final</TabsTrigger>
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

                {/* Buttons */}
                <div className="flex justify-end pt-4">
                  <Button
                    type="button"
                    onClick={() => {
                      // TODO: Validation for required fields
                      handleSave('personal');
                      setActiveTab('insurance');
                    }}
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
                <CardDescription>Please provide your insurance and payment information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* SSN Field */}
                <div className="space-y-4">
                  <div className="border-l-4 border-primary pl-4">
                    <h3 className="font-semibold text-foreground">Social Security Number</h3>
                    <p className="text-sm text-muted-foreground">Required for billing and insurance purposes</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client_ssn">Social Security Number *</Label>
                    <Input
                      id="client_ssn"
                      type="text"
                      value={clientSSN}
                      onChange={handleSSNChange}
                      placeholder="XXX-XX-XXXX"
                      maxLength={11}
                      required
                    />
                  </div>
                </div>

                {/* Insurance Preference */}
                <div className="space-y-4">
                  <div className="border-l-4 border-primary pl-4">
                    <h3 className="font-semibold text-foreground">Payment Method</h3>
                    <p className="text-sm text-muted-foreground">Choose how you would like to pay for your sessions</p>
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-base">I want to use insurance *</Label>
                    <div className="flex gap-6">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="insurance-yes"
                          name="insurance-preference"
                          checked={wantInsurance === true}
                          onChange={() => setWantInsurance(true)}
                          className="h-4 w-4"
                        />
                        <Label htmlFor="insurance-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="insurance-no"
                          name="insurance-preference"
                          checked={wantInsurance === false}
                          onChange={() => setWantInsurance(false)}
                          className="h-4 w-4"
                        />
                        <Label htmlFor="insurance-no">No</Label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Insurance Sections - Only show if user wants insurance */}
                {wantInsurance === true && (
                  <>
                    {/* Primary Insurance Section */}
                    <InsuranceFormSection
                      insuranceType="primary"
                      selectedInsurance={selectedPrimaryInsurance}
                      insuranceData={primaryInsuranceData}
                      onInsuranceSelect={handlePrimaryInsuranceSelect}
                      onFieldChange={handlePrimaryInsuranceFieldChange}
                    />

                    {/* Add Secondary Insurance Button */}
                    {!showSecondaryInsurance && (
                      <div className="flex justify-center pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowSecondaryInsurance(true)}
                          className="flex items-center gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Add Secondary/Supplemental Insurance
                        </Button>
                      </div>
                    )}

                    {/* Secondary Insurance Section */}
                    {showSecondaryInsurance && (
                      <div className="border-t pt-8">
                        <InsuranceFormSection
                          insuranceType="secondary"
                          selectedInsurance={selectedSecondaryInsurance}
                          insuranceData={secondaryInsuranceData}
                          onInsuranceSelect={handleSecondaryInsuranceSelect}
                          onFieldChange={handleSecondaryInsuranceFieldChange}
                        />
                      </div>
                    )}
                  </>
                )}

                {/* Out-of-Pocket Section - Only show if user doesn't want insurance */}
                {wantInsurance === false && (
                  <div className="space-y-4">
                    <div className="border border-amber-200 bg-amber-50 p-4 rounded-md">
                      <p className="text-sm text-amber-800 mb-4">
                        I understand that this means that my sessions will be paid out of pocket and will be due immediately after each session.
                      </p>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="agree-out-of-pocket"
                          checked={agreeOutOfPocket}
                          onCheckedChange={(checked) => setAgreeOutOfPocket(checked === true)}
                        />
                        <Label htmlFor="agree-out-of-pocket" className="text-sm">
                          I agree *
                        </Label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab('personal')}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      // TODO: Validation
                      handleSave('insurance');
                      setActiveTab('final');
                    }}
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

          <TabsContent value="clinical">
            <Card>
              <CardHeader>
                <CardTitle>Final Information</CardTitle>
                <CardDescription>Complete your profile with clinical information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Clinical Information Section */}
                <div className="space-y-4">
                  <div className="border-l-4 border-primary pl-4">
                    <h3 className="font-semibold text-foreground">Clinical Information</h3>
                    <p className="text-sm text-muted-foreground">Background and referral information</p>
                  </div>
                  
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
                </div>

                {/* Buttons */}
                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab('insurance')}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      // TODO: Validation
                      handleCompleteProfile();
                    }}
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Completing...
                      </>
                    ) : (
                      'Complete Profile'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
};
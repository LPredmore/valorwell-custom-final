import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Plus, Trash2, Edit3, Save, X, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  useAcceptedInsurance, 
  useCreateAcceptedInsurance, 
  useUpdateAcceptedInsurance, 
  useDeleteAcceptedInsurance,
  AcceptedInsurance 
} from '@/hooks/useInsurance';
import { InsuranceCompanyCombobox } from './InsuranceCompanyCombobox';

export const InsuranceManagement = () => {
  const { data: acceptedInsurance = [], isLoading } = useAcceptedInsurance();
  const createInsurance = useCreateAcceptedInsurance();
  const updateInsurance = useUpdateAcceptedInsurance();
  const deleteInsurance = useDeleteAcceptedInsurance();
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    insurance_company_id: '',
    plan_name: '',
    payer_id: '',
    electronic_claims_supported: false,
    prior_authorization_required: false,
    is_active: true,
    // Boolean requirement fields
    requires_insurance_plan_type: false,
    requires_insured_id_number: false,
    requires_insured_name: false,
    requires_patient_relationship_to_insured: false,
    requires_insured_address: false,
    requires_insured_date_of_birth: false,
    requires_insured_sex: false,
    requires_insured_employer_school_name: false,
    requires_insurance_plan_program_name: false,
    requires_other_insured_name: false,
    requires_other_insured_policy_group_number: false,
    requires_other_insured_date_of_birth: false,
    requires_other_insured_sex: false,
    requires_other_insured_employer_school_name: false,
    requires_other_insured_plan_program_name: false,
    requires_patient_condition_employment: false,
    requires_patient_condition_auto_accident: false,
    requires_patient_condition_other_accident: false,
    requires_health_benefit_plan_indicator: false,
    requires_signature_on_file: false,
    requires_insured_authorization_payment: false,
    requires_group_number: false,
    requires_phone_number: false,
    requires_website: false,
    requires_claims_address_line1: false,
    requires_claims_address_line2: false,
    requires_claims_city: false,
    requires_claims_state: false,
    requires_claims_zip: false,
    requires_copay_amount: false,
    requires_notes: false,
  });

  const resetForm = () => {
    setFormData({
      insurance_company_id: '',
      plan_name: '',
      payer_id: '',
      electronic_claims_supported: false,
      prior_authorization_required: false,
      is_active: true,
      requires_insurance_plan_type: false,
      requires_insured_id_number: false,
      requires_insured_name: false,
      requires_patient_relationship_to_insured: false,
      requires_insured_address: false,
      requires_insured_date_of_birth: false,
      requires_insured_sex: false,
      requires_insured_employer_school_name: false,
      requires_insurance_plan_program_name: false,
      requires_other_insured_name: false,
      requires_other_insured_policy_group_number: false,
      requires_other_insured_date_of_birth: false,
      requires_other_insured_sex: false,
      requires_other_insured_employer_school_name: false,
      requires_other_insured_plan_program_name: false,
      requires_patient_condition_employment: false,
      requires_patient_condition_auto_accident: false,
      requires_patient_condition_other_accident: false,
      requires_health_benefit_plan_indicator: false,
      requires_signature_on_file: false,
      requires_insured_authorization_payment: false,
      requires_group_number: false,
      requires_phone_number: false,
      requires_website: false,
      requires_claims_address_line1: false,
      requires_claims_address_line2: false,
      requires_claims_city: false,
      requires_claims_state: false,
      requires_claims_zip: false,
      requires_copay_amount: false,
      requires_notes: false,
    });
  };

  const handleSubmit = async () => {
    if (!formData.insurance_company_id || !formData.plan_name) {
      toast({
        title: "Missing required fields",
        description: "Please fill in insurance company and plan name.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingId) {
        await updateInsurance.mutateAsync({ id: editingId, updates: formData });
        toast({
          title: "Insurance updated",
          description: "Insurance plan has been updated successfully.",
        });
        setEditingId(null);
      } else {
        await createInsurance.mutateAsync(formData);
        toast({
          title: "Insurance added",
          description: "New insurance plan has been added successfully.",
        });
        setIsAddDialogOpen(false);
      }
      
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save insurance plan. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (insurance: AcceptedInsurance) => {
    setFormData({
      insurance_company_id: insurance.insurance_company_id,
      plan_name: insurance.plan_name,
      payer_id: insurance.payer_id || '',
      electronic_claims_supported: insurance.electronic_claims_supported,
      prior_authorization_required: insurance.prior_authorization_required,
      is_active: insurance.is_active,
      requires_insurance_plan_type: insurance.requires_insurance_plan_type,
      requires_insured_id_number: insurance.requires_insured_id_number,
      requires_insured_name: insurance.requires_insured_name,
      requires_patient_relationship_to_insured: insurance.requires_patient_relationship_to_insured,
      requires_insured_address: insurance.requires_insured_address,
      requires_insured_date_of_birth: insurance.requires_insured_date_of_birth,
      requires_insured_sex: insurance.requires_insured_sex,
      requires_insured_employer_school_name: insurance.requires_insured_employer_school_name,
      requires_insurance_plan_program_name: insurance.requires_insurance_plan_program_name,
      requires_other_insured_name: insurance.requires_other_insured_name,
      requires_other_insured_policy_group_number: insurance.requires_other_insured_policy_group_number,
      requires_other_insured_date_of_birth: insurance.requires_other_insured_date_of_birth,
      requires_other_insured_sex: insurance.requires_other_insured_sex,
      requires_other_insured_employer_school_name: insurance.requires_other_insured_employer_school_name,
      requires_other_insured_plan_program_name: insurance.requires_other_insured_plan_program_name,
      requires_patient_condition_employment: insurance.requires_patient_condition_employment,
      requires_patient_condition_auto_accident: insurance.requires_patient_condition_auto_accident,
      requires_patient_condition_other_accident: insurance.requires_patient_condition_other_accident,
      requires_health_benefit_plan_indicator: insurance.requires_health_benefit_plan_indicator,
      requires_signature_on_file: insurance.requires_signature_on_file,
      requires_insured_authorization_payment: insurance.requires_insured_authorization_payment,
      requires_group_number: insurance.requires_group_number,
      requires_phone_number: insurance.requires_phone_number,
      requires_website: insurance.requires_website,
      requires_claims_address_line1: insurance.requires_claims_address_line1,
      requires_claims_address_line2: insurance.requires_claims_address_line2,
      requires_claims_city: insurance.requires_claims_city,
      requires_claims_state: insurance.requires_claims_state,
      requires_claims_zip: insurance.requires_claims_zip,
      requires_copay_amount: insurance.requires_copay_amount,
      requires_notes: insurance.requires_notes,
    });
    setEditingId(insurance.id);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this insurance plan?')) {
      try {
        await deleteInsurance.mutateAsync(id);
        toast({
          title: "Insurance deleted",
          description: "Insurance plan has been deleted successfully.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete insurance plan. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleToggle = async (id: string, field: keyof AcceptedInsurance, currentValue: boolean) => {
    try {
      await updateInsurance.mutateAsync({
        id,
        updates: { [field]: !currentValue }
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update insurance plan. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getRequiredFieldsCount = (insurance: AcceptedInsurance) => {
    return Object.keys(insurance).filter(key => 
      key.startsWith('requires_') && insurance[key as keyof AcceptedInsurance]
    ).length;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading insurance information...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="flex flex-row items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center space-x-2">
              <ChevronRight className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
              <div>
                <CardTitle>Insurance</CardTitle>
                <CardDescription>
                  Configure data collection requirements for each insurance plan.
                </CardDescription>
              </div>
            </div>
            <Button 
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setIsAddDialogOpen(true);
              }}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Insurance
            </Button>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Active</TableHead>
                  <TableHead>Insurance Company</TableHead>
                  <TableHead>Plan Name</TableHead>
                  <TableHead>Payer ID</TableHead>
                  <TableHead className="w-20">Electronic Claims</TableHead>
                  <TableHead className="w-20">Prior Auth</TableHead>
                  <TableHead>Required Fields</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {acceptedInsurance.map((insurance) => (
                  <TableRow key={insurance.id}>
                    <TableCell>
                      <button
                        onClick={() => handleToggle(insurance.id, 'is_active', insurance.is_active)}
                        className="flex items-center justify-center w-6 h-6 rounded"
                      >
                        {insurance.is_active ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                      </button>
                    </TableCell>
                    <TableCell>{insurance.insurance_companies?.name || 'Unknown'}</TableCell>
                    <TableCell>{insurance.plan_name}</TableCell>
                    <TableCell>{insurance.payer_id || '-'}</TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleToggle(insurance.id, 'electronic_claims_supported', insurance.electronic_claims_supported)}
                        className="flex items-center justify-center w-6 h-6 rounded"
                      >
                        {insurance.electronic_claims_supported ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                      </button>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleToggle(insurance.id, 'prior_authorization_required', insurance.prior_authorization_required)}
                        className="flex items-center justify-center w-6 h-6 rounded"
                      >
                        {insurance.prior_authorization_required ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                      </button>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {getRequiredFieldsCount(insurance)} fields required
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(insurance)}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(insurance.id)}
                          disabled={deleteInsurance.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </CollapsibleContent>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
        setIsAddDialogOpen(open);
        if (!open) {
          resetForm();
          setEditingId(null);
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit' : 'Add'} Insurance Plan</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="insurance-company">Insurance Company *</Label>
                <InsuranceCompanyCombobox
                  value={formData.insurance_company_id}
                  onValueChange={(value) => setFormData({ ...formData, insurance_company_id: value })}
                  placeholder="Select insurance company..."
                />
              </div>
              <div>
                <Label htmlFor="plan-name">Plan Name *</Label>
                <Input
                  id="plan-name"
                  value={formData.plan_name}
                  onChange={(e) => setFormData({ ...formData, plan_name: e.target.value })}
                  placeholder="e.g., PPO, HMO, Medicare Advantage"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="payer-id">Payer ID</Label>
              <Input
                id="payer-id"
                value={formData.payer_id}
                onChange={(e) => setFormData({ ...formData, payer_id: e.target.value })}
                placeholder="Billing payer ID"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="electronic-claims"
                  checked={formData.electronic_claims_supported}
                  onCheckedChange={(checked) => setFormData({ ...formData, electronic_claims_supported: checked })}
                />
                <Label htmlFor="electronic-claims">Electronic Claims Supported</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="prior-auth"
                  checked={formData.prior_authorization_required}
                  onCheckedChange={(checked) => setFormData({ ...formData, prior_authorization_required: checked })}
                />
                <Label htmlFor="prior-auth">Prior Authorization Required</Label>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Required Information Fields</h3>
              <p className="text-sm text-muted-foreground">
                Select which information fields are required to be collected for this insurance plan.
              </p>
              
              {/* Primary Insured Information */}
              <div className="space-y-3">
                <h4 className="font-medium">Primary Insured Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { key: 'requires_insurance_plan_type', label: 'Insurance Plan Type' },
                    { key: 'requires_insured_id_number', label: 'Insured ID Number' },
                    { key: 'requires_insured_name', label: 'Insured Name' },
                    { key: 'requires_patient_relationship_to_insured', label: 'Patient Relationship to Insured' },
                    { key: 'requires_insured_address', label: 'Insured Address' },
                    { key: 'requires_insured_date_of_birth', label: 'Insured Date of Birth' },
                    { key: 'requires_insured_sex', label: 'Insured Sex' },
                    { key: 'requires_insured_employer_school_name', label: 'Insured Employer/School Name' },
                    { key: 'requires_insurance_plan_program_name', label: 'Insurance Plan/Program Name' },
                    { key: 'requires_group_number', label: 'Group Number' },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Switch
                        id={key}
                        checked={formData[key as keyof typeof formData] as boolean}
                        onCheckedChange={(checked) => setFormData({ ...formData, [key]: checked })}
                      />
                      <Label htmlFor={key} className="text-sm">{label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Other Insured Information */}
              <div className="space-y-3">
                <h4 className="font-medium">Other Insured Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { key: 'requires_other_insured_name', label: 'Other Insured Name' },
                    { key: 'requires_other_insured_policy_group_number', label: 'Other Insured Policy/Group Number' },
                    { key: 'requires_other_insured_date_of_birth', label: 'Other Insured Date of Birth' },
                    { key: 'requires_other_insured_sex', label: 'Other Insured Sex' },
                    { key: 'requires_other_insured_employer_school_name', label: 'Other Insured Employer/School Name' },
                    { key: 'requires_other_insured_plan_program_name', label: 'Other Insured Plan/Program Name' },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Switch
                        id={key}
                        checked={formData[key as keyof typeof formData] as boolean}
                        onCheckedChange={(checked) => setFormData({ ...formData, [key]: checked })}
                      />
                      <Label htmlFor={key} className="text-sm">{label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Patient Conditions */}
              <div className="space-y-3">
                <h4 className="font-medium">Patient Conditions</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { key: 'requires_patient_condition_employment', label: 'Condition Related to Employment' },
                    { key: 'requires_patient_condition_auto_accident', label: 'Condition Related to Auto Accident' },
                    { key: 'requires_patient_condition_other_accident', label: 'Condition Related to Other Accident' },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Switch
                        id={key}
                        checked={formData[key as keyof typeof formData] as boolean}
                        onCheckedChange={(checked) => setFormData({ ...formData, [key]: checked })}
                      />
                      <Label htmlFor={key} className="text-sm">{label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Authorizations and Additional Info */}
              <div className="space-y-3">
                <h4 className="font-medium">Authorizations & Additional Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { key: 'requires_health_benefit_plan_indicator', label: 'Health Benefit Plan Indicator' },
                    { key: 'requires_signature_on_file', label: 'Signature on File for Release' },
                    { key: 'requires_insured_authorization_payment', label: 'Insured Authorization of Payment' },
                    { key: 'requires_phone_number', label: 'Phone Number' },
                    { key: 'requires_website', label: 'Website' },
                    { key: 'requires_claims_address_line1', label: 'Claims Address Line 1' },
                    { key: 'requires_claims_address_line2', label: 'Claims Address Line 2' },
                    { key: 'requires_claims_city', label: 'Claims City' },
                    { key: 'requires_claims_state', label: 'Claims State' },
                    { key: 'requires_claims_zip', label: 'Claims ZIP' },
                    { key: 'requires_copay_amount', label: 'Copay Amount' },
                    { key: 'requires_notes', label: 'Notes' },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Switch
                        id={key}
                        checked={formData[key as keyof typeof formData] as boolean}
                        onCheckedChange={(checked) => setFormData({ ...formData, [key]: checked })}
                      />
                      <Label htmlFor={key} className="text-sm">{label}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is-active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is-active">Active</Label>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={createInsurance.isPending || updateInsurance.isPending || !formData.insurance_company_id || !formData.plan_name}
              >
                {editingId ? (updateInsurance.isPending ? "Updating..." : "Update Insurance") : (createInsurance.isPending ? "Adding..." : "Add Insurance")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Collapsible>
  );
};

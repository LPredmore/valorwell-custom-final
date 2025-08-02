import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
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
  AcceptedInsurance,
  useInsuranceCompanies 
} from '@/hooks/useInsurance';
import { InsuranceCompanyCombobox } from './InsuranceCompanyCombobox';

export const InsuranceManagement = () => {
  const { data: acceptedInsurance = [], isLoading } = useAcceptedInsurance();
  const { data: insuranceCompanies = [] } = useInsuranceCompanies();
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
    group_number: '',
    phone_number: '',
    website: '',
    claims_address_line1: '',
    claims_address_line2: '',
    claims_city: '',
    claims_state: '',
    claims_zip: '',
    electronic_claims_supported: false,
    prior_authorization_required: false,
    copay_amount: '',
    notes: '',
    is_active: true,
  });

  const handleInsuranceCompanyChange = (value: string) => {
    const selectedCompany = insuranceCompanies.find(company => company.id === value);
    setFormData({ 
      ...formData, 
      insurance_company_id: value,
      payer_id: selectedCompany?.payer_id || ''
    });
  };

  const resetForm = () => {
    setFormData({
      insurance_company_id: '',
      plan_name: '',
      payer_id: '',
      group_number: '',
      phone_number: '',
      website: '',
      claims_address_line1: '',
      claims_address_line2: '',
      claims_city: '',
      claims_state: '',
      claims_zip: '',
      electronic_claims_supported: false,
      prior_authorization_required: false,
      copay_amount: '',
      notes: '',
      is_active: true,
    });
  };

  const handleSubmit = async () => {
    if (!formData.insurance_company_id) {
      toast({
        title: "Missing required fields",
        description: "Please select an insurance company.",
        variant: "destructive",
      });
      return;
    }

    try {
      const selectedCompany = insuranceCompanies.find(company => company.id === formData.insurance_company_id);
      if (!selectedCompany) {
        toast({
          title: "Error",
          description: "Selected insurance company not found.",
          variant: "destructive",
        });
        return;
      }
      
      const insuranceData = {
        insurance_company_id: formData.insurance_company_id,
        plan_name: selectedCompany.name, // Use the company name as the plan name
        payer_id: formData.payer_id || selectedCompany.payer_id,
        group_number: null,
        phone_number: null,
        website: null,
        claims_address_line1: null,
        claims_address_line2: null,
        claims_city: null,
        claims_state: null,
        claims_zip: null,
        electronic_claims_supported: false,
        prior_authorization_required: false,
        copay_amount: null,
        notes: null,
        is_active: true,
      };

      if (editingId) {
        await updateInsurance.mutateAsync({ id: editingId, updates: insuranceData });
        toast({
          title: "Insurance updated",
          description: "Insurance plan has been updated successfully.",
        });
        setEditingId(null);
      } else {
        await createInsurance.mutateAsync(insuranceData);
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
      group_number: insurance.group_number || '',
      phone_number: insurance.phone_number || '',
      website: insurance.website || '',
      claims_address_line1: insurance.claims_address_line1 || '',
      claims_address_line2: insurance.claims_address_line2 || '',
      claims_city: insurance.claims_city || '',
      claims_state: insurance.claims_state || '',
      claims_zip: insurance.claims_zip || '',
      electronic_claims_supported: insurance.electronic_claims_supported,
      prior_authorization_required: insurance.prior_authorization_required,
      copay_amount: insurance.copay_amount?.toString() || '',
      notes: insurance.notes || '',
      is_active: insurance.is_active,
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

  const handleToggle = async (id: string, field: 'is_active' | 'electronic_claims_supported' | 'prior_authorization_required', currentValue: boolean) => {
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
                  Manage insurance plans accepted by your practice.
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
                  <TableHead>Phone</TableHead>
                  <TableHead className="w-20">Electronic Claims</TableHead>
                  <TableHead className="w-20">Prior Auth</TableHead>
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
                    <TableCell>
                      {editingId === insurance.id ? (
                         <InsuranceCompanyCombobox
                           value={formData.insurance_company_id}
                           onValueChange={handleInsuranceCompanyChange}
                         />
                      ) : (
                        insurance.insurance_companies?.name || 'Unknown'
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === insurance.id ? (
                        <Input
                          value={formData.plan_name}
                          onChange={(e) => setFormData({ ...formData, plan_name: e.target.value })}
                          className="w-full"
                        />
                      ) : (
                        insurance.plan_name
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === insurance.id ? (
                        <Input
                          value={formData.payer_id}
                          onChange={(e) => setFormData({ ...formData, payer_id: e.target.value })}
                          className="w-full"
                        />
                      ) : (
                        insurance.payer_id || '-'
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === insurance.id ? (
                        <Input
                          value={formData.phone_number}
                          onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                          className="w-full"
                        />
                      ) : (
                        insurance.phone_number || '-'
                      )}
                    </TableCell>
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
                      <div className="flex space-x-1">
                        {editingId === insurance.id ? (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleSubmit}
                              disabled={updateInsurance.isPending}
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingId(null);
                                resetForm();
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
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
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </CollapsibleContent>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Insurance Plan</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="insurance-company">Insurance Company *</Label>
              <InsuranceCompanyCombobox
                value={formData.insurance_company_id}
                onValueChange={handleInsuranceCompanyChange}
                placeholder="Select insurance company..."
              />
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

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={createInsurance.isPending || !formData.insurance_company_id}
              >
                {createInsurance.isPending ? "Adding..." : "Add Insurance"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Collapsible>
  );
};
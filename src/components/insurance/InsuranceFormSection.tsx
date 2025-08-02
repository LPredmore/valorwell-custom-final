import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { AcceptedInsuranceCombobox } from './AcceptedInsuranceCombobox';
import type { AcceptedInsurance } from '@/hooks/useInsurance';
import type { ClientInsurance } from '@/hooks/useClientInsurance';

interface InsuranceFormSectionProps {
  insuranceType: 'primary' | 'secondary';
  selectedInsurance?: AcceptedInsurance;
  insuranceData: Partial<ClientInsurance>;
  onInsuranceSelect: (insuranceId: string) => void;
  onFieldChange: (field: string, value: any) => void;
}

export const InsuranceFormSection: React.FC<InsuranceFormSectionProps> = ({
  insuranceType,
  selectedInsurance,
  insuranceData,
  onInsuranceSelect,
  onFieldChange,
}) => {
  const getFieldLabel = (fieldName: string): string => {
    const labelMap: { [key: string]: string } = {
      member_id: 'Member ID / Policy Number',
      group_number: 'Group Number',
      subscriber_name: 'Primary Insured Name',
      subscriber_relationship: 'Relationship to Insured',
      subscriber_date_of_birth: 'Primary Insured Date of Birth',
      subscriber_address_line1: 'Primary Insured Address',
      subscriber_address_line2: 'Address Line 2',
      subscriber_city: 'City',
      subscriber_state: 'State',
      subscriber_zip: 'ZIP Code',
      phone_number: 'Insurance Phone Number',
      copay_amount: 'Copay Amount',
      plan_name: 'Plan Name',
      plan_type: 'Plan Type',
      website: 'Insurance Website',
      claims_address_line1: 'Claims Mailing Address',
      claims_address_line2: 'Claims Address Line 2',
      claims_city: 'Claims City',
      claims_state: 'Claims State',
      claims_zip: 'Claims ZIP Code',
      health_benefit_plan_indicator: 'Health Benefit Plan',
      insurance_plan_program_name: 'Insurance Plan Program Name',
      insured_employer_school_name: 'Employer/School Name',
      insured_sex: 'Insured Gender',
      other_insured_name: 'Other Insured Name',
      other_insured_date_of_birth: 'Other Insured Date of Birth',
      other_insured_sex: 'Other Insured Gender',
      other_insured_employer_school_name: 'Other Insured Employer/School',
      other_insured_plan_program_name: 'Other Insured Plan Name',
      other_insured_policy_group_number: 'Other Insured Policy/Group Number',
      notes: 'Additional Notes',
    };
    return labelMap[fieldName] || fieldName;
  };

  const renderField = (fieldName: string, isRequired: boolean = false, shouldShow: boolean = true) => {
    if (!shouldShow) return null;
    
    const label = getFieldLabel(fieldName);
    const value = insuranceData[fieldName as keyof ClientInsurance] || '';

    if (fieldName.includes('date_of_birth')) {
      return (
        <div className="space-y-2">
          <Label htmlFor={fieldName}>
            {label} {isRequired && '*'}
          </Label>
          <Input
            id={fieldName}
            type="date"
            value={value as string}
            onChange={(e) => onFieldChange(fieldName, e.target.value)}
            required={isRequired}
          />
        </div>
      );
    }

    if (fieldName === 'subscriber_relationship') {
      return (
        <div className="space-y-2">
          <Label htmlFor={fieldName}>
            {label} {isRequired && '*'}
          </Label>
          <Select value={value as string} onValueChange={(val) => onFieldChange(fieldName, val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select relationship" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Self">Self</SelectItem>
              <SelectItem value="Spouse">Spouse</SelectItem>
              <SelectItem value="Child">Child</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      );
    }

    if (fieldName.includes('sex') || fieldName === 'insured_sex' || fieldName === 'other_insured_sex') {
      return (
        <div className="space-y-2">
          <Label htmlFor={fieldName}>
            {label} {isRequired && '*'}
          </Label>
          <Select value={value as string} onValueChange={(val) => onFieldChange(fieldName, val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="M">Male</SelectItem>
              <SelectItem value="F">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
      );
    }

    if (fieldName === 'subscriber_state' || fieldName === 'claims_state') {
      const states = [
        'Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California',
        'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Florida',
        'Georgia', 'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
        'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts',
        'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska',
        'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
        'North Carolina', 'North Dakota', 'Northern Mariana Islands', 'Ohio',
        'Oklahoma', 'Oregon', 'Pennsylvania', 'Puerto Rico', 'Rhode Island',
        'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
        'Virgin Islands', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin',
        'Wyoming'
      ];

      return (
        <div className="space-y-2">
          <Label htmlFor={fieldName}>
            {label} {isRequired && '*'}
          </Label>
          <Select value={value as string} onValueChange={(val) => onFieldChange(fieldName, val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {states.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }

    if (fieldName === 'copay_amount') {
      return (
        <div className="space-y-2">
          <Label htmlFor={fieldName}>
            {label} {isRequired && '*'}
          </Label>
          <Input
            id={fieldName}
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={value as string}
            onChange={(e) => onFieldChange(fieldName, e.target.value)}
            required={isRequired}
          />
        </div>
      );
    }

    if (fieldName === 'notes') {
      return (
        <div className="space-y-2">
          <Label htmlFor={fieldName}>
            {label} {isRequired && '*'}
          </Label>
          <Textarea
            id={fieldName}
            value={value as string}
            onChange={(e) => onFieldChange(fieldName, e.target.value)}
            required={isRequired}
            rows={3}
          />
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <Label htmlFor={fieldName}>
          {label} {isRequired && '*'}
        </Label>
        <Input
          id={fieldName}
          value={value as string}
          onChange={(e) => onFieldChange(fieldName, e.target.value)}
          required={isRequired}
        />
      </div>
    );
  };

  const renderCheckboxField = (fieldName: string, label: string, shouldShow: boolean = true) => {
    if (!shouldShow) return null;
    
    const value = insuranceData[fieldName as keyof ClientInsurance] as boolean;
    
    return (
      <div className="flex items-center space-x-2">
        <Checkbox
          id={fieldName}
          checked={value || false}
          onCheckedChange={(checked) => onFieldChange(fieldName, checked)}
        />
        <Label htmlFor={fieldName} className="text-sm">
          {label}
        </Label>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="border-l-4 border-primary pl-4">
        <h3 className="font-semibold text-foreground">
          {insuranceType === 'primary' ? 'Primary Insurance' : 'Secondary/Supplemental Insurance'}
        </h3>
        {insuranceType === 'primary' && (
          <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
            <p className="text-sm text-amber-800">
              <strong>Please input your primary insurance first.</strong> Please remember that you must include all insurances that you have. Even if you have a primary insurance that will not cover our services, you still must enter it or we can't bill to the secondary.
            </p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Insurance Company *</Label>
          <AcceptedInsuranceCombobox
            value={selectedInsurance?.id || ''}
            onValueChange={onInsuranceSelect}
            placeholder="Select your insurance company"
          />
        </div>

        {selectedInsurance && (
          <>
            {/* Member ID / Policy Number - only show when required */}
            {renderField('member_id', selectedInsurance.insurance_companies?.requires_insured_id_number, selectedInsurance.insurance_companies?.requires_insured_id_number)}

            {/* Group Number */}
            {renderField('group_number', selectedInsurance.insurance_companies?.requires_group_number, selectedInsurance.insurance_companies?.requires_group_number)}

            {/* Insured Name and Relationship */}
            {selectedInsurance.insurance_companies?.requires_insured_name && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderField('subscriber_name', true, true)}
                {renderField('subscriber_relationship', selectedInsurance.insurance_companies?.requires_patient_relationship_to_insured, selectedInsurance.insurance_companies?.requires_patient_relationship_to_insured)}
              </div>
            )}

            {/* Insured Date of Birth */}
            {renderField('subscriber_date_of_birth', selectedInsurance.insurance_companies?.requires_insured_date_of_birth, selectedInsurance.insurance_companies?.requires_insured_date_of_birth)}

            {/* Insured Sex */}
            {renderField('insured_sex', selectedInsurance.insurance_companies?.requires_insured_sex, selectedInsurance.insurance_companies?.requires_insured_sex)}

            {/* Insured Address */}
            {selectedInsurance.insurance_companies?.requires_insured_address && (
              <div className="space-y-4">
                {renderField('subscriber_address_line1', true, true)}
                {renderField('subscriber_address_line2', false, true)}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {renderField('subscriber_city', true, true)}
                  {renderField('subscriber_state', true, true)}
                  {renderField('subscriber_zip', true, true)}
                </div>
              </div>
            )}

            {/* Copay Amount */}
            {renderField('copay_amount', selectedInsurance.insurance_companies?.requires_copay_amount, selectedInsurance.insurance_companies?.requires_copay_amount)}

            {/* Plan Information */}
            {renderField('insurance_plan_program_name', selectedInsurance.insurance_companies?.requires_insurance_plan_program_name, selectedInsurance.insurance_companies?.requires_insurance_plan_program_name)}

            {/* Employer/School Name */}
            {renderField('insured_employer_school_name', selectedInsurance.insurance_companies?.requires_insured_employer_school_name, selectedInsurance.insurance_companies?.requires_insured_employer_school_name)}

            {/* Other insured fields */}
            {(selectedInsurance.insurance_companies?.requires_other_insured_name ||
              selectedInsurance.insurance_companies?.requires_other_insured_date_of_birth ||
              selectedInsurance.insurance_companies?.requires_other_insured_sex ||
              selectedInsurance.insurance_companies?.requires_other_insured_employer_school_name ||
              selectedInsurance.insurance_companies?.requires_other_insured_plan_program_name ||
              selectedInsurance.insurance_companies?.requires_other_insured_policy_group_number) && (
              <div className="space-y-4">
                <h4 className="font-medium text-foreground">Other Insured Information</h4>
                {renderField('other_insured_name', selectedInsurance.insurance_companies?.requires_other_insured_name, selectedInsurance.insurance_companies?.requires_other_insured_name)}
                {renderField('other_insured_date_of_birth', selectedInsurance.insurance_companies?.requires_other_insured_date_of_birth, selectedInsurance.insurance_companies?.requires_other_insured_date_of_birth)}
                {renderField('other_insured_sex', selectedInsurance.insurance_companies?.requires_other_insured_sex, selectedInsurance.insurance_companies?.requires_other_insured_sex)}
                {renderField('other_insured_employer_school_name', selectedInsurance.insurance_companies?.requires_other_insured_employer_school_name, selectedInsurance.insurance_companies?.requires_other_insured_employer_school_name)}
                {renderField('other_insured_plan_program_name', selectedInsurance.insurance_companies?.requires_other_insured_plan_program_name, selectedInsurance.insurance_companies?.requires_other_insured_plan_program_name)}
                {renderField('other_insured_policy_group_number', selectedInsurance.insurance_companies?.requires_other_insured_policy_group_number, selectedInsurance.insurance_companies?.requires_other_insured_policy_group_number)}
              </div>
            )}

            {/* Checkboxes for conditions and authorizations */}
            <div className="space-y-3">
              {renderCheckboxField('signature_on_file', 'Signature on file for insurance billing', selectedInsurance.insurance_companies?.requires_signature_on_file)}
              
              {renderCheckboxField('authorization_payment', 'Authorization for payment of benefits', selectedInsurance.insurance_companies?.requires_insured_authorization_payment)}

              {renderCheckboxField('condition_employment', 'Condition related to employment', selectedInsurance.insurance_companies?.requires_patient_condition_employment)}

              {renderCheckboxField('condition_auto_accident', 'Condition related to auto accident', selectedInsurance.insurance_companies?.requires_patient_condition_auto_accident)}

              {renderCheckboxField('condition_other_accident', 'Condition related to other accident', selectedInsurance.insurance_companies?.requires_patient_condition_other_accident)}
            </div>

            {/* Health Benefit Plan Indicator */}
            {renderField('health_benefit_plan_indicator', selectedInsurance.insurance_companies?.requires_health_benefit_plan_indicator, selectedInsurance.insurance_companies?.requires_health_benefit_plan_indicator)}

            {/* Website */}
            {renderField('website', selectedInsurance.insurance_companies?.requires_website, selectedInsurance.insurance_companies?.requires_website)}

            {/* Notes */}
            {renderField('notes', selectedInsurance.insurance_companies?.requires_notes, selectedInsurance.insurance_companies?.requires_notes)}
          </>
        )}
      </div>
    </div>
  );
};

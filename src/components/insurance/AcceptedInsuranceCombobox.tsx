import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAcceptedInsurance } from '@/hooks/useInsurance';
import type { AcceptedInsurance } from '@/hooks/useInsurance';

interface AcceptedInsuranceComboboxProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export const AcceptedInsuranceCombobox: React.FC<AcceptedInsuranceComboboxProps> = ({
  value,
  onValueChange,
  placeholder = "Select insurance plan"
}) => {
  const [open, setOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  
  const { data: acceptedInsurance, isLoading } = useAcceptedInsurance();
  
  // Filter insurance plans based on search input
  const filteredInsurance = acceptedInsurance?.filter((insurance) =>
    insurance.insurance_companies?.name.toLowerCase().includes(searchInput.toLowerCase()) ||
    insurance.plan_name.toLowerCase().includes(searchInput.toLowerCase())
  ) || [];

  // Find the selected insurance plan
  const selectedInsurance = acceptedInsurance?.find(insurance => insurance.id === value);
  
  const handleSelect = (insuranceId: string) => {
    onValueChange(insuranceId);
    setOpen(false);
    setSearchInput('');
  };

  if (isLoading) {
    return (
      <Button variant="outline" disabled className="w-full justify-between">
        Loading...
        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedInsurance ? (
            <span className="flex items-center">
              <span className="font-medium">{selectedInsurance.insurance_companies?.name}</span>
              {selectedInsurance.plan_name && (
                <span className="ml-2 text-muted-foreground">- {selectedInsurance.plan_name}</span>
              )}
            </span>
          ) : (
            placeholder
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Search insurance plans..."
            value={searchInput}
            onValueChange={setSearchInput}
          />
          <CommandList>
            <CommandEmpty>No insurance plans found.</CommandEmpty>
            <CommandGroup>
              {filteredInsurance.map((insurance) => (
                <CommandItem
                  key={insurance.id}
                  value={insurance.id}
                  onSelect={() => handleSelect(insurance.id)}
                  className="flex items-center justify-between"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{insurance.insurance_companies?.name}</span>
                    <span className="text-sm text-muted-foreground">{insurance.plan_name}</span>
                    {insurance.insurance_companies?.payer_id && (
                      <span className="text-xs text-muted-foreground">
                        Payer ID: {insurance.insurance_companies.payer_id}
                      </span>
                    )}
                  </div>
                  <Check
                    className={cn(
                      "ml-2 h-4 w-4",
                      value === insurance.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
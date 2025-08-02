import * as React from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useInsuranceCompanies, useCreateInsuranceCompany, InsuranceCompany } from "@/hooks/useInsurance";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface InsuranceCompanyComboboxProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export function InsuranceCompanyCombobox({
  value,
  onValueChange,
  placeholder = "Select insurance company..."
}: InsuranceCompanyComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const [showAddDialog, setShowAddDialog] = React.useState(false);
  const [newCompanyName, setNewCompanyName] = React.useState("");
  const [newCompanyPayerId, setNewCompanyPayerId] = React.useState("");
  
  const { data: companies = [], isLoading } = useInsuranceCompanies();
  const createCompany = useCreateInsuranceCompany();
  const { toast } = useToast();

  const selectedCompany = companies.find((company) => company.id === value);

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const showAddNew = searchValue && !filteredCompanies.some(
    (company) => company.name.toLowerCase() === searchValue.toLowerCase()
  );

  const handleAddNewCompany = async () => {
    if (!newCompanyName.trim()) return;

    try {
      const newCompany = await createCompany.mutateAsync({
        name: newCompanyName.trim(),
        payer_id: newCompanyPayerId.trim() || null,
      });
      
      onValueChange(newCompany.id);
      setShowAddDialog(false);
      setNewCompanyName("");
      setNewCompanyPayerId("");
      setOpen(false);
      
      toast({
        title: "Insurance company added",
        description: `${newCompany.name} has been added to the system.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add insurance company. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddNewClick = () => {
    setNewCompanyName(searchValue);
    setShowAddDialog(true);
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedCompany ? selectedCompany.name : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Search insurance companies..."
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList>
              <CommandEmpty>
                {isLoading ? "Loading..." : "No insurance companies found."}
              </CommandEmpty>
              {filteredCompanies.length > 0 && (
                <CommandGroup>
                  {filteredCompanies.map((company) => (
                    <CommandItem
                      key={company.id}
                      value={company.id}
                      onSelect={() => {
                        onValueChange(company.id);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === company.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex flex-col">
                        <span>{company.name}</span>
                        {company.payer_id && (
                          <span className="text-sm text-muted-foreground">
                            Payer ID: {company.payer_id}
                          </span>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              {showAddNew && (
                <CommandGroup>
                  <CommandItem onSelect={handleAddNewClick}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add "{searchValue}" as new company
                  </CommandItem>
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Insurance Company</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={newCompanyName}
                onChange={(e) => setNewCompanyName(e.target.value)}
                placeholder="Enter company name"
              />
            </div>
            <div>
              <Label htmlFor="payerId">Payer ID (Optional)</Label>
              <Input
                id="payerId"
                value={newCompanyPayerId}
                onChange={(e) => setNewCompanyPayerId(e.target.value)}
                placeholder="Enter payer ID"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddNewCompany}
                disabled={!newCompanyName.trim() || createCompany.isPending}
              >
                {createCompany.isPending ? "Adding..." : "Add Company"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
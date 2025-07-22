import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Clinician {
  id: string;
  profile_id: string;
  clinician_professional_name: string;
  clinician_accepting_new_clients: boolean;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
}

const Staff = () => {
  const { data: clinicians, isLoading, error } = useQuery({
    queryKey: ['clinicians'],
    queryFn: async () => {
      // Get clinicians data
      const { data: cliniciansData, error: cliniciansError } = await supabase
        .from('clinicians')
        .select('id, profile_id, clinician_professional_name, clinician_accepting_new_clients')
        .order('created_at', { ascending: false });

      if (cliniciansError) throw cliniciansError;

      // Get all profile IDs
      const profileIds = cliniciansData?.map(c => c.profile_id).filter(Boolean) || [];
      
      if (profileIds.length === 0) {
        return cliniciansData?.map(c => ({ ...c } as Clinician)) || [];
      }

      // Get profiles data
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, phone')
        .in('id', profileIds);

      if (profilesError) throw profilesError;

      // Merge the data
      const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);
      
      return cliniciansData?.map(clinician => {
        const profile = profilesMap.get(clinician.profile_id);
        return {
          ...clinician,
          first_name: profile?.first_name,
          last_name: profile?.last_name,
          email: profile?.email,
          phone: profile?.phone,
        } as Clinician;
      }) || [];
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Clinician Management</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Clinician Management</h1>
        </div>
        <div className="text-center p-8">
          <p className="text-lg font-medium text-destructive">Error loading clinicians</p>
          <p className="text-muted-foreground">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Clinician Management</h1>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" />
          Add Clinician
        </Button>
      </div>

      <div className="bg-card rounded-lg border">
        <div className="p-6">
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground border-b pb-3 mb-4">
            <div className="col-span-3">Name</div>
            <div className="col-span-3">Email</div>
            <div className="col-span-2">Phone</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Actions</div>
          </div>

          <div className="space-y-3">
            {clinicians?.map((clinician) => {
              const displayName = clinician.clinician_professional_name || 
                `${clinician.first_name || ''} ${clinician.last_name || ''}`.trim();
              
              const status = clinician.clinician_accepting_new_clients ? 'Active' : 'New';
              const statusColor = clinician.clinician_accepting_new_clients ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';

              return (
                <div key={clinician.id} className="grid grid-cols-12 gap-4 items-center py-3 border-b border-border/50 last:border-b-0">
                  <div className="col-span-3">
                    <Link 
                      to={`/clinician/${clinician.id}`}
                      className="text-foreground hover:text-primary font-medium transition-colors"
                    >
                      {displayName || 'Unnamed Clinician'}
                    </Link>
                  </div>
                  
                  <div className="col-span-3 flex items-center text-muted-foreground">
                    <Mail className="w-4 h-4 mr-2" />
                    {clinician.email || '—'}
                  </div>
                  
                  <div className="col-span-2 flex items-center text-muted-foreground">
                    <Phone className="w-4 h-4 mr-2" />
                    {clinician.phone || '—'}
                  </div>
                  
                  <div className="col-span-2">
                    <Badge className={`${statusColor} border-0`}>
                      {status}
                    </Badge>
                  </div>
                  
                  <div className="col-span-2">
                    <Button 
                      variant="destructive" 
                      size="sm"
                      className="text-white bg-red-500 hover:bg-red-600"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {(!clinicians || clinicians.length === 0) && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No clinicians found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Staff;
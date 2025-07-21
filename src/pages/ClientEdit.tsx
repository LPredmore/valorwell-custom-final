
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ClientForm } from '@/features/clients/components/ClientForm';
import { useUpdateClient } from '@/features/clients/hooks/useClientMutations';

const ClientEdit = () => {
  const { id } = useParams<{ id: string }>();
  const updateClientMutation = useUpdateClient(id!);

  const { data: client, isLoading } = useQuery({
    queryKey: ['client', id],
    queryFn: async () => {
      if (!id) throw new Error('Client ID is required');
      
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const handleSubmit = async (data: any) => {
    await updateClientMutation.mutateAsync(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ClientForm 
      initialData={client}
      onSubmit={handleSubmit}
      isLoading={updateClientMutation.isPending}
      mode="edit"
    />
  );
};

export default ClientEdit;

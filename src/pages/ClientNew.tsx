
import React from 'react';
import { ClientForm } from '@/features/clients/components/ClientForm';
import { useCreateClient } from '@/features/clients/hooks/useClientMutations';

const ClientNew = () => {
  const createClientMutation = useCreateClient();

  const handleSubmit = async (data: any) => {
    await createClientMutation.mutateAsync(data);
  };

  return (
    <ClientForm 
      onSubmit={handleSubmit}
      isLoading={createClientMutation.isPending}
      mode="create"
    />
  );
};

export default ClientNew;

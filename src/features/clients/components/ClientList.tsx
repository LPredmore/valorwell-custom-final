
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Filter, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Client {
  id: string;
  client_status: string;
  client_assigned_therapist: string;
  client_preferred_name: string;
  client_first_name: string;
  client_last_name: string;
  client_email?: string;
  client_phone?: string;
  date_of_birth?: string;
  created_at: string;
}

export const ClientList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const { data: clients, isLoading, error } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Client[];
    },
  });

  const filteredClients = clients?.filter(client => {
    const displayName = `${client.client_preferred_name || client.client_first_name || ''} ${client.client_last_name || ''}`;
    return displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           client.client_email?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Error loading clients. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-semibold">All Clients</h1>
          <Badge variant="secondary" className="bg-muted text-muted-foreground">
            {filteredClients?.length || 0}
          </Badge>
        </div>
      </div>

      <div className="bg-muted/30 p-4 rounded-lg">
        <Button variant="ghost" className="text-sm font-medium">
          All Clients
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search Clients"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-80"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            Search
          </Button>
          <Button variant="ghost" size="sm">
            Clear
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button variant="ghost" size="sm">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="border-b">
              <TableHead className="w-12">
                <Checkbox />
              </TableHead>
              <TableHead className="font-medium">NAME</TableHead>
              <TableHead className="font-medium">EMAIL</TableHead>
              <TableHead className="font-medium">PHONE</TableHead>
              <TableHead className="font-medium">DATE OF BIRTH</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients?.map((client) => (
              <TableRow key={client.id} className="hover:bg-muted/50">
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell className="font-medium">
                  {client.client_preferred_name || client.client_first_name || 'Unknown'} {client.client_last_name || 'User'}
                </TableCell>
                 <TableCell>{client.client_email || 'Not provided'}</TableCell>
                 <TableCell>{client.client_phone || 'Not provided'}</TableCell>
                <TableCell>
                  {client.date_of_birth 
                    ? new Date(client.date_of_birth).toLocaleDateString() 
                    : 'Not provided'
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredClients?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg font-medium">No clients found</p>
          <p className="text-muted-foreground">
            {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first client'}
          </p>
        </div>
      )}
    </div>
  );
};

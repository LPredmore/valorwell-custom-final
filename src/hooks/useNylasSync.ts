import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { NYLAS_CALENDARS_ENDPOINT } from '@/config';

export type NylasStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface NylasCalendar {
  id: string;
  name: string;
  description?: string;
  read_only: boolean;
  primary?: boolean;
}

export function useNylasSync() {
  const [status, setStatus] = useState<NylasStatus>('disconnected');
  const { session } = useAuth();

  const { data: calendars, error, isLoading, refetch } = useQuery({
    queryKey: ['nylas-calendars'],
    queryFn: async (): Promise<NylasCalendar[]> => {
      if (!session?.access_token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(NYLAS_CALENDARS_ENDPOINT, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch calendars');
      }

      return response.json();
    },
    enabled: !!session?.access_token,
    retry: false,
  });

  useEffect(() => {
    if (isLoading) {
      setStatus('connecting');
    } else if (error) {
      // Check if error is due to no Nylas account
      if (error.message.includes('No Nylas account found') || 
          error.message.includes('Not authenticated')) {
        setStatus('disconnected');
      } else {
        setStatus('error');
      }
    } else if (calendars && calendars.length > 0) {
      setStatus('connected');
    } else {
      setStatus('disconnected');
    }
  }, [calendars, error, isLoading]);

  const connect = () => {
    setStatus('connecting');
    // The actual connection is handled by the ConnectCalendar component
  };

  const disconnect = async () => {
    // TODO: Implement disconnect functionality
    // This would involve calling a Supabase function to remove the Nylas account
    console.log('Disconnect functionality not yet implemented');
  };

  const refresh = () => {
    refetch();
  };

  return {
    status,
    calendars: calendars || [],
    error: error?.message || null,
    isLoading,
    connect,
    disconnect,
    refresh,
  };
}
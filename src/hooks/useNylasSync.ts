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

  console.log('=== NYLAS SYNC HOOK DEBUG ===');
  console.log('Hook initialized with session:', session);
  console.log('Session access_token exists:', !!session?.access_token);
  console.log('NYLAS_CALENDARS_ENDPOINT:', NYLAS_CALENDARS_ENDPOINT);

  const { data: calendars, error, isLoading, refetch } = useQuery({
    queryKey: ['nylas-calendars'],
    queryFn: async (): Promise<NylasCalendar[]> => {
      console.log('=== QUERY FUNCTION STARTING ===');
      console.log('Session check - access_token exists:', !!session?.access_token);
      console.log('Session access_token (first 10 chars):', session?.access_token?.substring(0, 10) + '...');
      
      if (!session?.access_token) {
        console.error('❌ No access token available');
        throw new Error('Not authenticated');
      }

      const requestUrl = NYLAS_CALENDARS_ENDPOINT;
      const requestHeaders = {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      };

      console.log('Making fetch request:');
      console.log('URL:', requestUrl);
      console.log('Headers:', {
        ...requestHeaders,
        'Authorization': `Bearer ${session.access_token.substring(0, 10)}...`
      });

      let response;
      try {
        console.log('Calling fetch...');
        response = await fetch(requestUrl, {
          headers: requestHeaders,
        });
        console.log('Fetch completed with status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      } catch (fetchError) {
        console.error('❌ Fetch failed with error:', fetchError);
        throw new Error(`Network error: ${fetchError.message}`);
      }

      if (!response.ok) {
        console.error('❌ Response not OK:', response.status, response.statusText);
        let errorData;
        try {
          errorData = await response.json();
          console.error('Error response data:', errorData);
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          const textError = await response.text();
          console.error('Raw error response:', textError);
          throw new Error(`HTTP ${response.status}: ${textError}`);
        }
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to fetch calendars`);
      }

      let responseData;
      try {
        responseData = await response.json();
        console.log('✅ Successfully parsed response:', responseData);
        return responseData;
      } catch (parseError) {
        console.error('❌ Failed to parse successful response:', parseError);
        throw new Error('Invalid response format');
      }
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
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, ExternalLink } from 'lucide-react';
import { NYLAS_CLIENT_ID, CALLBACK_URI } from '@/config';

export function ConnectCalendar() {
  const handleConnect = () => {
    const url = new URL('https://api.nylas.com/oauth/authorize');
    url.searchParams.set('client_id', NYLAS_CLIENT_ID);
    url.searchParams.set('redirect_uri', CALLBACK_URI);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('scope', 'calendar.read_write,email.read_only');
    url.searchParams.set('state', crypto.randomUUID()); // CSRF protection
    
    window.location.href = url.toString();
  };

  return (
    <Button onClick={handleConnect} className="flex items-center gap-2">
      <Calendar className="h-4 w-4" />
      Connect Calendar
      <ExternalLink className="h-4 w-4" />
    </Button>
  );
}
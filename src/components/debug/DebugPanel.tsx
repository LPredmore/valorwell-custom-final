import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Bug, Copy, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { NYLAS_CLIENT_ID, CALLBACK_URI, SUPABASE_URL, NYLAS_EXCHANGE_ENDPOINT, NYLAS_CALENDARS_ENDPOINT } from '@/config';

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { session } = useAuth();

  const envVars = {
    'VITE_NYLAS_CLIENT_ID': NYLAS_CLIENT_ID,
    'VITE_NYLAS_CALLBACK_URI': CALLBACK_URI,
    'VITE_SUPABASE_URL': SUPABASE_URL,
  };

  const endpoints = {
    'NYLAS_EXCHANGE_ENDPOINT': NYLAS_EXCHANGE_ENDPOINT,
    'NYLAS_CALENDARS_ENDPOINT': NYLAS_CALENDARS_ENDPOINT,
  };

  const authStatus = {
    'Session exists': !!session,
    'Access token exists': !!session?.access_token,
    'Access token length': session?.access_token?.length || 0,
    'User ID': session?.user?.id || 'N/A',
    'User email': session?.user?.email || 'N/A',
  };

  const copyDebugInfo = () => {
    const debugInfo = {
      timestamp: new Date().toISOString(),
      environment_variables: envVars,
      endpoints,
      auth_status: authStatus,
      user_agent: navigator.userAgent,
      current_url: window.location.href,
    };

    navigator.clipboard.writeText(JSON.stringify(debugInfo, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatus = (value: any) => {
    if (typeof value === 'boolean') {
      return value ? 'success' : 'error';
    }
    if (typeof value === 'string') {
      return value && value !== 'N/A' ? 'success' : 'error';
    }
    if (typeof value === 'number') {
      return value > 0 ? 'success' : 'error';
    }
    return 'default';
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'success': return 'default' as const;
      case 'error': return 'destructive' as const;
      default: return 'secondary' as const;
    }
  };

  return (
    <Card className="mb-6 border-orange-200 bg-orange-50/50">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-orange-100/50 transition-colors">
            <CardTitle className="flex items-center justify-between text-orange-700">
              <span className="flex items-center gap-2">
                <Bug className="h-5 w-5" />
                Debug Panel
              </span>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  Troubleshooting Mode
                </Badge>
                {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </div>
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-6">
            <div className="flex justify-end">
              <Button onClick={copyDebugInfo} variant="outline" size="sm">
                {copied ? <CheckCircle className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                {copied ? 'Copied!' : 'Copy Debug Info'}
              </Button>
            </div>

            {/* Environment Variables */}
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Environment Variables</h4>
              <div className="grid gap-2">
                {Object.entries(envVars).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-2 bg-white rounded border">
                    <span className="font-mono text-xs">{key}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusVariant(getStatus(value))}>
                        {value ? 'Present' : 'Missing'}
                      </Badge>
                      {value && (
                        <span className="font-mono text-xs text-muted-foreground">
                          {value.length > 20 ? `${value.substring(0, 20)}...` : value}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Constructed Endpoints */}
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Constructed Endpoints</h4>
              <div className="grid gap-2">
                {Object.entries(endpoints).map(([key, value]) => (
                  <div key={key} className="flex flex-col gap-1 p-2 bg-white rounded border">
                    <span className="font-mono text-xs font-semibold">{key}</span>
                    <span className="font-mono text-xs text-muted-foreground break-all">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Authentication Status */}
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Authentication Status</h4>
              <div className="grid gap-2">
                {Object.entries(authStatus).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-2 bg-white rounded border">
                    <span className="text-sm">{key}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusVariant(getStatus(value))}>
                        {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Real-time Network Test */}
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Quick Network Test</h4>
              <Button 
                onClick={() => {
                  console.log('=== MANUAL NETWORK TEST ===');
                  console.log('Testing endpoint:', NYLAS_CALENDARS_ENDPOINT);
                  console.log('With auth token:', session?.access_token ? 'present' : 'missing');
                  
                  if (session?.access_token) {
                    fetch(NYLAS_CALENDARS_ENDPOINT, {
                      headers: {
                        'Authorization': `Bearer ${session.access_token}`,
                        'Content-Type': 'application/json',
                      },
                    })
                    .then(response => {
                      console.log('Test response status:', response.status);
                      console.log('Test response headers:', Object.fromEntries(response.headers.entries()));
                      return response.text();
                    })
                    .then(data => {
                      console.log('Test response body:', data);
                    })
                    .catch(error => {
                      console.error('Test request failed:', error);
                    });
                  }
                }}
                variant="outline" 
                size="sm"
                disabled={!session?.access_token}
              >
                Test Calendar Endpoint
              </Button>
            </div>

            <div className="text-xs text-muted-foreground">
              This panel helps diagnose configuration and connectivity issues. Check the browser console for detailed logs.
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
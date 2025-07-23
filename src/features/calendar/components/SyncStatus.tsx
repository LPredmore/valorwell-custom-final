import React from 'react';
import { useNylasSync } from '@/hooks/useNylasSync';
import { ConnectCalendar } from './ConnectCalendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Calendar, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';

export function SyncStatus() {
  const { status, calendars, error, isLoading, refresh } = useNylasSync();

  const getStatusIcon = () => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'connecting':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Calendar className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return `Connected (${calendars.length} calendar${calendars.length !== 1 ? 's' : ''})`;
      case 'connecting':
        return 'Connecting...';
      case 'error':
        return 'Connection Error';
      default:
        return 'Not Connected';
    }
  };

  const getStatusVariant = () => {
    switch (status) {
      case 'connected':
        return 'default' as const;
      case 'connecting':
        return 'secondary' as const;
      case 'error':
        return 'destructive' as const;
      default:
        return 'outline' as const;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            Calendar Sync
            {getStatusIcon()}
          </span>
          <Badge variant={getStatusVariant()}>
            {getStatusText()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === 'disconnected' && (
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">
              Connect your calendar to sync appointments automatically.
            </p>
            <ConnectCalendar />
          </div>
        )}

        {status === 'connecting' && (
          <div className="text-center">
            <p className="text-muted-foreground">
              Establishing connection to your calendar...
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center space-y-2">
            <p className="text-destructive text-sm">
              {error || 'Failed to connect to calendar'}
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={refresh} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
              <ConnectCalendar />
            </div>
          </div>
        )}

        {status === 'connected' && calendars.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Synced Calendars:</span>
              <Button onClick={refresh} variant="ghost" size="sm">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {calendars.map((calendar) => (
                <div
                  key={calendar.id}
                  className="flex items-center justify-between p-2 bg-muted rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">{calendar.name}</span>
                  </div>
                  <div className="flex gap-1">
                    {calendar.primary && (
                      <Badge variant="outline" className="text-xs">
                        Primary
                      </Badge>
                    )}
                    {calendar.read_only && (
                      <Badge variant="secondary" className="text-xs">
                        Read Only
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
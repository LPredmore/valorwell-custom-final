import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { NYLAS_EXCHANGE_ENDPOINT } from '@/config';

export default function NylasCallback() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const { user, session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const error = params.get('error');

        if (error) {
          setError(`OAuth error: ${error}`);
          setLoading(false);
          return;
        }

        if (!code) {
          setError('Missing authorization code from Nylas');
          setLoading(false);
          return;
        }

        if (!session?.access_token) {
          setError('You must be logged in to connect your calendar');
          setLoading(false);
          return;
        }

        const response = await fetch(NYLAS_EXCHANGE_ENDPOINT, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Token exchange failed');
        }

        if (data.success) {
          setSuccess(true);
          setLoading(false);
          setTimeout(() => {
            navigate('/calendar?sync=success');
          }, 2000);
        } else {
          setError(data.error || 'Unknown error occurred');
          setLoading(false);
        }
      } catch (err) {
        console.error('OAuth callback error:', err);
        setError(err instanceof Error ? err.message : 'Failed to connect calendar');
        setLoading(false);
      }
    };

    handleOAuthCallback();
  }, [session, navigate]);

  const handleRetry = () => {
    navigate('/calendar');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            {loading && <Loader2 className="h-5 w-5 animate-spin" />}
            {error && <AlertCircle className="h-5 w-5 text-destructive" />}
            {success && <CheckCircle className="h-5 w-5 text-green-600" />}
            Calendar Connection
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {loading && (
            <div>
              <p className="text-muted-foreground">
                Connecting your calendar...
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                This may take a few moments.
              </p>
            </div>
          )}
          
          {error && (
            <div className="space-y-4">
              <p className="text-destructive">
                {error}
              </p>
              <Button onClick={handleRetry} variant="outline">
                Return to Calendar
              </Button>
            </div>
          )}
          
          {success && (
            <div>
              <p className="text-green-600">
                Calendar connected successfully!
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Redirecting to calendar...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
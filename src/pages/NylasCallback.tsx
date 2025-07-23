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
        const state = params.get('state');
        const error = params.get('error');

        console.log('[NYLAS_CALLBACK] Processing OAuth callback with params:', {
          code: code ? `present (length: ${code.length})` : 'missing',
          state: state ? `present (${state})` : 'missing',
          error: error || 'none'
        });

        // Verify CSRF state
        const storedState = localStorage.getItem('nylas_oauth_state');
        console.log('[NYLAS_CALLBACK] State verification:', {
          received: state,
          stored: storedState,
          matches: state === storedState
        });

        if (state !== storedState) {
          setError('Security error: Invalid OAuth state. Please try connecting again.');
          setLoading(false);
          return;
        }

        // Clear stored state
        localStorage.removeItem('nylas_oauth_state');

        if (error) {
          console.log('[NYLAS_CALLBACK] OAuth error received:', error);
          setError(`OAuth authorization failed: ${error}`);
          setLoading(false);
          return;
        }

        if (!code) {
          console.log('[NYLAS_CALLBACK] Missing authorization code');
          setError('Authorization failed: No code received from Nylas');
          setLoading(false);
          return;
        }

        if (!session?.access_token) {
          console.log('[NYLAS_CALLBACK] Missing user session');
          setError('Authentication required: Please log in and try again');
          setLoading(false);
          return;
        }

        console.log('[NYLAS_CALLBACK] Starting token exchange with:', {
          endpoint: NYLAS_EXCHANGE_ENDPOINT,
          hasToken: !!session.access_token,
          codeLength: code.length
        });

        const response = await fetch(NYLAS_EXCHANGE_ENDPOINT, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });

        console.log('[NYLAS_CALLBACK] Exchange response:', {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok
        });

        const data = await response.json();
        console.log('[NYLAS_CALLBACK] Exchange response data:', data);

        if (!response.ok) {
          const errorMessage = data.error || `HTTP ${response.status}: ${response.statusText}`;
          console.error('[NYLAS_CALLBACK] Exchange failed:', errorMessage);
          throw new Error(errorMessage);
        }

        if (data.success) {
          console.log('[NYLAS_CALLBACK] Token exchange successful');
          setSuccess(true);
          setLoading(false);
          setTimeout(() => {
            navigate('/calendar?sync=success');
          }, 2000);
        } else {
          const errorMessage = data.error || 'Token exchange completed but returned no success flag';
          console.error('[NYLAS_CALLBACK] Exchange unsuccessful:', errorMessage);
          setError(errorMessage);
          setLoading(false);
        }
      } catch (err) {
        console.error('[NYLAS_CALLBACK] Fatal error during OAuth callback:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to connect calendar';
        console.error('[NYLAS_CALLBACK] Setting error state:', errorMessage);
        setError(`Connection failed: ${errorMessage}`);
        setLoading(false);
      }
    };

    handleOAuthCallback();
  }, [session, navigate]);

  const handleRetry = () => {
    console.log('[NYLAS_CALLBACK] User requested retry, redirecting to calendar');
    // Clear any remaining OAuth state
    localStorage.removeItem('nylas_oauth_state');
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
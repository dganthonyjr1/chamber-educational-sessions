import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

export default function MagicAuth() {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState('');
  const [showVoiceGuide, setShowVoiceGuide] = useState(false);
  
  const verifyMagicLink = trpc.magicLink.verify.useMutation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (!token) {
      setStatus('error');
      setErrorMessage('No authentication token provided');
      return;
    }

    // Verify the magic link
    verifyMagicLink.mutate(
      { token },
      {
        onSuccess: (data) => {
          setStatus('success');
          // Show voice guide after successful authentication
          setTimeout(() => {
            setShowVoiceGuide(true);
          }, 1000);
          
          // Redirect to home after voice guide or 5 seconds
          setTimeout(() => {
            setLocation('/');
          }, 5000);
        },
        onError: (error) => {
          setStatus('error');
          setErrorMessage(error.message || 'Invalid or expired magic link');
        },
      }
    );
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4">
      <Card className="bg-gray-900 border-gray-800 max-w-md w-full">
        <CardContent className="p-12 text-center">
          {status === 'verifying' && (
            <>
              <Loader2 className="animate-spin h-16 w-16 text-primary mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-2">Verifying Your Access</h2>
              <p className="text-gray-400">Please wait while we authenticate your magic link...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Welcome to SIA AI Academy!</h2>
              <p className="text-gray-400 mb-6">
                You've been successfully authenticated. {showVoiceGuide && 'Our AI guide will help you get started...'}
              </p>
              
              {showVoiceGuide && (
                <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/30 rounded-lg p-6 mb-6">
                  <p className="text-sm text-gray-300 mb-4">
                    🎙️ <strong>Voice Guide Ready!</strong><br />
                    Click the phone button in the bottom right to talk with your AI learning coach.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    Voice agent available 24/7
                  </div>
                </div>
              )}

              <Button
                onClick={() => setLocation('/')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Start Learning
              </Button>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
                <XCircle className="h-10 w-10 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Authentication Failed</h2>
              <p className="text-gray-400 mb-6">{errorMessage}</p>
              <Button
                onClick={() => setLocation('/')}
                variant="outline"
                className="border-gray-700 text-white"
              >
                Go to Home
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

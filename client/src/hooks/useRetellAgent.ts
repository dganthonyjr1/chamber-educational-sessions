import { useEffect, useRef, useState } from 'react';
import { RetellWebClient } from 'retell-client-js-sdk';

export function useRetellAgent() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const retellClientRef = useRef<RetellWebClient | null>(null);

  useEffect(() => {
    // Initialize Retell client
    const client = new RetellWebClient();
    retellClientRef.current = client;

    // Set up event listeners
    client.on('call_started', () => {
      console.log('[Retell] Call started');
      setIsCallActive(true);
    });

    client.on('call_ended', () => {
      console.log('[Retell] Call ended');
      setIsCallActive(false);
      setIsAgentSpeaking(false);
    });

    client.on('agent_start_talking', () => {
      console.log('[Retell] Agent started talking');
      setIsAgentSpeaking(true);
    });

    client.on('agent_stop_talking', () => {
      console.log('[Retell] Agent stopped talking');
      setIsAgentSpeaking(false);
    });

    client.on('error', (error) => {
      console.error('[Retell] Error:', error);
      setIsCallActive(false);
      setIsAgentSpeaking(false);
    });

    return () => {
      // Cleanup on unmount
      if (retellClientRef.current) {
        retellClientRef.current.stopCall();
      }
    };
  }, []);

  const startCall = async (agentId?: string) => {
    if (!retellClientRef.current) {
      console.error('[Retell] Client not initialized');
      return;
    }

    try {
      // Get access token from backend
      const response = await fetch('/api/trpc/retell.getAccessToken', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ agentId }),
      });

      if (!response.ok) {
        throw new Error('Failed to get Retell access token');
      }

      const data = await response.json();
      const accessToken = data.result?.data?.accessToken;

      if (!accessToken) {
        throw new Error('No access token received');
      }

      // Start the call
      await retellClientRef.current.startCall({
        accessToken,
      });
    } catch (error) {
      console.error('[Retell] Failed to start call:', error);
      alert('Unable to start voice call. Please ensure Retell AI credentials are configured in Settings → Secrets.');
    }
  };

  const stopCall = () => {
    if (retellClientRef.current) {
      retellClientRef.current.stopCall();
    }
  };

  return {
    startCall,
    stopCall,
    isCallActive,
    isAgentSpeaking,
  };
}

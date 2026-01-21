# Retell AI Integration Guide

## Setup Steps

### 1. Install SDK
```bash
npm install retell-client-js-sdk
```

### 2. Frontend Setup
```javascript
import { RetellWebClient } from "retell-client-js-sdk";

const retellWebClient = new RetellWebClient();
```

### 3. Backend - Create Web Call Endpoint
Create a tRPC endpoint that calls Retell API to get access token:

```typescript
// In server/routers.ts
retellCall: router({
  createWebCall: protectedProcedure
    .input(z.object({ agentId: z.string() }))
    .mutation(async ({ input }) => {
      const response = await fetch('https://api.retellai.com/v2/create-web-call', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RETELL_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          agent_id: input.agentId
        })
      });
      
      const data = await response.json();
      return { accessToken: data.access_token, callId: data.call_id };
    }),
}),
```

### 4. Frontend - Start Call
```javascript
// Get access token from backend
const { accessToken } = await trpc.retellCall.createWebCall.mutate({
  agentId: 'your-agent-id'
});

// Start the call
await retellWebClient.startCall({
  accessToken: accessToken,
  sampleRate: 24000,
  captureDeviceId: "default",
  playbackDeviceId: "default",
});
```

### 5. Listen to Events
```javascript
retellWebClient.on("call_started", () => {
  console.log("call started");
});

retellWebClient.on("call_ended", () => {
  console.log("call ended");
});

retellWebClient.on("agent_start_talking", () => {
  console.log("agent_start_talking");
});

retellWebClient.on("agent_stop_talking", () => {
  console.log("agent_stop_talking");
});

retellWebClient.on("update", (update) => {
  // Get transcript with update.transcript
  console.log(update);
});

retellWebClient.on("error", (error) => {
  console.error("An error occurred:", error);
  retellWebClient.stopCall();
});
```

### 6. Stop Call
```javascript
retellWebClient.stopCall();
```

## Environment Variables Needed
- `RETELL_API_KEY` - Your Retell AI API key from dashboard
- `RETELL_AGENT_ID` - The agent ID you want to use for calls

## UI Components to Build
1. Floating voice call button (always visible)
2. Call status indicator (talking/listening)
3. Transcript display (optional)
4. End call button

# Auth Event Bus Pattern

## Overview

The auth event bus provides a decoupled way for the API client to communicate authentication failures to React components without creating tight coupling or circular dependencies.

## Architecture

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│  API Client │ ──emit─→│ Auth Event   │ ──on──→ │ User Hook   │
│             │         │     Bus      │         │  (React)    │
└─────────────┘         └──────────────┘         └─────────────┘
                                                         │
                                                         ▼
                                                  Clear User State
                                                  Redirect to Login
```

## How It Works

1. **API Client** detects auth failure (refresh token expired/invalid)
2. **Emits event** via `authEventBus.emit("auth:refresh-failed")`
3. **User Hook** listens for the event and handles it appropriately
4. **User is redirected** to login page with clean state

## Benefits

✅ **Decoupled**: API client doesn't need to know about React Router or user state  
✅ **Testable**: Easy to mock and test event emissions  
✅ **Flexible**: Multiple listeners can respond to the same event  
✅ **Clean**: No circular dependencies or tight coupling

## Available Events

### `auth:refresh-failed`

Emitted when token refresh fails (expired refresh token, network error, etc.)

**When emitted:**

- Refresh token API call returns non-200 status
- Refresh token API call throws an error

**Default handler:**

- Clears user from localStorage
- Clears user state in React
- Redirects to `/login`

### `auth:unauthorized`

Reserved for future use - could be used for 401 responses that don't trigger refresh

## Usage Examples

### Emitting Events (API Client)

```typescript
// In api-client.ts
if (!response.ok) {
  authEventBus.emit("auth:refresh-failed");
}
```

### Listening to Events (React Components)

```typescript
import authEventBus from "@core/events/auth-event-bus";
import { useEffect } from "react";

function MyComponent() {
  useEffect(() => {
    const handleAuthFailure = () => {
      console.log("Auth failed, handle it here");
    };

    // Subscribe
    const unsubscribe = authEventBus.on("auth:refresh-failed", handleAuthFailure);

    // Cleanup
    return () => unsubscribe();
  }, []);
}
```

### Multiple Listeners

```typescript
// Component A
authEventBus.on("auth:refresh-failed", () => {
  console.log("Component A: clearing cache");
});

// Component B
authEventBus.on("auth:refresh-failed", () => {
  console.log("Component B: showing notification");
});

// Both will be called when event is emitted
```

## API Reference

### `authEventBus.on(event, listener)`

Subscribe to an event.

**Parameters:**

- `event`: `"auth:refresh-failed" | "auth:unauthorized"`
- `listener`: `() => void` - Callback function

**Returns:** `() => void` - Unsubscribe function

**Example:**

```typescript
const unsubscribe = authEventBus.on("auth:refresh-failed", () => {
  // Handle event
});

// Later...
unsubscribe();
```

### `authEventBus.emit(event)`

Emit an event to all subscribers.

**Parameters:**

- `event`: `"auth:refresh-failed" | "auth:unauthorized"`

**Example:**

```typescript
authEventBus.emit("auth:refresh-failed");
```

### `authEventBus.off(event, listener)`

Manually unsubscribe from an event.

**Parameters:**

- `event`: `"auth:refresh-failed" | "auth:unauthorized"`
- `listener`: The listener function to remove

**Example:**

```typescript
const handler = () => console.log("Auth failed");
authEventBus.on("auth:refresh-failed", handler);

// Later...
authEventBus.off("auth:refresh-failed", handler);
```

### `authEventBus.clear(event?)`

Clear all listeners for a specific event or all events.

**Parameters:**

- `event` (optional): Event type to clear. If omitted, clears all events.

**Example:**

```typescript
// Clear specific event
authEventBus.clear("auth:refresh-failed");

// Clear all events
authEventBus.clear();
```

## Implementation Details

### Current Implementation

**Files:**

- `/src/core/events/auth-event-bus.ts` - Event bus singleton
- `/src/core/api/api-client.ts` - Emits events on auth failure
- `/src/hooks/user.hook.tsx` - Listens for events and handles them

**Flow:**

1. API request returns 401
2. API client attempts token refresh
3. If refresh fails, emit `auth:refresh-failed`
4. User hook receives event
5. User hook clears state and redirects to login

### Why Not Use React Context?

React Context would create circular dependencies:

- API client (non-React) would need to access React Context
- Would require wrapping API client in a React component
- Makes testing more complex

Event bus keeps concerns separated:

- API client remains framework-agnostic
- React components handle React-specific logic
- Easy to test both independently

## Testing

### Testing Event Emission

```typescript
import authEventBus from "@core/events/auth-event-bus";

test("emits auth:refresh-failed on error", () => {
  const mockHandler = jest.fn();
  authEventBus.on("auth:refresh-failed", mockHandler);

  // Trigger the error condition
  authEventBus.emit("auth:refresh-failed");

  expect(mockHandler).toHaveBeenCalledTimes(1);
});
```

### Testing Event Handling

```typescript
import { renderHook } from "@testing-library/react";
import authEventBus from "@core/events/auth-event-bus";

test("redirects on auth failure", () => {
  const mockPush = jest.fn();
  jest.mock("next/navigation", () => ({
    useRouter: () => ({ push: mockPush }),
  }));

  renderHook(() => useUser());

  authEventBus.emit("auth:refresh-failed");

  expect(mockPush).toHaveBeenCalledWith("/login");
});
```

## Best Practices

1. **Always unsubscribe**: Use the returned unsubscribe function in cleanup
2. **Use in useEffect**: Subscribe in `useEffect` with proper dependencies
3. **Don't overuse**: Only for cross-cutting concerns like auth
4. **Keep listeners simple**: Complex logic should be in separate functions
5. **Document events**: Add new event types to this documentation

## Extending the Event Bus

### Adding New Event Types

```typescript
// In auth-event-bus.ts
type AuthEventType =
  | "auth:refresh-failed"
  | "auth:unauthorized"
  | "auth:session-expired" // New event
  | "auth:token-refreshed"; // New event
```

### Adding Event Payloads

If you need to pass data with events:

```typescript
type AuthEventListener<T = void> = (data: T) => void;

class AuthEventBus {
  emit<T>(event: AuthEventType, data?: T): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(listener => listener(data));
    }
  }
}

// Usage
authEventBus.emit("auth:session-expired", {
  reason: "timeout",
  timestamp: Date.now(),
});
```

## Troubleshooting

### Events not firing

- Check that you're using the same singleton instance
- Verify the event name matches exactly
- Ensure emit is being called

### Memory leaks

- Always return cleanup function from useEffect
- Call unsubscribe when component unmounts
- Use `authEventBus.clear()` in tests

### Multiple redirects

- Check that you don't have multiple listeners redirecting
- Ensure unsubscribe is called properly
- Use React Router's replace instead of push if needed

## Related Files

- `/src/core/events/auth-event-bus.ts` - Event bus implementation
- `/src/core/api/api-client.ts` - Event emitter
- `/src/hooks/user.hook.tsx` - Event listener
- `/docs/CLIENT_SIDE_REFRESH.md` - API client documentation

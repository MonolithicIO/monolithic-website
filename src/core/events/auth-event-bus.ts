/**
 * Simple event bus for authentication events
 * Allows decoupled communication between API client and React components
 */

type AuthEventType = "auth:refresh-failed" | "auth:unauthorized";

type AuthEventListener = () => void;

class AuthEventBus {
  private listeners: Map<AuthEventType, Set<AuthEventListener>> = new Map();

  /**
   * Subscribe to an auth event
   * @param event - The event type to listen for
   * @param listener - Callback function to execute when event is emitted
   * @returns Unsubscribe function
   */
  on(event: AuthEventType, listener: AuthEventListener): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    this.listeners.get(event)!.add(listener);

    // Return unsubscribe function
    return () => {
      this.off(event, listener);
    };
  }

  /**
   * Unsubscribe from an auth event
   * @param event - The event type
   * @param listener - The listener to remove
   */
  off(event: AuthEventType, listener: AuthEventListener): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(listener);
    }
  }

  /**
   * Emit an auth event to all subscribers
   * @param event - The event type to emit
   */
  emit(event: AuthEventType): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(listener => listener());
    }
  }

  /**
   * Remove all listeners for a specific event or all events
   * @param event - Optional event type to clear. If not provided, clears all events
   */
  clear(event?: AuthEventType): void {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }
}

// Export singleton instance
const authEventBus = new AuthEventBus();
export default authEventBus;

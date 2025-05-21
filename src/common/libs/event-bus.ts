type EventHandler = (...args: any[]) => void;

class SimpleEventBus {
  private listeners: Record<string, EventHandler[]> = {};

  on(event: string, handler: EventHandler) {
    this.listeners[event] ||= [];
    this.listeners[event].push(handler);
  }

  emit(event: string, ...args: any[]) {
    (this.listeners[event] || []).forEach((handler) => handler(...args));
  }

  off(event: string, handler: EventHandler) {
    this.listeners[event] = (this.listeners[event] || []).filter(h => h !== handler);
  }
}

export const eventBus = new SimpleEventBus();

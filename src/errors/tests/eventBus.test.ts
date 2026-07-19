import { EventBus, EventTypes } from '../../core/events/EventBus';

describe('EventBus', () => {
  beforeEach(() => {
    EventBus.clear();
  });

  it('should publish and receive events', () => {
    const mockHandler = jest.fn();
    EventBus.subscribe(EventTypes.SYSTEM_ERROR, mockHandler);
    
    const payload = { message: 'Test error' };
    EventBus.publish(EventTypes.SYSTEM_ERROR, payload, 'TestSource');
    
    expect(mockHandler).toHaveBeenCalledWith(payload);
  });

  it('should support multiple subscribers', () => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();
    
    EventBus.subscribe(EventTypes.AUDIT_ACTION, handler1);
    EventBus.subscribe(EventTypes.AUDIT_ACTION, handler2);
    
    const payload = { action: 'test' };
    EventBus.publish(EventTypes.AUDIT_ACTION, payload);
    
    expect(handler1).toHaveBeenCalledWith(payload);
    expect(handler2).toHaveBeenCalledWith(payload);
  });

  it('should unsubscribe correctly', () => {
    const mockHandler = jest.fn();
    const unsubscribe = EventBus.subscribe(EventTypes.DOMAIN_EVENT, mockHandler);
    
    EventBus.publish(EventTypes.DOMAIN_EVENT, { test: 1 });
    expect(mockHandler).toHaveBeenCalledTimes(1);
    
    unsubscribe();
    EventBus.publish(EventTypes.DOMAIN_EVENT, { test: 2 });
    expect(mockHandler).toHaveBeenCalledTimes(1); // Not called again
  });

  it('should not crash if a handler throws', () => {
    const throwingHandler = jest.fn(() => { throw new Error('Handler error'); });
    const normalHandler = jest.fn();
    
    EventBus.subscribe(EventTypes.SYSTEM_ERROR, throwingHandler);
    EventBus.subscribe(EventTypes.SYSTEM_ERROR, normalHandler);
    
    expect(() => {
      EventBus.publish(EventTypes.SYSTEM_ERROR, { test: true });
    }).not.toThrow();
    
    expect(normalHandler).toHaveBeenCalled();
  });

  it('should clear all listeners', () => {
    const handler = jest.fn();
    EventBus.subscribe(EventTypes.NOTIFICATION_DISPATCH, handler);
    
    EventBus.clear();
    EventBus.publish(EventTypes.NOTIFICATION_DISPATCH, { test: true });
    
    expect(handler).not.toHaveBeenCalled();
  });
});
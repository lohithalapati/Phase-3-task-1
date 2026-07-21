import { RecoveryManager } from '../../core/recovery/RecoveryManager';

describe('RecoveryManager', () => {
  it('should handle AUTH errors without throwing', () => {
    expect(() => RecoveryManager.execute('AUTH')).not.toThrow();
  });

  it('should handle NETWORK errors without throwing', () => {
    expect(() => RecoveryManager.execute('NETWORK')).not.toThrow();
  });

  it('should handle NOT_FOUND errors without throwing', () => {
    expect(() => RecoveryManager.execute('NOT_FOUND')).not.toThrow();
  });

  it('should handle unknown error types with default strategy', () => {
    expect(() => RecoveryManager.execute('UNKNOWN_ERROR_TYPE')).not.toThrow();
  });

  it('should expose handleRecovery method', () => {
    expect(RecoveryManager.handleRecovery).toBeDefined();
    expect(() => RecoveryManager.handleRecovery('AUTH')).not.toThrow();
  });

  it('should not crash on null/undefined', () => {
    expect(() => RecoveryManager.execute('')).not.toThrow();
  });
});
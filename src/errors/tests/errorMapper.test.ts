import { ErrorMapper } from '../mapper/ErrorMapper';

describe('ErrorMapper', () => {
  it('should map TypeError to error object', () => {
    const error = new TypeError('Cannot read property of undefined');
    const mapped = ErrorMapper.map(error);
    
    expect(mapped).toBeDefined();
    expect(mapped.message).toBe('Cannot read property of undefined');
  });

  it('should map ReferenceError to error object', () => {
    const error = new ReferenceError('x is not defined');
    const mapped = ErrorMapper.map(error);
    
    expect(mapped).toBeDefined();
    expect(mapped.message).toBe('x is not defined');
  });

  it('should map unknown errors safely', () => {
    const error = { random: 'object' };
    const mapped = ErrorMapper.map(error);
    
    expect(mapped).toBeDefined();
    expect(mapped.kind).toBeDefined();
  });

  it('should handle null/undefined errors', () => {
    const mapped1 = ErrorMapper.map(null);
    const mapped2 = ErrorMapper.map(undefined);
    
    expect(mapped1).toBeDefined();
    expect(mapped2).toBeDefined();
  });

  it('should preserve original error reference', () => {
    const original = new Error('Test error');
    const mapped = ErrorMapper.map(original);
    
    expect(mapped.originalError).toBe(original);
  });
});
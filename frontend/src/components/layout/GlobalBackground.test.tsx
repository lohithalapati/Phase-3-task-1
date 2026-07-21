import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import GlobalBackground from './GlobalBackground';

function setNavigatorProperty<T>(property: keyof Navigator, value: T): void {
  Object.defineProperty(window.navigator, property, {
    configurable: true,
    value,
  });
}

describe('GlobalBackground', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    act(() => { vi.runOnlyPendingTimers(); });
    vi.useRealTimers();
  });

  it('renders static background immediately', () => {
    const { container } = render(<GlobalBackground />);

    expect(container.firstChild).toBeTruthy();
    expect(container.querySelector('.bg-gradient-to-br')).toBeTruthy();
  });

  it('renders interactive canvas on capable desktop devices after delay', () => {
    setNavigatorProperty('userAgent', 'Mozilla/5.0 desktop chrome');
    setNavigatorProperty('hardwareConcurrency', 8);

    const { container } = render(<GlobalBackground />);

    expect(container.querySelector('#neural-network-canvas')).toBeNull();

    act(() => {
      vi.advanceTimersByTime(101);
    });

    expect(container.querySelector('#neural-network-canvas')).toBeTruthy();
  });

  it('does not render interactive canvas on mobile devices', () => {
    setNavigatorProperty('userAgent', 'Mozilla/5.0 iPhone Mobile Safari');
    setNavigatorProperty('hardwareConcurrency', 8);

    const { container } = render(<GlobalBackground />);

    act(() => {
      vi.advanceTimersByTime(101);
    });

    expect(container.querySelector('#neural-network-canvas')).toBeNull();
  });

  it('does not render interactive canvas on low CPU devices', () => {
    setNavigatorProperty('userAgent', 'Mozilla/5.0 desktop chrome');
    setNavigatorProperty('hardwareConcurrency', 4);

    const { container } = render(<GlobalBackground />);

    act(() => {
      vi.advanceTimersByTime(101);
    });

    expect(container.querySelector('#neural-network-canvas')).toBeNull();
  });

  it('clears delayed timer on unmount', () => {
    setNavigatorProperty('userAgent', 'Mozilla/5.0 desktop chrome');
    setNavigatorProperty('hardwareConcurrency', 8);

    const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout');

    const { unmount } = render(<GlobalBackground />);

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();

    clearTimeoutSpy.mockRestore();
  });
});


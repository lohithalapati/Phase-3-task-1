import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';

vi.mock('./components/auth/SSOPortal', () => ({
  default: () => <div data-testid="sso-portal">SSO Portal</div>,
}));

vi.mock('./components/auth/EnterpriseDashboard', () => ({
  default: () => <div data-testid="enterprise-dashboard">Enterprise Dashboard</div>,
}));

vi.mock('./pages/DesignSystemShowcase', () => ({
  default: () => <div data-testid="design-system-showcase">Design System Showcase</div>,
}));

vi.mock('./components/layout/GlobalBackground', () => ({
  default: () => <div data-testid="global-background">Global Background</div>,
}));

describe('App', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/');
  });

  it('renders the root design system route', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('design-system-showcase')).toBeInTheDocument();
    });

    expect(screen.getByTestId('global-background')).toBeInTheDocument();
  });

  it('renders the login route', async () => {
    window.history.pushState({}, '', '/login');

    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('sso-portal')).toBeInTheDocument();
    });
  });

  it('renders the dashboard route', async () => {
    window.history.pushState({}, '', '/dashboard');

    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('enterprise-dashboard')).toBeInTheDocument();
    });
  });

  it('renders and unmounts the app shell cleanly', () => {
    const { unmount } = render(<App />);

    expect(document.body).toBeInTheDocument();

    unmount();

    expect(document.body).toBeInTheDocument();
  });
});

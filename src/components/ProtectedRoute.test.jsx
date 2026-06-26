import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

// Mock the useAuth hook
const mockUseAuth = vi.fn();
vi.mock('@/lib/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock UserNotRegisteredError
vi.mock('@/components/UserNotRegisteredError', () => ({
  default: () => <div>User Not Registered</div>,
}));

import ProtectedRoute from './ProtectedRoute';

function renderWithRouter(authState, unauthenticatedElement = <div>Please Login</div>) {
  mockUseAuth.mockReturnValue({
    isAuthenticated: false,
    isLoadingAuth: false,
    authChecked: true,
    authError: null,
    checkUserAuth: vi.fn(),
    ...authState,
  });

  return render(
    <MemoryRouter initialEntries={['/protected']}>
      <Routes>
        <Route
          element={<ProtectedRoute unauthenticatedElement={unauthenticatedElement} />}
        >
          <Route path="/protected" element={<div>Protected Content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe('ProtectedRoute', () => {
  it('shows loading fallback while auth is loading', () => {
    renderWithRouter({
      isLoadingAuth: true,
      authChecked: false,
    });
    // Default fallback is a spinner div; protected content should not show
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders outlet (protected content) when authenticated', () => {
    renderWithRouter({
      isAuthenticated: true,
      authChecked: true,
    });
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('renders unauthenticatedElement when not authenticated', () => {
    renderWithRouter({
      isAuthenticated: false,
      authChecked: true,
    });
    expect(screen.getByText('Please Login')).toBeInTheDocument();
  });

  it('renders UserNotRegisteredError when authError type is user_not_registered', () => {
    renderWithRouter({
      isAuthenticated: false,
      authChecked: true,
      authError: { type: 'user_not_registered', message: 'Not registered' },
    });
    expect(screen.getByText('User Not Registered')).toBeInTheDocument();
  });

  it('renders unauthenticatedElement for other auth errors', () => {
    renderWithRouter({
      isAuthenticated: false,
      authChecked: true,
      authError: { type: 'auth_required', message: 'Auth required' },
    });
    expect(screen.getByText('Please Login')).toBeInTheDocument();
  });

  it('calls checkUserAuth when auth is not checked and not loading', () => {
    const checkUserAuth = vi.fn();
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoadingAuth: false,
      authChecked: false,
      authError: null,
      checkUserAuth,
    });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            element={<ProtectedRoute unauthenticatedElement={<div>Login</div>} />}
          >
            <Route path="/protected" element={<div>Protected</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(checkUserAuth).toHaveBeenCalled();
  });
});

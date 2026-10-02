import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/common/Navbar';
import { LoginPage } from './pages/LoginPage';
import { PublicDigitalCard } from './components/card/PublicDigitalCard';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminEmployees } from './pages/admin/AdminEmployees';
import { AdminAddEmployee } from './pages/admin/AdminAddEmployee';
import { AdminEditEmployee } from './pages/admin/AdminEditEmployee';
import { AdminCompanySettings } from './pages/admin/AdminCompanySettings';
import { EmployeeDashboard } from './pages/employee/EmployeeDashboard';
import { EmployeeProfile } from './pages/employee/EmployeeProfile';
import { EmployeeQRCode } from './pages/employee/EmployeeQRCode';
import { EmployeeNFC } from './pages/employee/EmployeeNFC';
import { api } from './lib/api';
import { Employee, CompanySettings } from './types';

function MainRouter() {
  const { user, isAuthenticated, isAdmin, isLoading } = useAuth();
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname || '/');
  const [publicCardData, setPublicCardData] = useState<{
    employee: Employee;
    company: CompanySettings;
  } | null>(null);
  const [publicCardLoading, setPublicCardLoading] = useState(false);
  const [publicCardError, setPublicCardError] = useState<string | null>(null);

  // Synchronize history navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Check if current route is a public card: `/card/:slug`
  const isPublicCardRoute = currentPath.startsWith('/card/');
  const publicSlug = isPublicCardRoute ? currentPath.replace('/card/', '').split('/')[0] : null;

  useEffect(() => {
    if (publicSlug) {
      setPublicCardLoading(true);
      setPublicCardError(null);
      api
        .getPublicCard(publicSlug)
        .then((data) => {
          setPublicCardData(data);
          // Non-blocking telemetry scan track
          api.trackCardAction(publicSlug, 'scan');
        })
        .catch((err) => {
          setPublicCardError(err.message || 'Digital card not found');
        })
        .finally(() => {
          setPublicCardLoading(false);
        });
    }
  }, [publicSlug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
      </div>
    );
  }

  // 1. PUBLIC DIGITAL CARD ROUTE
  if (isPublicCardRoute && publicSlug) {
    if (publicCardLoading) {
      return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mr-3" />
          <span>Opening TapCard...</span>
        </div>
      );
    }

    if (publicCardError || !publicCardData) {
      return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-4">
            ⚠️
          </div>
          <h2 className="text-xl font-bold text-zinc-100">Digital Card Unavailable</h2>
          <p className="text-sm text-zinc-400 mt-2 max-w-sm">
            {publicCardError || 'This card profile may be inactive or does not exist.'}
          </p>
          <button
            onClick={() => navigate('/login')}
            className="mt-6 px-4 py-2 rounded-xl bg-zinc-800 text-zinc-200 text-xs hover:bg-zinc-700"
          >
            Go to Portal
          </button>
        </div>
      );
    }

    return (
      <PublicDigitalCard
        employee={publicCardData.employee}
        company={publicCardData.company}
      />
    );
  }

  // 2. UNAUTHENTICATED USERS: SHOW LOGIN PAGE
  if (!isAuthenticated) {
    return (
      <LoginPage
        onSuccess={(role) => {
          if (role === 'ADMIN') {
            navigate('/admin/dashboard');
          } else {
            navigate('/employee/dashboard');
          }
        }}
      />
    );
  }

  // Route matches for authenticated users
  const renderAuthenticatedPage = () => {
    // ADMIN ROUTES
    if (isAdmin) {
      if (currentPath === '/admin/employees/new') {
        return <AdminAddEmployee onNavigate={navigate} />;
      }
      if (currentPath.startsWith('/admin/employees/edit/')) {
        const empId = currentPath.replace('/admin/employees/edit/', '');
        return <AdminEditEmployee employeeId={empId} onNavigate={navigate} />;
      }
      if (currentPath === '/admin/employees') {
        return <AdminEmployees onNavigate={navigate} />;
      }
      if (currentPath === '/admin/company') {
        return <AdminCompanySettings onNavigate={navigate} />;
      }
      return <AdminDashboard onNavigate={navigate} />;
    }

    // EMPLOYEE ROUTES
    if (currentPath === '/employee/profile') {
      return <EmployeeProfile onNavigate={navigate} />;
    }
    if (currentPath === '/employee/qrcode') {
      return <EmployeeQRCode onNavigate={navigate} />;
    }
    if (currentPath === '/employee/nfc') {
      return <EmployeeNFC onNavigate={navigate} />;
    }
    return <EmployeeDashboard onNavigate={navigate} />;
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Navbar currentPath={currentPath} onNavigate={navigate} />
      <main className="flex-1">{renderAuthenticatedPage()}</main>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <MainRouter />
      </AuthProvider>
    </ToastProvider>
  );
}

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { CreditCard, Lock, Mail, ArrowRight, Shield, User } from 'lucide-react';

interface LoginPageProps {
  onSuccess: (role: 'ADMIN' | 'EMPLOYEE') => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { error, success } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      error('Please enter your email address');
      return;
    }
    setIsLoading(true);
    try {
      await login(email, password);
      success('Logged in successfully!');
      if (email.includes('admin')) {
        onSuccess('ADMIN');
      } else {
        onSuccess('EMPLOYEE');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid credentials';
      error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const quickFill = (userEmail: string, userPass: string) => {
    setEmail(userEmail);
    setPassword(userPass);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center px-4">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/25 mb-4">
          <CreditCard className="w-7 h-7" />
        </div>
        <h2 className="text-3xl font-extrabold text-zinc-100 tracking-tight">
          TapCard Portal
        </h2>
        <p className="mt-2 text-sm text-zinc-400">
          Enterprise NFC & Digital Business Card Management
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 relative z-10">
        <div className="bg-zinc-900 border border-zinc-800 py-8 px-6 sm:px-10 rounded-3xl shadow-2xl backdrop-blur-xl">
          <form className="space-y-4" onSubmit={handleLogin}>
            <Input
              label="Email Address"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                size="lg"
                isLoading={isLoading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Sign In to Portal
              </Button>
            </div>
          </form>

          {/* Quick Demo Credentials Fill */}
          <div className="mt-8 pt-6 border-t border-zinc-800">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3 text-center">
              Quick Demo Logins
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => quickFill('admin@company.com', 'admin123')}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/60 text-left transition-colors group"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                  <Shield className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <div className="text-xs font-semibold text-zinc-200">Admin</div>
                  <div className="text-[10px] text-zinc-400 truncate">admin@company.com</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => quickFill('sarah@company.com', 'employee123')}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/60 text-left transition-colors group"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <User className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <div className="text-xs font-semibold text-zinc-200">Employee</div>
                  <div className="text-[10px] text-zinc-400 truncate">sarah@company.com</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

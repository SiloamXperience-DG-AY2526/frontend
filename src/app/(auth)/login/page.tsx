'use client';

import { useState } from 'react';
import Image from 'next/image';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Toast from '@/components/ui/Toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ROLE_HOME } from '@/lib/homeRoutes';
import { UserRole } from '@/types/AuthData';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; type: 'success' | 'error'; title: string; message?: string }>({ open: false, type: 'error', title: '' });

  const router = useRouter();
  const { authLogin } = useAuth();

  const handleLogin = async () => {
    
    const loginData = { 
      email: email, 
      password: password 
    };

    try {
      const authUser = await authLogin(loginData);

      const role = authUser.role;

      const home =
        role === UserRole.PARTNER && !authUser.hasOnboarded
          ? '/onboarding'
          : ROLE_HOME[role] || '/login-error';

      router.replace(home); 

    } catch (e: unknown) {
      setToast({ open: true, type: 'error', title: 'Login failed', message: `Please try again. ${e}` });
      return;
    }

    
  };

  return (
    <div className="min-h-screen flex">
      <Toast open={toast.open} type={toast.type} title={toast.title} message={toast.message} onClose={() => setToast((t) => ({ ...t, open: false }))} />
      {/* Left */}
      <div className="w-2/3 bg-white flex items-center justify-center px-16">
        <div className="w-full max-w-md space-y-8">
          {/* Title */}
          <div>
            <h1 className="text-5xl font-bold text-black">Hello,</h1>
            <p className="text-black text-5xl font-bold mt-1">Welcome Back</p>
          </div>

          {/* Email */}
          <Input label="Email" value={email} onChange={setEmail} type="email" />

          {/* Password */}
          <Input
            label="Password"
            value={password}
            onChange={setPassword}
            type="password"
          />

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-700">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              Remember me
            </label>

            <Link
              href="/forgot-password"
              className="text-gray-500 font-bold hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Sign In Button */}
          <Button label="Sign In" onClick={handleLogin} />

          {/* Sign Up */}
          <p className="text-sm font-bold text-gray-500 text-start">
            Don’t have an account?{' '}
            <Link
              href="/signup"
              className="text-blue-500 font-bold hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      {/* Right image*/}
      <div className="w-1/3 relative ">
        <Image
          src="/assets/login.png"
          alt="Login Image"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="p-3"
          priority
        />
      </div>
    </div>
  );
}

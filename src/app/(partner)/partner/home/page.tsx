'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function PartnerHomePage() {

  // example usage
  const { user, authLogout } = useAuth();
  const router = useRouter();
  if (!user) return;
  const { userId, firstName, lastName, email, role } = user;

  const handleLogout = () => {
    authLogout();
    router.replace('/');
  };

  return (
    <div>
      <div>User ID: {userId}</div>
      <div>First Name: {firstName}</div>
      <div>Last Name: {lastName}</div>
      <div>Email: {email}</div>
      <div>Role: {role}</div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};
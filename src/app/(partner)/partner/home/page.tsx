'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function PartnerHomePage() {

  // example usage
  const { user } = useAuth();
  if (!user) return;
  const { userId, firstName, lastName, email, role } = user;

  return (
    <div>
      <div>User ID: {userId}</div>
      <div>First Name: {firstName}</div>
      <div>Last Name: {lastName}</div>
      <div>Email: {email}</div>
      <div>Role: {role}</div>
    </div>
  );
};
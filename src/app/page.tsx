'use client';

import { useAuth } from '@/contexts/AuthContext';
import { ROLE_HOME } from '@/lib/homeRoutes';
import Link from 'next/link';

export default function LandingPage() {

  const { user } = useAuth();
  
  const homeRoute = user ? (ROLE_HOME[user.role] ?? '/') : '/login';
      
  return (
    // original color to be added after discussion
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* right abstract */}
      <div
        className="
          absolute
          -top-24
          right-0
          w-[680px]
          h-[744.92px]
          bg-[#D9D9D9]
          rounded-bl-[480px]
          rounded-br-[390px]
          z-20
        "
      />

      {/* left abstract*/}
      <div
        className="
          absolute
          w-[320px]
          h-[320px]
          bg-[#D9D9D9]
          rounded-full
          left-[-140px]
          bottom-[-120px]
          z-0
        "
      />

      {/* Navbar */}
      <nav className="relative z-10 bg-[#F0F0F2]">
        <div className="flex items-center gap-40 px-16 py-6">
          <div className="font-bold text-black">Logo</div>

          <ul className="flex gap-40 text-md font-bold text-black">
            <li>Home</li>
            <li>About</li>
            <li>Contact Us</li>
          </ul>
        </div>
      </nav>

      {/* Main*/}
      <main className="relative z-20 px-42 pt-32">
        {/* Login/Sign Up*/}
        <div className="max-w-md">
          <h1 className="text-5xl font-bold leading-tight text-black">
            Welcome to <br />
            <span className="underline">SiloamXperience!</span>
          </h1>

          <div className="mt-8 flex gap-5">
            <Link href={homeRoute}>
              <button className="px-12 py-2.5 bg-[#D9D9D9] cursor-pointer text-black rounded-md text-lg font-bold">
                Log In
              </button>
            </Link>
            <Link href="/signup">
              <button className="px-12 py-2.5 bg-[#D9D9D9] cursor-pointer text-black rounded-md text-lg font-bold">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </main>

      {/* IMAGE PLACEHOLDER*/}
      <div
        className="
          absolute
          top-20
          right-[160px]
          z-30
        "
      >
        <div className="bg-white px-10 py-8 rounded-lg shadow-sm text-sm text-gray-600">
          Include SiloamXperience picture here
        </div>
      </div>
    </div>
  );
}

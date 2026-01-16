'use client';

import { useAuth } from '@/contexts/AuthContext';
import { ROLE_HOME } from '@/lib/homeRoutes';
import Image from 'next/image';
import Link from 'next/link';

export default function LandingPage() {
  const { user } = useAuth();
  const homeRoute = user ? ROLE_HOME[user.role] ?? '/' : '/login';

  return (
    // original color to be added after discussion
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* right abstract */}

      {/* Left abstract  */}
      <div
        className="
          pointer-events-none
          absolute
          w-[320px]
          h-[320px]
          bg-[#195D4B]
          rounded-full
          left-[-120px] bottom-[-120px]
          z-0
        "
      />

      {/* Navbar */}
      <nav className="z-10 border border-gray-200">
        <div className="flex justify-between align-center px-16 py-6">
          <div className="font-bold text-2xl text-[#195D4B]">SVLTI</div>

          <ul className="flex gap-40 text-md font-bold text-[#195D4B]">
            <li>Home</li>
            <li>People</li>
            <li>Courses</li>
            <li>Happenings</li>
            <li>Contact</li>
          </ul>
        </div>
      </nav>

      {/* Main */}
      <main className="relative z-20 min-h-[calc(100vh-96px)] flex items-center justify-center px-6 pb-10">
        <div className="w-full max-w-7xl flex items-center justify-between">
          {/* LEFT: text */}
          <div className="max-w-md">
            <h1 className="text-5xl font-bold leading-tight text-black">
              Welcome to <br />
              <span className="text-[#195D4B]">SiloamXperience!</span>
            </h1>

            <div className="mt-8 flex gap-5">
              <Link href={homeRoute}>
                <button className="px-12 py-2.5 bg-[#7EDDC399]/50 cursor-pointer text-black rounded-md text-lg font-bold">
                  Log In
                </button>
              </Link>
              <Link href="/signup">
                <button className="px-12 py-2.5 bg-[#7EDDC399]/50 cursor-pointer text-black rounded-md text-lg font-bold">
                  Sign Up
                </button>
              </Link>
            </div>
          </div>

          {/* RIGHT: image */}
          <div className="relative w-[800px] h-[360px] shrink-0">
            <Image
              src="/assets/landing-page.png"
              alt="Landing Page"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          </div>
        </div>
      </main>
    </div>
  );
}

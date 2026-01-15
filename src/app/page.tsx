'use client';

import { useAuth } from '@/contexts/AuthContext';
import { ROLE_HOME } from '@/lib/homeRoutes';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';

export default function LandingPage() {
  const { user } = useAuth();
  const homeRoute = user ? ROLE_HOME[user.role] ?? '/' : '/login';

  return (
    <div className="relative min-h-screen bg-gray-50 overflow-hidden">
      {/* Right abstract: hide on small screens */}
      <div
        className="
          hidden lg:block
          pointer-events-none
          absolute -top-24 right-0
          w-[680px] h-[744.92px]
          bg-gradient-to-b from-[#DFF5EF] to-[#BFEDE2]
          rounded-bl-[480px] rounded-br-[390px]
          z-10
        "
      />

      {/* Left abstract (keep, but behind everything) */}
      <div
        className="
          pointer-events-none
          absolute
          w-[240px] h-[240px]
          sm:w-[280px] sm:h-[280px]
          md:w-[320px] md:h-[320px]
          bg-gradient-to-tr from-[#DFF5EF] to-[#BFEDE2]
          rounded-full
          left-[-120px] bottom-[-120px]
          z-0
        "
      />

      {/* Navbar */}
      <Navbar />

      {/* Main */}
      <main className="relative z-10 mx-auto max-w-6xl px-4 pt-10 pb-16 sm:px-6 md:px-12 md:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* Text */}
          <div className="max-w-md">
            <h1 className="text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
              Welcome to <br />
              <span className="underline decoration-[#2AAE92]">
                SiloamXperience!
              </span>
            </h1>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href={homeRoute}>
                <button
                  className="
                    px-10 py-2.5 rounded-md text-lg font-bold text-white
                    bg-gradient-to-r from-[#1F7A67] to-[#2AAE92]
                    hover:from-[#1A6A59] hover:to-[#22997F]
                    shadow-sm active:scale-[0.99] transition cursor-pointer
                  "
                >
                  Log In
                </button>
              </Link>

              <Link href="/signup">
                <button
                  className="
                    px-10 py-2.5 rounded-md text-lg font-bold text-[#1F7A67]
                    bg-white border border-[#BFEDE2]
                    hover:bg-[#F2FBF8]
                    shadow-sm active:scale-[0.99] transition cursor-pointer
                  "
                >
                  Sign Up
                </button>
              </Link>
            </div>
          </div>

          {/* Desktop image INSIDE right side (only lg+) */}
          <div className=" hidden lg:block absolute bottom-10 right-1 z-20">
            <Image
              src="/assets/logo.png"
              alt="SiloamXperience"
              width={300}
              height={40}
              className=" object-contain"
              priority
            />
          </div>
        </div>
      </main>
    </div>
  );
}

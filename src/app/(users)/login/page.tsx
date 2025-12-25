"use client";

import { useState } from "react";
import Image from "next/image";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const handleLogin = () => {
    console.log({ email, password, remember });
  };

  return (
    <div className="min-h-screen flex">
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
            Don’t have an account?{" "}
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
          className="p-3"
          priority
        />
      </div>
    </div>
  );
}

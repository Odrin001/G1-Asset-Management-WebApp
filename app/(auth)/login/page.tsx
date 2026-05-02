"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { validateSDCAEmail } from "@/lib/utils";
import { Card, CardBody, Input, Button } from "@/components";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    e: React.SyntheticEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email.trim()) {
      setError("Email is required");
      setLoading(false);
      return;
    }

    if (!validateSDCAEmail(email)) {
      setError("Email must end with @sdca.edu.ph");
      setLoading(false);
      return;
    }

    if (!password.trim()) {
      setError("Password is required");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));

      router.push("/dashboard");
    } catch (error) {
      setError("Cannot connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <Card>
        <CardBody>
          {/* Logo Section */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2 text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              SDCA Asset Management System
            </h1>
            <p className="text-gray-500 text-sm">
              Sign in using your school email
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="School Email"
              type="email"
              id="email"
              placeholder="your.name@sdca.edu.ph"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              required
              icon={
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              }
            />

            <div className="relative">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-gray-900 block mb-2"
              >
                Password <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>

                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm text-primary-500 hover:text-primary-600 font-medium"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <Button type="submit" loading={loading} className="w-full">
              Login
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-primary-500 hover:text-primary-600 font-semibold"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </CardBody>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-400">
            © 2026 SDCA Asset Management System
          </p>
        </div>
      </Card>
    </div>
  );
}
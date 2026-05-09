"use client";

import Link from "next/link";
import { useState } from "react";
import { validateSDCAEmail } from "@/lib/utils";
import { Card, CardBody, Input, Button } from "@/components";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
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

    // Simulate OTP send
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
    }, 500);
  };

  if (success) {
    return (
      <div className="w-full max-w-md">
        <Card>
          <CardBody>
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            {/* Success Message */}
            <div className="space-y-2 text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Check Your Email</h1>
              <p className="text-gray-500 text-sm">
                We&apos;ve sent a verification code to <strong>{email}</strong>
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                Please check your email and follow the link to reset your password.
                If you don&apos;t see the email, check your spam folder.
              </p>
            </div>

            {/* Back to Login Button */}
            <Link href="/login" className="block">
              <Button className="w-full">Back to Login</Button>
            </Link>
          </CardBody>
        </Card>
      </div>
    );
  }

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
              Forgot Password
            </h1>
            <p className="text-gray-500 text-sm">
              Enter your registered school email to receive a verification code.
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

            {/* Send OTP Button */}
            <Button type="submit" loading={loading} className="w-full">
              Send OTP
            </Button>
          </form>

          {/* Back to Login Link */}
          <div className="text-center mt-6">
            <Link
              href="/login"
              className="inline-flex items-center text-primary-500 hover:text-primary-600 font-medium text-sm"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Login
            </Link>
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

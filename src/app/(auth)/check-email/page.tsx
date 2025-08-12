/* eslint-disable react/no-unescaped-entities */
"use client";

import Link from "next/link";

const CheckEmailPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full border-2 rounded-md bg-white p-10 text-center">
        <h2 className="text-2xl font-bold text-black">Check Your Email</h2>
        <p className="text-gray-600 mt-4">
          We've sent a password reset link to your email. Please check your inbox and click the link to reset your password.
        </p>

        {/* Open Email Button */}
        <a
          href="https://mail.google.com/"
          target="_blank"
          className="mt-6 inline-block w-full bg-black text-white py-3 rounded-md font-medium hover:bg-gray-800 transition"
        >
          Open Email
        </a>

        {/* Back to Login */}
        <Link
          href="/login"
          className="inline-block mt-4 text-sm text-blue-600 hover:underline"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default CheckEmailPage;

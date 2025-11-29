// app/reset-password/page.tsx

"use client"; // Required for the handleSubmit event handler

import Link from 'next/link';
import React from 'react';

// Define the Reset Password Component
export default function ResetPasswordPage() {
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Password reset request submitted!');
    // Add logic here to send the password reset email
  };

  return (
    // Outer container with the background image
    <div 
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center p-4"
      style={{ backgroundImage: "url('/images/login-background.jpg')" }} // Using the same background
    >
      {/* Dark Green Overlay */}
      <div className="absolute inset-0 bg-green-900 opacity-70"></div>
      
      {/* Reset Card Container */}
      <div className="relative z-10 w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-2xl border border-beige-200">
        
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-green-800">
            Reset Your Password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {/* --- Reset Form --- */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="user@agriconnect.tn"
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150"
            >
              Send Reset Link
            </button>
          </div>
        </form>
        {/* --- End Form --- */}

        <div className="text-center text-sm mt-6">
          <p className="text-gray-600">
            Remembered your password? 
            <Link href="/login" className="font-medium text-green-600 hover:text-green-500 ml-1">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
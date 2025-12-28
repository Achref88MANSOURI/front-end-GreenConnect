"use client";

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Header: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Check for user in localStorage on mount
    const checkUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Error parsing user data", e);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    checkUser();

    // Listen for storage events (login/logout in other tabs or same tab via custom event)
    window.addEventListener('storage', checkUser);
    
    return () => {
      window.removeEventListener('storage', checkUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setShowDropdown(false);
    window.dispatchEvent(new Event('storage')); // Notify other components
    router.push('/login');
  };

  return (
    <header className="flex justify-between items-center p-5 bg-white shadow-sm sticky top-0 z-50">
      {/* Logo/Brand (Always links to home) */}
      <div className="text-2xl font-extrabold text-green-700">
        <Link href="/">GreenConnect</Link>
      </div>

      {/* Main Navigation Links (Hidden on mobile by default) */}
      <nav className="hidden md:flex space-x-6 text-gray-600 font-medium">
        {/* Module Links */}
        <Link href="/marketplace" className="hover:text-green-600 transition">Souk-Moussel</Link>
        <Link href="/equipment" className="hover:text-green-600 transition">Faza’et-Ard</Link>
        <Link href="/carriers" className="hover:text-green-600 transition">Tawssel</Link>

        {/* Public Links */}
        <Link href="/about" className="hover:text-green-600 transition">About</Link>
        <Link href="/contact" className="hover:text-green-600 transition">Contact</Link>
      </nav>

      {/* Authentication Buttons */}
      <div className="flex items-center space-x-4">
        {user ? (
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold border border-green-200">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="hidden sm:block font-medium text-gray-700">{user.name}</span>
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm text-gray-500">Connecté en tant que</p>
                  <p className="text-sm font-bold text-gray-900 truncate">{user.email}</p>
                </div>
                <Link 
                  href="/profile" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowDropdown(false)}
                >
                  Voir le profil
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Se déconnecter
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link href="/login" className="text-green-700 hover:underline hidden sm:block">
                Login
            </Link>
            <Link 
              href="/register" 
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition shadow-md"
            >
              Register
            </Link>
          </>
        )}
        
        {/* Mobile Menu Button (Hamburger) */}
        <button className="md:hidden text-2xl text-green-700">
            &#9776; {/* Unicode for Hamburger Icon */}
        </button>
      </div>
    </header>
  );
};

export default Header;
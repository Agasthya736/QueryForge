"use client";
import Link from "next/link";
import { logout, isLoggedIn } from "@/lib/auth";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, []);

  return (
    <nav className="border-b border-borderc bg-surface-0/80 backdrop-blur sticky top-0 z-10 px-6 py-4 flex items-center justify-between">
      <Link href="/" className="font-semibold text-lg text-white">
        Query<span className="bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">Forge</span>
      </Link>
      <div className="flex items-center gap-6 text-sm text-gray-400">
        <Link href="/learn" className="hover:text-white transition-colors">Learn</Link>
        <Link href="/practice" className="hover:text-white transition-colors">Practice</Link>
        <Link href="/interview" className="hover:text-white transition-colors">Mock Interview</Link>
        <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
        {loggedIn ? (
          <button onClick={logout} className="text-red-400 hover:text-red-300 transition-colors">Log out</button>
        ) : (
          <Link
            href="/login"
            className="bg-gradient-to-r from-accent-blue to-accent-purple text-black font-medium px-4 py-1.5 rounded-full hover:opacity-90 transition-opacity"
          >
            Log in
          </Link>
        )}
      </div>
    </nav>
  );
}
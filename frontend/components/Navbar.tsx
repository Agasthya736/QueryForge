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
    <nav className="border-b px-6 py-4 flex items-center justify-between">
      <Link href="/" className="font-semibold text-lg">QueryForge</Link>
      <div className="flex gap-6 text-sm">
        <Link href="/learn">Learn</Link>
        <Link href="/practice">Practice</Link>
        <Link href="/interview">Mock Interview</Link>
        <Link href="/dashboard">Dashboard</Link>
        {loggedIn ? (
          <button onClick={logout} className="text-red-500">Log out</button>
        ) : (
          <Link href="/login">Log in</Link>
        )}
      </div>
    </nav>
  );
}
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const data = await login(email, password);
      localStorage.setItem("token", data.token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  }

  const inputClass =
    "w-full bg-surface-1 border border-borderc text-white placeholder-gray-500 rounded-lg px-3 py-2 focus:outline-none focus:border-accent-blue transition-colors";

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-80 space-y-4">
        <h1 className="text-2xl font-semibold text-white mb-2">Log in to QueryForge</h1>
        <input
          type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
        <input
          type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-accent-blue to-accent-purple text-black font-medium rounded-lg px-3 py-2 hover:opacity-90 transition-opacity"
        >
          Log in
        </button>
        <p className="text-sm text-center text-gray-400">
          Don't have an account? <Link href="/register" className="text-accent-blue hover:underline">Sign up</Link>
        </p>
      </form>
    </div>
  );
}
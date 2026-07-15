"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth";

export default function DashboardPage() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.push("/login");
    } else {
      setChecked(true);
    }
  }, [router]);

  if (!checked) return null;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-white mb-4">Your dashboard</h1>
      <div className="bg-surface-1 border border-borderc rounded-card p-6">
        <p className="text-gray-400">
          Progress tracking, skill graph, and mock interview history will show up here
          once the Progress Tracker is built. For now, this confirms auth is working.
        </p>
      </div>
    </div>
  );
}
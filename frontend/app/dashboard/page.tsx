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

  if (!checked) return null; // avoid flashing content before redirect check

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">Your Dashboard</h1>
      <p className="text-gray-600">
        Progress tracking, skill graph, and mock interview history will show up here
        once Phase 6 (Progress Tracker) is built. For now, this confirms auth is working.
      </p>
    </div>
  );
}
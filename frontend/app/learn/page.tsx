"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getTopics } from "@/lib/api";

type Topic = {
  id: number;
  slug: string;
  title: string;
  description: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
};

const levelStyles: Record<Topic["level"], { badge: string; bar: string }> = {
  BEGINNER: { badge: "bg-green-950 text-green-400", bar: "from-green-500 to-green-400" },
  INTERMEDIATE: { badge: "bg-blue-950 text-accent-blue", bar: "from-accent-blue to-accent-purple" },
  ADVANCED: { badge: "bg-purple-950 text-accent-purple", bar: "from-accent-purple to-pink-400" },
};

export default function LearnPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTopics().then((data) => {
      setTopics(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-8 text-gray-400">Loading curriculum...</div>;

  const levels: Topic["level"][] = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-white mb-1">Learn SQL</h1>
      <p className="text-gray-400 text-sm mb-8">Work through topics at your own pace, from fundamentals to interview-level depth.</p>

      {levels.map((level) => {
        const topicsForLevel = topics.filter((t) => t.level === level);
        if (topicsForLevel.length === 0) return null;
        const style = levelStyles[level];

        return (
          <div key={level} className="mb-10">
            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-3">{level.toLowerCase()}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topicsForLevel.map((topic) => (
                <Link
                  key={topic.slug}
                  href={`/learn/${topic.slug}`}
                  className="group bg-surface-1 border border-borderc rounded-card p-5 hover:bg-surface-2 hover:border-gray-600 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-white group-hover:text-accent-blue transition-colors">{topic.title}</h3>
                    <span className={`text-xs px-2.5 py-1 rounded-full ${style.badge}`}>{level.toLowerCase()}</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-4">{topic.description}</p>
                  <div className="h-1 bg-surface-0 rounded-full overflow-hidden">
                    <div className={`h-full w-0 bg-gradient-to-r ${style.bar} rounded-full`} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
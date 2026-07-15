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

export default function LearnPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTopics().then((data) => {
      setTopics(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-8">Loading curriculum...</div>;

  const levels: Topic["level"][] = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Learn SQL</h1>
      {levels.map((level) => {
        const topicsForLevel = topics.filter((t) => t.level === level);
        if (topicsForLevel.length === 0) return null;
        return (
          <div key={level} className="mb-8">
            <h2 className="text-lg font-medium mb-3 capitalize">{level.toLowerCase()}</h2>
            <div className="space-y-2">
              {topicsForLevel.map((topic) => (
                <Link
                  key={topic.slug}
                  href={`/learn/${topic.slug}`}
                  className="block border rounded p-4 hover:bg-gray-50"
                >
                  <div className="font-medium">{topic.title}</div>
                  <div className="text-sm text-gray-600">{topic.description}</div>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
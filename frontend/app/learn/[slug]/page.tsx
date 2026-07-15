"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { getTopicWithLessons } from "@/lib/api";

export default function TopicPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getTopicWithLessons(slug).then(setData);
  }, [slug]);

  if (!data) return <div className="p-8 text-gray-400">Loading...</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white mb-2">{data.topic.title}</h1>
        <p className="text-gray-400">{data.topic.description}</p>
      </div>

      {data.lessons.map((lesson: any, i: number) => (
        <div
          key={lesson.id}
          className="bg-surface-1 border border-borderc rounded-card p-6 mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-medium bg-gradient-to-r from-accent-blue to-accent-purple text-black px-2 py-0.5 rounded-full">
              {i + 1}
            </span>
            <h2 className="text-lg font-medium text-white">{lesson.title}</h2>
          </div>
          <div className="prose prose-invert prose-sm max-w-none prose-pre:bg-surface-0 prose-pre:border prose-pre:border-borderc prose-code:text-accent-blue">
            <ReactMarkdown>{lesson.contentMarkdown}</ReactMarkdown>
          </div>
        </div>
      ))}
    </div>
  );
}
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

  if (!data) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-2">{data.topic.title}</h1>
      <p className="text-gray-600 mb-6">{data.topic.description}</p>
      {data.lessons.map((lesson: any) => (
        <div key={lesson.id} className="prose prose-invert mb-8">
          <h2>{lesson.title}</h2>
          <ReactMarkdown>{lesson.contentMarkdown}</ReactMarkdown>
        </div>
      ))}
    </div>
  );
}
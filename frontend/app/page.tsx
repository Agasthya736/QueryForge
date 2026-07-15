import Link from "next/link";

const features = [
  {
    title: "AI-guided learning",
    description: "A tutor agent explains concepts at your level, with live examples run against real data.",
    badge: "Learn",
  },
  {
    title: "Animated query execution",
    description: "See exactly how a JOIN merges rows or an index avoids a full table scan, generated from real execution plans.",
    badge: "Visualize",
  },
  {
    title: "Mock technical interviews",
    description: "Timed, no-hints practice rounds with rubric-based feedback on correctness, efficiency, and style.",
    badge: "Interview",
  },
  {
    title: "Multiple engines",
    description: "Practice across MySQL, Postgres, SQLite, and MongoDB — not just one dialect.",
    badge: "Flexible",
  },
];

const levels = [
  { name: "Beginner", desc: "SELECT, WHERE, sorting, and the fundamentals.", color: "text-green-400 bg-green-950" },
  { name: "Intermediate", desc: "Joins, aggregates, subqueries, and views.", color: "text-accent-blue bg-blue-950" },
  { name: "Advanced", desc: "Window functions, CTEs, optimization, and design.", color: "text-accent-purple bg-purple-950" },
];

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-8">
      {/* Hero */}
      <section className="py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-semibold text-white mb-4 leading-tight">
          Learn SQL the way you'll actually
          <br />
          be tested on it.
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
          QueryForge pairs structured lessons with AI agents that teach, quiz, and evaluate you —
          built for interview prep, not just query practice.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/register"
            className="bg-gradient-to-r from-accent-blue to-accent-purple text-black font-medium px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
          >
            Get started
          </Link>
          <Link
            href="/learn"
            className="border border-borderc text-gray-300 font-medium px-6 py-3 rounded-full hover:bg-surface-1 transition-colors"
          >
            Browse curriculum
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-12">
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-6 text-center">
          What makes this different
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((f) => (
            <div key={f.title} className="bg-surface-1 border border-borderc rounded-card p-6">
              <span className="text-xs px-2.5 py-1 rounded-full bg-surface-2 text-gray-400 mb-3 inline-block">
                {f.badge}
              </span>
              <h3 className="font-medium text-white mb-2">{f.title}</h3>
              <p className="text-sm text-gray-400">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Levels */}
      <section className="py-12 pb-24">
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-6 text-center">
          Structured by level
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {levels.map((l) => (
            <div key={l.name} className="bg-surface-1 border border-borderc rounded-card p-6 text-center">
              <span className={`text-xs px-2.5 py-1 rounded-full ${l.color} mb-3 inline-block`}>
                {l.name}
              </span>
              <p className="text-sm text-gray-400">{l.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
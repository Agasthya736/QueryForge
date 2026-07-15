const API_BASE = "http://localhost:8080/api";

export async function register(email: string, password: string, displayName: string) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, displayName }),
  });
  if (!res.ok) throw new Error((await res.json()).error || "Registration failed");
  return res.json();
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error((await res.json()).error || "Login failed");
  return res.json();
}
export async function getTopics() {
  const res = await fetch(`${API_BASE}/curriculum/topics`);
  if (!res.ok) throw new Error("Failed to load topics");
  return res.json();
}

export async function getTopicWithLessons(slug: string) {
  const res = await fetch(`${API_BASE}/curriculum/topics/${slug}`);
  if (!res.ok) throw new Error("Failed to load topic");
  return res.json();
}
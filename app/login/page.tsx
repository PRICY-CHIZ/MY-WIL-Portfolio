"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) { setError(data.message ?? "Could not log in."); return; }
      const next = searchParams.get("next");
      router.replace(next?.startsWith("/") ? next : data.redirectTo);
      router.refresh();
    } catch { setError("Could not connect to the server. Please try again."); }
    finally { setLoading(false); }
  }

  return <main className="container" style={{ maxWidth: 520, paddingTop: 60 }}>
    <Link className="muted" href="/">← Back to home</Link>
    <section className="panel" style={{ marginTop: 18 }}>
      <h1 style={{ fontSize: 30, marginTop: 0 }}>Welcome back</h1>
      <p className="muted">Sign in to your Team RBAC account.</p>
      <form onSubmit={submit}>
        <label className="field">Email address<input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <label className="field">Password<input type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} /></label>
        {error && <p role="alert" style={{ color: "#fca5a5" }}>{error}</p>}
        <button className="btn" disabled={loading} style={{ width: "100%", marginTop: 8 }}>{loading ? "Signing in…" : "Log in"}</button>
      </form>
      <p className="muted" style={{ marginBottom: 0, marginTop: 18 }}>No account? <Link href="/signup" style={{ color: "#a5b4fc" }}>Create one</Link></p>
    </section>
  </main>;
}

"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setLoading(true);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (!response.ok) { setError(data.message ?? "Could not create account."); return; }
      router.replace(data.redirectTo ?? "/user"); router.refresh();
    } catch { setError("Could not connect to the server. Please try again."); }
    finally { setLoading(false); }
  }

  return <main className="container" style={{ maxWidth: 520, paddingTop: 60 }}>
    <Link className="muted" href="/">← Back to home</Link>
    <section className="panel" style={{ marginTop: 18 }}>
      <h1 style={{ fontSize: 30, marginTop: 0 }}>Create your account</h1>
      <p className="muted">New accounts start with the User role.</p>
      <form onSubmit={submit}>
        <label className="field">Full name<input autoComplete="name" required minLength={2} maxLength={80} value={name} onChange={(e) => setName(e.target.value)} /></label>
        <label className="field">Email address<input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <label className="field">Password<input type="password" autoComplete="new-password" required minLength={10} value={password} onChange={(e) => setPassword(e.target.value)} /><span className="muted">Use at least 10 characters.</span></label>
        {error && <p role="alert" style={{ color: "#fca5a5" }}>{error}</p>}
        <button className="btn" disabled={loading} style={{ width: "100%", marginTop: 8 }}>{loading ? "Creating account…" : "Sign up"}</button>
      </form>
      <p className="muted" style={{ marginBottom: 0, marginTop: 18 }}>Already registered? <Link href="/login" style={{ color: "#a5b4fc" }}>Log in</Link></p>
    </section>
  </main>;
}

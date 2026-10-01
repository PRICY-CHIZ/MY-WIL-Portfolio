"use client";

import { FormEvent, useState } from "react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setMessage("Creating account...");

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();
    setMessage(data.message ?? "Signup completed.");

    if (response.ok) {
      window.location.href = "/login";
    }
  }

  return (
    <main style={{ padding: 40, maxWidth: 420, margin: "auto" }}>
      <h1>Create account</h1>
      <form onSubmit={submit}>
        <input
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ display: "block", width: "100%", padding: 12, marginBottom: 12 }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ display: "block", width: "100%", padding: 12, marginBottom: 12 }}
        />
        <input
          type="password"
          placeholder="Password (8+ characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          required
          style={{ display: "block", width: "100%", padding: 12, marginBottom: 12 }}
        />
        <button type="submit" style={{ padding: "12px 20px" }}>
          Sign up
        </button>
      </form>
      <p>{message}</p>
    </main>
  );
}
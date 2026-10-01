"use client";

import { FormEvent, useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setMessage("Logging in...");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    setMessage(data.message ?? "Login completed.");

    if (response.ok) {
      window.location.href = "/dashboard";
    }
  }

  return (
    <main style={{ padding: 40, maxWidth: 420, margin: "auto" }}>
      <h1>Login</h1>
      <form onSubmit={submit}>
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
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ display: "block", width: "100%", padding: 12, marginBottom: 12 }}
        />
        <button type="submit" style={{ padding: "12px 20px" }}>
          Login
        </button>
      </form>
      <p>{message}</p>
    </main>
  );
}
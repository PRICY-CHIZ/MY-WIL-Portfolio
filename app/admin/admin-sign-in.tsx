"use client";

import { FormEvent, useState } from "react";

type LoginResponse = {
  message?: string;
  user?: { role?: string };
};

export default function AdminSignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("Signing in...");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data: LoginResponse = await response.json();

      if (!response.ok) {
        setMessage(data.message ?? "Unable to sign in.");
        return;
      }

      if (data.user?.role !== "ADMIN") {
        await fetch("/api/auth/logout", { method: "POST" });
        setMessage("This account does not have administrator access.");
        return;
      }

      window.location.assign("/admin");
    } catch {
      setMessage("Unable to reach the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main style={{ padding: 40, maxWidth: 420, margin: "auto" }}>
      <h1>Admin sign in</h1>
      <p>Sign in with an administrator account.</p>
      <form onSubmit={submit}>
        <label style={{ display: "block", marginBottom: 12 }}>
          Email
          <input
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            style={{ display: "block", width: "100%", padding: 12, marginTop: 6 }}
          />
        </label>
        <label style={{ display: "block", marginBottom: 12 }}>
          Password
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            style={{ display: "block", width: "100%", padding: 12, marginTop: 6 }}
          />
        </label>
        <button type="submit" disabled={isSubmitting} style={{ padding: "12px 20px" }}>
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <p role="status">{message}</p>
    </main>
  );
}
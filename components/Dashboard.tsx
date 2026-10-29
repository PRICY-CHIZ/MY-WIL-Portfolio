"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ROLE_DESCRIPTIONS, ROLE_LABELS, ROLE_PERMISSIONS, ROLE_COLORS } from "@/lib/permissions";
import type { Role } from "@prisma/client";

type Props = { role: Role; name: string; email: string };

export default function Dashboard({ role, name, email }: Props) {
  const router = useRouter();
  const allRoles: Role[] = ["SUPER_ADMIN", "ADMIN", "MANAGER", "USER"];
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login"); router.refresh();
  }
  return <main className="container" style={{ paddingBottom: 50 }}>
    <header className="topbar">
      <div><Link href="/" className="muted">TEAM RBAC / HOME</Link><h1 style={{ fontSize: 28, margin: "8px 0" }}>{ROLE_LABELS[role]} Dashboard</h1><p className="muted" style={{ margin: 0 }}>Signed in as {name} · {email}</p></div>
      <button className="btn btn-secondary" onClick={logout}>Log out</button>
    </header>
    <section className={`panel ${ROLE_COLORS[role]}`} style={{ marginBottom: 20 }}>
      <span className="pill">{ROLE_LABELS[role]}</span><h2 style={{ fontSize: 25 }}>Welcome, {name}</h2><p className="muted">{ROLE_DESCRIPTIONS[role]}</p>
      <h3>Permissions for your role</h3>
      <ul style={{ lineHeight: 2 }}>{ROLE_PERMISSIONS[role].map((permission) => <li key={permission}>{permission}</li>)}</ul>
    </section>
    <h2 style={{ fontSize: 22 }}>Role overview</h2>
    <div className="grid">
      {allRoles.map((r) => <article className={`panel ${ROLE_COLORS[r]}`} key={r}>
        <h3 style={{ marginTop: 0 }}>{ROLE_LABELS[r]}</h3><p className="muted">{ROLE_DESCRIPTIONS[r]}</p>
        <Link className="btn btn-secondary" href={r === "SUPER_ADMIN" ? "/super-admin" : r === "ADMIN" ? "/admin" : r === "MANAGER" ? "/manager" : "/user"}>Open role area</Link>
      </article>)}
    </div>
    <p className="muted" style={{ marginTop: 22, fontSize: 13 }}>Role pages and API routes enforce access on the server. Hiding a link in the interface is not used as a security control.</p>
  </main>;
}

import Link from "next/link";
import { getSession, ROLE_HOME } from "@/lib/auth";
import { ROLE_DESCRIPTIONS, ROLE_LABELS, ROLE_PERMISSIONS } from "@/lib/permissions";
import { Role } from "@prisma/client";

const roles: Role[] = [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.USER];

export default async function HomePage() {
  const session = await getSession();
  return (
    <main className="container" style={{ paddingBottom: 60 }}>
      <header className="topbar">
        <div><div className="muted" style={{ fontSize: 12, letterSpacing: 2 }}>ACCESS CONTROL PLATFORM</div><h1 style={{ fontSize: 26, margin: "6px 0" }}>Team RBAC Management</h1></div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {session ? <Link className="btn" href={ROLE_HOME[session.role]}>Open dashboard</Link> : <><Link className="btn btn-secondary" href="/login">Log in</Link><Link className="btn" href="/signup">Create account</Link></>}
        </div>
      </header>
      <section style={{ padding: "28px 0 32px" }}>
        <span className="pill">Next.js 16 · PostgreSQL · Prisma</span>
        <h2 style={{ fontSize: "clamp(30px, 5vw, 48px)", lineHeight: 1.12, maxWidth: 760, margin: "18px 0" }}>One system. Four roles. Clear permissions.</h2>
        <p className="muted" style={{ maxWidth: 720, lineHeight: 1.8 }}>A starter role-based access control application with secure password hashing, signed HTTP-only sessions, protected dashboards, and role-aware API endpoints.</p>
      </section>
      <section className="grid">
        {roles.map((role) => (
          <article className={`panel ${role === Role.SUPER_ADMIN ? "purple" : role === Role.ADMIN ? "blue" : role === Role.MANAGER ? "green" : "orange"}`} key={role}>
            <div style={{ fontSize: 26 }}>{role === Role.SUPER_ADMIN ? "♛" : role === Role.ADMIN ? "🛡️" : role === Role.MANAGER ? "👥" : "👤"}</div>
            <h3 style={{ fontSize: 21, margin: "12px 0 8px" }}>{ROLE_LABELS[role]}</h3>
            <p className="muted" style={{ lineHeight: 1.6, minHeight: 70 }}>{ROLE_DESCRIPTIONS[role]}</p>
            <ul className="muted" style={{ paddingLeft: 20, lineHeight: 1.9 }}>{ROLE_PERMISSIONS[role].slice(0, 3).map((p) => <li key={p}>{p}</li>)}</ul>
            <Link className="btn btn-secondary" href="/login" style={{ marginTop: 12 }}>Sign in as {ROLE_LABELS[role]}</Link>
          </article>
        ))}
      </section>
      <p className="muted" style={{ marginTop: 28, fontSize: 13 }}>Public sign-up always creates a standard User account. Higher roles must be assigned by an authorized administrator.</p>
    </main>
  );
}

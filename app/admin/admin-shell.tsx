"use client";

import { useState } from "react";

type UserRow = {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
};

type AdminShellProps = {
  user: {
    name: string;
    email: string;
    role: string;
  };
  users: UserRow[];
};

export default function AdminShell({ user, users }: AdminShellProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const totalUsers = users.length;
  const adminUsers = users.filter((row) => row.role === "ADMIN").length;
  const regularUsers = totalUsers - adminUsers;

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/login";
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f3f4f6" }}>
      <aside
        style={{
          width: 260,
          background: "#111827",
          color: "white",
          padding: "32px 20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}
      >
        <div>
          <h2 style={{ margin: "0 0 24px", fontSize: 28 }}>Admin</h2>

          <nav style={{ display: "grid", gap: 12 }}>
            {[
              "Overview",
              "Users",
              "Security",
              "Reports",
              "Settings"
            ].map((item, index) => (
              <div
                key={item}
                style={{
                  padding: "12px 14px",
                  borderRadius: 10,
                  background: index === 0 ? "rgba(255,255,255,0.12)" : "transparent",
                  fontWeight: index === 0 ? 700 : 500
                }}
              >
                {item}
              </div>
            ))}
          </nav>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          style={{
            background: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: 10,
            padding: "12px 16px",
            cursor: "pointer",
            fontWeight: 700
          }}
        >
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
      </aside>

      <main style={{ flex: 1, padding: 40 }}>
        <header
          style={{
            background: "white",
            borderRadius: 18,
            padding: 24,
            boxShadow: "0 12px 30px rgba(15, 23, 42, 0.06)",
            marginBottom: 24
          }}
        >
          <p style={{ margin: 0, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1.2 }}>
            Administration
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 16,
              marginTop: 10,
              flexWrap: "wrap"
            }}
          >
            <div>
              <h1 style={{ margin: 0, fontSize: 36 }}>Admin Dashboard</h1>
              <p style={{ margin: "8px 0 0", color: "#4b5563" }}>
                Welcome back, {user.name}
              </p>
            </div>

            <div
              style={{
                background: "#eef2ff",
                color: "#4338ca",
                borderRadius: 999,
                padding: "10px 16px",
                fontWeight: 700
              }}
            >
              {user.role}
            </div>
          </div>
        </header>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 16,
            marginBottom: 24
          }}
        >
          {[
            { label: "Total users", value: totalUsers, bg: "#2563eb" },
            { label: "Admins", value: adminUsers, bg: "#7c3aed" },
            { label: "Regular users", value: regularUsers, bg: "#16a34a" },
            { label: "System", value: "Online", bg: "#dc2626" }
          ].map((card) => (
            <div
              key={card.label}
              style={{
                background: card.bg,
                color: "white",
                borderRadius: 18,
                padding: 20,
                boxShadow: "0 12px 28px rgba(0,0,0,0.08)"
              }}
            >
              <div style={{ opacity: 0.9, fontSize: 14 }}>{card.label}</div>
              <div style={{ fontSize: 32, fontWeight: 800, marginTop: 10 }}>{card.value}</div>
            </div>
          ))}
        </section>

        <section
          style={{
            background: "white",
            borderRadius: 18,
            padding: 24,
            boxShadow: "0 12px 30px rgba(15, 23, 42, 0.06)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ margin: 0 }}>Registered users</h2>
            <span style={{ color: "#6b7280" }}>{users.length} records</span>
          </div>

          {users.length === 0 ? (
            <p style={{ margin: 0, color: "#4b5563" }}>No users have signed up yet.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>
                    <th style={{ padding: "12px 10px" }}>Name</th>
                    <th style={{ padding: "12px 10px" }}>Email</th>
                    <th style={{ padding: "12px 10px" }}>Role</th>
                    <th style={{ padding: "12px 10px" }}>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((member) => (
                    <tr key={member.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                      <td style={{ padding: "12px 10px" }}>{member.name}</td>
                      <td style={{ padding: "12px 10px" }}>{member.email}</td>
                      <td style={{ padding: "12px 10px" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "6px 10px",
                            borderRadius: 999,
                            background: member.role === "ADMIN" ? "#ede9fe" : "#dcfce7",
                            color: member.role === "ADMIN" ? "#5b21b6" : "#166534",
                            fontWeight: 700
                          }}
                        >
                          {member.role}
                        </span>
                      </td>
                      <td style={{ padding: "12px 10px" }}>
                        {new Date(member.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import AdminSignIn from "./admin-sign-in";
import AdminShell from "./admin-shell";

export default async function AdminPage() {
  const user = await getCurrentUser();

  if (!user) {
    return <AdminSignIn />;
  }

  if (user.role !== "ADMIN") {
    return (
      <main style={{ padding: 40, maxWidth: 900, margin: "0 auto" }}>
        <h1>Access denied</h1>
        <p>This page is for administrators only.</p>
      </main>
    );
  }

  const result = await db.query(
    `
      SELECT id, name, email, role, created_at
      FROM users
      ORDER BY created_at DESC
    `
  );

  return <AdminShell user={user} users={result.rows} />;
}

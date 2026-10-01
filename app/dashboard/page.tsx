import { getCurrentUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <main style={{ padding: 40, maxWidth: 800, margin: "auto" }}>
      <h1>Dashboard</h1>
      {user ? (
        <>
          <p>Welcome, {user.name}.</p>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
        </>
      ) : (
        <p>You are not logged in. Use the login page or /api/auth/login.</p>
      )}
    </main>
  );
}

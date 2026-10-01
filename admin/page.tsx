import { getCurrentUser } from "@/lib/auth";

export default async function AdminPage() {
  const user = await getCurrentUser();

  if (!user) {
    return <main style={{ padding: 40 }}><h1>Login required</h1></main>;
  }

  if (user.role !== "ADMIN") {
    return (
      <main style={{ padding: 40 }}>
        <h1>Access denied</h1>
        <p>This page is for administrators only.</p>
      </main>
    );
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user.name}.</p>
      <p>You are authenticated as an administrator.</p>
    </main>
  );
}
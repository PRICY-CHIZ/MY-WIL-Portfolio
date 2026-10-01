export default function Home() {
  return (
    <main style={{ padding: 40, maxWidth: 800, margin: "auto" }}>
      <h1>Next.js 16 Backend API + PostgreSQL</h1>
      <p>Authentication API is ready.</p>

      <h2>Available endpoints</h2>
      <ul>
        <li>POST /api/auth/signup</li>
        <li>POST /api/auth/login</li>
        <li>POST /api/auth/logout</li>
        <li>GET /api/auth/me</li>
        <li>GET /api/users</li>
        <li>GET /api/admin</li>
      </ul>

      <p>
        Use Postman, Thunder Client, curl, or your frontend to test the API.
      </p>
    </main>
  );
}
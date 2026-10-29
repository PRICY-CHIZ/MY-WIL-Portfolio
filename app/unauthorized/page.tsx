import Link from "next/link";

export default function UnauthorizedPage() {
  return <main className="container" style={{ maxWidth: 650, paddingTop: 80 }}>
    <section className="panel"><h1>Access denied</h1><p className="muted">Your current role does not have permission to open that page.</p><Link className="btn" href="/">Return home</Link></section>
  </main>;
}

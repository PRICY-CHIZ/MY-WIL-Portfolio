import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js 16 Auth API",
  description: "Next.js 16 PostgreSQL backend API with authentication"
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "Arial, sans-serif", margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
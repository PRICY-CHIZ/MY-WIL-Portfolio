require("dotenv").config({ path: ".env.local" });

const { Client } = require("pg");

async function main() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is missing. Create .env.local first.");
  }

  const client = new Client({
    connectionString,
    connectionTimeoutMillis: 5000
  });

  try {
    await client.connect();

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'USER',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    console.log("Database initialized successfully.");
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error("Database initialization failed:", error.message);
  process.exit(1);
});
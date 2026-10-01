const bcrypt = require("bcryptjs");
const { Client } = require("pg");

async function main() {
  const client = new Client({
    connectionString:
      process.env.DATABASE_URL || "postgresql://postgres:admin123@localhost:5432/nextauth"
  });

  await client.connect();

  const email = "admin@admin.com";
  const password = "admin12345";
  const hash = await bcrypt.hash(password, 12);

  const existing = await client.query("SELECT id FROM users WHERE email = $1", [email]);

  if (existing.rowCount) {
    await client.query(
      "UPDATE users SET name = $1, password_hash = $2, role = $3 WHERE email = $4",
      ["Admin User", hash, "ADMIN", email]
    );
    console.log("Admin account updated:", email);
  } else {
    await client.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4)",
      ["Admin User", email, hash, "ADMIN"]
    );
    console.log("Admin account created:", email);
  }

  await client.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

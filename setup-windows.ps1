$ErrorActionPreference = "Stop"
if (-not (Test-Path ".env")) {
  Copy-Item ".env.example" ".env"
  Write-Host "Created .env. Edit DATABASE_URL, AUTH_SECRET, and SUPER_ADMIN_PASSWORD before continuing." -ForegroundColor Yellow
}
npm install
npx prisma generate
Write-Host "Next: configure PostgreSQL in .env, then run: npx prisma migrate dev --name init" -ForegroundColor Green
Write-Host "Then run: npm run db:seed ; npm run dev"

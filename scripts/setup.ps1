$ErrorActionPreference = "Stop"

Write-Host "Starting Postgres (Docker)..." -ForegroundColor Cyan
docker compose up -d

Write-Host "Generating Prisma client..." -ForegroundColor Cyan
npm.cmd run prisma:generate

Write-Host "Running database migrations..." -ForegroundColor Cyan
npx.cmd prisma migrate dev

Write-Host "Done. Start the app with: npm run dev" -ForegroundColor Green


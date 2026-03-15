#!/bin/sh
echo "Running Prisma migrations..."
npx prisma migrate deploy
echo "Seeding database..."
npx prisma db seed || echo "Seed skipped (already done)"
echo "Starting NestJS..."
exec node dist/main

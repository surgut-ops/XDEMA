#!/bin/sh
set -e

echo "=== Pushing Prisma schema to database ==="
npx prisma db push --accept-data-loss
echo "=== Schema pushed successfully ==="

echo "=== Seeding database ==="
npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts || echo "Seed skipped"
echo "=== Seed done ==="

echo "=== Starting NestJS ==="
exec node dist/main

#!/bin/bash
# Vercel prebuild: switch Prisma to PostgreSQL (idempotent)
sed -i 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma
echo "Prisma provider set to PostgreSQL"

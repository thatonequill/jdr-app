#!/bin/sh
set -ex

# 1. Clean the Prisma Client to ensure no stale metadata exists in node_modules
echo "--- Regenerating Prisma Client ---"
rm -rf ./node_modules/.prisma
npm run db:generate

# 2. Force Prisma to reset and push
# The --force-reset flag is critical here. It tells Prisma: 
# "I don't care if you think you're in sync; wipe the schemas and push the tables now."
echo "--- Forcing Database Reset and Push ---"
npx prisma db push --accept-data-loss --force-reset

# 3. Short sleep to allow Postgres to index the new relations
sleep 2

# 4. Verify table existence
echo "--- Verifying Table: jdr.Card ---"
psql "$DATABASE_URL" -c "\dt public.*"

# 5. Run the SQL seed
echo "--- Seeding Database ---"
npm run db:seed

# 6. Start the server
echo "--- Starting Next.js ---"
npm run dev -- -p 3001
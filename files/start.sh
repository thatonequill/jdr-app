#!/bin/sh
set -ex

# This script is designed to run inside the Next.js 'web' container
# and connect to a local Supabase instance running on the host machine
# via `supabase start`.

# Ensure the local Supabase services are running on your host machine
# before starting this container (e.g., by running `supabase start` in your terminal).

# 1. Regenerate Prisma Client
echo "--- Regenerating Prisma Client ---"
rm -rf ./node_modules/.prisma
npm run db:generate

# 2. Apply Prisma schema to the local Supabase database.
# This assumes `supabase start` has already initialized the database.
# `db push` is suitable for development to quickly sync schema changes.
# For production-like local environments, consider `npx prisma migrate dev`.
echo "--- Applying Database Schema (Prisma db push) ---"
# Use the DATABASE_URL set in docker-compose.yml which points to host.docker.internal
npx prisma db push --accept-data-loss

# 3. Short sleep to allow the database to process schema changes
# and for any potential indexing.
sleep 2

# 4. Enable Row Level Security (RLS) and create policies for Realtime
echo "--- Configuring Realtime Policies ---"

# Card Table
psql "$DATABASE_URL" -c "ALTER TABLE \"crux\".\"Card\" ENABLE ROW LEVEL SECURITY;" # This command is idempotent
psql "$DATABASE_URL" -c "DROP POLICY IF EXISTS \"Enable read access for all users on Card\" ON \"crux\".\"Card\";"
psql "$DATABASE_URL" -c "CREATE POLICY \"Enable read access for all users on Card\" ON \"crux\".\"Card\" FOR SELECT USING (true);"
echo "RLS enabled and policy created for Card table."

# Room Table
psql "$DATABASE_URL" -c "ALTER TABLE \"crux\".\"Room\" ENABLE ROW LEVEL SECURITY;" # This command is idempotent
psql "$DATABASE_URL" -c "DROP POLICY IF EXISTS \"Enable read access for all users on Room\" ON \"crux\".\"Room\";"
psql "$DATABASE_URL" -c "CREATE POLICY \"Enable read access for all users on Room\" ON \"crux\".\"Room\" FOR SELECT USING (true);"
echo "RLS enabled and policy created for Room table."

# Player Table
psql "$DATABASE_URL" -c "ALTER TABLE \"crux\".\"Player\" ENABLE ROW LEVEL SECURITY;" # This command is idempotent
psql "$DATABASE_URL" -c "DROP POLICY IF EXISTS \"Enable read access for all users on Player\" ON \"crux\".\"Player\";"
psql "$DATABASE_URL" -c "CREATE POLICY \"Enable read access for all users on Player\" ON \"crux\".\"Player\" FOR SELECT USING (true);"
echo "RLS enabled and policy created for Player table."

# Draw Table
psql "$DATABASE_URL" -c "ALTER TABLE \"crux\".\"Draw\" ENABLE ROW LEVEL SECURITY;" # This command is idempotent
psql "$DATABASE_URL" -c "DROP POLICY IF EXISTS \"Enable read access for all users on Draw\" ON \"crux\".\"Draw\";"
psql "$DATABASE_URL" -c "CREATE POLICY \"Enable read access for all users on Draw\" ON \"crux\".\"Draw\" FOR SELECT USING (true);"
echo "RLS enabled and policy created for Draw table."

# 5. Add tables to Supabase Realtime publication
echo "--- Enabling Realtime for Tables ---"
psql "$DATABASE_URL" -c "ALTER PUBLICATION supabase_realtime ADD TABLE \"crux\".\"Card\";" || true
echo "Card table added to Realtime publication."
psql "$DATABASE_URL" -c "ALTER PUBLICATION supabase_realtime ADD TABLE \"crux\".\"Room\";" || true
echo "Room table added to Realtime publication."
psql "$DATABASE_URL" -c "ALTER PUBLICATION supabase_realtime ADD TABLE \"crux\".\"Player\";" || true
echo "Player table added to Realtime publication."
psql "$DATABASE_URL" -c "ALTER PUBLICATION supabase_realtime ADD TABLE \"crux\".\"Draw\";" || true
echo "Draw table added to Realtime publication."

# 6. Run the SQL seed
echo "--- Seeding Database ---"
npm run db:seed
# 7. Start the Next.js development server
echo "--- Starting Next.js ---"
npm run dev -- -p 3001
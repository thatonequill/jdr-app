# Supabase Production Realtime Setup Guide

This guide outlines the steps to enable Supabase Realtime for your `Card`, `Room`, `Player`, and `Draw` tables in a production Supabase environment.

## Prerequisites

- An active Supabase project.
- Database access credentials (usually available in your Supabase project settings).
- Your Prisma schema (`schema.prisma`) should already have `@map()` annotations for your models to match the database table names.

## Steps to Enable Realtime

You can perform these steps either directly in the Supabase SQL Editor (under "SQL Editor" in your project dashboard) or by connecting to your database using a PostgreSQL client.

### 1. Ensure Prisma Schema Mapping is in Place

Your `schema.prisma` file already includes `@map("TableName")` for `Card`, `Room`, `Player`, and `Draw`. This is crucial for Supabase to correctly identify the tables.

```prisma
// /home/ariane/Projects/jdr-app/prisma/schema.prisma
model Card @map("Card") { ... }
model Room @map("Room") { ... }
model Player @map("Player") { ... }
model Draw @map("Draw") { ... }
```

### 2. Enable Row Level Security (RLS)

Supabase Realtime relies on Row Level Security (RLS) policies to determine which data changes to broadcast. You must enable RLS for each table you want to track.

Execute the following SQL commands:

```sql
ALTER TABLE "Card" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Room" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Player" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Draw" ENABLE ROW LEVEL SECURITY;
```

### 3. Create RLS Policies for Read Access

For Realtime to broadcast changes, it needs to be able to "read" the data. For publicly accessible data (like game state that all players in a room might see), you can create a broad `SELECT` policy. For more granular control (e.g., only players in a specific room can see updates for that room), you would create more complex policies.

For now, to enable basic Realtime functionality for all users, execute these policies:

```sql
-- Card Table (assuming cards are public and can be read by anyone)
CREATE POLICY "Enable read access for all users on Card" ON "Card" FOR SELECT USING (true);

-- Room Table
CREATE POLICY "Enable read access for all users on Room" ON "Room" FOR SELECT USING (true);

-- Player Table
CREATE POLICY "Enable read access for all users on Player" ON "Player" FOR SELECT USING (true);

-- Draw Table
CREATE POLICY "Enable read access for all users on Draw" ON "Draw" FOR SELECT USING (true);
```

**Note on `IF NOT EXISTS`**: In a production environment, you typically create policies once. If you need to re-run these, you might consider `DROP POLICY IF EXISTS ...` before `CREATE POLICY ...` to avoid errors. However, for a fresh setup, the `CREATE POLICY` commands are sufficient.

### 4. Add Tables to Supabase Realtime Publication

Finally, you need to explicitly tell PostgreSQL (and thus Supabase Realtime) which tables to monitor for changes by adding them to the `supabase_realtime` publication.

Execute the following SQL commands:

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE "Card";
ALTER PUBLICATION supabase_realtime ADD TABLE "Room";
ALTER PUBLICATION supabase_realtime ADD TABLE "Player";
ALTER PUBLICATION supabase_realtime ADD TABLE "Draw";
```

### 5. Verify in Supabase Dashboard

After executing these SQL commands, navigate to your Supabase project dashboard:

1.  Go to "Database" -> "Realtime".
2.  You should see `Card`, `Room`, `Player`, and `Draw` listed under "Tables" and enabled for Realtime. If not, you might need to manually toggle them on.

---

This completes the setup for Realtime in your production Supabase environment. Your application's `GameRoom.tsx` component should now be able to receive real-time updates for these tables.This completes the setup for Realtime in your production Supabase environment. Your application's `GameRoom.tsx` component should now be able to receive real-time updates for these tables.

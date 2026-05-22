-- 1. Grant usage on the custom 'crux' schema to Supabase public roles
GRANT USAGE ON SCHEMA crux TO anon, authenticated;

-- 2. Grant select permissions on all tables inside the 'crux' schema
GRANT SELECT ON ALL TABLES IN SCHEMA crux TO anon, authenticated;

-- 3. Enable Row Level Security (RLS) on the tables
ALTER TABLE "crux"."Card" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "crux"."Room" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "crux"."Player" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "crux"."Draw" ENABLE ROW LEVEL SECURITY;

-- 4. Create policies to allow the Realtime engine to read the data
DROP POLICY IF EXISTS "Enable read access for all users on Card" ON "crux"."Card";
CREATE POLICY "Enable read access for all users on Card" ON "crux"."Card" FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable read access for all users on Room" ON "crux"."Room";
CREATE POLICY "Enable read access for all users on Room" ON "crux"."Room" FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable read access for all users on Player" ON "crux"."Player";
CREATE POLICY "Enable read access for all users on Player" ON "crux"."Player" FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable read access for all users on Draw" ON "crux"."Draw";
CREATE POLICY "Enable read access for all users on Draw" ON "crux"."Draw" FOR SELECT USING (true);

-- 5. Enable REPLICA IDENTITY FULL to broadcast the entire row on UPDATE and DELETE
ALTER TABLE "crux"."Room" REPLICA IDENTITY FULL;
ALTER TABLE "crux"."Player" REPLICA IDENTITY FULL;
ALTER TABLE "crux"."Draw" REPLICA IDENTITY FULL;
ALTER TABLE "crux"."Card" REPLICA IDENTITY FULL;

-- 6. Add the tables to the supabase_realtime publication
-- Use DO block to ignore errors if they are already added
DO $$ 
BEGIN 
    ALTER PUBLICATION supabase_realtime ADD TABLE "crux"."Card"; 
EXCEPTION WHEN OTHERS THEN 
    -- Do nothing if already added
END; 
$$;

DO $$ 
BEGIN 
    ALTER PUBLICATION supabase_realtime ADD TABLE "crux"."Room"; 
EXCEPTION WHEN OTHERS THEN 
END; 
$$;

DO $$ 
BEGIN 
    ALTER PUBLICATION supabase_realtime ADD TABLE "crux"."Player"; 
EXCEPTION WHEN OTHERS THEN 
END; 
$$;

DO $$ 
BEGIN 
    ALTER PUBLICATION supabase_realtime ADD TABLE "crux"."Draw"; 
EXCEPTION WHEN OTHERS THEN 
END; 
$$;

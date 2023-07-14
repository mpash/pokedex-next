-- Create a new table with an additional column for the new order
CREATE TABLE temp_pokemon AS
SELECT p.*, ROW_NUMBER() OVER (ORDER BY p."sourceId", p."subVariant") AS new_order
FROM "Pokemon" AS p;

-- Drop the original Pokemon table
DROP TABLE IF EXISTS "Pokemon";

-- Recreate the Pokemon table with the reordered id column
CREATE TABLE "Pokemon" AS
SELECT *
FROM temp_pokemon
ORDER BY new_order;

-- Set id of each Pokemon to the value in new_order
UPDATE "Pokemon"
SET id = new_order;

-- Drop the temporary table
DROP TABLE IF EXISTS temp_pokemon;

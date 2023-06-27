DROP TABLE lifespan CASCADE;
-- Create tables

CREATE TABLE IF NOT EXISTS lifespan (
	id SERIAL PRIMARY KEY,
    entity varchar NOT NULL,
    code varchar NOT NULL,
    year int4 NOT NULL,
    life_expectancy float8 NOT NULL
     )
;

SELECT * FROM lifespan;

SELECT COUNT(*) FROM lifespan;
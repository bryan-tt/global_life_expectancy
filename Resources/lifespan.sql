-- Drop table if exists

DROP TABLE "lifespan" cascade;


-- Create tables

CREATE TABLE "lifespan" (
    "Entity" varchar(30)   NOT NULL,
    "Code" varchar(5)   NOT NULL,
    "Year" int(5)   NOT NULL,
    "Life expectancy at birth, total (years)" float(20)   NOT NULL,
     )
;

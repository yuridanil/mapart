CREATE DATABASE "mapart"
WITH OWNER "postgres"
ENCODING = 'UTF8'
LC_COLLATE = 'en_US.UTF-8'
LC_CTYPE = 'en_US.UTF-8'
TEMPLATE template0;

CREATE USER mapart WITH PASSWORD 'mapart';

CREATE SCHEMA mapart AUTHORIZATION mapart;

CREATE TABLE mapart.images (
  id int8 GENERATED ALWAYS AS IDENTITY NOT NULL,
  title varchar(1000) DEFAULT NULL,
  "desc" text,
  lat numeric(20,16) DEFAULT NULL,
  lng numeric(20,16) DEFAULT NULL,
  zoom numeric(20,16) DEFAULT NULL,
  bearing numeric(20,16) DEFAULT NULL,
  user_id int8 DEFAULT NULL,
  filters text,
  likes int NOT NULL DEFAULT '0',
  shown smallint DEFAULT '1',
  width int DEFAULT NULL,
  height int DEFAULT NULL,
  category varchar(100) DEFAULT NULL,
  tags text,
  CONSTRAINT images_pk PRIMARY KEY (id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA mapart TO mapart;

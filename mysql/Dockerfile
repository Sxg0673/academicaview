FROM mysql:8.0
COPY schema.sql /docker-entrypoint-initdb.d/01-schema.sql
COPY seed_estudiantes.sql /docker-entrypoint-initdb.d/02-seed.sql

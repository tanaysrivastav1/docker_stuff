# Use the official PostgreSQL image as the base image
FROM postgres:13-alpine

# Set environment variables for PostgreSQL (these should be overridden in production or OpenShift)
ENV POSTGRES_USER=postgres_user
ENV POSTGRES_PASSWORD=postgres_password
ENV POSTGRES_DB=wallet_db

# Expose PostgreSQL's default port
EXPOSE 5432

# Add a SQL script to initialize the database if needed
# (Optional) Copy any SQL scripts for table creation or data initialization
COPY ./init.sql /docker-entrypoint-initdb.d/

# This will use the default entrypoint for PostgreSQL
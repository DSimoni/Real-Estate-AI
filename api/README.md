
# RealEstateApi (ASP.NET Core 8)

Minimal Web API to read real-estate listings from a PostgreSQL table `public.listings`.

## Endpoints
- `GET /api/listings` — latest items (supports pagination & filters)
- `GET /api/listings/{id}` — single listing
- `GET /api/listings/search` — search by `title`, `maxPrice`, `since` (ISO date)
- `GET /health` — health probe

## Quick start (Docker)
1) Build & run the API container:
```bash
docker build -t realestate-api ./src/RealEstateApi
docker run --rm -p 5000:5000   -e ASPNETCORE_URLS=http://+:5000   -e ConnectionStrings__Postgres="Host=db;Port=5432;Database=listings;Username=api_user;Password=ApiPass123"   realestate-api
```
(Replace the connection string according to your setup.)

2) Or add this service to your docker-compose:
```yaml
  api:
    build: ./api
    environment:
      ConnectionStrings__Postgres: Host=db;Port=5432;Database=listings;Username=api_user;Password=ApiPass123
      ASPNETCORE_URLS: http://+:5000
    ports:
      - "5000:5000"
    depends_on:
      db:
        condition: service_healthy
    restart: always
```

## Development (local)
- .NET 8 SDK
- Set `ConnectionStrings:Postgres` in `appsettings.Development.json` to your local DB.
- Run:
```bash
dotnet run --project src/RealEstateApi
```
Swagger UI at `http://localhost:5000/swagger` (Development only).

## PostgreSQL schema (expected)
```
CREATE TABLE IF NOT EXISTS public.listings
(
    id integer NOT NULL DEFAULT nextval('listings_id_seq'::regclass),
    title character varying(1024) NOT NULL,
    link character varying(2048) NOT NULL,
    price numeric(10,2),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT listings_pkey PRIMARY KEY (id),
    CONSTRAINT listings_link_key UNIQUE (link)
);
```

-- =========================
-- EXTENSIONES
-- =========================
create extension if not exists "uuid-ossp";

-- =========================
-- PROFILES
-- =========================
create table profiles (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null unique references auth.users(id) on delete cascade,
    full_name text not null,
    email text not null unique,
    created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "profiles_select"
on profiles
for select
using (auth.uid() = user_id);

create policy "profiles_insert"
on profiles
for insert
with check (auth.uid() = user_id);

create policy "profiles_update"
on profiles
for update
using (auth.uid() = user_id);

create policy "profiles_delete"
on profiles
for delete
using (auth.uid() = user_id);

-- =========================
-- CUSTOMERS
-- =========================
create table customers (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references auth.users(id) on delete cascade,
    name text not null,
    email text,
    created_at timestamptz not null default now()
);

alter table customers enable row level security;

create policy "customers_select"
on customers
for select
using (auth.uid() = user_id);

create policy "customers_insert"
on customers
for insert
with check (auth.uid() = user_id);

create policy "customers_update"
on customers
for update
using (auth.uid() = user_id);

create policy "customers_delete"
on customers
for delete
using (auth.uid() = user_id);

-- =========================
-- PROJECTS
-- =========================
create table projects (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references auth.users(id) on delete cascade,
    customer_id uuid references customers(id) on delete set null,
    name text not null,
    description text,
    status text not null default 'active'
                  check (status in ('active', 'paused', 'completed', 'archived')),
    hourly_rate numeric(10,2),
    created_at timestamptz not null default now()
);

alter table projects enable row level security;

create policy "projects_select"
on projects
for select
using (auth.uid() = user_id);

create policy "projects_insert"
on projects
for insert
with check (auth.uid() = user_id);

create policy "projects_update"
on projects
for update
using (auth.uid() = user_id);

create policy "projects_delete"
on projects
for delete
using (auth.uid() = user_id);

-- =========================
-- TIME LOGS
-- =========================
create table time_logs (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references auth.users(id) on delete cascade,
    project_id uuid not null references projects(id) on delete cascade,
    start_time timestamptz not null,
    end_time timestamptz,
    duration_seconds integer generated always as (
                       extract(epoch from (end_time - start_time))::integer
                     ) stored,
    description text,
    created_at timestamptz not null default now(),
    constraint time_logs_order check (end_time is null or end_time > start_time)
);

alter table time_logs enable row level security;

create policy "time_logs_select"
on time_logs
for select
using (auth.uid() = user_id);

create policy "time_logs_insert"
on time_logs
for insert
with check (auth.uid() = user_id);

create policy "time_logs_update"
on time_logs
for update
using (auth.uid() = user_id);

create policy "time_logs_delete"
on time_logs
for delete
using (auth.uid() = user_id);

-- =========================
-- ÍNDICES
-- =========================
create index on customers(user_id);
create index on projects(user_id);
create index on projects(customer_id);
create index on time_logs(user_id);
create index on time_logs(project_id);
create index on time_logs(start_time desc);

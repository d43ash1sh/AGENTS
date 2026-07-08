-- Drop table if exists
drop table if exists public.listings;

-- Create listings table
create table public.listings (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  owner_id uuid references auth.users not null default auth.uid(),
  title text not null check (char_length(title) >= 3),
  description text not null check (char_length(description) >= 10),
  price numeric not null check (price >= 0),
  address text not null check (char_length(address) >= 5),
  latitude double precision not null check (latitude between -90 and 90),
  longitude double precision not null check (longitude between -180 and 180),
  distance_to_rgu double precision not null check (distance_to_rgu >= 0),
  room_type text not null check (room_type in ('single', 'shared', 'apartment', 'other')),
  amenities text[] default '{}'::text[] not null,
  status text not null default 'available' check (status in ('available', 'rented', 'unavailable')),
  contact_phone text not null check (char_length(contact_phone) >= 8)
);

-- Enable Row Level Security (RLS)
alter table public.listings enable row level security;

-- Policies for public access
create policy "Allow public read access"
  on public.listings for select
  using (true);

-- Policies for authenticated listing owners
create policy "Allow owners to insert listings"
  on public.listings for insert
  with check (auth.uid() = owner_id);

create policy "Allow owners to update their own listings"
  on public.listings for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "Allow owners to delete their own listings"
  on public.listings for delete
  using (auth.uid() = owner_id);

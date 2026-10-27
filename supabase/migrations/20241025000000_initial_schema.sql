-- ============================================================
-- Artworks by Smartist – Initial Schema
-- ============================================================
create extension if not exists "uuid-ossp";

-- profiles
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text, avatar_url text, phone text, address text,
  created_at timestamptz default now()
);
alter table profiles enable row level security;
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

-- products
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  _id text unique, name text not null, overview text, description text,
  price numeric(10,2), category text, images jsonb default '[]'::jsonb,
  in_stock boolean default true, created_at timestamptz default now()
);
alter table products enable row level security;
create policy "Products are publicly viewable" on products for select using (true);
create policy "Admins can modify products" on products for all using (auth.role() = 'service_role');

-- images
create table if not exists images (
  id uuid primary key default uuid_generate_v4(),
  url text not null, alt text, product_id uuid references products(id) on delete cascade,
  created_at timestamptz default now()
);
alter table images enable row level security;
create policy "Images are publicly viewable" on images for select using (true);
create policy "Admins can modify images" on images for all using (auth.role() = 'service_role');

-- blogs
create table if not exists blogs (
  id uuid primary key default uuid_generate_v4(),
  _id text unique, title text not null, description text, image text, content text,
  created_at timestamptz default now()
);
alter table blogs enable row level security;
create policy "Blogs are publicly viewable" on blogs for select using (true);
create policy "Admins can modify blogs" on blogs for all using (auth.role() = 'service_role');

-- tutorials
create table if not exists tutorials (
  id uuid primary key default uuid_generate_v4(),
  title text not null, description text, image text, video_url text, content text,
  created_at timestamptz default now()
);
alter table tutorials enable row level security;
create policy "Tutorials are publicly viewable" on tutorials for select using (true);
create policy "Admins can modify tutorials" on tutorials for all using (auth.role() = 'service_role');

-- orders
create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete set null,
  customer_name text, customer_email text, total_amount numeric(10,2),
  status text default 'pending', shipping_address jsonb, notes text,
  created_at timestamptz default now()
);
alter table orders enable row level security;
create policy "Users can view own orders" on orders for select using (auth.uid() = user_id);
create policy "Users can insert own orders" on orders for insert with check (auth.uid() = user_id);
create policy "Admins can manage orders" on orders for all using (auth.role() = 'service_role');

-- order_items
create table if not exists order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  product_name text, quantity integer not null default 1, unit_price numeric(10,2),
  created_at timestamptz default now()
);
alter table order_items enable row level security;
create policy "Order items follow order" on order_items for select using (
  exists (select 1 from orders where orders.id = order_id and orders.user_id = auth.uid())
);
create policy "Admins can manage order items" on order_items for all using (auth.role() = 'service_role');

-- commissions
create table if not exists commissions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete set null,
  customer_name text, customer_email text, description text, size text, medium text,
  reference_images jsonb default '[]'::jsonb, budget numeric(10,2), deadline date,
  status text default 'pending', notes text, created_at timestamptz default now()
);
alter table commissions enable row level security;
create policy "Users can view own commissions" on commissions for select using (auth.uid() = user_id);
create policy "Anyone can submit a commission" on commissions for insert with check (true);
create policy "Admins can manage commissions" on commissions for all using (auth.role() = 'service_role');

-- contact_messages
create table if not exists contact_messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null, email text not null, subject text, message text not null,
  status text default 'unread', created_at timestamptz default now()
);
alter table contact_messages enable row level security;
create policy "Anyone can send contact messages" on contact_messages for insert with check (true);
create policy "Admins can manage contact messages" on contact_messages for all using (auth.role() = 'service_role');

-- newsletter_subscribers
create table if not exists newsletter_subscribers (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null, subscribed_at timestamptz default now()
);
alter table newsletter_subscribers enable row level security;
create policy "Anyone can subscribe" on newsletter_subscribers for insert with check (true);
create policy "Admins can manage subscribers" on newsletter_subscribers for all using (auth.role() = 'service_role');

-- testimonials
create table if not exists testimonials (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete set null,
  author_name text not null, author_email text, content text not null,
  rating integer check (rating between 1 and 5), approved boolean default false,
  created_at timestamptz default now()
);
alter table testimonials enable row level security;
create policy "Approved testimonials are public" on testimonials for select using (approved = true);
create policy "Anyone can submit a testimonial" on testimonials for insert with check (true);
create policy "Admins can manage testimonials" on testimonials for all using (auth.role() = 'service_role');

-- about_page
create table if not exists about_page (
  id uuid primary key default uuid_generate_v4(),
  hero_title text, hero_subtitle text, bio text, profile_image text,
  social_links jsonb default '{}'::jsonb, updated_at timestamptz default now()
);
alter table about_page enable row level security;
create policy "About page is public" on about_page for select using (true);
create policy "Admins can manage about page" on about_page for all using (auth.role() = 'service_role');

-- achievements
create table if not exists achievements (
  id uuid primary key default uuid_generate_v4(),
  title text not null, description text, image text, date date,
  created_at timestamptz default now()
);
alter table achievements enable row level security;
create policy "Achievements are public" on achievements for select using (true);
create policy "Admins can manage achievements" on achievements for all using (auth.role() = 'service_role');

-- policies (legal pages)
create table if not exists policies (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null, title text not null, content text,
  updated_at timestamptz default now()
);
alter table policies enable row level security;
create policy "Policies are public" on policies for select using (true);
create policy "Admins can manage policies" on policies for all using (auth.role() = 'service_role');

insert into policies (slug, title, content) values
  ('privacy-policy', 'Privacy Policy', 'Privacy policy content goes here.'),
  ('return-policy', 'Return Policy', 'Return policy content goes here.'),
  ('shipping-policy', 'Shipping Policy', 'Shipping policy content goes here.'),
  ('terms-of-service', 'Terms of Service', 'Terms of service content goes here.')
on conflict (slug) do nothing;

-- Storage bucket: invoices
insert into storage.buckets (id, name, public) values ('invoices', 'invoices', false)
on conflict (id) do nothing;

create policy "Admins can upload invoices" on storage.objects for insert
  with check (bucket_id = 'invoices' and auth.role() = 'service_role');
create policy "Users can view own invoices" on storage.objects for select
  using (bucket_id = 'invoices' and auth.uid()::text = (storage.foldername(name))[1]);

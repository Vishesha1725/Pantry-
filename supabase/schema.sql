create extension if not exists "uuid-ossp";

create type buying_mode as enum ('same_day_fresh','daily_use','weekly_fresh','monthly_staple','quarterly_bulk','recipe_based','one_time');
create type storage_type as enum ('fridge','freezer','pantry','utility');
create type stock_status as enum ('in_stock','low_stock','out_of_stock');
create type freshness_priority as enum ('high','medium','low','non_food');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  vegetarian boolean default true not null,
  no_soya boolean default true not null,
  no_tofu boolean default true not null,
  no_mushrooms boolean default true not null,
  prefer_high_protein boolean default true not null,
  pcos_friendly boolean default true not null,
  thyroid_friendly boolean default true not null,
  created_at timestamptz default now() not null
);

create table pantry_items (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  category text not null,
  quantity numeric default 0 not null,
  unit text not null,
  buying_mode buying_mode not null,
  purchase_date date,
  expiry_date date,
  shelf_life_days integer default 0 not null,
  storage_type storage_type default 'pantry' not null,
  stock_status stock_status default 'in_stock' not null,
  daily_usage_quantity numeric,
  daily_usage_unit text,
  reorder_threshold_quantity numeric,
  reorder_threshold_unit text,
  freshness_priority freshness_priority default 'medium' not null,
  avoid_stocking boolean default false not null,
  notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table recipes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  meal_type text not null,
  cuisine text not null,
  prep_time integer not null,
  protein_level text not null,
  difficulty text not null,
  freshness_requirement text not null,
  main_protein text not null,
  tags text[] default '{}',
  instructions text[] default '{}',
  is_seed boolean default false not null,
  created_at timestamptz default now() not null
);

create table recipe_ingredients (
  id uuid primary key default uuid_generate_v4(),
  recipe_id uuid references recipes(id) on delete cascade not null,
  name text not null,
  quantity numeric not null,
  unit text not null,
  category text not null,
  buying_mode buying_mode not null,
  optional boolean default false not null,
  freshness_rule text
);

create table weekly_recipe_plans (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  week_start date not null,
  status text default 'draft' not null,
  created_at timestamptz default now() not null
);

create table weekly_plan_recipes (
  id uuid primary key default uuid_generate_v4(),
  weekly_plan_id uuid references weekly_recipe_plans(id) on delete cascade not null,
  recipe_id uuid references recipes(id) on delete cascade not null,
  cooking_day text not null,
  meal_slot text default 'dinner' not null
);

create table grocery_lists (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  weekly_plan_id uuid references weekly_recipe_plans(id) on delete set null,
  title text not null,
  status text default 'draft' not null,
  created_at timestamptz default now() not null
);

create table grocery_list_items (
  id uuid primary key default uuid_generate_v4(),
  grocery_list_id uuid references grocery_lists(id) on delete cascade not null,
  name text not null,
  quantity numeric not null,
  unit text not null,
  category text not null,
  buying_mode buying_mode not null,
  used_in text[] default '{}',
  freshness_rule text,
  suggested_action text,
  status text default 'need' not null,
  cooking_dates text[] default '{}',
  editable boolean default true not null
);

create table weekly_essentials (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  quantity numeric not null,
  unit text not null,
  category text not null,
  buying_mode buying_mode not null,
  enabled boolean default true not null
);

create table user_achievements (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  achievement_key text not null,
  title text not null,
  earned_at timestamptz default now() not null,
  unique(user_id, achievement_key)
);

alter table profiles enable row level security;
alter table pantry_items enable row level security;
alter table recipes enable row level security;
alter table recipe_ingredients enable row level security;
alter table weekly_recipe_plans enable row level security;
alter table weekly_plan_recipes enable row level security;
alter table grocery_lists enable row level security;
alter table grocery_list_items enable row level security;
alter table weekly_essentials enable row level security;
alter table user_achievements enable row level security;

create policy "Profiles are private" on profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "Pantry items are private" on pantry_items for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Recipes are readable seed or private" on recipes for select using (is_seed or auth.uid() = user_id);
create policy "Users manage recipes" on recipes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Recipe ingredients follow readable recipe" on recipe_ingredients for select using (exists (select 1 from recipes r where r.id = recipe_id and (r.is_seed or r.user_id = auth.uid())));
create policy "Weekly plans are private" on weekly_recipe_plans for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Weekly plan recipes are private" on weekly_plan_recipes for all using (exists (select 1 from weekly_recipe_plans p where p.id = weekly_plan_id and p.user_id = auth.uid()));
create policy "Grocery lists are private" on grocery_lists for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Grocery list items are private" on grocery_list_items for all using (exists (select 1 from grocery_lists g where g.id = grocery_list_id and g.user_id = auth.uid()));
create policy "Weekly essentials are private" on weekly_essentials for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Achievements are private" on user_achievements for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

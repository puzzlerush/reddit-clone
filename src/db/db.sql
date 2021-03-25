create table users(
  id serial primary key,
  username varchar(255) not null,
  password varchar(255) not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create table users(
  id serial primary key,
  username varchar(255) not null unique,
  password varchar(255) not null,
  tokens text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create type post_type as enum ('text', 'link');

create table posts(
  id serial primary key,
  type post_type not null,
  title varchar(255) not null,
  body text,
  author_id int, 
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint fk_author
    foreign key(author_id)
      references users(id)
      on delete set null
);
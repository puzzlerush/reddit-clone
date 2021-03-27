create table users(
  id serial primary key,
  username varchar(255) not null unique,
  password varchar(255) not null,
  tokens text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table subreddits(
  id serial primary key,
  name varchar(255) not null unique,
  description text,
  created_at timestamptz default now()
);

create type post_type as enum ('text', 'link');

create table posts(
  id serial primary key,
  type post_type not null,
  title varchar(255) not null,
  body text,
  author_id int,
  subreddit_id int not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint fk_author
    foreign key(author_id)
      references users(id)
      on delete set null,
  constraint fk_subreddit
    foreign key(subreddit_id)
      references subreddits(id)
      on delete set null
);

create or replace function update_updated_at_column()
  returns trigger
  language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$

create trigger update_users_updated_at
  before update
  on users
  for each row
    execute procedure update_updated_at_column();

create trigger update_posts_updated_at
  before update
  on posts
  for each row
    execute procedure update_updated_at_column();
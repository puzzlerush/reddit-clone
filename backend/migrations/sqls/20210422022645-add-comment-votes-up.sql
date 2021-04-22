create table comment_votes(
  user_id int not null,
  comment_id int not null,
  vote_value int not null check (-1 <= vote_value and vote_value <= 1),
  primary key (user_id, comment_id),
  constraint fk_user
    foreign key(user_id)
      references users(id)
      on delete cascade,
  constraint fk_comment
    foreign key(comment_id)
      references comments(id)
      on delete cascade
);

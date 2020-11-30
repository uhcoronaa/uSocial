use semidb;
create table user (id_user int not null auto_increment primary key, username varchar(255) not null, full_name varchar(255) not null, user_password varchar(255) not null, user_picture_key varchar(255) null, user_picture_location varchar(255) null, active int default 0, bot int default 0);

#insert into user(username, full_name, user_password) values ('uhcorona', 'René Corona', 'password');
#insert into user(username, full_name, user_password) values ('ercl', 'Erick Lemus', 'password');
#insert into user(username, full_name, user_password) values ('pixelcode', 'Henry Galvez', 'password');

create table publishing(id_publishing int not null auto_increment primary key, id_user int not null, message varchar(500), date datetime, image varchar(255) not null, foreign key(id_user) references user(id_user));

#insert into publishing(id_user, message, date, image) values (1, 'Publicacion 1 de Herlindo', (select NOW()), '');
#insert into publishing(id_user, message, date, image) values (1, 'Publicacion 2 de Herlindo', (select NOW()), '');
#insert into publishing(id_user, message, date, image) values (1, 'Publicacion 3 de Herlindo', (select NOW()), '');

#insert into publishing(id_user, message, date, image) values (2, 'Publicacion 1 de Erick', (select NOW()), '');
#insert into publishing(id_user, message, date, image) values (2, 'Publicacion 2 de Erick', (select NOW()), '');
#insert into publishing(id_user, message, date, image) values (2, 'Publicacion 3 de Erick', (select NOW()), '');

#insert into publishing(id_user, message, date, image) values (3, 'Publicacion 1 de Henry', (select NOW()), '');
#insert into publishing(id_user, message, date, image) values (3, 'Publicacion 2 de Henry', (select NOW()), '');
#insert into publishing(id_user, message, date, image) values (3, 'Publicacion 3 de Henry', (select NOW()), '');


create table friendship(id_friendship int auto_increment primary key, friend1 int, friend2 int, confirmed int, foreign key(friend1) references user(id_user), foreign key(friend2) references user(id_user));

#insert into friendship(friend1, friend2, confirmed) values (1, 2, 1);
#insert into friendship(friend1, friend2, confirmed) values (1, 3, 1);
#insert into friendship(friend1, friend2, confirmed) values (2, 3, 0);

create table notification(id_notification int auto_increment primary key, id_user int, notification_type int, notification_reference int, leida boolean default false,foreign key(id_user) references user(id_user));

create table message(id_message int auto_increment primary key, id_friendship int, date_sent datetime, message varchar(300), id_user_sent int, foreign key(id_friendship) references friendship(id_friendship));

#insert into message(id_friendship, date_sent, message, id_user_sent) values (1, (select NOW()), "Wenas", 1);
#insert into message(id_friendship, date_sent, message, id_user_sent) values (1, (select NOW()), "Sale pubg?", 2);
#insert into message(id_friendship, date_sent, message, id_user_sent) values (1, (select NOW()), "Vivoooo", 1);
#insert into message(id_friendship, date_sent, message, id_user_sent) values (1, (select NOW()), "de una xD", 2);

create table tag(id_tag int auto_increment primary key, name varchar(100) unique);
create table publishing_tag(id_tag int, id_publishing int, foreign key(id_tag) references tag(id_tag), foreign key(id_publishing) references publishing(id_publishing), primary key(id_tag, id_publishing));

#show tables;
#describe user;
#drop table publishing;
#drop table message;
#drop table friendship;
#drop table user;
#delete from user where id_user>0;
#delete from publishing_tag;
#delete from tag;
#delete from publishing;
#select * from user;
#select * from publishing;
#select * from friendship;
#select * from message;
#select * from tag;
#select * from publishing_tag;


#select u.full_name, u.username, p.* from publishing p, user u where p.id_user = u.id_user
#and p.id_user in
#(
#select distinct u.id_user from user u, friendship f
#where u.id_user = f.friend1
#and f.confirmed = 1
#and f.friend2 = 1
#union
#(
#select distinct u.id_user  from user u, friendship f
#where u.id_user = f.friend2
#and f.confirmed = 1
#and f.friend1 = 1
#) union (
#select 1
#)
#)
#order by date desc;

#select * from publishing p where id_user in (
#select distinct u.id_user from user u, friendship f
#where u.id_user = f.friend1
#and f.confirmed = 1
#and f.friend2 = 1
#union
#(
#select distinct u.id_user  from user u, friendship f
#where u.id_user = f.friend2
#and f.confirmed = 1
#and f.friend1 = 1
#) union (
#select 1
#)
#)
#order by date desc;
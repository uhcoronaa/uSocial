create database semidb;
use semidb;

create table user (id_user int not null auto_increment primary key, username varchar(255) not null, full_name varchar(255) not null, user_password varchar(255) not null, user_picture_key varchar(255) null, user_picture_location varchar(255) null, active int default 0, bot int default 0);

create table friendship(id_friendship int auto_increment primary key, friend1 int, friend2 int, confirmed int, foreign key(friend1) references user(id_user), foreign key(friend2) references user(id_user));

create table notification(id_notification int auto_increment primary key, id_user int, notification_type int, notification_reference int, leida boolean default false,foreign key(id_user) references user(id_user));

create table message(id_message int auto_increment primary key, id_friendship int, date_sent datetime, message varchar(300), id_user_sent int, foreign key(id_friendship) references friendship(id_friendship));

create table publishing(id_publishing int not null auto_increment primary key, id_user int not null, message varchar(500), date datetime, image varchar(255) not null, foreign key(id_user) references user(id_user));

create table tag(id_tag int auto_increment primary key, name varchar(100) unique);

create table publishing_tag(id_tag int, id_publishing int, foreign key(id_tag) references tag(id_tag), foreign key(id_publishing) references publishing(id_publishing), primary key(id_tag, id_publishing));

delimiter // 
CREATE TRIGGER noti_friendship 
	AFTER INSERT 
		ON friendship FOR EACH ROW
			BEGIN
				INSERT INTO notification(id_user, notification_type, notification_reference) values (new.friend2, 1, new.id_friendship);
			END// 
delimiter ;

ALTER USER 'root' IDENTIFIED WITH mysql_native_password BY 'password';
flush privileges;

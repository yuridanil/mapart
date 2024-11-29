CREATE DATABASE mapart;
CREATE USER 'mapart'@'localhost' IDENTIFIED WITH mysql_native_password BY 'mapart';
GRANT ALL ON mapart.* TO 'mapart'@'localhost';

CREATE TABLE mapart.images (
  id int unsigned NOT NULL AUTO_INCREMENT,
  title varchar(1000) DEFAULT NULL,
  `desc` text,
  lat decimal(20,16) DEFAULT NULL,
  lng decimal(20,16) DEFAULT NULL,
  zoom decimal(20,16) DEFAULT NULL,
  bearing decimal(20,16) DEFAULT NULL,
  user_id int unsigned DEFAULT NULL,
  filters text,
  likes int unsigned NOT NULL DEFAULT '0',
  shown tinyint DEFAULT '1',
  width int unsigned DEFAULT NULL,
  height int unsigned DEFAULT NULL,
  category varchar(100) DEFAULT NULL,
  tags text,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

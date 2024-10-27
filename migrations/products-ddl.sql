CREATE TABLE products (
    id int(10) unsigned NOT NULL AUTO_INCREMENT,
    title varchar(255) NOT NULL,
    price int NOT NULL,
    PRIMARY KEY (id)
) ENGINE = INNODB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;
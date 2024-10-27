CREATE TABLE products (
    id int(10) unsigned NOT NULL AUTO_INCREMENT,
    title varchar(255) NOT NULL,
    price int NOT NULL,
    discount_key varchar(255) NOT NULL,
    used ENUM("0","1") DEFAULT "0" ,
    
    PRIMARY KEY (id),
    UNIQUE KEY products_discount_key (discount_key)
) ENGINE = INNODB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;
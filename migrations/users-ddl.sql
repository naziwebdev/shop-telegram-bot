CREATE TABLE users (
    id int(10) unsigned NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    chat_id int(10) NOT NULL,
    role ENUM("user", "admin") NOT NULL DEFAULT "user",
    PRIMARY KEY (id),
    UNIQUE KEY users_unique_chat_id (chat_id)
) ENGINE = INNODB DEFAULT CHARSET = utf8mb4 COLLATE utf8mb4_general_ci;
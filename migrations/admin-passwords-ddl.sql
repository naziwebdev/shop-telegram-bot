CREATE TABLE admin_passwords (
    id int(10) unsigned NOT NULL AUTO_INCREMENT,
    password varchar(255) NOT NULL,
    user_id int(10) unsigned NOT NULL,
    PRIMARY KEY (id),
    KEY admin_passwords_user_id (user_id),
    CONSTRAINT admin_passwords_user_id FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE = INNODB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;
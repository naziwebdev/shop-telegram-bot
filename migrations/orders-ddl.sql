CREATE TABLE orders (
    id int(10) unsigned NOT NULL AUTO_INCREMENT,
    product_id int(10) unsigned NOT NULL,
    user_id int(10) unsigned NOT NULL,
    status_pay ENUM("pendding", "done", "cancel") NOT NULL DEFAULT "pendding",
    track_id BIGINT unsigned,
    created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY orders_ticket_id (ticket_id),
    key orders_user_id (user_id),
    CONSTRAINT orders_user_id FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    KEY orders_product_id (product_id),
    CONSTRAINT orders_product_id FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
) ENGINE = INNODB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(10) NOT NULL CHECK (role IN ('admin', 'user')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, password, role)
VALUES ('admin', 'admin123', 'admin'), ('user', 'user123', 'user')
ON CONFLICT (username) DO NOTHING;

CREATE OR REPLACE FUNCTION authenticate_user(p_username TEXT, p_password TEXT)
RETURNS TABLE (user_id INTEGER, username VARCHAR, role VARCHAR)
LANGUAGE SQL
AS $$
    SELECT u.user_id, u.username, u.role
    FROM users u
    WHERE LOWER(u.username) = LOWER(p_username) AND u.password = p_password;
$$;

ALTER TABLE sales ADD COLUMN IF NOT EXISTS customer_name VARCHAR(120);
ALTER TABLE sales ADD COLUMN IF NOT EXISTS customer_address TEXT;
ALTER TABLE sales ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(user_id);

CREATE OR REPLACE FUNCTION record_sale(
    p_user_id INTEGER,
    p_product_id INTEGER,
    p_quantity_sold INTEGER,
    p_customer_name TEXT,
    p_customer_address TEXT
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
    available_stock INTEGER;
BEGIN
    IF p_quantity_sold <= 0 THEN RAISE EXCEPTION 'Quantity must be greater than zero'; END IF;
    IF NULLIF(TRIM(p_customer_name), '') IS NULL THEN RAISE EXCEPTION 'Customer name is required'; END IF;
    IF NULLIF(TRIM(p_customer_address), '') IS NULL THEN RAISE EXCEPTION 'Customer address is required'; END IF;

    SELECT stock_quantity INTO available_stock FROM products
    WHERE product_id = p_product_id FOR UPDATE;

    IF available_stock IS NULL THEN RAISE EXCEPTION 'Product not found'; END IF;
    IF available_stock < p_quantity_sold THEN RAISE EXCEPTION 'Insufficient stock'; END IF;

    IF NOT EXISTS (SELECT 1 FROM users WHERE user_id = p_user_id) THEN
        RAISE EXCEPTION 'Seller not found';
    END IF;

    INSERT INTO sales (user_id, product_id, quantity_sold, customer_name, customer_address)
    VALUES (p_user_id, p_product_id, p_quantity_sold, TRIM(p_customer_name), TRIM(p_customer_address));

    UPDATE products SET stock_quantity = stock_quantity - p_quantity_sold
    WHERE product_id = p_product_id;
END;
$$;

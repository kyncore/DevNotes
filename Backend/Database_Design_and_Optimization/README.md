# Database Design and Optimization

## Part 1: Core Concepts of Database Design

Database design is the process of organizing data according to a specific schema to model a real-world system. A well-designed database is crucial for data integrity, performance, and maintainability.

### 1. Normalization

Normalization is the process of structuring a relational database to minimize data redundancy and improve data integrity. It involves dividing larger tables into smaller, well-structured tables and defining relationships between them.

-   **First Normal Form (1NF):** Ensures that a table has no repeating groups. Each cell must hold a single, atomic value, and each record must be unique.
    -   **Bad:** `(id: 1, name: 'John Doe', phones: '555-1234, 555-5678')`
    -   **Good:** Two tables: `Users (id, name)` and `User_Phones (user_id, phone)`.
-   **Second Normal Form (2NF):** The table must be in 1NF, and every non-primary-key attribute must be fully dependent on the *entire* primary key. This applies to tables with composite primary keys.
    -   **Bad:** `Order_Items (product_id, order_id, product_name)` where `(product_id, order_id)` is the primary key. `product_name` only depends on `product_id`, not the whole key.
    -   **Good:** `Products (product_id, product_name)` and `Order_Items (product_id, order_id)`.
-   **Third Normal Form (3NF):** The table must be in 2NF, and all attributes must be dependent *only* on the primary key, not on other non-key attributes (no transitive dependencies).
    -   **Bad:** `Products (id, name, category_name, category_description)`. `category_description` depends on `category_name`.
    -   **Good:** `Products (id, name, category_id)` and `Categories (id, name, description)`.

**Goal of Normalization:** "Every non-key attribute must provide a fact about the key, the whole key, and nothing but the key."

### 2. Denormalization

Denormalization is the process of intentionally violating normalization rules to improve the read performance of a database. You trade some data integrity and write efficiency for faster reads.

-   **When to use it:** When `JOIN` operations for frequently accessed data become too expensive.
-   **Example:** An e-commerce site might have a `categories` table and a `products` table. To show the product count next to each category name, you'd need an expensive `COUNT` query with a `JOIN`. You could denormalize by adding a `product_count` column to the `categories` table.
-   **Trade-off:** You must now update the `product_count` every time a product is added or removed from that category, which makes writes more complex (often handled by triggers or application logic).

### 3. Choosing Data Types

Using the correct data types is critical for storage efficiency and performance.

-   **Integers:** Use the smallest integer type that can hold the maximum possible value (e.g., `TINYINT`, `SMALLINT`, `INT`, `BIGINT`). Don't use a `BIGINT` for a user's age.
-   **Strings:** Use `VARCHAR(n)` for variable-length strings when you have a known maximum length. Use `TEXT` for long-form text. `VARCHAR` is generally faster for smaller data.
-   **Dates and Times:** Use native `DATE`, `DATETIME`, or `TIMESTAMP` types. They are stored more efficiently than strings and allow for date-based arithmetic.
-   **UUIDs:** While great for unique distributed IDs, they can be poor primary keys in databases that use clustered indexes (like MySQL's InnoDB) because they are not sequential, leading to index fragmentation.

---

## Part 2: Real-World Project: E-commerce Schema

Let's design a database for a simple e-commerce platform. We will start with a normalized schema.

### Initial (3NF) Schema Design

Here are the `CREATE TABLE` statements for our core tables.

```sql
-- Users who can place orders
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories for products
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    parent_id INT, -- For sub-categories
    name VARCHAR(100) NOT NULL,
    FOREIGN KEY (parent_id) REFERENCES categories(id)
);

-- The products being sold
CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    category_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Main order information, linked to a user
CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- e.g., PENDING, SHIPPED, DELIVERED
    total_amount DECIMAL(10, 2) NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Line items for each order (a many-to-many relationship between orders and products)
CREATE TABLE order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    price_per_unit DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);
```

---

## Part 3: Database Optimization in Practice

Our normalized schema is great for data integrity, but certain queries will be slow. Let's identify bottlenecks and fix them.

### Bottleneck 1: Finding a User by Email

A very common operation is looking up a user by their email address during login.

**The Slow Query:**
```sql
SELECT id, full_name, password_hash FROM users WHERE email = 'customer@example.com';
```
**Problem:** Without an index on the `email` column, the database must perform a **full table scan**, reading every single row in the `users` table to find the matching email. This is extremely slow on large tables.

**Solution: Add an Index**
An index is a special lookup table that the database search engine can use to speed up data retrieval. We'll add a unique index to the `email` column.

```sql
-- The database will now use a fast B-Tree search to find the email
CREATE UNIQUE INDEX idx_users_email ON users(email);
```
**Result:** The query will now be almost instantaneous, even with millions of users.

### Bottleneck 2: Finding All Products in a Category

Displaying a category page requires fetching all products belonging to it.

**The Slow Query:**
```sql
SELECT id, name, price, stock_quantity FROM products WHERE category_id = 123;
```
**Problem:** Similar to the first bottleneck, the database has to scan the entire `products` table to find rows matching `category_id = 123`.

**Solution: Add an Index**
We add an index to the `category_id` foreign key column.

```sql
-- This index will be used for category pages and for JOINs on this key
CREATE INDEX idx_products_category_id ON products(category_id);
```
**Result:** Fetching all products for a category becomes very fast.

### Bottleneck 3: Searching for Products by Name

A search bar is a core feature of any e-commerce site.

**The Slow Query:**
```sql
SELECT id, name, price FROM products WHERE name LIKE '%laptop%';
```
**Problem:** A standard B-Tree index (created with `CREATE INDEX`) is **useless for leading wildcard searches** (`LIKE '%...'`). The database still has to do a full table scan.

**Solution: Use a Full-Text Index**
For text searching, a specialized `FULLTEXT` index is required.

```sql
-- Create a full-text index on the product name and description
CREATE FULLTEXT INDEX idx_products_name_desc ON products(name, description);
```
**The Optimized Query:**
Now we use the `MATCH() ... AGAINST()` syntax to leverage this index.
```sql
SELECT id, name, price FROM products
WHERE MATCH(name, description) AGAINST('laptop' IN NATURAL LANGUAGE MODE);
```
**Result:** Text-based searches are now highly efficient.

### Bottleneck 4: Displaying Product Counts on the Category List

We want to show how many products are in each category on the main navigation menu.

**The Slow Query:**
```sql
SELECT c.name, COUNT(p.id) as product_count
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
GROUP BY c.id;
```
**Problem:** This query involves a `JOIN` and a `COUNT` aggregation across the entire `products` table. It's too slow to run on every page load.

**Solution: Denormalize the Data**
We add a `product_count` column to the `categories` table.

**Step 1: Alter the table**
```sql
ALTER TABLE categories ADD COLUMN product_count INT NOT NULL DEFAULT 0;
```

**Step 2: Keep the count updated**
This is the hard part. You need to ensure this count is always accurate.
-   **Application Logic:** In your code, when you add a product, you also run `UPDATE categories SET product_count = product_count + 1 WHERE id = ?`. You must also handle product deletion and moves.
-   **Database Triggers (More Robust):** A trigger is a procedure that automatically runs when an event (like `INSERT`, `UPDATE`, `DELETE`) occurs on a table.

```sql
-- A trigger that runs AFTER a new product is inserted
DELIMITER $$
CREATE TRIGGER trg_after_product_insert
AFTER INSERT ON products
FOR EACH ROW
BEGIN
    UPDATE categories SET product_count = product_count + 1 WHERE id = NEW.category_id;
END$$
DELIMITER ;

-- You would also need triggers for DELETE and UPDATE (if category can change)
```

**The Optimized Query:**
Now, fetching the category list is trivial and incredibly fast.
```sql
SELECT name, product_count FROM categories;
```
**Result:** We've traded write-time complexity for blazing-fast read performance on a very common query.

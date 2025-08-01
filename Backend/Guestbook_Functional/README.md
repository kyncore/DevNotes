# Guestbook - Functional Version

This project is a simple guestbook application built with PHP, jQuery, and MySQL, following a Functional Programming (FP) paradigm.

## How it Works (Functional)

*   **`src/Database.php`**: Contains a simple function `getDbConnection()` that returns a PDO instance. It uses a static variable to ensure the connection is only made once (memoization).
*   **`src/Comments.php`**: Contains pure functions like `fetchAllComments()` and `saveComment()`. These functions do not manage state; they receive the database connection as an argument and operate on the data.
*   **`public/api/comments.php`**: The API endpoint. It calls the functions from the `src` directory to handle GET and POST requests, passing the database connection to them.
*   **`public/index.html` & `public/app.js`**: The frontend that uses jQuery to make AJAX calls to the API.

## How to Run

1.  **Database Setup:**
    *   Make sure you have a MySQL server running.
    *   Create a database named `guestbook`.
    *   Execute the `database.sql` script to create the `comments` table and insert some sample data.

2.  **Configure Connection:**
    *   Open `src/Database.php` and adjust the `$username` and `$password` variables if they differ from the default `root` with no password.

3.  **Install Dependencies:**
    *   Run `composer install` in the project root. This will generate the autoloader for the files in `src`.

4.  **Run the Server:**
    *   Navigate to the `public` directory.
    *   Start the PHP built-in web server:
        ```bash
        cd public
        php -S localhost:8001
        ```
    *(Note: Using a different port like 8001 to avoid conflict if you run the OOP version simultaneously.)*

5.  **View the Application:**
    *   Open your web browser and go to `http://localhost:8001`.

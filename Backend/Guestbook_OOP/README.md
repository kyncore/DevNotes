# Guestbook - OOP Version

This project is a simple guestbook application built with PHP, jQuery, and MySQL, following an Object-Oriented Programming (OOP) paradigm.

## How it Works (OOP)

*   **`src/Database.php`**: A singleton class that manages the PDO database connection, ensuring only one connection is made.
*   **`src/CommentService.php`**: A service class that encapsulates all business logic related to comments (fetching, creating). It depends on the `Database` class.
*   **`public/api/comments.php`**: The API endpoint that receives requests. It instantiates `CommentService` and calls its methods to handle GET and POST requests.
*   **`public/index.html` & `public/app.js`**: The frontend that uses jQuery to make AJAX calls to the API.

## How to Run

1.  **Database Setup:**
    *   Make sure you have a MySQL server running.
    *   Create a database named `guestbook`.
    *   Execute the `database.sql` script to create the `comments` table and insert some sample data.

2.  **Configure Connection:**
    *   Open `src/Database.php` and adjust the `$username` and `$password` variables if they differ from the default `root` with no password.

3.  **Install Dependencies:**
    *   Run `composer install` in the project root.

4.  **Run the Server:**
    *   Navigate to the `public` directory.
    *   Start the PHP built-in web server:
        ```bash
        cd public
        php -S localhost:8000
        ```

5.  **View the Application:**
    *   Open your web browser and go to `http://localhost:8000`.

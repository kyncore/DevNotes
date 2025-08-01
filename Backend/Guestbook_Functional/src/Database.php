<?php

// This file provides a function to get a database connection.
// It avoids a singleton class in favor of a simple function that memoizes the connection.

/**
 * Returns a PDO database connection.
 * The connection is created only once and reused on subsequent calls.
 *
 * @return PDO
 */
function getDbConnection(): PDO
{
    // Use a static variable to hold the connection instance (memoization)
    static $pdo = null;

    if ($pdo === null) {
        $host = '127.0.0.1';
        $db_name = 'guestbook';
        $username = 'root';
        $password = '';
        $dsn = 'mysql:host=' . $host . ';dbname=' . $db_name . ';charset=utf8mb4';

        try {
            $pdo = new PDO($dsn, $username, $password);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            die('Connection failed: ' . $e->getMessage());
        }
    }

    return $pdo;
}

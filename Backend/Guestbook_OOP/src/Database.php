<?php

namespace App;

use PDO;
use PDOException;

/**
 * A singleton class to manage the database connection.
 */
class Database
{
    private static ?PDO $instance = null;
    private string $host = '127.0.0.1'; // Use 127.0.0.1 instead of localhost to avoid potential DNS lookup issues
    private string $db_name = 'guestbook';
    private string $username = 'root'; // Change if you have a different user
    private string $password = ''; // Change if you have a password

    private function __construct() {}
    private function __clone() {}

    public static function getInstance(): PDO
    {
        if (self::$instance === null) {
            $db = new self();
            $dsn = 'mysql:host=' . $db->host . ';dbname=' . $db->db_name . ';charset=utf8mb4';

            try {
                self::$instance = new PDO($dsn, $db->username, $db->password);
                self::$instance->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                self::$instance->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            } catch (PDOException $e) {
                // In a real app, you would log this error, not echo it.
                die('Connection failed: ' . $e->getMessage());
            }
        }

        return self::$instance;
    }
}

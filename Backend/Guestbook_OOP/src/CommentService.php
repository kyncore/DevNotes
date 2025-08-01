<?php

namespace App;

use PDO;

/**
 * Handles business logic for comments.
 */
class CommentService
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    /**
     * Fetches all comments from the database.
     * @return array
     */
    public function getAllComments(): array
    {
        $stmt = $this->db->query("SELECT name, comment, created_at FROM comments ORDER BY created_at DESC");
        return $stmt->fetchAll();
    }

    /**
     * Creates a new comment.
     * @param string $name
     * @param string $comment
     * @return bool
     */
    public function createComment(string $name, string $comment): bool
    {
        if (empty($name) || empty($comment)) {
            return false;
        }

        $stmt = $this->db->prepare("INSERT INTO comments (name, comment) VALUES (:name, :comment)");
        return $stmt->execute([
            ':name' => htmlspecialchars($name),
            ':comment' => htmlspecialchars($comment)
        ]);
    }
}

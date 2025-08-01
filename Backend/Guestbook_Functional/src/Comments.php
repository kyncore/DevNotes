<?php

// This file contains pure functions for interacting with comments data.

/**
 * Fetches all comments from the database.
 * This function depends on a PDO connection but does not manage it.
 *
 * @param PDO $db The database connection.
 * @return array A list of comments.
 */
function fetchAllComments(PDO $db): array
{
    $stmt = $db->query("SELECT name, comment, created_at FROM comments ORDER BY created_at DESC");
    return $stmt->fetchAll();
}

/**
 * Creates a new comment.
 *
 * @param PDO $db The database connection.
 * @param array $commentData The data for the new comment (e.g., ['name' => ..., 'comment' => ...]).
 * @return bool True on success, false on failure.
 */
function saveComment(PDO $db, array $commentData): bool
{
    $name = $commentData['name'] ?? '';
    $comment = $commentData['comment'] ?? '';

    if (empty($name) || empty($comment)) {
        return false;
    }

    $stmt = $db->prepare("INSERT INTO comments (name, comment) VALUES (:name, :comment)");
    return $stmt->execute([
        ':name' => htmlspecialchars($name),
        ':comment' => htmlspecialchars($comment)
    ]);
}

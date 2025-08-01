<?php

require_once __DIR__ . '/../vendor/autoload.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$dbConnection = getDbConnection(); // Get the database connection
$response = ['success' => false, 'message' => 'An unknown error occurred.'];

try {
    if ($method === 'GET') {
        $comments = fetchAllComments($dbConnection);
        $response = ['success' => true, 'comments' => $comments];
    } elseif ($method === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);

        if (empty($data['name']) || empty($data['comment'])) {
            http_response_code(400); // Bad Request
            $response = ['success' => false, 'message' => 'Name and comment cannot be empty.'];
        } elseif (saveComment($dbConnection, $data)) {
            $response = ['success' => true];
        } else {
            http_response_code(500); // Internal Server Error
            $response = ['success' => false, 'message' => 'Failed to save comment.'];
        }
    } else {
        http_response_code(405); // Method Not Allowed
        $response = ['success' => false, 'message' => 'Method not allowed.'];
    }
} catch (Exception $e) {
    http_response_code(500);
    $response = ['success' => false, 'message' => 'Server error: ' . $e->getMessage()];
}

echo json_encode($response);

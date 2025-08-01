<?php

require_once __DIR__ . '/../vendor/autoload.php';

use App\CommentService;

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$commentService = new CommentService();
$response = ['success' => false, 'message' => 'An unknown error occurred.'];

try {
    if ($method === 'GET') {
        $comments = $commentService->getAllComments();
        $response = ['success' => true, 'comments' => $comments];
    } elseif ($method === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        $name = $data['name'] ?? '';
        $comment = $data['comment'] ?? '';

        if (empty($name) || empty($comment)) {
            http_response_code(400); // Bad Request
            $response = ['success' => false, 'message' => 'Name and comment cannot be empty.'];
        } elseif ($commentService->createComment($name, $comment)) {
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
    // In a real app, log the error message instead of echoing it.
    $response = ['success' => false, 'message' => 'Server error: ' . $e->getMessage()];
}

echo json_encode($response);

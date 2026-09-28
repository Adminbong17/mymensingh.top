<?php
/**
 * Mymensingh City Guide (Mymensingh.top) - Database & API Configuration
 * cPanel MySQL / MariaDB PDO Setup
 */

// ----------------------------------------------------------------------------
// 0. Security Guard: Block direct browser access to config.php
// ----------------------------------------------------------------------------
if (basename($_SERVER['SCRIPT_FILENAME'] ?? '') === 'config.php' || basename($_SERVER['PHP_SELF'] ?? '') === 'config.php') {
    http_response_code(403);
    header("Content-Type: application/json; charset=UTF-8");
    echo json_encode([
        'success' => false,
        'error'   => 'Direct access to config.php is forbidden.'
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

// ----------------------------------------------------------------------------
// 1. CORS Headers (Allows React App & Mobile Devices to access this API)
// ----------------------------------------------------------------------------
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Catch any unhandled errors or database exceptions and return clean JSON
ini_set('display_errors', '0');
error_reporting(E_ALL);

set_exception_handler(function($e) {
    http_response_code(500);
    header("Content-Type: application/json; charset=UTF-8");
    echo json_encode([
        'success' => false,
        'error'   => 'Server Error: ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
    exit();
});


// Handle CORS Preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ----------------------------------------------------------------------------
// 2. Database Credentials (cPanel MySQL Details)
// ----------------------------------------------------------------------------
define('DB_HOST', 'localhost');
define('DB_NAME', 'ihyphiht_mym2');
define('DB_USER', 'ihyphiht_mym2');
define('DB_PASS', 'Aktmtbar@1');

// JWT / Token Salt
define('JWT_SECRET', 'mymensingh_top_secret_salt_key_2026_xyz');

// ----------------------------------------------------------------------------
// 3. PDO Connection Helper
// ----------------------------------------------------------------------------
function getDBConnection() {
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }

    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
        ];
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        return $pdo;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error'   => 'Database connection failed: ' . $e->getMessage()
        ], JSON_UNESCAPED_UNICODE);
        exit();
    }
}

// ----------------------------------------------------------------------------
// 4. Response Helper Functions
// ----------------------------------------------------------------------------
function sendResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit();
}

function sendError($message, $statusCode = 400) {
    http_response_code($statusCode);
    echo json_encode([
        'success' => false,
        'error'   => $message
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

// Helper to get JSON request body
function getRequestBody() {
    $raw = file_get_contents('php://input');
    if (empty($raw)) {
        return [];
    }
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

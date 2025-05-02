<?php

$host = $_ENV['DB_HOST'] ?? 'localhost';
$port = $_ENV['DB_PORT'] ?? '3306';
$db   = $_ENV['DB_NAME'] ?? 'internhub';
$user = $_ENV['DB_USERNAME'] ?? 'root';
$pass = $_ENV['DB_PASSWORD'] ?? 'root';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);

    $sql = "
    CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        profile_url VARCHAR(255) NOT NULL UNIQUE,
        full_name VARCHAR(100) NOT NULL,
        occupation VARCHAR(100) NOT NULL,
        company VARCHAR(100) NOT NULL,
        posts TEXT NOT NULL,
        rating FLOAT,
        created_at DATETIME NOT NULL,
        updated_at DATETIME NOT NULL
    );
    ";

    $pdo->exec($sql);
    echo "✅ Reviews table created successfully.\n";
} catch (PDOException $e) {
    echo "❌ DB Error: " . $e->getMessage() . "\n";
}
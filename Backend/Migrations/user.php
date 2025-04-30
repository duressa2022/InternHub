<?php
$host = $_ENV['DB_HOST'] ?? 'localhost';
$port = $_ENV['DB_PORT'] ?? '3306';        
$db   = $_ENV['DB_NAME'] ?? 'my_database';       
$user = $_ENV['DB_USERNAME'] ?? '';            
$pass = $_ENV['DB_PASSWORD'] ?? '';         
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);

    $sql = "
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        field VARCHAR(255),
        role VARCHAR(50) NOT NULL,
        avatar_url TEXT,
        gender VARCHAR(20),
        phone_number VARCHAR(20),
        address TEXT,
        city VARCHAR(100),
        state VARCHAR(100),
        country VARCHAR(100),
        postal_code VARCHAR(20),
        date_of_birth DATE,
        website VARCHAR(255),
        social_links TEXT,
        created_at DATETIME NOT NULL,
        updated_at DATETIME NOT NULL
    );
    ";

    $pdo->exec($sql);
    echo "✅ Users table created successfully.\n";
} catch (PDOException $e) {
    echo "❌ DB Error: " . $e->getMessage() . "\n";
}

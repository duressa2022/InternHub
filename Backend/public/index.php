<?php
namespace Backend\public;
require_once __DIR__ . '/../vendor/autoload.php'; 
require_once __DIR__ . '/userRoute.php'; 
use Dotenv\Dotenv;
use PDO;
$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

$host = $_ENV['DB_HOST'];
$db   = $_ENV['DB_DATABASE'];
$user = $_ENV['DB_USERNAME'];
$pass = $_ENV['DB_PASSWORD'];


use Src\Adapter\Controllers\UserController;
use Src\Adapter\Presenters\JsonPresenter;
use Src\Usecase\UserUsecase;
use Src\Adapter\Gateways\Database\UserRepository;

$pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
$userRepository = new UserRepository($pdo);
$userUsecase = new UserUsecase($userRepository);
$jsonPresenter = new JsonPresenter();
$userController = new UserController($userUsecase, $jsonPresenter);

$requestMethod = $_SERVER['REQUEST_METHOD'];
$requestUri = $_SERVER['REQUEST_URI'];

if (str_starts_with($requestUri, '/users')) {
    USER_ROUTES($requestMethod, $requestUri,$userController);
} else {
    http_response_code(404);
    echo json_encode(["message" => "Route not found"]);
}

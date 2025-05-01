<?php
namespace Backend\Routes;

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/userRoute.php';
require_once __DIR__ . '/internshipRoute.php';
require_once __DIR__ . '/companyRoute.php';

use Dotenv\Dotenv;
use PDO;

$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

$host = $_ENV['DB_HOST'];
$db   = $_ENV['DB_DATABASE'];
$user = $_ENV['DB_USERNAME'];
$pass = $_ENV['DB_PASSWORD'];

use Src\Adapter\Controllers\UserController;
use Src\Adapter\Controllers\InternshipController;
use Src\Adapter\Controllers\CompanyController;
use Src\Adapter\Presenters\JsonPresenter;
use Src\Usecase\UserUsecase;
use Src\Usecase\InternshipUsecase;
use Src\Usecase\CompanyUsecase;
use Src\Adapter\Gateways\Database\UserRepository;
use Src\Adapter\Gateways\Database\InternshipRepository;
use Src\Adapter\Gateways\Database\CompanyRepository;

$pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);

$userRepository = new UserRepository($pdo);
$userUsecase = new UserUsecase($userRepository);
$jsonPresenter = new JsonPresenter();
$userController = new UserController($userUsecase, $jsonPresenter);

$internshipRepository = new InternshipRepository($pdo);
$internshipUsecase = new InternshipUsecase($internshipRepository);
$internshipController = new InternshipController($internshipUsecase, $jsonPresenter);

$companyRepository = new CompanyRepository($pdo);
$companyUsecase = new CompanyUsecase($companyRepository);
$companyController = new CompanyController($companyUsecase, $jsonPresenter);

$requestMethod = $_SERVER['REQUEST_METHOD'];
$requestUri = $_SERVER['REQUEST_URI'];

if (str_starts_with($requestUri, '/users')) {
    USER_ROUTES($requestMethod, $requestUri, $userController);
} elseif (str_starts_with($requestUri, '/internships')) {
    INTERNSHIP_ROUTES($requestMethod, $requestUri, $internshipController);
} elseif (str_starts_with($requestUri, '/companies')) {
    COMPANY_ROUTES($requestMethod, $requestUri, $companyController);
} else {
    http_response_code(404);
    echo json_encode(["message" => "Route not found"]);
}
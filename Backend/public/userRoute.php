<?php
namespace Backend\public;

use Src\Adapter\Controllers\UserController;
use Src\Adapter\Presenters\JsonPresenter;
use Src\Usecase\UserUsecase;
use Src\Adapter\Gateways\Database\UserRepository;

require_once __DIR__ . '/../src/Domain/Interface/UserInterface.php';
require_once __DIR__ . '/../src/Domain/Entity/userEntity.php';
require_once __DIR__ . '/../src/Adapter/Presenters/JsonPresenter.php';
require_once __DIR__ . '/../src/Adapter/Gateways/Database/UserRepository.php';
require_once __DIR__ . '/../src/Usecase/UserUsecase.php';
require_once __DIR__ . '/../src/Adapter/Controller/UserController.php';

// $pdo = new \PDO('mysql:host=localhost;dbname=internhub', 'root', 'root');
// $userRepository = new UserRepository($pdo);
// $userUsecase = new UserUsecase($userRepository);
// $jsonPresenter = new JsonPresenter();
// $userController = new UserController($userUsecase, $jsonPresenter);


function USER_ROUTES(string $requestMethod, string $requestUri,UserController $userController): void
{
    global $userController;

    $parsedUrl = strtok($requestUri, '?'); 

    if ($requestMethod === 'GET' && $parsedUrl === '/users') {
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
        $userController->getAllUsers($page, $limit);

    } elseif ($requestMethod === 'POST' && $parsedUrl === '/users') {
        $data = json_decode(file_get_contents('php://input'), true);
        $userController->createUser($data);

    } elseif ($requestMethod === 'GET' && preg_match('#^/users/(\d+)$#', $parsedUrl, $matches)) {
        $id = (int)$matches[1];
        $userController->getUserById($id);

    } elseif ($requestMethod === 'PUT' && preg_match('#^/users/(\d+)$#', $parsedUrl, $matches)) {
        $id = (int)$matches[1];
        $data = json_decode(file_get_contents('php://input'), true);
        $userController->updateUser($id, $data);

    } elseif ($requestMethod === 'DELETE' && preg_match('#^/users/(\d+)$#', $parsedUrl, $matches)) {
        $id = (int)$matches[1];
        $userController->deleteUser($id);

    } elseif ($requestMethod === 'POST' && $parsedUrl === '/users/login') {
        $data = json_decode(file_get_contents('php://input'), true);
        $userController->login($data);

    } elseif ($requestMethod === 'POST' && $parsedUrl === '/users/logout') {
        $userController->logout();

    } elseif ($requestMethod === 'DELETE' && $parsedUrl === '/users/delete-by-email') {
        $data = json_decode(file_get_contents('php://input'), true);
        $userController->deleteUserByEmail($data["email"]);

    } elseif ($requestMethod === 'GET' && $parsedUrl === '/users/get-by-email') {
        $data = json_decode(file_get_contents('php://input'), true);
        $userController->getUserByEmail($data["email"]);

    } elseif ($requestMethod === 'PUT' && $parsedUrl === '/users/reset-password') {
        $data = json_decode(file_get_contents('php://input'), true);
        $userController->changePassword($data);

    } else {
        http_response_code(404);
        echo json_encode(['message' => 'User Route Not Found']);
    }
}

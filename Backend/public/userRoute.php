<?php
namespace Backend\Routes;

use Src\Adapter\Controllers\UserController;
use Src\Adapter\Presenters\JsonPresenter;
use Src\Usecase\UserUsecase;
use Src\Adapter\Gateways\Database\UserRepository;
use Src\Adapter\Gateways\Service\JWTService;
use Src\Adapter\Gateways\Service\MiddleWare;

require_once __DIR__ . '/../src/Domain/Interface/UserInterface.php';
require_once __DIR__ . '/../src/Domain/Entity/userEntity.php';
require_once __DIR__ . '/../src/Adapter/Presenters/JsonPresenter.php';
require_once __DIR__ . '/../src/Adapter/Gateways/Database/UserRepository.php';
require_once __DIR__ . '/../src/Usecase/UserUsecase.php';
require_once __DIR__ . '/../src/Adapter/Controller/UserController.php';;
require_once __DIR__ . '/../src/Adapter/Gateways/Service/JWTService.php';
require_once __DIR__ . '/../src/Adapter/Gateways/Service/MiddleWare.php';


function USER_ROUTES(string $requestMethod, string $requestUri, UserController $userController): void
{
    $parsedUrl = strtok($requestUri, '?'); 
    $jwtService = new JWTService();  
    $middleware = new MiddleWare();
    if ($requestMethod === 'GET' && $parsedUrl === '/users') {
        
        $object = $middleware->authenticateRequest();
        if ($object->role !== 'admin') {
            http_response_code(403);
            echo json_encode(['message' => 'Access denied']);
            exit;
        }

        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
        $userController->getAllUsers($page, $limit);
    } elseif ($requestMethod === 'POST' && $parsedUrl === '/users') {
        $data = json_decode(file_get_contents('php://input'), true);
        $userController->createUser($data);


    } elseif ($requestMethod === 'GET' && preg_match('#^/users/(\d+)$#', $parsedUrl, $matches)) {
        $id = (int)$matches[1];
        $userController->getUserById($id);


    } elseif ($requestMethod === 'PATCH' && preg_match('#^/users/(\d+)$#', $parsedUrl, $matches)) {
        $token = $jwtService->getTokenFromHeader();;
        $object = $jwtService->validate($token);
        $_id=$jwtService->getUserIdFromToken($token);
        if ($_id != $matches[1]) {
            http_response_code(403);
            echo json_encode(['message' => 'Access denied']);
            exit;
        }

        $id = (int)$matches[1];
        $data = json_decode(file_get_contents('php://input'), true);
        $userController->updateUser($id, $data);
    } elseif ($requestMethod === 'DELETE' && preg_match('#^/users/(\d+)$#', $parsedUrl, $matches)) {
        $token = $jwtService->getTokenFromHeader();;
        $object = $jwtService->validate($token);
        $_id=$jwtService->getUserIdFromToken($token);
        if ($_id != $matches[1]) {
            http_response_code(403);
            echo json_encode(['message' => 'Access denied']);
            exit;
        }

        $id = (int)$matches[1];
        $userController->deleteUser($id);
    } elseif ($requestMethod === 'POST' && $parsedUrl === '/users/login') {
        $data = json_decode(file_get_contents('php://input'), true);
        $userController->login($data);
    } elseif ($requestMethod === 'POST' && $parsedUrl === '/users/logout') {
        $userController->logout();
    } elseif ($requestMethod === 'DELETE' && $parsedUrl === '/users/delete-by-email') {
        $object = $middleware->authenticateRequest();
        if ($object->role !== 'admin') {
            http_response_code(403);
            echo json_encode(['message' => 'Access denied']);
            exit;
        }
        $data = json_decode(file_get_contents('php://input'), true);
        $userController->deleteUserByEmail($data["email"]);

    } elseif ($requestMethod === 'GET' && $parsedUrl === '/users/get-by-email') {
        $object = $middleware->authenticateRequest();
        if ($object->role !== 'admin') {
            http_response_code(403);
            echo json_encode(['message' => 'Access denied']);
            exit;
        }
        $data = json_decode(file_get_contents('php://input'), true);
        $userController->getUserByEmail($data["email"]);

    } elseif ($requestMethod === 'PUT' && $parsedUrl === '/users/reset-password') {
        $token = $jwtService->getTokenFromHeader();;
        $object = $jwtService->validate($token);
        $email = $jwtService->getUserEmailFromToken($token);
        if ($object->email !== $email) {
            http_response_code(403);    
            echo json_encode(['message' => 'Access denied']);
            exit;
        }
        $data = json_decode(file_get_contents('php://input'), true);
        $userController->changePassword($data);
    } else {
        http_response_code(404);
        echo json_encode(['message' => 'User Route Not Found']);
    }
}

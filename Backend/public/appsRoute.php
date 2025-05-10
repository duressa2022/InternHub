<?php

namespace Backend\Routes;

use Src\Adapter\Controllers\ApplicationController;
use Src\Adapter\Presenters\JsonPresenter;
use Src\Usecase\ApplicationUsecase;
use Src\Adapter\Gateways\Database\ApplicationRepository;
use Src\Adapter\Gateways\Service\JWTService;
use Src\Adapter\Gateways\Service\MiddleWare;

require_once __DIR__ . '/../src/Domain/Interface/appsInterface.php';
require_once __DIR__ . '/../src/Domain/Entity/application.php';
require_once __DIR__ . '/../src/Adapter/Presenters/JsonPresenter.php';
require_once __DIR__ . '/../src/Adapter/Gateways/Database/applicationRepos.php';
require_once __DIR__ . '/../src/Usecase/AppsUsecase.php';
require_once __DIR__ . '/../src/Adapter/Controller/ApplicationCon.php';
require_once __DIR__ . '/../src/Adapter/Gateways/Service/JWTService.php';
require_once __DIR__ . '/../src/Adapter/Gateways/Service/MiddleWare.php';

function APPLICATION_ROUTES(string $requestMethod, string $requestUri, ApplicationController $applicationController): void
{
    $parsedUrl = strtok($requestUri, '?');
    $jwtService = new JWTService();
    $middleware = new MiddleWare();

    if ($requestMethod === 'GET' && $parsedUrl === '/applications') {
        $object = $middleware->authenticateRequest();
        if ($object->role !== 'admin') {
            http_response_code(403);
            echo json_encode(['message' => 'Access denied']);
            exit;
        }
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
        $applicationController->getAllApplications($page, $limit);
    }

    elseif ($requestMethod === 'POST' && $parsedUrl === '/applications') {
        $object = $middleware->authenticateRequest();
        if ($object->role !== 'student') {
            http_response_code(403);
            echo json_encode(['message' => 'Access denied']);
            exit;
        }
        $data = json_decode(file_get_contents('php://input'), true);
        $applicationController->createApplication($data);
    }

    elseif ($requestMethod === 'GET' && preg_match('#^/applications/(\d+)$#', $parsedUrl, $matches)) {
        $object = $middleware->authenticateRequest();
        $id = (int)$matches[1];
        $applicationController->getApplicationById($id);
    }

    elseif ($requestMethod === 'PATCH' && preg_match('#^/applications/(\d+)$#', $parsedUrl, $matches)) {
        $object = $middleware->authenticateRequest();
        if ($object->role !== 'admin') {
            http_response_code(403);
            echo json_encode(['message' => 'Access denied']);
            exit;
        }
        $id = (int)$matches[1];
        $data = json_decode(file_get_contents('php://input'), true);
        $applicationController->updateApplication($id, $data);
    }

    elseif ($requestMethod === 'DELETE' && preg_match('#^/applications/(\d+)$#', $parsedUrl, $matches)) {
        $object = $middleware->authenticateRequest();
        if ($object->role !== 'admin') {
            http_response_code(403);
            echo json_encode(['message' => 'Access denied']);
            exit;
        }
        $id = (int)$matches[1];
        $applicationController->deleteApplication($id);
    }

    elseif ($requestMethod === 'GET' && preg_match('#^/applications/by-user/(\d+)$#', $parsedUrl, $matches)) {
        $object = $middleware->authenticateRequest();
        $userId = (int)$matches[1];
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
        $applicationController->getApplicationsByUserId($userId, $page, $limit);
    }

    elseif ($requestMethod === 'GET' && preg_match('#^/applications/by-company/(\d+)$#', $parsedUrl, $matches)) {
        $object = $middleware->authenticateRequest();
        $companyId = (int)$matches[1];
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
        $applicationController->getApplicationsByCompanyId($companyId, $page, $limit);
    }

    elseif ($requestMethod === 'GET' && preg_match('#^/applications/by-internship/(\d+)$#', $parsedUrl, $matches)) {
        $object = $middleware->authenticateRequest();
        $internshipId = (int)$matches[1];
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
        $applicationController->getApplicationsByInternshipId($internshipId, $page, $limit);
    }

    elseif ($requestMethod === 'GET' && preg_match('#^/applications/by-status/(.+)$#', $parsedUrl, $matches)) {
        $object = $middleware->authenticateRequest();
        $status = $matches[1];
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
        $applicationController->getApplicationsByStatus($status, $page, $limit);
    }

    elseif ($requestMethod === 'GET' && preg_match('#^/applications/stats/(\d+)$#', $parsedUrl, $matches)) {
        $object = $middleware->authenticateRequest();
        $userId = (int)$matches[1];
        $applicationController->getApplicationStatsByUserId($userId);
    }

    elseif ($requestMethod === 'GET' && preg_match('#^/applications/information/(\d+)$#', $parsedUrl, $matches)) {
        $userId = (int)$matches[1];
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
        $applicationController->getApplicationsInformation($userId, $page, $limit);
    }

    else {
        http_response_code(404);
        echo json_encode(['message' => 'Application Route Not Found']);
    }
}
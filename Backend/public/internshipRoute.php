<?php
namespace Backend\Routes;

use Src\Adapter\Controllers\InternshipController;
use Src\Adapter\Presenters\JsonPresenter;
use Src\Usecase\InternshipUsecase;
use Src\Adapter\Gateways\Database\InternshipRepository;
use Src\Adapter\Gateways\Service\JWTService;
use Src\Adapter\Gateways\Service\MiddleWare;

require_once __DIR__ . '/../src/Domain/Interface/internshipFace.php';
require_once __DIR__ . '/../src/Domain/Entity/Internship.php';
require_once __DIR__ . '/../src/Adapter/Presenters/JsonPresenter.php';
require_once __DIR__ . '/../src/Adapter/Gateways/Database/internshipRepos.php';
require_once __DIR__ . '/../src/Usecase/internshipCase.php';
require_once __DIR__ . '/../src/Adapter/Controller/InternshipCon.php';
require_once __DIR__ . '/../src/Adapter/Gateways/Service/JWTService.php';
require_once __DIR__ . '/../src/Adapter/Gateways/Service/MiddleWare.php';

function INTERNSHIP_ROUTES(string $requestMethod, string $requestUri, InternshipController $internshipController): void
{
    $parsedUrl = strtok($requestUri, '?');
    $jwtService = new JWTService();
    $middleware = new MiddleWare();

    if ($requestMethod === 'GET' && $parsedUrl === '/internships') {
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
        $internshipController->getAllInternships($page, $limit);
    }

    elseif ($requestMethod === 'POST' && $parsedUrl === '/internships') {
        $object = $middleware->authenticateRequest();
        if ($object->role !== 'admin') {
            http_response_code(403);
            echo json_encode(['message' => 'Access denied']);
            exit;
        }
        $data = json_decode(file_get_contents('php://input'), true);
        $internshipController->createInternship($data);
    }

  
    elseif ($requestMethod === 'GET' && preg_match('#^/internships/(\d+)$#', $parsedUrl, $matches)) {
        $id = (int)$matches[1];
        $internshipController->getInternshipById($id);
    }

    elseif ($requestMethod === 'PUT' && preg_match('#^/internships/(\d+)$#', $parsedUrl, $matches)) {
        $object = $middleware->authenticateRequest();
        if ($object->role !== 'admin') {
            http_response_code(403);
            echo json_encode(['message' => 'Access denied']);
            exit;
        }
        $id = (int)$matches[1];
        $data = json_decode(file_get_contents('php://input'), true);
        $internshipController->updateInternship($id, $data);
    }

    elseif ($requestMethod === 'DELETE' && preg_match('#^/internships/(\d+)$#', $parsedUrl, $matches)) {
        $object = $middleware->authenticateRequest();
        if ($object->role !== 'admin') {
            http_response_code(403);
            echo json_encode(['message' => 'Access denied']);
            exit;
        }
        $id = (int)$matches[1];
        $internshipController->deleteInternship($id);
    }

    elseif ($requestMethod === 'GET' && $parsedUrl === '/internships/search') {
        $query = $_GET; 
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
        $internshipController->searchInternships($query, $page, $limit);
    }

    elseif ($requestMethod === 'POST' && preg_match('#^/internships/(\d+)/apply$#', $parsedUrl, $matches)) {
        $token = $jwtService->getTokenFromHeader();
        $object = $jwtService->validate($token);
        $userId = $jwtService->getUserIdFromToken($token);
        $internshipId = (int)$matches[1];
        $internshipController->applyToInternship($internshipId, $userId);
    }

    elseif ($requestMethod === 'GET' && preg_match('#^/internships/(\d+)/applications$#', $parsedUrl, $matches)) {
        $object = $middleware->authenticateRequest();
        if ($object->role !== 'admin') {
            http_response_code(403);
            echo json_encode(['message' => 'Access denied']);
            exit;
        }
        $internshipId = (int)$matches[1];
        $internshipController->getInternshipApplications($internshipId);
    }

    elseif ($requestMethod === 'GET' && $parsedUrl === '/internships/by-title') {
        $title = $_GET['title'] ?? '';
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
        $internshipController->getInternshipByTitle($title, $page, $limit);
    }

    elseif ($requestMethod === 'GET' && $parsedUrl === '/internships/by-company') {
        $company = $_GET['company'] ?? '';
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
        $internshipController->getInternshipByCompany($company, $page, $limit);
    }

    elseif ($requestMethod === 'GET' && $parsedUrl === '/internships/by-location') {
        $location = $_GET['location'] ?? '';
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
        $internshipController->getInternshipByLocation($location, $page, $limit);
    }

    elseif ($requestMethod === 'GET' && $parsedUrl === '/internships/by-category') {
        $category = $_GET['category'] ?? '';
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
        $internshipController->getInternshipByCategory($category, $page, $limit);
    }

    elseif ($requestMethod === 'GET' && $parsedUrl === '/internships/by-type') {
        $type = $_GET['type'] ?? '';
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
        $internshipController->getInternshipByType($type, $page, $limit);
        
    }elseif ($requestMethod === 'GET' && $parsedUrl === '/internships/by-company-id'){
        $companyId = $_GET['company_id'] ?? '';
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
        $internshipController->getInternshipByCompanyId($companyId, $page, $limit);
    }

    else {
        http_response_code(404);
        echo json_encode(['message' => 'Internship Route Not Found']);
    }
}
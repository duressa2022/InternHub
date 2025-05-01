<?php
namespace Backend\Routes;

use Src\Adapter\Controllers\CompanyController;
use Src\Adapter\Presenters\JsonPresenter;
use Src\Usecase\CompanyUsecase;
use Src\Adapter\Gateways\Database\CompanyRepository;
use Src\Adapter\Gateways\Service\JWTService;
use Src\Adapter\Gateways\Service\MiddleWare;

require_once __DIR__ . '/../src/Domain/Interface/companyFace.php';
require_once __DIR__ . '/../src/Domain/Entity/company.php';
require_once __DIR__ . '/../src/Adapter/Presenters/JsonPresenter.php';
require_once __DIR__ . '/../src/Adapter/Gateways/Database/companyRepos.php';
require_once __DIR__ . '/../src/Usecase/companyCase.php';
require_once __DIR__ . '/../src/Adapter/Controller/CompanyCon.php';
require_once __DIR__ . '/../src/Adapter/Gateways/Service/JWTService.php';
require_once __DIR__ . '/../src/Adapter/Gateways/Service/MiddleWare.php';

function COMPANY_ROUTES(string $requestMethod, string $requestUri, CompanyController $companyController): void
{
    $parsedUrl = strtok($requestUri, '?');
    $jwtService = new JWTService();
    $middleware = new MiddleWare();

    if ($requestMethod === 'GET' && $parsedUrl === '/companies') {
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
        $companyController->getAllCompanies($page, $limit);
    }

    elseif ($requestMethod === 'POST' && $parsedUrl === '/companies') {
        $object = $middleware->authenticateRequest();
        if ($object->role !== 'admin') {
            http_response_code(403);
            echo json_encode(['message' => 'Access denied']);
            exit;
        }
        $data = json_decode(file_get_contents('php://input'), true);
        $companyController->createCompany($data);
    }

    elseif ($requestMethod === 'GET' && preg_match('#^/companies/(\d+)$#', $parsedUrl, $matches)) {
        $id = (int)$matches[1];
        $companyController->getCompanyById($id);
    }

    elseif ($requestMethod === 'PUT' && preg_match('#^/companies/(\d+)$#', $parsedUrl, $matches)) {
        $object = $middleware->authenticateRequest();
        if ($object->role !== 'admin') {
            http_response_code(403);
            echo json_encode(['message' => 'Access denied']);
            exit;
        }
        $id = (int)$matches[1];
        $data = json_decode(file_get_contents('php://input'), true);
        $companyController->updateCompany($id, $data);
    }

    elseif ($requestMethod === 'DELETE' && preg_match('#^/companies/(\d+)$#', $parsedUrl, $matches)) {
        $object = $middleware->authenticateRequest();
        if ($object->role !== 'admin') {
            http_response_code(403);
            echo json_encode(['message' => 'Access denied']);
            exit;
        }
        $id = (int)$matches[1];
        $companyController->deleteCompany($id);
    }

    elseif ($requestMethod === 'GET' && $parsedUrl === '/companies/search') {
        $query = $_GET;
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
        $companyController->searchCompanies($query, $page, $limit);
    }

    elseif ($requestMethod === 'GET' && $parsedUrl === '/companies/by-name') {
        $name = $_GET['name'] ?? '';
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
        $companyController->getCompanyByName($name, $page, $limit);
    }

    elseif ($requestMethod === 'GET' && $parsedUrl === '/companies/by-category') {
        $category = $_GET['category'] ?? '';
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
        $companyController->getCompaniesByCategory($category, $page, $limit);
    }

    elseif ($requestMethod === 'GET' && $parsedUrl === '/companies/by-location') {
        $location = $_GET['location'] ?? '';
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
        $companyController->getCompaniesByLocation($location, $page, $limit);
    }

    elseif ($requestMethod === 'GET' && $parsedUrl === '/companies/by-rating') {
        $rating = isset($_GET['rating']) ? (float)$_GET['rating'] : 0.0;
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
        $companyController->getCompaniesByRating($rating, $page, $limit);
    }

    elseif ($requestMethod === 'GET' && preg_match('#^/companies/(\d+)/internships$#', $parsedUrl, $matches)) {
        $companyId = (int)$matches[1];
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
        $companyController->getCompanyInternships($companyId, $page, $limit);
    }

    else {
        http_response_code(404);
        echo json_encode(['message' => 'Company Route Not Found']);
    }
}
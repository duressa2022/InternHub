<?php

namespace Backend\Routes;

use Src\Adapter\Controllers\ReviewController;
use Src\Adapter\Presenters\JsonPresenter;
use Src\Usecase\ReviewUsecase;
use Src\Adapter\Gateways\Database\ReviewRepository;
use Src\Adapter\Gateways\Service\JWTService;
use Src\Adapter\Gateways\Service\MiddleWare;

require_once __DIR__ . '/../src/Domain/Interface/reviewFace.php';
require_once __DIR__ . '/../src/Domain/Entity/review.php';
require_once __DIR__ . '/../src/Adapter/Presenters/JsonPresenter.php';
require_once __DIR__ . '/../src/Adapter/Gateways/Database/reviewRepos.php';
require_once __DIR__ . '/../src/Usecase/ReviewUsecase.php';
require_once __DIR__ . '/../src/Adapter/Controller/reviewController.php';
require_once __DIR__ . '/../src/Adapter/Gateways/Service/JWTService.php';
require_once __DIR__ . '/../src/Adapter/Gateways/Service/MiddleWare.php';

function REVIEW_ROUTES(string $requestMethod, string $requestUri, ReviewController $reviewController): void
{
    $parsedUrl = strtok($requestUri, '?');
    $jwtService = new JWTService();
    $middleware = new MiddleWare();

    if ($requestMethod === 'POST' && $parsedUrl === '/reviews') {
        $object = $middleware->authenticateRequest();
        $data = json_decode(file_get_contents('php://input'), true);
        $reviewController->createReview($data);
    } elseif ($requestMethod === 'GET' && preg_match('#^/reviews/(\d+)$#', $parsedUrl, $matches)) {
        $object = $middleware->authenticateRequest();
        $id = (int)$matches[1];
        $reviewController->getReviewById($id);
    } elseif ($requestMethod === 'PATCH' && preg_match('#^/reviews/(\d+)$#', $parsedUrl, $matches)) {
        $object = $middleware->authenticateRequest();
        $id = (int)$matches[1];
        $data = json_decode(file_get_contents('php://input'), true);
        $reviewController->updateReview($id, $data);
    } elseif ($requestMethod === 'DELETE' && preg_match('#^/reviews/(\d+)$#', $parsedUrl, $matches)) {
        $object = $middleware->authenticateRequest();
        $id = (int)$matches[1];
        $reviewController->deleteReview($id);
    } elseif ($requestMethod === 'GET' && $parsedUrl === '/reviews') {
        $object = $middleware->authenticateRequest();
        if ($object->role !== 'admin') {
            http_response_code(403);
            echo json_encode(['message' => 'Access denied']);
            exit;
        }
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
        $reviewController->getAllReviews($page, $limit);
    } elseif ($requestMethod === 'GET' && preg_match('#^/reviews/by-company/(.+)$#', $parsedUrl, $matches)) {
        $object = $middleware->authenticateRequest();
        $company = urldecode($matches[1]);
        $reviewController->getReviewsByCompany($company);
    } elseif ($requestMethod === 'GET' && preg_match('#^/reviews/by-rating/(\d+\.\d+)$#', $parsedUrl, $matches)) {
        $object = $middleware->authenticateRequest();
        $rating = (float)$matches[1];
        $reviewController->getReviewsByRating($rating);
    } elseif ($requestMethod === 'DELETE' && preg_match('#^/reviews/by-company/(.+)$#', $parsedUrl, $matches)) {
        $object = $middleware->authenticateRequest();
        if ($object->role !== 'admin') {
            http_response_code(403);
            echo json_encode(['message' => 'Access denied']);
            exit;
        }
        $company = urldecode($matches[1]);
        $reviewController->deleteReviewByCompany($company);
    } else {
        http_response_code(404);
        echo json_encode(['message' => 'Review Route Not Found']);
    }
}
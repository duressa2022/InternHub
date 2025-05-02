<?php 
namespace Src\Adapter\Gateways\Service;
use Src\Adapter\Gateways\Service\JWTService;
class MiddleWare{
    function authenticateRequest(): ?object
    {
        $headers = getallheaders();
        if (!isset($headers['Authorization'])) {
            http_response_code(401);
            echo json_encode(['message' => 'Token required']);
            exit;
        }

        $token = str_replace('Bearer ', '', $headers['Authorization']);
        $jwtService = new JWTService();
        $decoded = $jwtService->validate($token);

        if (!$decoded) {
            http_response_code(401);
            echo json_encode(['message' => 'Invalid or expired token']);
            exit;
        }

        return $decoded;
    }

}


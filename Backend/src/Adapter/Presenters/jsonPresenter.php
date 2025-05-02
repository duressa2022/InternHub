<?php
namespace Src\Adapter\Presenters;

class JsonPresenter
{
    public function respond_without(int $status, array $data): void
    {
        header('Content-Type: application/json; charset=utf-8');
        http_response_code($status);
        echo json_encode($data, JSON_PRETTY_PRINT);
    }

    public function respond_with(string $token,int $status, array $data): void{
        header('Content-Type: application/json; charset=utf-8');
        http_response_code($status);
        echo json_encode([
            'token' => $token,
            'data' => $data
        ], JSON_PRETTY_PRINT);
    }

    public function respond(string $access,string $refresh,int $status, array $data): void{
        header('Content-Type: application/json; charset=utf-8');
        http_response_code($status);
        echo json_encode([
            'access' => $access,
            'refresh' => $refresh,
            'data' => $data
        ], JSON_PRETTY_PRINT);
    }
   
}
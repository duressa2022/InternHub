<?php
namespace Src\Adapter\Gateways\Service;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use DateTimeImmutable;
class JWTService
{
    private $secret;
    private $accessExp;
    private $refreshExp;

    public function __construct()
    {
        $this->secret = $_ENV['JWT_SECRET'];
        $this->accessExp = $_ENV['ACCESS_TOKEN_EXP'];
        $this->refreshExp = $_ENV['REFRESH_TOKEN_EXP'];
    }

    public function generateAccessToken(array $user): string
    {
        $now = new DateTimeImmutable();
        $payload = [
            'iat' => $now->getTimestamp(),
            'exp' => $now->getTimestamp() + $this->accessExp,
            'uid' => $user['id'],
            'email' => $user['email'],
            'role' => $user['role'] ?? 'user'
        ];
        return JWT::encode($payload, $this->secret, 'HS256');
    }

    public function generateRefreshToken(array $user): string
    {
        $now = new DateTimeImmutable();
        $payload = [
            'iat' => $now->getTimestamp(),
            'exp' => $now->getTimestamp() + $this->refreshExp,
            'uid' => $user['id']
        ];
        return JWT::encode($payload, $this->secret, 'HS256');
    }

    public function validate(string $token): ?object
    {
        try {
            return JWT::decode($token, new Key($this->secret, 'HS256'));
        } catch (\Exception $e) {
            return null;
        }
    }

    public function getUserIdFromToken(string $token): ?int
    {
        $decoded = $this->validate($token);
        return $decoded ? (int)$decoded->uid : null;
    }
    
    public function getUserEmailFromToken(string $token): ?string
    {
        $decoded = $this->validate($token);
        return $decoded ? $decoded->email : null;
    }

    public function getUserRoleFromToken(string $token): ?string
    {
        $decoded = $this->validate($token);
        return $decoded ? $decoded->role : null;
    }
    public function getTokenFromHeader(): ?string
    {
        $headers = getallheaders();
        if (isset($headers['Authorization'])) {
            $matches = [];
            preg_match('/Bearer\s(\S+)/', $headers['Authorization'], $matches);
            return $matches[1] ?? null;
        }
        return null;
    }
    public function getTokenFromCookie(string $token): ?string
    {
        return $_COOKIE[token] ?? null;
    }

}


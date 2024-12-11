<?php

namespace App\Application\Services;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JwtService
{
    private $secret;

    public function __construct(string $secret)
    {
        $this->secret = $secret;
    }

    public function generateToken($userId)
    {
        $payload = [
            'iss' => "http://localhost",
            'aud' => "http://localhost",
            'iat' => time(),
            'nbf' => time(),
            'exp' => time() + (3600 * 24),
            'uid' => $userId
        ];
        return JWT::encode($payload, $this->secret, 'HS256');
    }

    public function validateToken($token)
    {
        try {
            $decoded = JWT::decode($token, new Key($this->secret, 'HS256'));
            return $decoded->uid;
        } catch (\Exception $e) {
            return null;
        }
    }
}

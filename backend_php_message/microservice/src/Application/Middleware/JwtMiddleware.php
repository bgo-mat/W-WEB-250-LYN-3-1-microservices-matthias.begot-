<?php

namespace App\Application\Middleware;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface;
use App\Application\Services\JwtService;

class JwtMiddleware
{
    private $jwtService;

    public function __construct(JwtService $jwtService)
    {
        $this->jwtService = $jwtService;
    }

    public function __invoke(Request $request, RequestHandlerInterface $handler): Response
    {
        $authHeader = $request->getHeaderLine('Authorization');
        if (!$authHeader) {
            $response = new \Slim\Psr7\Response();
            $response->getBody()->write(json_encode(['error' => 'Missing Authorization Header']));
            return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
        }

        $token = str_replace('Bearer ', '', $authHeader);
        $userId = $this->jwtService->validateToken($token);

        if (!$userId) {
            $response = new \Slim\Psr7\Response();
            $response->getBody()->write(json_encode(['error' => 'Invalid Token']));
            return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
        }

        // Stocke l'id de l'utilisateur dans la requête
        $request = $request->withAttribute('user_id', $userId);
        return $handler->handle($request);
    }
}

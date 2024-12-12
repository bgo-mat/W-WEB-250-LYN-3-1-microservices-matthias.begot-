<?php

namespace App\Application\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Domain\User\User;
use App\Application\Services\JwtService;
use Slim\Exception\HttpBadRequestException;
use Slim\Exception\HttpNotFoundException;

class UserController
{
    private $jwtService;

    public function __construct(JwtService $jwtService)
    {
        $this->jwtService = $jwtService;
    }

    public function register(Request $request, Response $response): Response
    {
        $data = $request->getParsedBody();
        $name = $data['name'] ?? null;
        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;

        if (!$name || !$email || !$password) {
            throw new HttpBadRequestException($request, "Missing required fields");
        }

        if (User::where('email', $email)->exists()) {
            $response->getBody()->write(json_encode(['error' => 'Email already used']));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => password_hash($password, PASSWORD_BCRYPT)
        ]);

        $response->getBody()->write(json_encode(['message' => 'User created', 'user' => $user]));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function login(Request $request, Response $response): Response
    {
        $data = $request->getParsedBody();
        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;

        if (!$email || !$password) {
            throw new HttpBadRequestException($request, "Missing email or password");
        }

        $user = User::where('email', $email)->first();
        if (!$user || !password_verify($password, $user->password)) {
            $response->getBody()->write(json_encode(['error' => 'Invalid credentials']));
            return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
        }

        $token = $this->jwtService->generateToken($user->id);

        $response->getBody()->write(json_encode(['token' => $token]));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function getOne(Request $request, Response $response, $args): Response
    {
        $user = User::find($args['id']);
        if (!$user) {
            throw new HttpNotFoundException($request, "User not found");
        }

        $response->getBody()->write($user->toJson());
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function update(Request $request, Response $response, $args): Response
    {
        $user = User::find($args['id']);
        if (!$user) {
            throw new HttpNotFoundException($request, "User not found");
        }

        $data = $request->getParsedBody();
        if (isset($data['name'])) $user->name = $data['name'];
        if (isset($data['email'])) $user->email = $data['email'];
        if (isset($data['password'])) $user->password = password_hash($data['password'], PASSWORD_BCRYPT);

        $user->save();
        $response->getBody()->write($user->toJson());
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function delete(Request $request, Response $response, $args): Response
    {
        $user = User::find($args['id']);
        if (!$user) {
            throw new HttpNotFoundException($request, "User not found");
        }
        $user->delete();

        $response->getBody()->write(json_encode(['message' => 'User deleted']));
        return $response->withHeader('Content-Type', 'application/json');
    }

    // Nouvelles méthodes pour l'utilisateur connecté (sans {id})
    public function getCurrent(Request $request, Response $response): Response
    {
        $userId = $request->getAttribute('user_id');
        $user = User::find($userId);

        if (!$user) {
            throw new HttpNotFoundException($request, "User not found");
        }

        $response->getBody()->write($user->toJson());
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function updateCurrent(Request $request, Response $response): Response
    {
        $userId = $request->getAttribute('user_id');
        $user = User::find($userId);

        if (!$user) {
            throw new HttpNotFoundException($request, "User not found");
        }

        $data = $request->getParsedBody();
        if (isset($data['name'])) $user->name = $data['name'];
        if (isset($data['email'])) $user->email = $data['email'];
        if (isset($data['password'])) $user->password = password_hash($data['password'], PASSWORD_BCRYPT);

        $user->save();
        $response->getBody()->write($user->toJson());
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function deleteCurrent(Request $request, Response $response): Response
    {
        $userId = $request->getAttribute('user_id');
        $user = User::find($userId);

        if (!$user) {
            throw new HttpNotFoundException($request, "User not found");
        }

        $user->delete();
        $response->getBody()->write(json_encode(['message' => 'User deleted']));
        return $response->withHeader('Content-Type', 'application/json');
    }
}

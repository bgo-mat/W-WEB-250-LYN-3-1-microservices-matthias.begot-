<?php

namespace App\Application\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Domain\Message\Message;
use Slim\Exception\HttpBadRequestException;
use Slim\Exception\HttpNotFoundException;

class MessageController
{
    public function getAll(Request $request, Response $response): Response
    {
        $messages = Message::with('user')->get();
        $response->getBody()->write($messages->toJson());
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function getOne(Request $request, Response $response, $args): Response
    {
        $message = Message::with('user')->find($args['id']);
        if (!$message) {
            throw new HttpNotFoundException($request, "Message not found");
        }

        $response->getBody()->write($message->toJson());
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function create(Request $request, Response $response): Response
    {
        $userId = $request->getAttribute('user_id');
        $data = $request->getParsedBody();
        $content = $data['content'] ?? null;

        if (!$content) {
            throw new HttpBadRequestException($request, "Missing content");
        }

        $message = Message::create([
            'user_id' => $userId,
            'content' => $content
        ]);

        $response->getBody()->write($message->toJson());
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function update(Request $request, Response $response, $args): Response
    {
        $userId = $request->getAttribute('user_id');
        $message = Message::find($args['id']);

        if (!$message) {
            throw new HttpNotFoundException($request, "Message not found");
        }

        if ($message->user_id !== $userId) {
            $response->getBody()->write(json_encode(['error' => 'Not authorized']));
            return $response->withStatus(403)->withHeader('Content-Type', 'application/json');
        }

        $data = $request->getParsedBody();
        if (isset($data['content'])) {
            $message->content = $data['content'];
            $message->save();
        }

        $response->getBody()->write($message->toJson());
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function delete(Request $request, Response $response, $args): Response
    {
        $userId = $request->getAttribute('user_id');
        $message = Message::find($args['id']);

        if (!$message) {
            throw new HttpNotFoundException($request, "Message not found");
        }

        if ($message->user_id !== $userId) {
            $response->getBody()->write(json_encode(['error' => 'Not authorized']));
            return $response->withStatus(403)->withHeader('Content-Type', 'application/json');
        }

        $message->delete();
        $response->getBody()->write(json_encode(['message' => 'Message deleted']));
        return $response->withHeader('Content-Type', 'application/json');
    }
}

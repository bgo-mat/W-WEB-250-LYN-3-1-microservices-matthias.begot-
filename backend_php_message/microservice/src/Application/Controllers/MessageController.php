<?php

namespace App\Application\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Domain\Message\Message;
use Slim\Exception\HttpBadRequestException;
use Slim\Exception\HttpNotFoundException;

class MessageController
{
    public function getByConversation(Request $request, Response $response, $args): Response
    {
        $conv_id = $args['conv_id'];
        $messages = Message::with('user')->where('conv_id', $conv_id)->get();

        if ($messages->isEmpty()) {
            $response->getBody()->write(json_encode(['message' => 'No messages found for this conversation']));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(404);
        }

        $response->getBody()->write($messages->toJson());
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function create(Request $request, Response $response): Response
    {
        $userId = $request->getAttribute('user_id');
        $data = $request->getParsedBody();
        $content = $data['content'] ?? null;
        $conv_id = $data['conv_id'] ?? null;

        if (!$content || !$conv_id) {
            throw new HttpBadRequestException($request, "Missing content or conv_id");
        }

        $message = Message::create([
            'user_id' => $userId,
            'content' => $content,
            'conv_id' => $conv_id
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

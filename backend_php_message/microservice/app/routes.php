<?php

use Slim\App;
use App\Application\Controllers\UserController;
use App\Application\Controllers\MessageController;
use App\Application\Middleware\JwtMiddleware;
use App\Application\Services\JwtService;

return function (App $app) {

    $app->options('/{routes:.+}', function ($request, $response, $args) {
        return $response;
    });

    $container = $app->getContainer();
    $jwtService = new JwtService($container->get('jwt_secret'));

    $app->post('/register', [new UserController($jwtService), 'register']);
    $app->post('/login', [new UserController($jwtService), 'login']);

    $app->group('/user', function ($group) use ($jwtService) {
        $group->get('', [new UserController($jwtService), 'getCurrent']);
        $group->put('', [new UserController($jwtService), 'updateCurrent']);
        $group->patch('', [new UserController($jwtService), 'updateCurrent']);
        $group->delete('', [new UserController($jwtService), 'deleteCurrent']);
        $group->get('/{id}', [new UserController($jwtService), 'getOne']);
        $group->put('/{id}', [new UserController($jwtService), 'update']);
        $group->delete('/{id}', [new UserController($jwtService), 'delete']);
    })->add(new JwtMiddleware($jwtService));

    $app->group('/messages', function ($group) use ($jwtService) {
        $group->get('', [new MessageController(), 'getAll']);
        $group->get('/{id}', [new MessageController(), 'getOne']);
        $group->post('', [new MessageController(), 'create']);
        $group->put('/{id}', [new MessageController(), 'update']);
        $group->delete('/{id}', [new MessageController(), 'delete']);
    })->add(new JwtMiddleware($jwtService));
};

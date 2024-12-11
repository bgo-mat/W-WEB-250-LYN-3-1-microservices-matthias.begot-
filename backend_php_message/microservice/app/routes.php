<?php

use Slim\App;
use App\Application\Controllers\UserController;
use App\Application\Controllers\MessageController;
use App\Application\Middleware\JwtMiddleware;
use App\Application\Services\JwtService;

return function (App $app) {
    $container = $app->getContainer();
    $jwtService = new JwtService($container->get('jwt_secret'));

    // User routes (public)
    $app->post('/register', [new UserController($jwtService), 'register']);
    $app->post('/login', [new UserController($jwtService), 'login']);

    // User CRUD (admin or protected ? Dans ce cas, protégé par token)
    $app->group('/users', function ($group) use ($jwtService) {
        $group->get('', [new UserController($jwtService), 'getAll']);
        $group->get('/{id}', [new UserController($jwtService), 'getOne']);
        $group->put('/{id}', [new UserController($jwtService), 'update']);
        $group->delete('/{id}', [new UserController($jwtService), 'delete']);
    })->add(new JwtMiddleware($jwtService));

    // Message routes (auth required)
    $app->group('/messages', function ($group) use ($jwtService) {
        $group->get('', [new MessageController(), 'getAll']);
        $group->get('/{id}', [new MessageController(), 'getOne']);
        $group->post('', [new MessageController(), 'create']);
        $group->put('/{id}', [new MessageController(), 'update']);
        $group->delete('/{id}', [new MessageController(), 'delete']);
    })->add(new JwtMiddleware($jwtService));
};

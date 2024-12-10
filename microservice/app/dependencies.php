<?php

declare(strict_types=1);

use Monolog\Handler\StreamHandler;
use Monolog\Logger;
use Psr\Container\ContainerInterface;
use Illuminate\Database\Capsule\Manager as Capsule;

return function (ContainerInterface $container) {
    $settings = $container->get('settings');

    // Logger
    $logger = new Logger($settings['logger']['name']);
    $logger->pushHandler(new StreamHandler($settings['logger']['path'], $settings['logger']['level']));
    $container->set('logger', $logger);

    // Eloquent
    $capsule = new Capsule;
    $capsule->addConnection($settings['db']);
    $capsule->setAsGlobal();
    $capsule->bootEloquent();
    $container->set('db', $capsule);

    // JWT secret
    $container->set('jwt_secret', $settings['jwt']['secret']);
};


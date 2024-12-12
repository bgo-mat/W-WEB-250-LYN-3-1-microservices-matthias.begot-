<?php

use DI\ContainerBuilder;
use Psr\Container\ContainerInterface;
use Illuminate\Database\Capsule\Manager as Capsule;
use Monolog\Logger;
use Monolog\Handler\StreamHandler;

return function (ContainerBuilder $containerBuilder) {
    $containerBuilder->addDefinitions([
        Logger::class => function (ContainerInterface $c) {
            $settings = $c->get('settings');
            $logger = new Logger($settings['logger']['name']);
            $logger->pushHandler(new StreamHandler($settings['logger']['path'], $settings['logger']['level']));
            return $logger;
        },

        'db' => function (ContainerInterface $c) {
            $settings = $c->get('settings');
            $capsule = new Capsule();
            $capsule->addConnection($settings['db']);
            $capsule->setAsGlobal();
            $capsule->bootEloquent();
            return $capsule;
        },

        'jwt_secret' => function (ContainerInterface $c) {
            return $c->get('settings')['jwt']['secret'];
        },
    ]);
};

<?php

declare(strict_types=1);

return function (\DI\ContainerBuilder $containerBuilder) {
    $containerBuilder->addDefinitions([
        'settings' => [
            'displayErrorDetails' => true,
            'logger' => [
                'name' => 'slim-app',
                'path' => __DIR__ . '/logs/app.log',
                'level' => \Monolog\Logger::DEBUG,
            ],
            'db' => [
                'driver' => 'mysql',
                'host' => getenv('DB_HOST') ?: 'db',
                'database' => getenv('DB_DATABASE') ?: 'mydb',
                'username' => getenv('DB_USER') ?: 'root',
                'password' => getenv('DB_PASS') ?: 'password',
                'charset' => 'utf8',
                'collation' => 'utf8_unicode_ci',
                'prefix' => '',
            ],
            'jwt' => [
                'secret' => getenv('JWT_SECRET') ?: 'le_jwt_de_toto_12345'
            ]
        ],
    ]);
};

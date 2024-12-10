<?php

declare(strict_types=1);

use DI\ContainerBuilder;
use Slim\Factory\AppFactory;

require __DIR__ . '/../vendor/autoload.php';

$containerBuilder = new ContainerBuilder();

// Chargement des settings
$settings = require __DIR__ . '/../app/settings.php';
$settings($containerBuilder);

// Chargement des dépendances
$dependencies = require __DIR__ . '/../app/dependencies.php';
$dependencies($containerBuilder);

// Construction du container
$container = $containerBuilder->build();

// Création de l'application Slim
AppFactory::setContainer($container);
$app = AppFactory::create();

// Middlewares Slim
$app->addBodyParsingMiddleware();
$app->addRoutingMiddleware();

$container->get('db');

$routes = require __DIR__ . '/../app/routes.php';
$routes($app);

// Chargement des middlewares et des routes
(require __DIR__ . '/../app/middleware.php')($app);

$app->run();


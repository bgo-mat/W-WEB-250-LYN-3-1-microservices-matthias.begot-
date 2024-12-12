<?php

require __DIR__ . '/vendor/autoload.php';

use DI\ContainerBuilder;

$containerBuilder = new ContainerBuilder();

$settings = require __DIR__ . '/app/settings.php';
$settings($containerBuilder);

$dependencies = require __DIR__ . '/app/dependencies.php';
$dependencies($containerBuilder);

$container = $containerBuilder->build();

$db = $container->get('db');

foreach (glob(__DIR__ . '/database/migrations/*.php') as $migration) {
    require_once $migration;
}

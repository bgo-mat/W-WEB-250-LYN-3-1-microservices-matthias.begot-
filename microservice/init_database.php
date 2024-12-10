<?php

require __DIR__ . '/vendor/autoload.php';

$settings = require __DIR__ . '/app/settings.php';
$builder = new \DI\ContainerBuilder();
$builder->addDefinitions($settings);
$container = $builder->build();
(require __DIR__ . '/app/dependencies.php')($container);

use Illuminate\Database\Capsule\Manager as Capsule;

// Run Migrations
foreach (glob(__DIR__ . '/database/migrations/*.php') as $migration) {
    require_once $migration;
}

<?php

require __DIR__ . '/vendor/autoload.php';

use DI\ContainerBuilder;

$containerBuilder = new ContainerBuilder();

// Chargement des settings
$settings = require __DIR__ . '/app/settings.php';
$settings($containerBuilder);

// Chargement des dépendances
$dependencies = require __DIR__ . '/app/dependencies.php';
$dependencies($containerBuilder);

// Construction du container
$container = $containerBuilder->build();

// Force l'initialisation de la DB
$db = $container->get('db');

// Maintenant que la DB est initialisée, on peut lancer les migrations
foreach (glob(__DIR__ . '/database/migrations/*.php') as $migration) {
    require_once $migration;
}

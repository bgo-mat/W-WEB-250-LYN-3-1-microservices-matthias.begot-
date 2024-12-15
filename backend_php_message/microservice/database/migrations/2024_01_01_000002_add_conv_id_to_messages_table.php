<?php

use Illuminate\Database\Capsule\Manager as Capsule;
use Illuminate\Database\Schema\Blueprint;

Capsule::schema()->table('messages', function (Blueprint $table) {
    $table->text('conv_id')->after('id');
});

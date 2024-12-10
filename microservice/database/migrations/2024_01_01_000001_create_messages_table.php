<?php

use Illuminate\Database\Capsule\Manager as Capsule;
use Illuminate\Database\Schema\Blueprint;

Capsule::schema()->create('messages', function (Blueprint $table) {
    $table->id();
    $table->unsignedBigInteger('user_id');
    $table->text('content');
    $table->timestamps();

    $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
});

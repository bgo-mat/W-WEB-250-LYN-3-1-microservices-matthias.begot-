<?php

namespace App\Domain\User;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    protected $table = 'users';
    protected $fillable = ['email', 'password', 'name'];
    protected $hidden = ['password'];
}

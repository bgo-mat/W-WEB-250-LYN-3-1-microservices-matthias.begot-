<?php

namespace App\Domain\Message;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $table = 'messages';
    protected $fillable = ['user_id', 'content', 'conv_id'];

    public function user()
    {
        return $this->belongsTo('App\Domain\User\User', 'user_id');
    }
}

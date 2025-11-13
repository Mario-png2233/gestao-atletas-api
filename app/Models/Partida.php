<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Partida extends Model
{
    protected $table = 'partidas';
    
    protected $fillable = [
        'adversario',
        'competicao',
        'tipo',
        'data_hora',
        'local',
        'observacoes'
    ];

    protected $casts = [
        'data_hora' => 'datetime'
    ];
}
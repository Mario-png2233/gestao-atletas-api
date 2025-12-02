<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tatica extends Model
{
    protected $table = 'taticas';
    
    protected $fillable = [
        'usuario_id',
        'nome',
        'formacao',
        'descricao',
        'instrucoes_ataque',
        'instrucoes_defesa',
        'jogadas_ensaiadas',
        'posicoes_jogadores',
        'ativa'
    ];

    protected $casts = [
        'posicoes_jogadores' => 'array',
        'ativa' => 'boolean'
    ];

    public function tecnico()
    {
        return $this->belongsTo('App\Models\Usuario', 'usuario_id');
    }
}


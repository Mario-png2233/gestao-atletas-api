<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Evento extends Model
{
    protected $table = 'eventos';
    
    protected $fillable = [
        'titulo',
        'descricao',
        'data_inicio',
        'data_fim',
        'tipo',
        'local',
        'cor',
        'lembrete',
        'lembrete_minutos',
        'partida_id',
        'treino_id',
        'usuario_id'
    ];

    protected $casts = [
        'data_inicio' => 'datetime',
        'data_fim' => 'datetime',
        'lembrete' => 'boolean'
    ];

    public function partida()
    {
        return $this->belongsTo('App\Models\Partida');
    }

    public function treino()
    {
        return $this->belongsTo('App\Models\Treino');
    }

    public function usuario()
    {
        return $this->belongsTo('App\Models\Usuario');
    }
}



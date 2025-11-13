<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Treino extends Model
{
    protected $table = 'treinos';
    
    protected $fillable = [
        'tipo_treino',
        'descricao',
        'data_hora',
        'local',
        'duracao_minutos',
        'observacoes'
    ];

    protected $casts = [
        'data_hora' => 'datetime'
    ];

    public function atletas()
    {
        return $this->belongsToMany('App\Models\Atleta', 'atleta_treino')
                    ->withPivot('presente', 'observacoes')
                    ->withTimestamps();
    }
}
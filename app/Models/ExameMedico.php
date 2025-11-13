<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExameMedico extends Model
{
    protected $table = 'exames_medicos';
    
    protected $fillable = [
        'atleta_id',
        'usuario_id',
        'tipo_exame',
        'data_exame',
        'resultados',
        'status',
        'recomendacoes',
        'proximo_exame'
    ];

    protected $casts = [
        'data_exame' => 'date',
        'proximo_exame' => 'date'
    ];

    public function atleta()
    {
        return $this->belongsTo('App\Models\Atleta');
    }

    public function medico()
    {
        return $this->belongsTo('App\Models\Usuario', 'usuario_id');
    }
}
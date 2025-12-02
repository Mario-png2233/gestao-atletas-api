<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AvaliacaoFisica extends Model
{
    protected $table = 'avaliacoes_fisicas';

    protected $fillable = [
        'atleta_id',
        'usuario_id',
        'data_avaliacao',
        'batimentos_repouso',
        'batimentos_esforco',
        'pressao_arterial',
        'peso',
        'altura',
        'imc',
        'percentual_gordura',
        'massa_muscular',
        'vo2_max',
        'flexibilidade',
        'velocidade_10m',
        'velocidade_40m',
        'salto_vertical',
        'resistencia_abdominal',
        'status',
        'observacoes',
        'recomendacoes'
    ];

    protected $casts = [
        'data_avaliacao' => 'date',
        'peso' => 'float',
        'altura' => 'float',
        'imc' => 'float',
        'percentual_gordura' => 'float',
        'massa_muscular' => 'float',
        'vo2_max' => 'float',
        'velocidade_10m' => 'float',
        'velocidade_40m' => 'float'
    ];

    public function atleta()
    {
        return $this->belongsTo(Atleta::class);
    }

    public function usuario()
    {
        return $this->belongsTo(Usuario::class);
    }

    // Calcular IMC automaticamente
    public static function calcularIMC($peso, $altura)
    {
        if ($peso && $altura && $altura > 0) {
            return round($peso / ($altura * $altura), 1);
        }
        return null;
    }
}




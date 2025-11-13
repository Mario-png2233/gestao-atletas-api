<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lesao extends Model
{
    protected $table = 'lesoes';
    
    protected $fillable = [
        'atleta_id',
        'tipo_lesao',
        'descricao',
        'data_lesao',
        'data_recuperacao_estimada',
        'status',
        'gravidade'
        // Removido: usuario_id, previsao_retorno, tratamento_prescrito
    ];

    protected $casts = [
        'data_lesao' => 'date',
        'data_recuperacao_estimada' => 'date'
    ];

    public function atleta()
    {
        return $this->belongsTo('App\Models\Atleta');
    }

    public function estaAtiva()
    {
        return $this->status === 'ATIVA';
    }

    public function diasAteRecuperacao()
    {
        $hoje = date('Y-m-d');
        $dataRetorno = $this->data_recuperacao_estimada;
        
        return abs(round((strtotime($dataRetorno) - strtotime($hoje)) / (60 * 60 * 24)));
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lesao extends Model
{
    protected $table = 'lesoes';
    
    protected $fillable = [
        'atleta_id',
        'usuario_id',           // ← ADICIONADO para compatibilidade
        'tipo_lesao',
        'descricao',
        'tratamento_prescrito', // ← ADICIONADO para compatibilidade  
        'data_lesao',
        'previsao_retorno',     // ← ADICIONADO para compatibilidade
        'data_recuperacao_estimada',
        'status',
        'gravidade'
    ];

    protected $casts = [
        'data_lesao' => 'date',
        'previsao_retorno' => 'date',     // ← ADICIONADO
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
        if (!$this->data_recuperacao_estimada) {
            return null;
        }
        
        $hoje = date('Y-m-d');
        $dataRetorno = $this->data_recuperacao_estimada;
        
        return abs(round((strtotime($dataRetorno) - strtotime($hoje)) / (60 * 60 * 24)));
    }

    // Método para compatibilidade - usa previsao_retorno se disponível
    public function getPrevisaoRetornoAttribute()
    {
        return $this->attributes['previsao_retorno'] ?? $this->attributes['data_recuperacao_estimada'];
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Patrocinio extends Model
{
    protected $table = 'patrocinios';
    
    protected $fillable = [
        'empresa',
        'contato',
        'telefone',
        'email',
        'valor_contrato',
        'data_inicio',
        'data_fim',
        'tipo',
        'status',
        'descricao',
        'contrapartidas'
    ];

    protected $casts = [
        'data_inicio' => 'date',
        'data_fim' => 'date',
        'valor_contrato' => 'decimal:2'
    ];

    public function receitas()
    {
        return $this->hasMany('App\Models\Receita');
    }

    public function estaAtivo()
    {
        return $this->status === 'ATIVO';
    }
}




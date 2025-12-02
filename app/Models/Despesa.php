<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Despesa extends Model
{
    protected $table = 'despesas';
    
    protected $fillable = [
        'descricao',
        'valor',
        'data',
        'data_vencimento',
        'categoria',
        'status',
        'fornecedor',
        'nota_fiscal',
        'observacoes'
    ];

    protected $casts = [
        'data' => 'date',
        'data_vencimento' => 'date',
        'valor' => 'decimal:2'
    ];
}



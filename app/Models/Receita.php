<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Receita extends Model
{
    protected $table = 'receitas';
    
    protected $fillable = [
        'descricao',
        'valor',
        'data',
        'categoria',
        'status',
        'patrocinio_id',
        'observacoes'
    ];

    protected $casts = [
        'data' => 'date',
        'valor' => 'decimal:2'
    ];

    public function patrocinio()
    {
        return $this->belongsTo('App\Models\Patrocinio');
    }
}


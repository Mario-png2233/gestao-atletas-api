<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notificacao extends Model
{
    protected $table = 'notificacoes';
    
    protected $fillable = [
        'usuario_id',
        'titulo',
        'mensagem',
        'tipo',
        'lida',
        'dados_adicinais'
    ];

    protected $casts = [
        'lida' => 'boolean',
        'dados_adicinais' => 'array'
    ];

    public function usuario()
    {
        return $this->belongsTo('App\Models\Usuario');
    }

    public function marcarComoLida()
    {
        $this->update(['lida' => true]);
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Atleta extends Model
{
    protected $table = 'atletas';
    
    protected $fillable = [
        'nome',
        'data_nascimento',
        'posicao',
        'altura',
        'peso',
        'status',
        'historico_medico',
        'telefone_contato',
        'foto_url'
    ];

    protected $casts = [
        'data_nascimento' => 'date',
        'altura' => 'decimal:2',
        'peso' => 'decimal:2'
    ];

    // RELACIONAMENTOS
    public function lesoes()
    {
        return $this->hasMany('App\Models\Lesao');
    }

    public function examesMedicos()
    {
        return $this->hasMany('App\Models\ExameMedico');
    }

    public function treinos()
    {
        return $this->belongsToMany('App\Models\Treino', 'atleta_treino')
                    ->withPivot('presente', 'observacoes')
                    ->withTimestamps();
    }

    // MÉTODOS DE NEGÓCIO
    public function estaLesionado()
    {
        return $this->status === 'LESIONADO';
    }

    public function lesaoAtiva()
    {
        return $this->lesoes()->where('status', 'ATIVA')->first();
    }
}
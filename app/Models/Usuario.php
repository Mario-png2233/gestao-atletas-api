<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;

class Usuario extends Model
{
    protected $table = 'usuarios';
    
    protected $fillable = [
        'email',
        'senha', 
        'perfil',
        'tentativas_login',
        'data_bloqueio'
    ];

    protected $hidden = [
        'senha'
    ];

    protected $casts = [
        'data_bloqueio' => 'datetime'
    ];

    public function lesoesRegistradas()
    {
        return $this->hasMany('App\Models\Lesao', 'usuario_id');
    }

    public function examesRegistrados()
    {
        return $this->hasMany('App\Models\ExameMedico', 'usuario_id');
    }

    public function notificacoes()
    {
        return $this->hasMany('App\Models\Notificacao');
    }

    public function isMedico()
    {
        return $this->perfil === 'MEDICO';
    }

    public function isTecnico()
    {
        return $this->perfil === 'TECNICO';
    }

    public function isPreparador()
    {
        return $this->perfil === 'PREPARADOR';
    }

    public function incrementarTentativaLogin()
    {
        $this->increment('tentativas_login');
        
        if ($this->tentativas_login >= 3) {
            $this->update(['data_bloqueio' => date('Y-m-d H:i:s')]);
        }
    }

    public function resetarTentativasLogin()
    {
        $this->update([
            'tentativas_login' => 0,
            'data_bloqueio' => null
        ]);
    }

    public function estaBloqueado()
    {
        if (!$this->data_bloqueio) {
            return false;
        }

        $minutosBloqueio = round((time() - strtotime($this->data_bloqueio)) / 60);
        
        if ($minutosBloqueio > 30) {
            $this->resetarTentativasLogin();
            return false;
        }

        return $this->tentativas_login >= 3;
    }

    public function setSenhaAttribute($value)
    {
        $this->attributes['senha'] = Hash::make($value);
    }
}
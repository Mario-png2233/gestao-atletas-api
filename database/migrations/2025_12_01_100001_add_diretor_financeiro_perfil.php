<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class AddDiretorFinanceiroPerfil extends Migration
{
    public function up()
    {
        // Modificar o ENUM para incluir DIRETOR_FINANCEIRO
        DB::statement("ALTER TABLE usuarios MODIFY COLUMN perfil ENUM('MEDICO', 'TECNICO', 'PREPARADOR', 'DIRETOR_FINANCEIRO') NOT NULL");
    }

    public function down()
    {
        DB::statement("ALTER TABLE usuarios MODIFY COLUMN perfil ENUM('MEDICO', 'TECNICO', 'PREPARADOR') NOT NULL");
    }
}

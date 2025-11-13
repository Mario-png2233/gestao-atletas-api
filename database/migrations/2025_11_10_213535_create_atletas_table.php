<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAtletasTable extends Migration
{
    public function up()
    {
        Schema::create('atletas', function (Blueprint $table) {
            $table->id();
            $table->string('nome');
            $table->date('data_nascimento');
            $table->string('posicao');
            $table->decimal('altura', 3, 2); // Ex: 1.85
            $table->decimal('peso', 5, 2);   // Ex: 78.50
            $table->enum('status', ['DISPONIVEL', 'LESIONADO', 'SUSPENSO'])->default('DISPONIVEL');
            $table->text('historico_medico')->nullable();
            $table->string('telefone_contato');
            $table->string('foto_url')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('atletas');
    }
}
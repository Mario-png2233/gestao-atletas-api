<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTaticasTable extends Migration
{
    public function up()
    {
        Schema::create('taticas', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('usuario_id');
            $table->foreign('usuario_id')->references('id')->on('usuarios');
            $table->string('nome');
            $table->string('formacao'); // Ex: 4-4-2, 4-3-3, 3-5-2
            $table->text('descricao');
            $table->text('instrucoes_ataque')->nullable();
            $table->text('instrucoes_defesa')->nullable();
            $table->text('jogadas_ensaiadas')->nullable();
            $table->json('posicoes_jogadores')->nullable(); // JSON com posições
            $table->boolean('ativa')->default(true);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('taticas');
    }
}

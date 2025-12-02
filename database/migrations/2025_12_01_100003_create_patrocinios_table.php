<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePatrociniosTable extends Migration
{
    public function up()
    {
        Schema::create('patrocinios', function (Blueprint $table) {
            $table->id();
            $table->string('empresa');
            $table->string('contato')->nullable();
            $table->string('telefone')->nullable();
            $table->string('email')->nullable();
            $table->decimal('valor_contrato', 12, 2);
            $table->date('data_inicio');
            $table->date('data_fim');
            $table->enum('tipo', ['PRINCIPAL', 'SECUNDARIO', 'PONTUAL']);
            $table->enum('status', ['ATIVO', 'ENCERRADO', 'PENDENTE', 'CANCELADO'])->default('ATIVO');
            $table->text('descricao')->nullable();
            $table->text('contrapartidas')->nullable(); // O que o clube oferece
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('patrocinios');
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEventosCalendarioTable extends Migration
{
    public function up()
    {
        Schema::create('eventos_calendario', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->text('descricao')->nullable();
            $table->dateTime('data_hora');
            $table->dateTime('data_hora_fim')->nullable();
            $table->enum('tipo', ['JOGO', 'TREINO', 'EXAME', 'REUNIAO', 'OUTRO'])->default('OUTRO');
            $table->string('local')->nullable();
            $table->string('cor')->default('#0d6efd'); // Cor para exibir no calendário
            $table->boolean('lembrete')->default(true);
            $table->integer('lembrete_minutos')->default(60); // Minutos antes para lembrar
            $table->foreignId('usuario_id')->constrained('usuarios'); // Quem criou
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('eventos_calendario');
    }
}


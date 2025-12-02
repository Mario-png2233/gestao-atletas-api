<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEventosTable extends Migration
{
    public function up()
    {
        Schema::create('eventos', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->text('descricao')->nullable();
            $table->dateTime('data_inicio');
            $table->dateTime('data_fim')->nullable();
            $table->enum('tipo', ['JOGO', 'TREINO', 'EXAME', 'REUNIAO', 'OUTRO']);
            $table->string('local')->nullable();
            $table->string('cor')->default('#0d6efd'); // Cor para exibir no calendário
            $table->boolean('lembrete')->default(false);
            $table->integer('lembrete_minutos')->nullable(); // Minutos antes para lembrar
            $table->foreignId('partida_id')->nullable()->constrained('partidas')->onDelete('cascade');
            $table->foreignId('treino_id')->nullable()->constrained('treinos')->onDelete('cascade');
            $table->foreignId('usuario_id')->nullable()->constrained('usuarios'); // Quem criou
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('eventos');
    }
}


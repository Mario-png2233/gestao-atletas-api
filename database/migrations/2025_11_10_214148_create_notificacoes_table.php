<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNotificacoesTable extends Migration
{
    public function up()
    {
        Schema::create('notificacoes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usuario_id')->constrained('usuarios'); // Destinatário
            $table->string('titulo');
            $table->text('mensagem');
            $table->string('tipo'); // LESAO, EXAM, TREINO, etc.
            $table->boolean('lida')->default(false);
            $table->json('dados_adicinais')->nullable(); // Para dados específicos
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('notificacoes');
    }
}
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLesoesTable extends Migration
{
    public function up()
    {
        Schema::create('lesoes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('atleta_id')->constrained('atletas')->onDelete('cascade');
            $table->foreignId('usuario_id')->constrained('usuarios'); // Médico que registrou
            $table->string('tipo_lesao');
            $table->enum('gravidade', ['LEVE', 'MODERADA', 'GRAVE']);
            $table->text('descricao');
            $table->date('data_lesao');
            $table->date('previsao_retorno');
            $table->text('tratamento_prescrito')->nullable();
            $table->enum('status', ['ATIVA', 'CURADA', 'EM_TRATAMENTO'])->default('ATIVA');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('lesoes');
    }
}
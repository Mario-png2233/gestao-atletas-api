<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAvaliacoesFisicasTable extends Migration
{
    public function up()
    {
        Schema::create('avaliacoes_fisicas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('atleta_id')->constrained('atletas')->onDelete('cascade');
            $table->foreignId('usuario_id')->constrained('usuarios'); // Médico/Preparador que fez
            $table->date('data_avaliacao');
            
            // Dados cardíacos
            $table->integer('batimentos_repouso')->nullable(); // bpm
            $table->integer('batimentos_esforco')->nullable(); // bpm após esforço
            $table->string('pressao_arterial')->nullable(); // Ex: 120/80
            
            // Dados físicos
            $table->decimal('peso', 5, 2)->nullable(); // kg
            $table->decimal('altura', 3, 2)->nullable(); // metros
            $table->decimal('imc', 4, 1)->nullable(); // calculado
            $table->decimal('percentual_gordura', 4, 1)->nullable(); // %
            $table->decimal('massa_muscular', 5, 2)->nullable(); // kg
            
            // Performance
            $table->decimal('vo2_max', 4, 1)->nullable(); // ml/kg/min
            $table->string('flexibilidade')->nullable(); // Ruim, Regular, Boa, Excelente
            $table->decimal('velocidade_10m', 4, 2)->nullable(); // segundos
            $table->decimal('velocidade_40m', 5, 2)->nullable(); // segundos
            $table->integer('salto_vertical')->nullable(); // cm
            $table->integer('resistencia_abdominal')->nullable(); // repetições em 1 min
            
            // Resultado
            $table->enum('status', ['APTO', 'APTO_COM_RESTRICAO', 'INAPTO'])->default('APTO');
            $table->text('observacoes')->nullable();
            $table->text('recomendacoes')->nullable();
            
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('avaliacoes_fisicas');
    }
}



<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateExamesMedicosTable extends Migration
{
    public function up()
    {
        Schema::create('exames_medicos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('atleta_id')->constrained('atletas')->onDelete('cascade');
            $table->foreignId('usuario_id')->constrained('usuarios'); // Médico
            $table->string('tipo_exame');
            $table->date('data_exame');
            $table->text('resultados');
            $table->enum('status', ['PENDENTE', 'APROVADO', 'REPROVADO'])->default('PENDENTE');
            $table->text('recomendacoes')->nullable();
            $table->date('proximo_exame')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('exames_medicos');
    }
}
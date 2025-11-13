<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAtletaTreinoTable extends Migration
{
    public function up()
    {
        Schema::create('atleta_treino', function (Blueprint $table) {
            $table->id();
            $table->foreignId('atleta_id')->constrained('atletas')->onDelete('cascade');
            $table->foreignId('treino_id')->constrained('treinos')->onDelete('cascade');
            $table->boolean('presente')->default(false);
            $table->text('observacoes')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('atleta_treino');
    }
}
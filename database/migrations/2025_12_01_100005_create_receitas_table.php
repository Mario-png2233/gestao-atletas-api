<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReceitasTable extends Migration
{
    public function up()
    {
        Schema::create('receitas', function (Blueprint $table) {
            $table->id();
            $table->string('descricao');
            $table->decimal('valor', 12, 2);
            $table->date('data');
            $table->enum('categoria', [
                'PATROCINIO', 
                'BILHETERIA', 
                'MENSALIDADES',
                'PREMIACOES',
                'VENDAS',
                'OUTROS'
            ]);
            $table->enum('status', ['RECEBIDO', 'PENDENTE', 'ATRASADO'])->default('PENDENTE');
            $table->foreignId('patrocinio_id')->nullable()->constrained('patrocinios')->onDelete('set null');
            $table->text('observacoes')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('receitas');
    }
}




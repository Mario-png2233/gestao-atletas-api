<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDespesasTable extends Migration
{
    public function up()
    {
        Schema::create('despesas', function (Blueprint $table) {
            $table->id();
            $table->string('descricao');
            $table->decimal('valor', 12, 2);
            $table->date('data');
            $table->date('data_vencimento')->nullable();
            $table->enum('categoria', [
                'SALARIOS', 
                'INFRAESTRUTURA', 
                'EQUIPAMENTOS', 
                'VIAGENS', 
                'ALIMENTACAO',
                'SAUDE',
                'MARKETING',
                'IMPOSTOS',
                'OUTROS'
            ]);
            $table->enum('status', ['PAGO', 'PENDENTE', 'ATRASADO', 'CANCELADO'])->default('PENDENTE');
            $table->string('fornecedor')->nullable();
            $table->string('nota_fiscal')->nullable();
            $table->text('observacoes')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('despesas');
    }
}

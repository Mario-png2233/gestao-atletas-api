<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddDataRecuperacaoEstimadaToLesoes extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('lesoes', function (Blueprint $table) {
            // Adiciona campo se não existir (compatibilidade)
            if (!Schema::hasColumn('lesoes', 'data_recuperacao_estimada')) {
                $table->date('data_recuperacao_estimada')->nullable()->after('previsao_retorno');
            }
        });

        // Atualizar registros existentes para copiar previsao_retorno para data_recuperacao_estimada
        \DB::statement('UPDATE lesoes SET data_recuperacao_estimada = previsao_retorno WHERE data_recuperacao_estimada IS NULL');
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('lesoes', function (Blueprint $table) {
            if (Schema::hasColumn('lesoes', 'data_recuperacao_estimada')) {
                $table->dropColumn('data_recuperacao_estimada');
            }
        });
    }
}




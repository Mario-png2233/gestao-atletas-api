<?php

namespace Tests;

use Laravel\Lumen\Testing\DatabaseMigrations;
use App\Models\Atleta;
use App\Models\Lesao;

class RelatorioControllerTest extends TestCase
{
    use DatabaseMigrations;

    /** @test */
    public function deve_gerar_relatorio_disponibilidade()
    {
        // ARRANGE
        Atleta::create(['nome' => 'A1', 'data_nascimento' => '1990-01-01', 'posicao' => 'P1', 'altura' => 1.70, 'peso' => 70, 'status' => 'DISPONIVEL', 'telefone_contato' => '111']);
        Atleta::create(['nome' => 'A2', 'data_nascimento' => '1990-01-01', 'posicao' => 'P2', 'altura' => 1.70, 'peso' => 70, 'status' => 'LESIONADO', 'telefone_contato' => '112']);
        Atleta::create(['nome' => 'A3', 'data_nascimento' => '1990-01-01', 'posicao' => 'P3', 'altura' => 1.70, 'peso' => 70, 'status' => 'DISPONIVEL', 'telefone_contato' => '113']);

        $params = [
            'data_inicio' => '2024-01-01',
            'data_fim' => '2024-01-31'
        ];

        // ACT
        $this->get('/api/relatorios/disponibilidade?' . http_build_query($params));

        // ASSERT
        $this->seeStatusCode(200);
        $this->seeJsonStructure([
            'data' => [
                'estatisticas' => [
                    'total_atletas',
                    'disponiveis',
                    'lesionados',
                    'suspensos',
                    'porcentagem_disponivel'
                ]
            ]
        ]);
    }

    /** @test */
    public function deve_validar_periodo_maximo_1_ano()
    {
        // ARRANGE
        $params = [
            'data_inicio' => '2024-01-01',
            'data_fim' => '2025-02-01' // MAIS DE 1 ANO
        ];

        // ACT
        $this->get('/api/relatorios/disponibilidade?' . http_build_query($params));

        // ASSERT
        $this->seeStatusCode(422);
    }

    /** @test */
    public function deve_validar_datas_obrigatorias()
    {
        // ARRANGE - Sem parâmetros
        // ACT
        $this->get('/api/relatorios/disponibilidade');

        // ASSERT
        $this->seeStatusCode(422);
    }
}
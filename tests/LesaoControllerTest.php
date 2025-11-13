<?php

namespace Tests;

use Laravel\Lumen\Testing\DatabaseMigrations;
use App\Models\Atleta;
use App\Models\Usuario;

class LesaoControllerTest extends TestCase
{
    use DatabaseMigrations;

    /** @test */
    public function deve_registrar_nova_lesao_para_atleta()
    {
        // ARRANGE
        $atleta = Atleta::create([
            'nome' => 'Carlos Souza',
            'data_nascimento' => '1990-01-01',
            'posicao' => 'Goleiro',
            'altura' => 1.85,
            'peso' => 80.0,
            'status' => 'DISPONIVEL',
            'telefone_contato' => '11777777777'
        ]);

        $dadosLesao = [
            'tipo_lesao' => 'Entorse de tornozelo',
            'gravidade' => 'MODERADA',
            'descricao' => 'Lesão durante treino',
            'data_lesao' => '2024-01-15',
            'previsao_retorno' => '2024-02-15',
            'tratamento_prescrito' => 'Repouso e fisioterapia'
        ];

        // ACT
        $this->post("/api/atletas/{$atleta->id}/lesoes", $dadosLesao);

        // ASSERT
        $this->seeStatusCode(201);
        $this->seeJson(['tipo_lesao' => 'Entorse de tornozelo']);
        $this->seeInDatabase('lesoes', ['tipo_lesao' => 'Entorse de tornozelo']);
    }

    /** @test */
    public function deve_listar_lesoes_de_um_atleta()
    {
        // ARRANGE
        $atleta = Atleta::create([
            'nome' => 'Teste Lesões',
            'data_nascimento' => '1995-01-01',
            'posicao' => 'Teste',
            'altura' => 1.70,
            'peso' => 70.0,
            'telefone_contato' => '11666666666'
        ]);

        // ACT
        $this->get("/api/atletas/{$atleta->id}/lesoes");

        // ASSERT
        $this->seeStatusCode(200);
        $this->seeJsonStructure(['data' => []]);
    }

    /** @test */
    public function deve_validar_previsao_retorno_futura()
    {
        // ARRANGE
        $atleta = Atleta::create([
            'nome' => 'Teste Validação',
            'data_nascimento' => '1990-01-01',
            'posicao' => 'Teste',
            'altura' => 1.70,
            'peso' => 70.0,
            'telefone_contato' => '11555555555'
        ]);

        $dadosLesaoInvalida = [
            'tipo_lesao' => 'Fratura',
            'gravidade' => 'GRAVE',
            'descricao' => 'Lesão grave',
            'data_lesao' => '2024-01-15',
            'previsao_retorno' => '2024-01-10', // DATA ANTERIOR - INVÁLIDA
            'tratamento_prescrito' => 'Cirurgia'
        ];

        // ACT
        $this->post("/api/atletas/{$atleta->id}/lesoes", $dadosLesaoInvalida);

        // ASSERT
        $this->seeStatusCode(422);
    }
}
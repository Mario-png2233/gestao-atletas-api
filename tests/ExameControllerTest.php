<?php

namespace Tests;

use Laravel\Lumen\Testing\DatabaseMigrations;
use App\Models\Atleta;

class ExameControllerTest extends TestCase
{
    use DatabaseMigrations;

    /** @test */
    public function deve_registrar_novo_exame_medico()
    {
        // ARRANGE
        $atleta = Atleta::create([
            'nome' => 'Atleta Exame',
            'data_nascimento' => '1995-01-01',
            'posicao' => 'Teste',
            'altura' => 1.75,
            'peso' => 72.0,
            'telefone_contato' => '11444444444'
        ]);

        $dadosExame = [
            'tipo_exame' => 'Hemograma Completo',
            'data_exame' => '2024-01-10',
            'resultados' => 'Todos os parâmetros dentro da normalidade',
            'status' => 'APROVADO',
            'recomendacoes' => 'Manter acompanhamento regular'
        ];

        // ACT
        $this->post("/api/atletas/{$atleta->id}/exames", $dadosExame);

        // ASSERT
        $this->seeStatusCode(201);
        $this->seeJson(['tipo_exame' => 'Hemograma Completo']);
    }

    /** @test */
    public function deve_listar_exames_de_um_atleta()
    {
        // ARRANGE
        $atleta = Atleta::create([
            'nome' => 'Atleta Lista Exames',
            'data_nascimento' => '1990-01-01',
            'posicao' => 'Teste',
            'altura' => 1.70,
            'peso' => 70.0,
            'telefone_contato' => '11333333333'
        ]);

        // ACT
        $this->get("/api/atletas/{$atleta->id}/exames");

        // ASSERT
        $this->seeStatusCode(200);
        $this->seeJsonStructure(['data' => []]);
    }
}
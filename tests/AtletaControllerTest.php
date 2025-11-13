<?php

namespace Tests;

use Laravel\Lumen\Testing\DatabaseMigrations;
use Laravel\Lumen\Testing\DatabaseTransactions;

class AtletaControllerTest extends TestCase
{
    use DatabaseMigrations;

    /** @test */
    public function deve_listar_todos_os_atletas()
    {
        // ARRANGE - Criar atleta de teste
        $atleta = \App\Models\Atleta::create([
            'nome' => 'João Silva',
            'data_nascimento' => '1995-05-15',
            'posicao' => 'Atacante',
            'altura' => 1.80,
            'peso' => 75.5,
            'status' => 'DISPONIVEL',
            'telefone_contato' => '11999999999'
        ]);

        // ACT
        $this->get('/api/atletas');

        // ASSERT
        $this->seeStatusCode(200);
        $this->seeJsonStructure([
            'data' => ['*' => ['id', 'nome', 'posicao', 'status']]
        ]);
    }

    /** @test */
    public function deve_exibir_detalhes_de_um_atleta()
    {
        // ARRANGE
        $atleta = \App\Models\Atleta::create([
            'nome' => 'Maria Santos',
            'data_nascimento' => '1998-08-20',
            'posicao' => 'Zagueira',
            'altura' => 1.70,
            'peso' => 65.0,
            'status' => 'DISPONIVEL',
            'telefone_contato' => '11888888888'
        ]);

        // ACT
        $this->get('/api/atletas/' . $atleta->id);

        // ASSERT
        $this->seeStatusCode(200);
        $this->seeJsonStructure([
            'data' => ['id', 'nome', 'posicao', 'status']
        ]);
    }
}
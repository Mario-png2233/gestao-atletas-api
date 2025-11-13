<?php

namespace Tests;

use Laravel\Lumen\Testing\DatabaseMigrations;
use App\Models\Usuario;

class AuthControllerTest extends TestCase
{
    use DatabaseMigrations;

    /** @test */
    public function deve_fazer_login_com_credenciais_validas()
    {
        // ARRANGE
        $usuario = Usuario::create([
            'email' => 'medico@teste.com',
            'senha' => password_hash('Senha123!', PASSWORD_DEFAULT),
            'perfil' => 'MEDICO'
        ]);

        $dadosLogin = [
            'email' => 'medico@teste.com',
            'password' => 'Senha123!'
        ];

        // ACT
        $this->post('/api/auth/login', $dadosLogin);

        // ASSERT
        $this->seeStatusCode(200);
        $this->seeJsonStructure([
            'token',
            'user' => ['id', 'email', 'perfil']
        ]);
    }

    /** @test */
    public function deve_falhar_com_credenciais_invalidas()
    {
        // ARRANGE
        $dadosLogin = [
            'email' => 'invalido@teste.com',
            'password' => 'senha_errada'
        ];

        // ACT
        $this->post('/api/auth/login', $dadosLogin);

        // ASSERT
        $this->seeStatusCode(401);
        $this->seeJson(['error' => 'Credenciais inválidas']);
    }

    /** @test */
    public function deve_obter_dados_do_usuario_logado()
    {
        // ARRANGE
        $usuario = Usuario::create([
            'email' => 'tecnico@teste.com',
            'senha' => password_hash('Senha123!', PASSWORD_DEFAULT),
            'perfil' => 'TECNICO'
        ]);

        // Gerar token manualmente para teste
        $token = base64_encode(json_encode([
            'user_id' => $usuario->id,
            'email' => $usuario->email,
            'perfil' => $usuario->perfil
        ]));

        // ACT
        $this->get('/api/auth/me', ['Authorization' => 'Bearer ' . $token]);

        // ASSERT
        $this->seeStatusCode(200);
        $this->seeJson(['email' => 'tecnico@teste.com']);
    }
}
<?php

/** @var \Laravel\Lumen\Routing\Router $router */

// ==================== ROTA DE SAÚDE DA API ====================
$router->get('/api/health', function () use ($router) {
    return response()->json([
        'status' => 'online',
        'timestamp' => date('Y-m-d H:i:s'),
        'service' => 'Gestão de Atletas API',
        'version' => '2.0.0',
        'framework' => 'Lumen ' . $router->app->version(),
        'environment' => env('APP_ENV', 'production')
    ]);
});

// ==================== ROTA PÚBLICA (Informações da API) ====================
$router->get('/', function () {
    return response()->json([
        'message' => 'Bem-vindo à API de Gestão de Atletas',
        'version' => '2.0.0',
        'perfis' => ['TECNICO', 'MEDICO', 'PREPARADOR', 'DIRETOR_FINANCEIRO'],
        'modules' => [
            'atletas' => 'Gestão de atletas',
            'lesoes' => 'Controle de lesões',
            'exames' => 'Exames médicos',
            'partidas' => 'Partidas e jogos',
            'treinos' => 'Sessões de treino',
            'taticas' => 'Táticas (apenas TECNICO)',
            'financas' => 'Financeiro (apenas DIRETOR_FINANCEIRO)',
            'calendario' => 'Eventos e lembretes'
        ]
    ]);
});

// ==================== ROTAS DE AUTENTICAÇÃO ====================
$router->post('/api/register', 'AuthController@register');
$router->post('/api/login', 'AuthController@login');
$router->post('/api/logout', 'AuthController@logout');
$router->get('/api/me', 'AuthController@me');

// ==================== ROTAS DE ATLETAS ====================
$router->get('/api/atletas', 'AtletaController@index');
$router->get('/api/atletas/{id}', 'AtletaController@show');
$router->post('/api/atletas', 'AtletaController@store');
$router->put('/api/atletas/{id}', 'AtletaController@update');
$router->delete('/api/atletas/{id}', 'AtletaController@destroy');

// ==================== ROTAS DE LESÕES ====================
$router->get('/api/lesoes', 'LesaoController@index');
$router->get('/api/lesoes/{id}', 'LesaoController@show');
$router->get('/api/atletas/{atletaId}/lesoes', 'LesaoController@indexByAtleta');
$router->post('/api/atletas/{atletaId}/lesoes', 'LesaoController@store');
$router->put('/api/atletas/{atletaId}/lesoes/{lesaoId}', 'LesaoController@update');
$router->delete('/api/atletas/{atletaId}/lesoes/{lesaoId}', 'LesaoController@destroy');

// ==================== ROTAS DE EXAMES MÉDICOS ====================
$router->get('/api/exames', 'ExameController@index');
$router->get('/api/exames/{id}', 'ExameController@show');
$router->get('/api/atletas/{atletaId}/exames', 'ExameController@indexByAtleta');
$router->post('/api/atletas/{atletaId}/exames', 'ExameController@store');
$router->put('/api/atletas/{atletaId}/exames/{exameId}', 'ExameController@update');
$router->delete('/api/atletas/{atletaId}/exames/{exameId}', 'ExameController@destroy');

// ==================== ROTAS DE PARTIDAS ====================
$router->get('/api/partidas', 'PartidaController@index');
$router->get('/api/partidas/{id}', 'PartidaController@show');
$router->post('/api/partidas', 'PartidaController@store');
$router->put('/api/partidas/{id}', 'PartidaController@update');
$router->delete('/api/partidas/{id}', 'PartidaController@destroy');

// ==================== ROTAS DE TREINOS ====================
$router->get('/api/treinos', 'TreinoController@index');
$router->get('/api/treinos/{id}', 'TreinoController@show');
$router->post('/api/treinos', 'TreinoController@store');
$router->put('/api/treinos/{id}', 'TreinoController@update');
$router->delete('/api/treinos/{id}', 'TreinoController@destroy');
$router->post('/api/treinos/{id}/atletas', 'TreinoController@vincularAtletas');
$router->put('/api/treinos/{id}/presenca', 'TreinoController@registrarPresenca');

// ==================== ROTAS DE NOTIFICAÇÕES ====================
$router->get('/api/notificacoes', 'NotificacaoController@index');
$router->put('/api/notificacoes/{id}/lida', 'NotificacaoController@marcarComoLida');
$router->get('/api/notificacoes/nao-lidas/count', 'NotificacaoController@contarNaoLidas');

// ==================== ROTAS DE RELATÓRIOS ====================
$router->get('/api/relatorios/disponibilidade', 'RelatorioController@disponibilidade');

// ==================== ROTAS DE AVALIAÇÕES FÍSICAS (MÉDICO/PREPARADOR) ====================
$router->get('/api/avaliacoes', 'AvaliacaoFisicaController@index');
$router->get('/api/avaliacoes/{id}', 'AvaliacaoFisicaController@show');
$router->get('/api/atletas/{atletaId}/avaliacoes', 'AvaliacaoFisicaController@porAtleta');
$router->get('/api/atletas/{atletaId}/avaliacoes/ultima', 'AvaliacaoFisicaController@ultimaAvaliacao');
$router->post('/api/atletas/{atletaId}/avaliacoes', 'AvaliacaoFisicaController@store');
$router->put('/api/avaliacoes/{id}', 'AvaliacaoFisicaController@update');
$router->delete('/api/avaliacoes/{id}', 'AvaliacaoFisicaController@destroy');

// ==================== ROTAS DE TÁTICAS (TÉCNICO) ====================
$router->get('/api/taticas', 'TaticaController@index');
$router->get('/api/taticas/{id}', 'TaticaController@show');
$router->post('/api/taticas', 'TaticaController@store');
$router->put('/api/taticas/{id}', 'TaticaController@update');
$router->delete('/api/taticas/{id}', 'TaticaController@destroy');

// ==================== ROTAS DE FINANÇAS (DIRETOR FINANCEIRO) ====================
// Resumo geral
$router->get('/api/financas/resumo', 'FinancaController@resumo');

// Patrocínios
$router->get('/api/patrocinios', 'PatrocinioController@index');
$router->get('/api/patrocinios/{id}', 'PatrocinioController@show');
$router->post('/api/patrocinios', 'PatrocinioController@store');
$router->put('/api/patrocinios/{id}', 'PatrocinioController@update');
$router->delete('/api/patrocinios/{id}', 'PatrocinioController@destroy');

// Despesas
$router->get('/api/despesas', 'DespesaController@index');
$router->get('/api/despesas/{id}', 'DespesaController@show');
$router->post('/api/despesas', 'DespesaController@store');
$router->put('/api/despesas/{id}', 'DespesaController@update');
$router->delete('/api/despesas/{id}', 'DespesaController@destroy');

// Receitas
$router->get('/api/receitas', 'ReceitaController@index');
$router->get('/api/receitas/{id}', 'ReceitaController@show');
$router->post('/api/receitas', 'ReceitaController@store');
$router->put('/api/receitas/{id}', 'ReceitaController@update');
$router->delete('/api/receitas/{id}', 'ReceitaController@destroy');

// ==================== ROTAS DE EVENTOS/CALENDÁRIO ====================
$router->get('/api/eventos', 'EventoController@index');
$router->get('/api/eventos/calendario', 'EventoController@calendario');
$router->get('/api/eventos/{id}', 'EventoController@show');
$router->post('/api/eventos', 'EventoController@store');
$router->put('/api/eventos/{id}', 'EventoController@update');
$router->delete('/api/eventos/{id}', 'EventoController@destroy');

// ==================== ROTA DE FALLBACK ====================
$router->get('/{any:.*}', function ($any = null) {
    if (strpos($any, 'api/') === 0) {
        return response()->json([
            'error' => 'Rota não encontrada',
            'path' => '/' . $any,
            'message' => 'Verifique a documentação em GET /'
        ], 404);
    }
    
    return response()->json([
        'message' => 'API de Gestão de Atletas',
        'documentation' => 'Acesse GET / para ver todos os endpoints disponíveis'
    ]);
});

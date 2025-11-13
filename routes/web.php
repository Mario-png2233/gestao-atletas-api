<?php

// Rota raiz para evitar erro 404
$router->get('/', function () use ($router) {
    return response()->json([
        'message' => 'API Gestão de Atletas - Backend funcionando!',
        'version' => '1.0.0',
        'status' => 'online'
    ]);
});

$router->group(['prefix' => 'api'], function () use ($router) {
    // Autenticação
    $router->post('/auth/login', 'AuthController@login');
    $router->post('/auth/logout', 'AuthController@logout');
    $router->get('/auth/me', 'AuthController@me');
    
    // Atletas
    $router->get('/atletas', 'AtletaController@index');
    $router->get('/atletas/{id}', 'AtletaController@show');
    $router->post('/atletas', 'AtletaController@store');
    $router->put('/atletas/{id}', 'AtletaController@update');
    $router->delete('/atletas/{id}', 'AtletaController@destroy');
    
    // Lesões
    $router->get('/atletas/{atletaId}/lesoes', 'LesaoController@indexByAtleta');
    $router->post('/atletas/{atletaId}/lesoes', 'LesaoController@store');
    $router->put('/atletas/{atletaId}/lesoes/{lesaoId}', 'LesaoController@update');
    
    // Exames
    $router->get('/atletas/{atletaId}/exames', 'ExameController@indexByAtleta');
    $router->post('/atletas/{atletaId}/exames', 'ExameController@store');
    
    // Relatórios
    $router->get('/relatorios/disponibilidade', 'RelatorioController@disponibilidade');
    
    // Notificações
    $router->get('/notificacoes', 'NotificacaoController@index');
    $router->put('/notificacoes/{id}/ler', 'NotificacaoController@marcarComoLida');
    $router->get('/notificacoes/contador', 'NotificacaoController@contarNaoLidas');
});

$router->get('/test-db', function () {
    try {
        // Testa a conexão com o banco
        \DB::connection()->getPdo();
        return response()->json([
            'message' => 'Conexão com banco OK!',
            'database' => \DB::connection()->getDatabaseName()
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Erro na conexão com o banco',
            'message' => $e->getMessage()
        ], 500);
    }
});
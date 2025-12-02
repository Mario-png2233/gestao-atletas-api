<?php
// ========== CORS UNIVERSAL (DESENVOLVIMENTO) ==========
// Permite qualquer origem - apenas para desenvolvimento!
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control');
header('Access-Control-Max-Age: 86400');

// Responde imediatamente para requisições OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ==============================================

// Carrega o Lumen
$app = require __DIR__.'/../bootstrap/app.php';

// Executa a aplicação
$app->run();

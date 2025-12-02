<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Carregar variáveis de ambiente
$host = getenv('DB_HOST') ?: 'localhost';
$port = getenv('DB_PORT') ?: '3306';
$database = getenv('DB_DATABASE') ?: 'gestao_atletas';
$username = getenv('DB_USERNAME') ?: 'root';
$password = getenv('DB_PASSWORD') ?: '';

$result = [
    'config' => [
        'host' => $host,
        'port' => $port,
        'database' => $database,
        'username' => $username,
        'password' => '***' . substr($password, -4) // Mostra só os últimos 4 caracteres
    ],
    'connection' => 'pending',
    'tables' => []
];

try {
    $pdo = new PDO(
        "mysql:host={$host};port={$port};dbname={$database}",
        $username,
        $password,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    
    $result['connection'] = 'SUCCESS';
    
    // Listar tabelas
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    $result['tables'] = $tables;
    $result['table_count'] = count($tables);
    
    // Verificar se tabela usuarios existe
    if (in_array('usuarios', $tables)) {
        $stmt = $pdo->query("SELECT COUNT(*) as total FROM usuarios");
        $count = $stmt->fetch(PDO::FETCH_ASSOC);
        $result['usuarios_count'] = $count['total'];
    }
    
} catch (PDOException $e) {
    $result['connection'] = 'FAILED';
    $result['error'] = $e->getMessage();
}

echo json_encode($result, JSON_PRETTY_PRINT);


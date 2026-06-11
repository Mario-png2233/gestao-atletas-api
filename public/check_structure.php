<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/../bootstrap/env_helpers.php';

$host = getEnvVar('DB_HOST', 'localhost');
$port = getEnvVar('DB_PORT', '3306');
$database = getEnvVar('DB_DATABASE', 'railway');
$username = getEnvVar('DB_USERNAME', 'root');
$password = getEnvVar('DB_PASSWORD', '');

try {
    $pdo = new PDO(
        "mysql:host={$host};port={$port};dbname={$database}",
        $username,
        $password,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    
    $tables = ['usuarios', 'atletas', 'partidas', 'treinos', 'patrocinios', 'despesas', 'receitas', 'taticas', 'eventos'];
    $structure = [];
    
    foreach ($tables as $table) {
        $stmt = $pdo->query("DESCRIBE {$table}");
        $columns = $stmt->fetchAll(PDO::FETCH_COLUMN);
        $structure[$table] = $columns;
    }
    
    echo json_encode($structure, JSON_PRETTY_PRINT);
    
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()], JSON_PRETTY_PRINT);
}









<?php
/**
 * Script para verificar conexão com banco Railway
 */

// Pega as variáveis de ambiente do Railway
$host = getenv('DB_HOST') ?: 'mysql.railway.internal';
$port = getenv('DB_PORT') ?: '3306';
$database = getenv('DB_DATABASE') ?: 'ferrovia';
$username = getenv('DB_USERNAME') ?: 'root';
$password = getenv('DB_PASSWORD') ?: '';

echo "=== Verificando Conexão com Banco de Dados ===\n\n";
echo "Host: $host\n";
echo "Port: $port\n";
echo "Database: $database\n";
echo "Username: $username\n";
echo "Password: " . (empty($password) ? '(vazio)' : '(definido)') . "\n\n";

try {
    $pdo = new PDO(
        "mysql:host=$host;port=$port;dbname=$database",
        $username,
        $password,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    
    echo "✅ Conexão com banco de dados OK!\n\n";
    
    // Lista as tabelas
    echo "=== Tabelas no banco '$database' ===\n";
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    if (empty($tables)) {
        echo "⚠️ NENHUMA TABELA ENCONTRADA!\n";
        echo "O banco está vazio. As migrações precisam ser executadas.\n";
    } else {
        foreach ($tables as $table) {
            echo "- $table\n";
        }
        echo "\nTotal: " . count($tables) . " tabelas\n";
    }
    
} catch (PDOException $e) {
    echo "❌ ERRO de conexão: " . $e->getMessage() . "\n";
}


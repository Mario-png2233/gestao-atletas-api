<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Mostrar todas as variáveis de ambiente relacionadas a DB/MySQL
$relevant = [];

// Verificar $_ENV
foreach ($_ENV as $key => $value) {
    if (stripos($key, 'DB') !== false || stripos($key, 'MYSQL') !== false || stripos($key, 'DATABASE') !== false) {
        $relevant['$_ENV'][$key] = strlen($value) > 10 ? substr($value, 0, 5) . '...' : $value;
    }
}

// Verificar $_SERVER
foreach ($_SERVER as $key => $value) {
    if (stripos($key, 'DB') !== false || stripos($key, 'MYSQL') !== false || stripos($key, 'DATABASE') !== false) {
        if (is_string($value)) {
            $relevant['$_SERVER'][$key] = strlen($value) > 10 ? substr($value, 0, 5) . '...' : $value;
        }
    }
}

// Verificar getenv para variáveis específicas
$vars = ['DB_HOST', 'DB_PORT', 'DB_DATABASE', 'DB_USERNAME', 'DB_PASSWORD', 
         'MYSQLHOST', 'MYSQLPORT', 'MYSQLDATABASE', 'MYSQLUSER', 'MYSQLPASSWORD',
         'MYSQL_HOST', 'MYSQL_PORT', 'MYSQL_DATABASE', 'MYSQL_USER', 'MYSQL_PASSWORD'];

foreach ($vars as $var) {
    $val = getenv($var);
    if ($val !== false) {
        $relevant['getenv'][$var] = strlen($val) > 10 ? substr($val, 0, 5) . '...' : $val;
    }
}

// Contar totais
$relevant['counts'] = [
    '$_ENV total' => count($_ENV),
    '$_SERVER total' => count($_SERVER)
];

echo json_encode($relevant, JSON_PRETTY_PRINT);


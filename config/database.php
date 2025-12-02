<?php

// Função helper para pegar variáveis de ambiente (compatível com Railway)
function getEnvVar($key, $default = null) {
    // Tenta várias formas de pegar a variável
    $value = $_ENV[$key] ?? $_SERVER[$key] ?? getenv($key) ?? null;
    return $value !== null && $value !== false ? $value : $default;
}

return [
    'default' => getEnvVar('DB_CONNECTION', 'mysql'),

    /*
    |--------------------------------------------------------------------------
    | Migration Repository Table
    |--------------------------------------------------------------------------
    */
    'migrations' => 'migrations',

    'connections' => [
        'mysql' => [
            'driver' => 'mysql',
            'host' => getEnvVar('DB_HOST', getEnvVar('MYSQLHOST', '127.0.0.1')),
            'port' => getEnvVar('DB_PORT', getEnvVar('MYSQLPORT', '3306')),
            'database' => getEnvVar('DB_DATABASE', getEnvVar('MYSQLDATABASE', 'gestao_atletas')),
            'username' => getEnvVar('DB_USERNAME', getEnvVar('MYSQLUSER', 'root')),
            'password' => getEnvVar('DB_PASSWORD', getEnvVar('MYSQLPASSWORD', '')),
            'charset' => 'utf8mb4',
            'collation' => 'utf8mb4_unicode_ci',
            'prefix' => '',
            'strict' => false,
            'engine' => null,
        ],

        'sqlite' => [
            'driver' => 'sqlite',
            'database' => env('DB_DATABASE', database_path('database.sqlite')),
            'prefix' => '',
        ],

        'pgsql' => [
            'driver' => 'pgsql',
            'host' => env('DB_HOST', '127.0.0.1'),
            'port' => env('DB_PORT', '5432'),
            'database' => env('DB_DATABASE', 'gestao_atletas'),
            'username' => env('DB_USERNAME', 'postgres'),
            'password' => env('DB_PASSWORD', ''),
            'charset' => 'utf8',
            'prefix' => '',
            'schema' => 'public',
        ],
    ],
];

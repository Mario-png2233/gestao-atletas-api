<?php

if (!function_exists('getEnvVar')) {
    function getEnvVar($key, $default = null)
    {
        $value = $_ENV[$key] ?? $_SERVER[$key] ?? getenv($key) ?? null;

        return $value !== null && $value !== false ? $value : $default;
    }
}

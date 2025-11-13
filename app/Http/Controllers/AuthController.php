<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Usuario;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $this->validate($request, [
            'email' => 'required|email',
            'password' => 'required|string'
        ]);

        $usuario = Usuario::where('email', $request->email)->first();

        if (!$usuario) {
            return response()->json(['error' => 'Credenciais inválidas'], 401);
        }

        // Verificar senha de forma simples
        if (!password_verify($request->password, $usuario->senha)) {
            return response()->json(['error' => 'Credenciais inválidas'], 401);
        }

        // Token simples
        $token = base64_encode(json_encode([
            'user_id' => $usuario->id,
            'email' => $usuario->email,
            'perfil' => $usuario->perfil,
            'expires' => time() + (2 * 60 * 60)
        ]));

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $usuario->id,
                'email' => $usuario->email,
                'perfil' => $usuario->perfil
            ]
        ]);
    }

    public function logout(Request $request)
    {
        return response()->json(['message' => 'Logout realizado com sucesso']);
    }

    public function me(Request $request)
    {
        $token = $request->header('Authorization');
        
        if (!$token) {
            return response()->json(['error' => 'Token não fornecido'], 401);
        }

        try {
            $token = str_replace('Bearer ', '', $token);
            $tokenData = json_decode(base64_decode($token), true);
            
            if (!$tokenData || !isset($tokenData['user_id'])) {
                return response()->json(['error' => 'Token inválido'], 401);
            }

            $usuario = Usuario::find($tokenData['user_id']);
            
            if (!$usuario) {
                return response()->json(['error' => 'Usuário não encontrado'], 401);
            }

            return response()->json([
                'user' => [
                    'id' => $usuario->id,
                    'email' => $usuario->email,
                    'perfil' => $usuario->perfil
                ]
            ]);
            
        } catch (\Exception $e) {
            return response()->json(['error' => 'Token inválido'], 401);
        }
    }
}
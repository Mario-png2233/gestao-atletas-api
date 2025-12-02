<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Usuario;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $this->parseJsonInput($request);

        $this->validate($request, [
            'email' => 'required|email|unique:usuarios,email',
            'password' => 'required|string|min:6',
            'perfil' => 'required|in:MEDICO,TECNICO,PREPARADOR,DIRETOR_FINANCEIRO'
        ]);

        try {
            $usuario = Usuario::create([
                'email' => $request->email,
                'senha' => $request->password,
                'perfil' => $request->perfil,
                'tentativas_login' => 0
            ]);

            $token = base64_encode(json_encode([
                'user_id' => $usuario->id,
                'email' => $usuario->email,
                'perfil' => $usuario->perfil,
                'expires' => time() + (2 * 60 * 60)
            ]));

            return response()->json([
                'message' => 'Usuário registrado com sucesso',
                'token' => $token,
                'user' => [
                    'id' => $usuario->id,
                    'email' => $usuario->email,
                    'perfil' => $usuario->perfil
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Erro ao registrar usuário: ' . $e->getMessage()], 500);
        }
    }

    public function login(Request $request)
    {
        $this->parseJsonInput($request);

        $this->validate($request, [
            'email' => 'required|email',
            'password' => 'required|string'
        ]);

        $usuario = Usuario::where('email', $request->email)->first();

        if (!$usuario) {
            return response()->json(['error' => 'Credenciais inválidas'], 401);
        }

        if ($usuario->estaBloqueado()) {
            return response()->json([
                'error' => 'Usuário bloqueado. Aguarde 30 minutos ou entre em contato com o administrador.'
            ], 423);
        }

        if (!Hash::check($request->password, $usuario->senha)) {
            $usuario->incrementarTentativaLogin();
            return response()->json(['error' => 'Credenciais inválidas'], 401);
        }

        $usuario->resetarTentativasLogin();

        $token = base64_encode(json_encode([
            'user_id' => $usuario->id,
            'email' => $usuario->email,
            'perfil' => $usuario->perfil,
            'expires' => time() + (2 * 60 * 60)
        ]));

        return response()->json([
            'message' => 'Login realizado com sucesso',
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

            if (isset($tokenData['expires']) && $tokenData['expires'] < time()) {
                return response()->json(['error' => 'Token expirado'], 401);
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

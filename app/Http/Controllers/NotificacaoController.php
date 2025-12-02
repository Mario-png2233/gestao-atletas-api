<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notificacao;

class NotificacaoController extends Controller
{
    public function index(Request $request)
    {
        $usuarioId = 1;
        
        $notificacoes = Notificacao::where('usuario_id', $usuarioId)
                                  ->orderBy('created_at', 'desc')
                                  ->get();

        return response()->json(['data' => $notificacoes]);
    }

    public function marcarComoLida($id)
    {
        $notificacao = Notificacao::find($id);

        if (!$notificacao) {
            return response()->json(['error' => 'Notificação não encontrada'], 404);
        }

        $notificacao->update(['lida' => true]);

        return response()->json(['message' => 'Notificação marcada como lida']);
    }

    public function contarNaoLidas()
    {
        $usuarioId = 1;
        
        $count = Notificacao::where('usuario_id', $usuarioId)
                           ->where('lida', false)
                           ->count();

        return response()->json(['data' => ['nao_lidas' => $count]]);
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Lesao;
use App\Models\Atleta;
use App\Models\Notificacao;

class LesaoController extends Controller
{
    public function store(Request $request, $atletaId)
    {
        $atleta = Atleta::find($atletaId);

        if (!$atleta) {
            return response()->json(['error' => 'Atleta não encontrado'], 404);
        }

        // Validação ajustada para a estrutura real
        $this->validate($request, [
            'tipo_lesao' => 'required',
            'gravidade' => 'required|in:LEVE,MODERADA,GRAVE',
            'descricao' => 'required',
            'data_lesao' => 'required|date',
            'data_recuperacao_estimada' => 'required|date'
        ]);

        // RN-021: Verificar se previsão de retorno é futura
        if (strtotime($request->data_recuperacao_estimada) <= strtotime($request->data_lesao)) {
            return response()->json([
                'error' => 'A previsão de retorno deve ser uma data futura em relação à data da lesão'
            ], 422);
        }

        try {
            $lesao = Lesao::create([
                'atleta_id' => $atletaId,
                'usuario_id' => 1, // ← ADICIONADO para compatibilidade com a tabela
                'tipo_lesao' => $request->tipo_lesao,
                'gravidade' => $request->gravidade,
                'descricao' => $request->descricao,
                'tratamento_prescrito' => $request->tratamento_prescrito ?? '', // ← ADICIONADO
                'data_lesao' => $request->data_lesao,
                'previsao_retorno' => $request->previsao_retorno ?? $request->data_recuperacao_estimada, // ← ADICIONADO
                'data_recuperacao_estimada' => $request->data_recuperacao_estimada,
                'status' => 'ATIVA'
            ]);

            // Atualizar status do atleta para lesionado
            $atleta->update(['status' => 'LESIONADO']);

            // Criar notificação (SEM o campo problemático)
            Notificacao::create([
                'usuario_id' => 1,
                'titulo' => 'Nova Lesão Registrada',
                'mensagem' => "Atleta {$atleta->nome} sofreu uma lesão: {$request->tipo_lesao} - Gravidade: {$request->gravidade}",
                'tipo' => 'LESAO',
                'lida' => false
                // REMOVIDO: dados_adicionais para evitar erro
            ]);

            return response()->json(['data' => $lesao], 201);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Erro ao registrar lesão: ' . $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $atletaId, $lesaoId)
    {
        $lesao = Lesao::where('id', $lesaoId)
                      ->where('atleta_id', $atletaId)
                      ->first();

        if (!$lesao) {
            return response()->json(['error' => 'Lesão não encontrada'], 404);
        }

        $this->validate($request, [
            'status' => 'in:ATIVA,RECUPERADA,CRONICA'
        ]);

        $lesao->update($request->all());

        // Se lesão recuperada, verificar se atleta pode voltar a DISPONIVEL
        if ($request->status === 'RECUPERADA') {
            $lesoesAtivas = Lesao::where('atleta_id', $atletaId)
                                ->where('status', 'ATIVA')
                                ->count();
            
            if ($lesoesAtivas === 0) {
                $atleta = Atleta::find($atletaId);
                $atleta->update(['status' => 'DISPONIVEL']);
            }
        }

        return response()->json(['data' => $lesao]);
    }

    public function indexByAtleta($atletaId)
    {
        $lesoes = Lesao::where('atleta_id', $atletaId)->get();
        return response()->json(['data' => $lesoes]);
    }
}
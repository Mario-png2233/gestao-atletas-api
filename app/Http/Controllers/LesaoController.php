<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Lesao;
use App\Models\Atleta;
use App\Models\Notificacao;

class LesaoController extends Controller
{
    public function index()
    {
        $lesoes = Lesao::with('atleta')->orderBy('data_lesao', 'desc')->get();
        return response()->json(['data' => $lesoes]);
    }

    public function indexByAtleta($atletaId)
    {
        $atleta = Atleta::find($atletaId);

        if (!$atleta) {
            return response()->json(['error' => 'Atleta não encontrado'], 404);
        }

        $lesoes = Lesao::where('atleta_id', $atletaId)
                       ->orderBy('data_lesao', 'desc')
                       ->get();
        
        return response()->json(['data' => $lesoes]);
    }

    public function show($id)
    {
        $lesao = Lesao::with('atleta')->find($id);

        if (!$lesao) {
            return response()->json(['error' => 'Lesão não encontrada'], 404);
        }

        return response()->json(['data' => $lesao]);
    }

    public function store(Request $request, $atletaId)
    {
        $atleta = Atleta::find($atletaId);

        if (!$atleta) {
            return response()->json(['error' => 'Atleta não encontrado'], 404);
        }

        $this->parseJsonInput($request);

        $this->validate($request, [
            'tipo_lesao' => 'required|string|max:255',
            'gravidade' => 'required|in:LEVE,MODERADA,GRAVE',
            'descricao' => 'required|string',
            'data_lesao' => 'required|date',
            'data_recuperacao_estimada' => 'required|date'
        ]);

        if (strtotime($request->data_recuperacao_estimada) <= strtotime($request->data_lesao)) {
            return response()->json([
                'error' => 'A previsão de retorno deve ser uma data futura em relação à data da lesão'
            ], 422);
        }

        try {
            $lesao = Lesao::create([
                'atleta_id' => $atletaId,
                'usuario_id' => 1,
                'tipo_lesao' => $request->tipo_lesao,
                'gravidade' => $request->gravidade,
                'descricao' => $request->descricao,
                'tratamento_prescrito' => $request->tratamento_prescrito ?? '',
                'data_lesao' => $request->data_lesao,
                'previsao_retorno' => $request->previsao_retorno ?? $request->data_recuperacao_estimada,
                'data_recuperacao_estimada' => $request->data_recuperacao_estimada,
                'status' => 'ATIVA'
            ]);

            $atleta->update(['status' => 'LESIONADO']);

            Notificacao::create([
                'usuario_id' => 1,
                'titulo' => 'Nova Lesão Registrada',
                'mensagem' => "Atleta {$atleta->nome} sofreu uma lesão: {$request->tipo_lesao} - Gravidade: {$request->gravidade}",
                'tipo' => 'LESAO',
                'lida' => false
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

        $this->parseJsonInput($request);

        $this->validate($request, [
            'tipo_lesao' => 'string|max:255',
            'gravidade' => 'in:LEVE,MODERADA,GRAVE',
            'descricao' => 'string',
            'tratamento_prescrito' => 'string|nullable',
            'data_recuperacao_estimada' => 'date',
            'status' => 'in:ATIVA,RECUPERADA,CRONICA'
        ]);

        $lesao->update($request->all());

        if ($request->status === 'RECUPERADA') {
            $lesoesAtivas = Lesao::where('atleta_id', $atletaId)
                                ->where('status', 'ATIVA')
                                ->count();
            
            if ($lesoesAtivas === 0) {
                $atleta = Atleta::find($atletaId);
                $atleta->update(['status' => 'DISPONIVEL']);

                Notificacao::create([
                    'usuario_id' => 1,
                    'titulo' => 'Atleta Recuperado',
                    'mensagem' => "Atleta {$atleta->nome} está recuperado e disponível novamente.",
                    'tipo' => 'RECUPERACAO',
                    'lida' => false
                ]);
            }
        }

        return response()->json(['data' => $lesao]);
    }

    public function destroy($atletaId, $lesaoId)
    {
        $lesao = Lesao::where('id', $lesaoId)
                      ->where('atleta_id', $atletaId)
                      ->first();

        if (!$lesao) {
            return response()->json(['error' => 'Lesão não encontrada'], 404);
        }

        $lesao->delete();

        $lesoesAtivas = Lesao::where('atleta_id', $atletaId)
                            ->where('status', 'ATIVA')
                            ->count();
        
        if ($lesoesAtivas === 0) {
            $atleta = Atleta::find($atletaId);
            if ($atleta && $atleta->status === 'LESIONADO') {
                $atleta->update(['status' => 'DISPONIVEL']);
            }
        }

        return response()->json(['message' => 'Lesão excluída com sucesso']);
    }
}

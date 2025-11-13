<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ExameMedico;
use App\Models\Atleta;

class ExameController extends Controller
{
    public function store(Request $request, $atletaId)
    {
        $atleta = Atleta::find($atletaId);

        if (!$atleta) {
            return response()->json(['error' => 'Atleta não encontrado'], 404);
        }

        $this->validate($request, [
            'tipo_exame' => 'required',
            'data_exame' => 'required|date',
            'resultados' => 'required',
            'status' => 'required|in:PENDENTE,APROVADO,REPROVADO'
        ]);

        try {
            $exame = ExameMedico::create([
                'atleta_id' => $atletaId,
                'usuario_id' => 1,
                'tipo_exame' => $request->tipo_exame,
                'data_exame' => $request->data_exame,
                'resultados' => $request->resultados,
                'status' => $request->status,
                'recomendacoes' => $request->recomendacoes ?? '',
                'proximo_exame' => $request->proximo_exame
            ]);

            return response()->json(['data' => $exame], 201);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Erro ao registrar exame'], 500);
        }
    }

    public function indexByAtleta($atletaId)
    {
        $exames = ExameMedico::where('atleta_id', $atletaId)->get();
        return response()->json(['data' => $exames]);
    }
}
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ExameMedico;
use App\Models\Atleta;

class ExameController extends Controller
{
    public function index()
    {
        $exames = ExameMedico::with('atleta')->orderBy('data_exame', 'desc')->get();
        return response()->json(['data' => $exames]);
    }

    public function indexByAtleta($atletaId)
    {
        $atleta = Atleta::find($atletaId);

        if (!$atleta) {
            return response()->json(['error' => 'Atleta não encontrado'], 404);
        }

        $exames = ExameMedico::where('atleta_id', $atletaId)
                             ->orderBy('data_exame', 'desc')
                             ->get();
        
        return response()->json(['data' => $exames]);
    }

    public function show($id)
    {
        $exame = ExameMedico::with('atleta')->find($id);

        if (!$exame) {
            return response()->json(['error' => 'Exame não encontrado'], 404);
        }

        return response()->json(['data' => $exame]);
    }

    public function store(Request $request, $atletaId)
    {
        $atleta = Atleta::find($atletaId);

        if (!$atleta) {
            return response()->json(['error' => 'Atleta não encontrado'], 404);
        }

        $this->parseJsonInput($request);

        $this->validate($request, [
            'tipo_exame' => 'required|string|max:255',
            'data_exame' => 'required|date',
            'resultados' => 'required|string',
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
            return response()->json(['error' => 'Erro ao registrar exame: ' . $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $atletaId, $exameId)
    {
        $exame = ExameMedico::where('id', $exameId)
                            ->where('atleta_id', $atletaId)
                            ->first();

        if (!$exame) {
            return response()->json(['error' => 'Exame não encontrado'], 404);
        }

        $this->parseJsonInput($request);

        $this->validate($request, [
            'tipo_exame' => 'string|max:255',
            'data_exame' => 'date',
            'resultados' => 'string',
            'status' => 'in:PENDENTE,APROVADO,REPROVADO',
            'recomendacoes' => 'string|nullable',
            'proximo_exame' => 'date|nullable'
        ]);

        $exame->update($request->all());

        return response()->json(['data' => $exame]);
    }

    public function destroy($atletaId, $exameId)
    {
        $exame = ExameMedico::where('id', $exameId)
                            ->where('atleta_id', $atletaId)
                            ->first();

        if (!$exame) {
            return response()->json(['error' => 'Exame não encontrado'], 404);
        }

        $exame->delete();

        return response()->json(['message' => 'Exame excluído com sucesso']);
    }
}

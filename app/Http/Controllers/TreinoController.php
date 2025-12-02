<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Treino;
use App\Models\Atleta;

class TreinoController extends Controller
{
    public function index()
    {
        $treinos = Treino::with('atletas')->orderBy('data_hora', 'desc')->get();
        return response()->json(['data' => $treinos]);
    }

    public function show($id)
    {
        $treino = Treino::with('atletas')->find($id);

        if (!$treino) {
            return response()->json(['error' => 'Treino não encontrado'], 404);
        }

        return response()->json(['data' => $treino]);
    }

    public function store(Request $request)
    {
        $this->parseJsonInput($request);

        $this->validate($request, [
            'tipo_treino' => 'required|string|max:255',
            'descricao' => 'required|string',
            'data_hora' => 'required|date',
            'local' => 'required|string|max:255',
            'duracao_minutos' => 'required|integer|min:1'
        ]);

        $treino = Treino::create([
            'tipo_treino' => $request->tipo_treino,
            'descricao' => $request->descricao,
            'data_hora' => $request->data_hora,
            'local' => $request->local,
            'duracao_minutos' => $request->duracao_minutos,
            'observacoes' => $request->observacoes ?? ''
        ]);

        return response()->json(['data' => $treino], 201);
    }

    public function update(Request $request, $id)
    {
        $treino = Treino::find($id);

        if (!$treino) {
            return response()->json(['error' => 'Treino não encontrado'], 404);
        }

        $this->parseJsonInput($request);

        $this->validate($request, [
            'tipo_treino' => 'string|max:255',
            'descricao' => 'string',
            'data_hora' => 'date',
            'local' => 'string|max:255',
            'duracao_minutos' => 'integer|min:1'
        ]);

        $treino->update($request->all());

        return response()->json(['data' => $treino]);
    }

    public function destroy($id)
    {
        $treino = Treino::find($id);

        if (!$treino) {
            return response()->json(['error' => 'Treino não encontrado'], 404);
        }

        $treino->delete();

        return response()->json(['message' => 'Treino excluído com sucesso']);
    }

    public function vincularAtletas(Request $request, $id)
    {
        $treino = Treino::find($id);

        if (!$treino) {
            return response()->json(['error' => 'Treino não encontrado'], 404);
        }

        $this->parseJsonInput($request);

        $this->validate($request, [
            'atletas' => 'required|array',
            'atletas.*' => 'integer|exists:atletas,id'
        ]);

        $atletasData = [];
        foreach ($request->atletas as $atletaId) {
            $atletasData[$atletaId] = [
                'presente' => false,
                'observacoes' => ''
            ];
        }

        $treino->atletas()->sync($atletasData);

        return response()->json([
            'message' => 'Atletas vinculados com sucesso',
            'data' => $treino->load('atletas')
        ]);
    }

    public function registrarPresenca(Request $request, $id)
    {
        $treino = Treino::find($id);

        if (!$treino) {
            return response()->json(['error' => 'Treino não encontrado'], 404);
        }

        $this->parseJsonInput($request);

        $this->validate($request, [
            'presencas' => 'required|array',
            'presencas.*.atleta_id' => 'required|integer|exists:atletas,id',
            'presencas.*.presente' => 'required|boolean',
            'presencas.*.observacoes' => 'string|nullable'
        ]);

        foreach ($request->presencas as $presenca) {
            $treino->atletas()->updateExistingPivot($presenca['atleta_id'], [
                'presente' => $presenca['presente'],
                'observacoes' => $presenca['observacoes'] ?? ''
            ]);
        }

        return response()->json([
            'message' => 'Presenças registradas com sucesso',
            'data' => $treino->load('atletas')
        ]);
    }
}

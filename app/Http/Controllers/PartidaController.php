<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Partida;

class PartidaController extends Controller
{
    public function index()
    {
        $partidas = Partida::orderBy('data_hora', 'desc')->get();
        return response()->json(['data' => $partidas]);
    }

    public function show($id)
    {
        $partida = Partida::find($id);

        if (!$partida) {
            return response()->json(['error' => 'Partida não encontrada'], 404);
        }

        return response()->json(['data' => $partida]);
    }

    public function store(Request $request)
    {
        $this->parseJsonInput($request);

        $this->validate($request, [
            'adversario' => 'required|string|max:255',
            'competicao' => 'required|string|max:255',
            'tipo' => 'required|in:AMISTOSO,OFICIAL,TREINO',
            'data_hora' => 'required|date',
            'local' => 'required|string|max:255'
        ]);

        $partida = Partida::create([
            'adversario' => $request->adversario,
            'competicao' => $request->competicao,
            'tipo' => $request->tipo,
            'data_hora' => $request->data_hora,
            'local' => $request->local,
            'observacoes' => $request->observacoes ?? ''
        ]);

        return response()->json(['data' => $partida], 201);
    }

    public function update(Request $request, $id)
    {
        $partida = Partida::find($id);

        if (!$partida) {
            return response()->json(['error' => 'Partida não encontrada'], 404);
        }

        $this->parseJsonInput($request);

        $this->validate($request, [
            'adversario' => 'string|max:255',
            'competicao' => 'string|max:255',
            'tipo' => 'in:AMISTOSO,OFICIAL,TREINO',
            'data_hora' => 'date',
            'local' => 'string|max:255'
        ]);

        $partida->update($request->all());

        return response()->json(['data' => $partida]);
    }

    public function destroy($id)
    {
        $partida = Partida::find($id);

        if (!$partida) {
            return response()->json(['error' => 'Partida não encontrada'], 404);
        }

        $partida->delete();

        return response()->json(['message' => 'Partida excluída com sucesso']);
    }
}

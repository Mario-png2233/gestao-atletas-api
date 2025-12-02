<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tatica;

class TaticaController extends Controller
{
    public function index()
    {
        $taticas = Tatica::with('tecnico')->orderBy('created_at', 'desc')->get();
        return response()->json(['data' => $taticas]);
    }

    public function show($id)
    {
        $tatica = Tatica::with('tecnico')->find($id);

        if (!$tatica) {
            return response()->json(['error' => 'Tática não encontrada'], 404);
        }

        return response()->json(['data' => $tatica]);
    }

    public function store(Request $request)
    {
        $this->parseJsonInput($request);

        $this->validate($request, [
            'nome' => 'required|string|max:255',
            'formacao' => 'required|string|max:50',
            'descricao' => 'required|string'
        ]);

        $tatica = Tatica::create([
            'usuario_id' => 1, // Em produção, pegar do token
            'nome' => $request->nome,
            'formacao' => $request->formacao,
            'descricao' => $request->descricao,
            'instrucoes_ataque' => $request->instrucoes_ataque ?? '',
            'instrucoes_defesa' => $request->instrucoes_defesa ?? '',
            'jogadas_ensaiadas' => $request->jogadas_ensaiadas ?? '',
            'posicoes_jogadores' => $request->posicoes_jogadores,
            'ativa' => $request->ativa ?? true
        ]);

        return response()->json(['data' => $tatica], 201);
    }

    public function update(Request $request, $id)
    {
        $tatica = Tatica::find($id);

        if (!$tatica) {
            return response()->json(['error' => 'Tática não encontrada'], 404);
        }

        $this->parseJsonInput($request);

        $this->validate($request, [
            'nome' => 'string|max:255',
            'formacao' => 'string|max:50',
            'descricao' => 'string',
            'ativa' => 'boolean'
        ]);

        $tatica->update($request->all());

        return response()->json(['data' => $tatica]);
    }

    public function destroy($id)
    {
        $tatica = Tatica::find($id);

        if (!$tatica) {
            return response()->json(['error' => 'Tática não encontrada'], 404);
        }

        $tatica->delete();

        return response()->json(['message' => 'Tática excluída com sucesso']);
    }
}




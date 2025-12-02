<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Receita;

class ReceitaController extends Controller
{
    public function index()
    {
        $receitas = Receita::with('patrocinio')->orderBy('data', 'desc')->get();
        return response()->json(['data' => $receitas]);
    }

    public function show($id)
    {
        $receita = Receita::with('patrocinio')->find($id);

        if (!$receita) {
            return response()->json(['error' => 'Receita não encontrada'], 404);
        }

        return response()->json(['data' => $receita]);
    }

    public function store(Request $request)
    {
        $this->parseJsonInput($request);

        $this->validate($request, [
            'descricao' => 'required|string|max:255',
            'valor' => 'required|numeric|min:0',
            'data' => 'required|date',
            'categoria' => 'required|in:PATROCINIO,BILHETERIA,MENSALIDADES,PREMIACOES,VENDAS,OUTROS'
        ]);

        $receita = Receita::create([
            'descricao' => $request->descricao,
            'valor' => $request->valor,
            'data' => $request->data,
            'categoria' => $request->categoria,
            'status' => $request->status ?? 'PENDENTE',
            'patrocinio_id' => $request->patrocinio_id,
            'observacoes' => $request->observacoes
        ]);

        return response()->json(['data' => $receita], 201);
    }

    public function update(Request $request, $id)
    {
        $receita = Receita::find($id);

        if (!$receita) {
            return response()->json(['error' => 'Receita não encontrada'], 404);
        }

        $this->parseJsonInput($request);

        $this->validate($request, [
            'descricao' => 'string|max:255',
            'valor' => 'numeric|min:0',
            'data' => 'date',
            'categoria' => 'in:PATROCINIO,BILHETERIA,MENSALIDADES,PREMIACOES,VENDAS,OUTROS',
            'status' => 'in:RECEBIDO,PENDENTE,ATRASADO'
        ]);

        $receita->update($request->all());

        return response()->json(['data' => $receita]);
    }

    public function destroy($id)
    {
        $receita = Receita::find($id);

        if (!$receita) {
            return response()->json(['error' => 'Receita não encontrada'], 404);
        }

        $receita->delete();

        return response()->json(['message' => 'Receita excluída com sucesso']);
    }
}




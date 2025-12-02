<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Despesa;

class DespesaController extends Controller
{
    public function index()
    {
        $despesas = Despesa::orderBy('data', 'desc')->get();
        return response()->json(['data' => $despesas]);
    }

    public function show($id)
    {
        $despesa = Despesa::find($id);

        if (!$despesa) {
            return response()->json(['error' => 'Despesa não encontrada'], 404);
        }

        return response()->json(['data' => $despesa]);
    }

    public function store(Request $request)
    {
        $this->parseJsonInput($request);

        $this->validate($request, [
            'descricao' => 'required|string|max:255',
            'valor' => 'required|numeric|min:0',
            'data' => 'required|date',
            'categoria' => 'required|in:SALARIOS,INFRAESTRUTURA,EQUIPAMENTOS,VIAGENS,ALIMENTACAO,SAUDE,MARKETING,IMPOSTOS,OUTROS'
        ]);

        $despesa = Despesa::create([
            'descricao' => $request->descricao,
            'valor' => $request->valor,
            'data' => $request->data,
            'data_vencimento' => $request->data_vencimento,
            'categoria' => $request->categoria,
            'status' => $request->status ?? 'PENDENTE',
            'fornecedor' => $request->fornecedor,
            'nota_fiscal' => $request->nota_fiscal,
            'observacoes' => $request->observacoes
        ]);

        return response()->json(['data' => $despesa], 201);
    }

    public function update(Request $request, $id)
    {
        $despesa = Despesa::find($id);

        if (!$despesa) {
            return response()->json(['error' => 'Despesa não encontrada'], 404);
        }

        $this->parseJsonInput($request);

        $this->validate($request, [
            'descricao' => 'string|max:255',
            'valor' => 'numeric|min:0',
            'data' => 'date',
            'categoria' => 'in:SALARIOS,INFRAESTRUTURA,EQUIPAMENTOS,VIAGENS,ALIMENTACAO,SAUDE,MARKETING,IMPOSTOS,OUTROS',
            'status' => 'in:PAGO,PENDENTE,ATRASADO,CANCELADO'
        ]);

        $despesa->update($request->all());

        return response()->json(['data' => $despesa]);
    }

    public function destroy($id)
    {
        $despesa = Despesa::find($id);

        if (!$despesa) {
            return response()->json(['error' => 'Despesa não encontrada'], 404);
        }

        $despesa->delete();

        return response()->json(['message' => 'Despesa excluída com sucesso']);
    }
}




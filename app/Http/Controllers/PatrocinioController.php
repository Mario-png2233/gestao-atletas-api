<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Patrocinio;

class PatrocinioController extends Controller
{
    public function index()
    {
        $patrocinios = Patrocinio::orderBy('created_at', 'desc')->get();
        return response()->json(['data' => $patrocinios]);
    }

    public function show($id)
    {
        $patrocinio = Patrocinio::with('receitas')->find($id);

        if (!$patrocinio) {
            return response()->json(['error' => 'Patrocínio não encontrado'], 404);
        }

        return response()->json(['data' => $patrocinio]);
    }

    public function store(Request $request)
    {
        $this->parseJsonInput($request);

        $this->validate($request, [
            'empresa' => 'required|string|max:255',
            'valor_contrato' => 'required|numeric|min:0',
            'data_inicio' => 'required|date',
            'data_fim' => 'required|date|after:data_inicio',
            'tipo' => 'required|in:PRINCIPAL,SECUNDARIO,PONTUAL'
        ]);

        $patrocinio = Patrocinio::create([
            'empresa' => $request->empresa,
            'contato' => $request->contato,
            'telefone' => $request->telefone,
            'email' => $request->email,
            'valor_contrato' => $request->valor_contrato,
            'data_inicio' => $request->data_inicio,
            'data_fim' => $request->data_fim,
            'tipo' => $request->tipo,
            'status' => $request->status ?? 'ATIVO',
            'descricao' => $request->descricao ?? '',
            'contrapartidas' => $request->contrapartidas ?? ''
        ]);

        return response()->json(['data' => $patrocinio], 201);
    }

    public function update(Request $request, $id)
    {
        $patrocinio = Patrocinio::find($id);

        if (!$patrocinio) {
            return response()->json(['error' => 'Patrocínio não encontrado'], 404);
        }

        $this->parseJsonInput($request);

        $this->validate($request, [
            'empresa' => 'string|max:255',
            'valor_contrato' => 'numeric|min:0',
            'data_inicio' => 'date',
            'data_fim' => 'date',
            'tipo' => 'in:PRINCIPAL,SECUNDARIO,PONTUAL',
            'status' => 'in:ATIVO,ENCERRADO,PENDENTE,CANCELADO'
        ]);

        $patrocinio->update($request->all());

        return response()->json(['data' => $patrocinio]);
    }

    public function destroy($id)
    {
        $patrocinio = Patrocinio::find($id);

        if (!$patrocinio) {
            return response()->json(['error' => 'Patrocínio não encontrado'], 404);
        }

        $patrocinio->delete();

        return response()->json(['message' => 'Patrocínio excluído com sucesso']);
    }
}




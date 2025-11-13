<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Atleta;

class AtletaController extends Controller
{
    public function index()
    {
        $atletas = Atleta::all();
        return response()->json(['data' => $atletas]);
    }

    public function show($id)
    {
        $atleta = Atleta::find($id);

        if (!$atleta) {
            return response()->json(['error' => 'Atleta não encontrado'], 404);
        }

        return response()->json(['data' => $atleta]);
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'nome' => 'required',
            'data_nascimento' => 'required|date',
            'posicao' => 'required',
            'altura' => 'required|numeric',
            'peso' => 'required|numeric',
            'telefone_contato' => 'required'
        ]);

        $atleta = Atleta::create($request->all());

        return response()->json(['data' => $atleta], 201);
    }

    public function update(Request $request, $id)
    {
        $atleta = Atleta::find($id);

        if (!$atleta) {
            return response()->json(['error' => 'Atleta não encontrado'], 404);
        }

        $this->validate($request, [
            'nome' => 'string',
            'data_nascimento' => 'date',
            'posicao' => 'string',
            'altura' => 'numeric',
            'peso' => 'numeric',
            'status' => 'in:DISPONIVEL,LESIONADO,SUSPENSO'
        ]);

        $atleta->update($request->all());

        return response()->json(['data' => $atleta]);
    }

    public function destroy($id)
    {
        $atleta = Atleta::find($id);

        if (!$atleta) {
            return response()->json(['error' => 'Atleta não encontrado'], 404);
        }

        $atleta->delete();

        return response()->json(['message' => 'Atleta deletado com sucesso']);
    }
}
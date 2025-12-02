<?php

namespace App\Http\Controllers;

use App\Models\AvaliacaoFisica;
use App\Models\Atleta;
use Illuminate\Http\Request;

class AvaliacaoFisicaController extends Controller
{
    public function __construct(Request $request)
    {
        $this->parseJsonInput($request);
    }

    // Listar todas as avaliações
    public function index()
    {
        try {
            $avaliacoes = AvaliacaoFisica::with(['atleta', 'usuario'])
                ->orderBy('data_avaliacao', 'desc')
                ->get();
            return response()->json(['data' => $avaliacoes]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erro ao listar avaliações: ' . $e->getMessage()], 500);
        }
    }

    // Listar avaliações de um atleta específico
    public function porAtleta($atletaId)
    {
        try {
            $avaliacoes = AvaliacaoFisica::with(['usuario'])
                ->where('atleta_id', $atletaId)
                ->orderBy('data_avaliacao', 'desc')
                ->get();
            return response()->json(['data' => $avaliacoes]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erro ao listar avaliações: ' . $e->getMessage()], 500);
        }
    }

    // Buscar uma avaliação
    public function show($id)
    {
        try {
            $avaliacao = AvaliacaoFisica::with(['atleta', 'usuario'])->findOrFail($id);
            return response()->json(['data' => $avaliacao]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Avaliação não encontrada'], 404);
        }
    }

    // Criar avaliação
    public function store(Request $request, $atletaId)
    {
        $this->validate($request, [
            'data_avaliacao' => 'required|date'
        ]);

        try {
            // Verificar se o atleta existe
            $atleta = Atleta::find($atletaId);
            if (!$atleta) {
                return response()->json(['error' => 'Atleta não encontrado'], 404);
            }

            $data = $request->all();
            $data['atleta_id'] = $atletaId; // Pegar da URL
            
            // Calcular IMC se peso e altura fornecidos
            if (isset($data['peso']) && isset($data['altura']) && $data['peso'] && $data['altura']) {
                $data['imc'] = AvaliacaoFisica::calcularIMC($data['peso'], $data['altura']);
            }

            // Pegar usuário do token
            $token = $request->header('Authorization');
            if ($token) {
                $token = str_replace('Bearer ', '', $token);
                $tokenData = json_decode(base64_decode($token), true);
                $data['usuario_id'] = $tokenData['user_id'] ?? 1;
            } else {
                $data['usuario_id'] = 1; // Fallback
            }

            $avaliacao = AvaliacaoFisica::create($data);

            return response()->json([
                'message' => 'Avaliação física registrada com sucesso',
                'data' => $avaliacao->load(['atleta', 'usuario'])
            ], 201);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Erro ao criar avaliação: ' . $e->getMessage()], 500);
        }
    }

    // Atualizar avaliação
    public function update(Request $request, $id)
    {
        try {
            $avaliacao = AvaliacaoFisica::findOrFail($id);
            $data = $request->all();

            // Recalcular IMC se peso ou altura mudaram
            $peso = $data['peso'] ?? $avaliacao->peso;
            $altura = $data['altura'] ?? $avaliacao->altura;
            if ($peso && $altura) {
                $data['imc'] = AvaliacaoFisica::calcularIMC($peso, $altura);
            }

            $avaliacao->update($data);

            return response()->json([
                'message' => 'Avaliação atualizada com sucesso',
                'data' => $avaliacao->load(['atleta', 'usuario'])
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Erro ao atualizar avaliação: ' . $e->getMessage()], 500);
        }
    }

    // Excluir avaliação
    public function destroy($id)
    {
        try {
            $avaliacao = AvaliacaoFisica::findOrFail($id);
            $avaliacao->delete();

            return response()->json(['message' => 'Avaliação excluída com sucesso']);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Erro ao excluir avaliação: ' . $e->getMessage()], 500);
        }
    }

    // Última avaliação de um atleta (para PDF)
    public function ultimaAvaliacao($atletaId)
    {
        try {
            $avaliacao = AvaliacaoFisica::with(['atleta', 'usuario'])
                ->where('atleta_id', $atletaId)
                ->orderBy('data_avaliacao', 'desc')
                ->first();

            if (!$avaliacao) {
                return response()->json(['error' => 'Nenhuma avaliação encontrada'], 404);
            }

            return response()->json(['data' => $avaliacao]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Erro ao buscar avaliação: ' . $e->getMessage()], 500);
        }
    }
}


<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Atleta;
use App\Models\Lesao;

class RelatorioController extends Controller
{
    public function disponibilidade(Request $request)
    {
        if (!$request->has('data_inicio') || !$request->has('data_fim')) {
            return response()->json(['error' => 'Datas de início e fim são obrigatórias'], 422);
        }

        $dataInicio = $request->data_inicio;
        $dataFim = $request->data_fim;

        $diasPeriodo = (strtotime($dataFim) - strtotime($dataInicio)) / (60 * 60 * 24);
        if ($diasPeriodo > 365) {
            return response()->json(['error' => 'O período de análise não pode ser superior a 1 ano'], 422);
        }

        try {
            $totalAtletas = Atleta::count();
            $atletasDisponiveis = Atleta::where('status', 'DISPONIVEL')->count();
            $atletasLesionados = Atleta::where('status', 'LESIONADO')->count();
            $atletasSuspensos = Atleta::where('status', 'SUSPENSO')->count();

            $porcentagemDisponivel = $totalAtletas > 0 
                ? round(($atletasDisponiveis / $totalAtletas) * 100, 2) 
                : 0;

            $lesoesPeriodo = Lesao::whereBetween('data_lesao', [$dataInicio, $dataFim])->get();

            return response()->json([
                'data' => [
                    'periodo' => [
                        'inicio' => $dataInicio,
                        'fim' => $dataFim
                    ],
                    'estatisticas' => [
                        'total_atletas' => $totalAtletas,
                        'disponiveis' => $atletasDisponiveis,
                        'lesionados' => $atletasLesionados,
                        'suspensos' => $atletasSuspensos,
                        'porcentagem_disponivel' => $porcentagemDisponivel
                    ],
                    'lesoes_periodo' => $lesoesPeriodo->count(),
                    'lesoes_por_gravidade' => [
                        'LEVE' => $lesoesPeriodo->where('gravidade', 'LEVE')->count(),
                        'MODERADA' => $lesoesPeriodo->where('gravidade', 'MODERADA')->count(),
                        'GRAVE' => $lesoesPeriodo->where('gravidade', 'GRAVE')->count()
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Erro ao gerar relatório: ' . $e->getMessage()], 500);
        }
    }
}

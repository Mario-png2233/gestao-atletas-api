<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Despesa;
use App\Models\Receita;
use App\Models\Patrocinio;

class FinancaController extends Controller
{
    /**
     * Resumo financeiro geral
     */
    public function resumo(Request $request)
    {
        $mesAtual = date('Y-m');
        $anoAtual = date('Y');

        // Totais do mês
        $receitasMes = Receita::whereRaw("DATE_FORMAT(data, '%Y-%m') = ?", [$mesAtual])->sum('valor');
        $despesasMes = Despesa::whereRaw("DATE_FORMAT(data, '%Y-%m') = ?", [$mesAtual])->sum('valor');
        $saldoMes = $receitasMes - $despesasMes;

        // Totais do ano
        $receitasAno = Receita::whereYear('data', $anoAtual)->sum('valor');
        $despesasAno = Despesa::whereYear('data', $anoAtual)->sum('valor');
        $saldoAno = $receitasAno - $despesasAno;

        // Patrocínios ativos
        $patrociniosAtivos = Patrocinio::where('status', 'ATIVO')->count();
        $valorPatrocinios = Patrocinio::where('status', 'ATIVO')->sum('valor_contrato');

        // Despesas pendentes
        $despesasPendentes = Despesa::where('status', 'PENDENTE')->sum('valor');
        $despesasAtrasadas = Despesa::where('status', 'ATRASADO')->sum('valor');

        // Receitas pendentes
        $receitasPendentes = Receita::where('status', 'PENDENTE')->sum('valor');

        // Por categoria (mês atual)
        $despesasPorCategoria = Despesa::whereRaw("DATE_FORMAT(data, '%Y-%m') = ?", [$mesAtual])
            ->selectRaw('categoria, SUM(valor) as total')
            ->groupBy('categoria')
            ->get();

        $receitasPorCategoria = Receita::whereRaw("DATE_FORMAT(data, '%Y-%m') = ?", [$mesAtual])
            ->selectRaw('categoria, SUM(valor) as total')
            ->groupBy('categoria')
            ->get();

        return response()->json([
            'data' => [
                'mes_atual' => [
                    'receitas' => $receitasMes,
                    'despesas' => $despesasMes,
                    'saldo' => $saldoMes
                ],
                'ano_atual' => [
                    'receitas' => $receitasAno,
                    'despesas' => $despesasAno,
                    'saldo' => $saldoAno
                ],
                'patrocinios' => [
                    'ativos' => $patrociniosAtivos,
                    'valor_total' => $valorPatrocinios
                ],
                'pendencias' => [
                    'despesas_pendentes' => $despesasPendentes,
                    'despesas_atrasadas' => $despesasAtrasadas,
                    'receitas_pendentes' => $receitasPendentes
                ],
                'por_categoria' => [
                    'despesas' => $despesasPorCategoria,
                    'receitas' => $receitasPorCategoria
                ]
            ]
        ]);
    }
}


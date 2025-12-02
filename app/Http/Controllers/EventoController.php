<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Evento;

class EventoController extends Controller
{
    public function index(Request $request)
    {
        $query = Evento::with(['partida', 'treino', 'usuario']);

        // Filtrar por mês se fornecido
        if ($request->has('mes') && $request->has('ano')) {
            $query->whereMonth('data_inicio', $request->mes)
                  ->whereYear('data_inicio', $request->ano);
        }

        // Filtrar por tipo se fornecido
        if ($request->has('tipo')) {
            $query->where('tipo', $request->tipo);
        }

        $eventos = $query->orderBy('data_inicio', 'asc')->get();

        return response()->json(['data' => $eventos]);
    }

    public function show($id)
    {
        $evento = Evento::with(['partida', 'treino', 'usuario'])->find($id);

        if (!$evento) {
            return response()->json(['error' => 'Evento não encontrado'], 404);
        }

        return response()->json(['data' => $evento]);
    }

    public function store(Request $request)
    {
        $this->parseJsonInput($request);

        $this->validate($request, [
            'titulo' => 'required|string|max:255',
            'data_inicio' => 'required|date',
            'tipo' => 'required|in:JOGO,TREINO,EXAME,REUNIAO,OUTRO'
        ]);

        $evento = Evento::create([
            'titulo' => $request->titulo,
            'descricao' => $request->descricao,
            'data_inicio' => $request->data_inicio,
            'data_fim' => $request->data_fim,
            'tipo' => $request->tipo,
            'local' => $request->local,
            'cor' => $request->cor ?? $this->getCorPorTipo($request->tipo),
            'lembrete' => $request->lembrete ?? false,
            'lembrete_minutos' => $request->lembrete_minutos,
            'partida_id' => $request->partida_id,
            'treino_id' => $request->treino_id,
            'usuario_id' => 1 // Em produção, pegar do token
        ]);

        return response()->json(['data' => $evento], 201);
    }

    public function update(Request $request, $id)
    {
        $evento = Evento::find($id);

        if (!$evento) {
            return response()->json(['error' => 'Evento não encontrado'], 404);
        }

        $this->parseJsonInput($request);

        $this->validate($request, [
            'titulo' => 'string|max:255',
            'data_inicio' => 'date',
            'tipo' => 'in:JOGO,TREINO,EXAME,REUNIAO,OUTRO'
        ]);

        $evento->update($request->all());

        return response()->json(['data' => $evento]);
    }

    public function destroy($id)
    {
        $evento = Evento::find($id);

        if (!$evento) {
            return response()->json(['error' => 'Evento não encontrado'], 404);
        }

        $evento->delete();

        return response()->json(['message' => 'Evento excluído com sucesso']);
    }

    /**
     * Retorna cor padrão por tipo de evento
     */
    private function getCorPorTipo($tipo)
    {
        $cores = [
            'JOGO' => '#dc3545',     // Vermelho
            'TREINO' => '#198754',   // Verde
            'EXAME' => '#0dcaf0',    // Ciano
            'REUNIAO' => '#ffc107',  // Amarelo
            'OUTRO' => '#6c757d'     // Cinza
        ];

        return $cores[$tipo] ?? '#0d6efd';
    }

    /**
     * Retorna eventos do mês para o calendário
     */
    public function calendario(Request $request)
    {
        $mes = $request->get('mes', date('m'));
        $ano = $request->get('ano', date('Y'));

        $eventos = Evento::whereMonth('data_inicio', $mes)
                        ->whereYear('data_inicio', $ano)
                        ->orderBy('data_inicio', 'asc')
                        ->get();

        // Formatar para o calendário
        $eventosFormatados = $eventos->map(function ($evento) {
            return [
                'id' => $evento->id,
                'title' => $evento->titulo,
                'start' => $evento->data_inicio,
                'end' => $evento->data_fim,
                'color' => $evento->cor,
                'tipo' => $evento->tipo,
                'local' => $evento->local,
                'descricao' => $evento->descricao
            ];
        });

        return response()->json(['data' => $eventosFormatados]);
    }
}




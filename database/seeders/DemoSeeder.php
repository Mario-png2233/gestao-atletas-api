<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DemoSeeder extends Seeder
{
    public function run()
    {
        // ==================== USUÁRIOS ====================
        echo "Criando usuários...\n";
        
        $usuarios = [
            [
                'email' => 'tecnico@clubefc.com',
                'senha' => Hash::make('123456'),
                'perfil' => 'TECNICO',
                'tentativas_login' => 0,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'email' => 'medico@clubefc.com',
                'senha' => Hash::make('123456'),
                'perfil' => 'MEDICO',
                'tentativas_login' => 0,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'email' => 'preparador@clubefc.com',
                'senha' => Hash::make('123456'),
                'perfil' => 'PREPARADOR',
                'tentativas_login' => 0,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'email' => 'financeiro@clubefc.com',
                'senha' => Hash::make('123456'),
                'perfil' => 'DIRETOR_FINANCEIRO',
                'tentativas_login' => 0,
                'created_at' => now(),
                'updated_at' => now()
            ]
        ];

        foreach ($usuarios as $usuario) {
            DB::table('usuarios')->updateOrInsert(
                ['email' => $usuario['email']],
                $usuario
            );
        }

        // ==================== ATLETAS (11 titulares + 5 reservas) ====================
        echo "Criando atletas...\n";
        
        $atletas = [
            // Goleiro
            [
                'nome' => 'Carlos Eduardo Silva',
                'data_nascimento' => '1995-03-15',
                'posicao' => 'Goleiro',
                'altura' => 1.92,
                'peso' => 88.5,
                'status' => 'DISPONIVEL',
                'telefone_contato' => '(11) 99999-0001',
                'historico_medico' => 'Cirurgia no ombro direito em 2020. Recuperação completa.'
            ],
            // Defensores
            [
                'nome' => 'Rafael Santos Oliveira',
                'data_nascimento' => '1998-07-22',
                'posicao' => 'Lateral Direito',
                'altura' => 1.76,
                'peso' => 72.0,
                'status' => 'DISPONIVEL',
                'telefone_contato' => '(11) 99999-0002',
                'historico_medico' => 'Nenhuma ocorrência significativa.'
            ],
            [
                'nome' => 'Lucas Mendes Costa',
                'data_nascimento' => '1997-01-10',
                'posicao' => 'Zagueiro',
                'altura' => 1.88,
                'peso' => 84.0,
                'status' => 'DISPONIVEL',
                'telefone_contato' => '(11) 99999-0003',
                'historico_medico' => 'Fratura no tornozelo em 2019. Totalmente recuperado.'
            ],
            [
                'nome' => 'André Luiz Ferreira',
                'data_nascimento' => '1996-09-05',
                'posicao' => 'Zagueiro',
                'altura' => 1.86,
                'peso' => 82.0,
                'status' => 'DISPONIVEL',
                'telefone_contato' => '(11) 99999-0004',
                'historico_medico' => 'Nenhuma ocorrência significativa.'
            ],
            [
                'nome' => 'Bruno Henrique Souza',
                'data_nascimento' => '1999-04-18',
                'posicao' => 'Lateral Esquerdo',
                'altura' => 1.74,
                'peso' => 70.5,
                'status' => 'DISPONIVEL',
                'telefone_contato' => '(11) 99999-0005',
                'historico_medico' => 'Alergia a anti-inflamatórios à base de dipirona.'
            ],
            // Meio-campistas
            [
                'nome' => 'Pedro Augusto Lima',
                'data_nascimento' => '1997-11-30',
                'posicao' => 'Volante',
                'altura' => 1.80,
                'peso' => 76.0,
                'status' => 'DISPONIVEL',
                'telefone_contato' => '(11) 99999-0006',
                'historico_medico' => 'Nenhuma ocorrência significativa.'
            ],
            [
                'nome' => 'Gabriel Nascimento',
                'data_nascimento' => '2000-02-14',
                'posicao' => 'Meia Central',
                'altura' => 1.78,
                'peso' => 73.0,
                'status' => 'LESIONADO',
                'telefone_contato' => '(11) 99999-0007',
                'historico_medico' => 'Lesão muscular na coxa direita (atual).'
            ],
            [
                'nome' => 'Matheus Rodrigues',
                'data_nascimento' => '1998-06-25',
                'posicao' => 'Meia Armador',
                'altura' => 1.75,
                'peso' => 71.0,
                'status' => 'DISPONIVEL',
                'telefone_contato' => '(11) 99999-0008',
                'historico_medico' => 'Nenhuma ocorrência significativa.'
            ],
            // Atacantes
            [
                'nome' => 'Felipe Costa Almeida',
                'data_nascimento' => '1999-08-12',
                'posicao' => 'Ponta Direita',
                'altura' => 1.72,
                'peso' => 68.0,
                'status' => 'DISPONIVEL',
                'telefone_contato' => '(11) 99999-0009',
                'historico_medico' => 'Nenhuma ocorrência significativa.'
            ],
            [
                'nome' => 'Thiago Santos Pereira',
                'data_nascimento' => '1996-12-03',
                'posicao' => 'Centroavante',
                'altura' => 1.85,
                'peso' => 80.0,
                'status' => 'DISPONIVEL',
                'telefone_contato' => '(11) 99999-0010',
                'historico_medico' => 'Pubalgia tratada em 2021. Sem sequelas.'
            ],
            [
                'nome' => 'Vinícius Moreira',
                'data_nascimento' => '2001-05-20',
                'posicao' => 'Ponta Esquerda',
                'altura' => 1.70,
                'peso' => 66.0,
                'status' => 'DISPONIVEL',
                'telefone_contato' => '(11) 99999-0011',
                'historico_medico' => 'Nenhuma ocorrência significativa.'
            ],
            // Reservas
            [
                'nome' => 'João Victor Campos',
                'data_nascimento' => '2002-03-08',
                'posicao' => 'Goleiro',
                'altura' => 1.89,
                'peso' => 85.0,
                'status' => 'DISPONIVEL',
                'telefone_contato' => '(11) 99999-0012',
                'historico_medico' => 'Nenhuma ocorrência significativa.'
            ],
            [
                'nome' => 'Henrique Dias',
                'data_nascimento' => '2000-10-15',
                'posicao' => 'Zagueiro',
                'altura' => 1.84,
                'peso' => 79.0,
                'status' => 'EM_RECUPERACAO',
                'telefone_contato' => '(11) 99999-0013',
                'historico_medico' => 'Lesão no ligamento do joelho em recuperação.'
            ],
            [
                'nome' => 'Daniel Ribeiro',
                'data_nascimento' => '1999-07-28',
                'posicao' => 'Volante',
                'altura' => 1.82,
                'peso' => 77.0,
                'status' => 'DISPONIVEL',
                'telefone_contato' => '(11) 99999-0014',
                'historico_medico' => 'Nenhuma ocorrência significativa.'
            ],
            [
                'nome' => 'Leonardo Martins',
                'data_nascimento' => '2001-01-05',
                'posicao' => 'Atacante',
                'altura' => 1.79,
                'peso' => 74.0,
                'status' => 'DISPONIVEL',
                'telefone_contato' => '(11) 99999-0015',
                'historico_medico' => 'Nenhuma ocorrência significativa.'
            ],
            [
                'nome' => 'Caio Fernandes',
                'data_nascimento' => '2002-09-12',
                'posicao' => 'Meia',
                'altura' => 1.73,
                'peso' => 69.0,
                'status' => 'DISPONIVEL',
                'telefone_contato' => '(11) 99999-0016',
                'historico_medico' => 'Nenhuma ocorrência significativa.'
            ]
        ];

        foreach ($atletas as $atleta) {
            $atleta['created_at'] = now();
            $atleta['updated_at'] = now();
            DB::table('atletas')->updateOrInsert(
                ['nome' => $atleta['nome']],
                $atleta
            );
        }

        // Pegar IDs dos atletas
        $atletasIds = DB::table('atletas')->pluck('id', 'nome')->toArray();

        // ==================== LESÕES ====================
        echo "Criando lesões...\n";
        
        $lesoes = [
            [
                'atleta_id' => $atletasIds['Gabriel Nascimento'],
                'tipo_lesao' => 'Lesão muscular grau 2 - Coxa direita',
                'data_lesao' => '2025-11-20',
                'gravidade' => 'MODERADA',
                'descricao' => 'Lesão durante treino. Atleta sentiu fisgada na coxa direita durante sprint.',
                'tratamento' => 'Fisioterapia diária, repouso de 3 semanas, anti-inflamatórios.',
                'previsao_retorno' => '2025-12-15',
                'status' => 'ATIVA'
            ],
            [
                'atleta_id' => $atletasIds['Henrique Dias'],
                'tipo_lesao' => 'Lesão ligamentar - Joelho esquerdo',
                'data_lesao' => '2025-10-05',
                'gravidade' => 'GRAVE',
                'descricao' => 'Entorse do joelho durante partida. Lesão parcial do LCA.',
                'tratamento' => 'Cirurgia realizada em 10/10. Fisioterapia intensiva.',
                'previsao_retorno' => '2026-02-01',
                'status' => 'ATIVA'
            ],
            [
                'atleta_id' => $atletasIds['Thiago Santos Pereira'],
                'tipo_lesao' => 'Contusão - Tornozelo direito',
                'data_lesao' => '2025-11-01',
                'gravidade' => 'LEVE',
                'descricao' => 'Pancada durante treino tático.',
                'tratamento' => 'Gelo, repouso de 5 dias.',
                'previsao_retorno' => '2025-11-06',
                'status' => 'RECUPERADA'
            ]
        ];

        foreach ($lesoes as $lesao) {
            $lesao['created_at'] = now();
            $lesao['updated_at'] = now();
            DB::table('lesoes')->insert($lesao);
        }

        // ==================== EXAMES MÉDICOS ====================
        echo "Criando exames médicos...\n";
        
        $usuarioMedico = DB::table('usuarios')->where('perfil', 'MEDICO')->first();
        
        foreach ($atletasIds as $nome => $atletaId) {
            DB::table('exames_medicos')->insert([
                'atleta_id' => $atletaId,
                'usuario_id' => $usuarioMedico->id,
                'tipo_exame' => 'Avaliação Cardiológica',
                'data_exame' => '2025-01-' . str_pad(rand(10, 28), 2, '0', STR_PAD_LEFT),
                'resultados' => 'ECG normal. Ecocardiograma sem alterações. Teste ergométrico: excelente condicionamento.',
                'status' => 'APROVADO',
                'recomendacoes' => 'Apto para atividades físicas de alta intensidade.',
                'proximo_exame' => '2026-01-15',
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }

        // ==================== AVALIAÇÕES FÍSICAS ====================
        echo "Criando avaliações físicas...\n";
        
        $usuarioPreparador = DB::table('usuarios')->where('perfil', 'PREPARADOR')->first();
        
        $avaliacoesBase = [
            'Carlos Eduardo Silva' => ['vo2' => 52, 'gordura' => 14, 'salto' => 55, 'vel10' => 1.95],
            'Rafael Santos Oliveira' => ['vo2' => 58, 'gordura' => 10, 'salto' => 48, 'vel10' => 1.72],
            'Lucas Mendes Costa' => ['vo2' => 54, 'gordura' => 12, 'salto' => 52, 'vel10' => 1.85],
            'André Luiz Ferreira' => ['vo2' => 53, 'gordura' => 13, 'salto' => 50, 'vel10' => 1.88],
            'Bruno Henrique Souza' => ['vo2' => 60, 'gordura' => 9, 'salto' => 45, 'vel10' => 1.68],
            'Pedro Augusto Lima' => ['vo2' => 56, 'gordura' => 11, 'salto' => 47, 'vel10' => 1.78],
            'Gabriel Nascimento' => ['vo2' => 57, 'gordura' => 10, 'salto' => 44, 'vel10' => 1.75],
            'Matheus Rodrigues' => ['vo2' => 59, 'gordura' => 9, 'salto' => 42, 'vel10' => 1.70],
            'Felipe Costa Almeida' => ['vo2' => 62, 'gordura' => 8, 'salto' => 50, 'vel10' => 1.62],
            'Thiago Santos Pereira' => ['vo2' => 55, 'gordura' => 12, 'salto' => 58, 'vel10' => 1.75],
            'Vinícius Moreira' => ['vo2' => 63, 'gordura' => 7, 'salto' => 52, 'vel10' => 1.58]
        ];

        foreach ($avaliacoesBase as $nome => $dados) {
            if (isset($atletasIds[$nome])) {
                $atleta = DB::table('atletas')->find($atletasIds[$nome]);
                DB::table('avaliacoes_fisicas')->insert([
                    'atleta_id' => $atletasIds[$nome],
                    'usuario_id' => $usuarioPreparador->id,
                    'data_avaliacao' => '2025-11-15',
                    'batimentos_repouso' => rand(55, 68),
                    'batimentos_esforco' => rand(165, 185),
                    'pressao_arterial' => '120/80',
                    'peso' => $atleta->peso,
                    'altura' => $atleta->altura,
                    'imc' => round($atleta->peso / ($atleta->altura * $atleta->altura), 1),
                    'percentual_gordura' => $dados['gordura'],
                    'massa_muscular' => round($atleta->peso * 0.45, 1),
                    'vo2_max' => $dados['vo2'],
                    'flexibilidade' => ['Regular', 'Boa', 'Excelente'][rand(0, 2)],
                    'velocidade_10m' => $dados['vel10'],
                    'velocidade_40m' => $dados['vel10'] * 4.2,
                    'salto_vertical' => $dados['salto'],
                    'resistencia_abdominal' => rand(35, 50),
                    'status' => 'APTO',
                    'observacoes' => 'Atleta em boas condições físicas.',
                    'recomendacoes' => 'Manter programa de treinamento atual.',
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            }
        }

        // ==================== TÁTICAS ====================
        echo "Criando táticas...\n";
        
        $usuarioTecnico = DB::table('usuarios')->where('perfil', 'TECNICO')->first();
        
        $taticas = [
            [
                'usuario_id' => $usuarioTecnico->id,
                'nome' => 'Posse de Bola - Construção',
                'formacao' => '4-3-3',
                'descricao' => 'Sistema de jogo focado na posse de bola e construção de jogadas desde a defesa. Ideal para partidas em casa contra adversários retrancados.',
                'instrucoes_ataque' => 'Laterais devem subir como alas. Meias centralizam para dar opção ao volante. Pontas abrem bem na linha para esticar a defesa adversária. Centroavante fixa os zagueiros.',
                'instrucoes_defesa' => 'Pressão alta na saída de bola adversária. Linha de 4 compacta. Volante cobre espaços entre linhas.',
                'jogadas_ensaiadas' => 'Escanteio curto para meia armar jogada. Falta frontal: dois na barreira, ponta arranca para segunda trave.',
                'posicoes_jogadores' => json_encode([
                    ['id' => 1, 'x' => 50, 'y' => 90, 'label' => 'GK'],
                    ['id' => 2, 'x' => 15, 'y' => 70, 'label' => 'LD'],
                    ['id' => 3, 'x' => 35, 'y' => 75, 'label' => 'ZAG'],
                    ['id' => 4, 'x' => 65, 'y' => 75, 'label' => 'ZAG'],
                    ['id' => 5, 'x' => 85, 'y' => 70, 'label' => 'LE'],
                    ['id' => 6, 'x' => 30, 'y' => 50, 'label' => 'VOL'],
                    ['id' => 7, 'x' => 50, 'y' => 45, 'label' => 'MC'],
                    ['id' => 8, 'x' => 70, 'y' => 50, 'label' => 'VOL'],
                    ['id' => 9, 'x' => 20, 'y' => 20, 'label' => 'PE'],
                    ['id' => 10, 'x' => 50, 'y' => 15, 'label' => 'CA'],
                    ['id' => 11, 'x' => 80, 'y' => 20, 'label' => 'PD']
                ]),
                'ativa' => true
            ],
            [
                'usuario_id' => $usuarioTecnico->id,
                'nome' => 'Contra-Ataque Veloz',
                'formacao' => '4-4-2',
                'descricao' => 'Tática para jogos fora de casa contra times ofensivos. Defesa sólida com transições rápidas.',
                'instrucoes_ataque' => 'Após recuperar a bola, lançamento longo para os atacantes. Meias acompanham pelo meio. Laterais só sobem em vantagem numérica.',
                'instrucoes_defesa' => 'Bloco baixo, linhas de 4 bem compactas. Zagueiros não saem da área. Volantes fecham os espaços centrais.',
                'jogadas_ensaiadas' => 'Lateral longo para o atacante de referência disputar. Escanteio na primeira trave com desvio.',
                'posicoes_jogadores' => json_encode([
                    ['id' => 1, 'x' => 50, 'y' => 90, 'label' => 'GK'],
                    ['id' => 2, 'x' => 15, 'y' => 72, 'label' => 'LD'],
                    ['id' => 3, 'x' => 38, 'y' => 78, 'label' => 'ZAG'],
                    ['id' => 4, 'x' => 62, 'y' => 78, 'label' => 'ZAG'],
                    ['id' => 5, 'x' => 85, 'y' => 72, 'label' => 'LE'],
                    ['id' => 6, 'x' => 20, 'y' => 55, 'label' => 'MD'],
                    ['id' => 7, 'x' => 40, 'y' => 58, 'label' => 'MC'],
                    ['id' => 8, 'x' => 60, 'y' => 58, 'label' => 'MC'],
                    ['id' => 9, 'x' => 80, 'y' => 55, 'label' => 'ME'],
                    ['id' => 10, 'x' => 40, 'y' => 25, 'label' => 'ATA'],
                    ['id' => 11, 'x' => 60, 'y' => 25, 'label' => 'ATA']
                ]),
                'ativa' => true
            ],
            [
                'usuario_id' => $usuarioTecnico->id,
                'nome' => 'Pressão Alta',
                'formacao' => '4-2-3-1',
                'descricao' => 'Sistema de pressão intensa no campo adversário. Para jogos decisivos onde precisamos do resultado.',
                'instrucoes_ataque' => 'Pressão imediata na saída de bola adversária. Meias marcam os volantes. Atacante marca os zagueiros.',
                'instrucoes_defesa' => 'Linha alta, impedimento ativo. Zagueiros preparados para cobrir espaço nas costas.',
                'jogadas_ensaiadas' => 'Cobrança de falta com bola parada no segundo poste. Escanteio com movimentação cruzada.',
                'posicoes_jogadores' => null,
                'ativa' => false
            ]
        ];

        foreach ($taticas as $tatica) {
            $tatica['created_at'] = now();
            $tatica['updated_at'] = now();
            DB::table('taticas')->insert($tatica);
        }

        // ==================== PATROCÍNIOS ====================
        echo "Criando patrocínios...\n";
        
        $patrocinios = [
            [
                'empresa' => 'Nike Brasil',
                'contato' => 'Roberto Almeida',
                'telefone' => '(11) 3333-4444',
                'email' => 'roberto.almeida@nike.com.br',
                'valor_contrato' => 500000.00,
                'data_inicio' => '2025-01-01',
                'data_fim' => '2027-12-31',
                'tipo' => 'PRINCIPAL',
                'status' => 'ATIVO',
                'descricao' => 'Fornecimento de material esportivo completo: uniformes, chuteiras e equipamentos de treino.',
                'contrapartidas' => 'Logo na camisa (frontal), placas de publicidade, presença em eventos da marca.'
            ],
            [
                'empresa' => 'Banco do Esporte',
                'contato' => 'Maria Silva',
                'telefone' => '(11) 4444-5555',
                'email' => 'maria.silva@bancoesporte.com.br',
                'valor_contrato' => 300000.00,
                'data_inicio' => '2025-03-01',
                'data_fim' => '2026-02-28',
                'tipo' => 'SECUNDARIO',
                'status' => 'ATIVO',
                'descricao' => 'Patrocínio financeiro com direito a publicidade.',
                'contrapartidas' => 'Logo nas mangas, naming rights do CT, ações de marketing conjuntas.'
            ],
            [
                'empresa' => 'Supermercados União',
                'contato' => 'Carlos Santos',
                'telefone' => '(11) 5555-6666',
                'email' => 'carlos@uniao.com.br',
                'valor_contrato' => 150000.00,
                'data_inicio' => '2025-06-01',
                'data_fim' => '2025-12-31',
                'tipo' => 'SECUNDARIO',
                'status' => 'ATIVO',
                'descricao' => 'Patrocínio para alimentação do elenco e categorias de base.',
                'contrapartidas' => 'Logo nas costas da camisa, posts em redes sociais.'
            ],
            [
                'empresa' => 'Construtora Horizonte',
                'contato' => 'Ana Paula',
                'telefone' => '(11) 6666-7777',
                'email' => 'ana@horizonte.com.br',
                'valor_contrato' => 100000.00,
                'data_inicio' => '2025-01-01',
                'data_fim' => '2025-06-30',
                'tipo' => 'PONTUAL',
                'status' => 'ENCERRADO',
                'descricao' => 'Patrocínio para reforma do vestiário.',
                'contrapartidas' => 'Placa de agradecimento no vestiário, menção em entrevistas.'
            ]
        ];

        foreach ($patrocinios as $patrocinio) {
            $patrocinio['created_at'] = now();
            $patrocinio['updated_at'] = now();
            DB::table('patrocinios')->insert($patrocinio);
        }

        // ==================== RECEITAS ====================
        echo "Criando receitas...\n";
        
        $receitas = [
            ['descricao' => 'Parcela Patrocínio Nike - Dezembro', 'valor' => 41666.67, 'data' => '2025-12-01', 'categoria' => 'PATROCINIO', 'status' => 'RECEBIDO'],
            ['descricao' => 'Parcela Banco do Esporte - Dezembro', 'valor' => 25000.00, 'data' => '2025-12-01', 'categoria' => 'PATROCINIO', 'status' => 'RECEBIDO'],
            ['descricao' => 'Parcela Supermercados União - Dezembro', 'valor' => 21428.57, 'data' => '2025-12-01', 'categoria' => 'PATROCINIO', 'status' => 'PENDENTE'],
            ['descricao' => 'Bilheteria - Jogo vs Sport Club', 'valor' => 45000.00, 'data' => '2025-11-25', 'categoria' => 'BILHETERIA', 'status' => 'RECEBIDO'],
            ['descricao' => 'Bilheteria - Jogo vs Atlético Regional', 'valor' => 38000.00, 'data' => '2025-11-18', 'categoria' => 'BILHETERIA', 'status' => 'RECEBIDO'],
            ['descricao' => 'Mensalidades Sócio Torcedor - Novembro', 'valor' => 85000.00, 'data' => '2025-11-30', 'categoria' => 'MENSALIDADES', 'status' => 'RECEBIDO'],
            ['descricao' => 'Premiação Campeonato Estadual', 'valor' => 120000.00, 'data' => '2025-11-20', 'categoria' => 'PREMIACOES', 'status' => 'RECEBIDO'],
            ['descricao' => 'Venda de Produtos Oficiais - Novembro', 'valor' => 32000.00, 'data' => '2025-11-30', 'categoria' => 'VENDAS', 'status' => 'RECEBIDO'],
            ['descricao' => 'Parcela Patrocínio Nike - Novembro', 'valor' => 41666.67, 'data' => '2025-11-01', 'categoria' => 'PATROCINIO', 'status' => 'RECEBIDO'],
            ['descricao' => 'Aluguel de Espaço Publicitário', 'valor' => 15000.00, 'data' => '2025-11-15', 'categoria' => 'OUTROS', 'status' => 'RECEBIDO']
        ];

        foreach ($receitas as $receita) {
            $receita['created_at'] = now();
            $receita['updated_at'] = now();
            DB::table('receitas')->insert($receita);
        }

        // ==================== DESPESAS ====================
        echo "Criando despesas...\n";
        
        $despesas = [
            ['descricao' => 'Folha de Pagamento - Novembro', 'valor' => 280000.00, 'data' => '2025-11-30', 'data_vencimento' => '2025-12-05', 'categoria' => 'SALARIOS', 'status' => 'PAGO', 'fornecedor' => 'Folha Interna'],
            ['descricao' => 'Folha de Pagamento - Dezembro', 'valor' => 280000.00, 'data' => '2025-12-01', 'data_vencimento' => '2026-01-05', 'categoria' => 'SALARIOS', 'status' => 'PENDENTE', 'fornecedor' => 'Folha Interna'],
            ['descricao' => 'Manutenção CT - Gramado', 'valor' => 15000.00, 'data' => '2025-11-20', 'data_vencimento' => '2025-11-25', 'categoria' => 'INFRAESTRUTURA', 'status' => 'PAGO', 'fornecedor' => 'Verde Campos Ltda'],
            ['descricao' => 'Energia Elétrica - CT', 'valor' => 8500.00, 'data' => '2025-11-15', 'data_vencimento' => '2025-11-20', 'categoria' => 'INFRAESTRUTURA', 'status' => 'PAGO', 'fornecedor' => 'Eletropaulo'],
            ['descricao' => 'Equipamentos de Academia', 'valor' => 45000.00, 'data' => '2025-11-10', 'data_vencimento' => '2025-12-10', 'categoria' => 'EQUIPAMENTOS', 'status' => 'PENDENTE', 'fornecedor' => 'FitPro Equipamentos'],
            ['descricao' => 'Viagem - Jogo fora (Curitiba)', 'valor' => 35000.00, 'data' => '2025-11-22', 'data_vencimento' => '2025-11-22', 'categoria' => 'VIAGENS', 'status' => 'PAGO', 'fornecedor' => 'Agência Esporte Travel'],
            ['descricao' => 'Alimentação CT - Novembro', 'valor' => 22000.00, 'data' => '2025-11-30', 'data_vencimento' => '2025-12-05', 'categoria' => 'ALIMENTACAO', 'status' => 'PAGO', 'fornecedor' => 'Restaurante do Esporte'],
            ['descricao' => 'Exames Médicos Periódicos', 'valor' => 18000.00, 'data' => '2025-11-15', 'data_vencimento' => '2025-11-30', 'categoria' => 'SAUDE', 'status' => 'PAGO', 'fornecedor' => 'Clínica Atleta'],
            ['descricao' => 'Produção de Conteúdo - Redes Sociais', 'valor' => 12000.00, 'data' => '2025-11-01', 'data_vencimento' => '2025-11-10', 'categoria' => 'MARKETING', 'status' => 'PAGO', 'fornecedor' => 'Digital Sports Agency'],
            ['descricao' => 'INSS e FGTS - Novembro', 'valor' => 95000.00, 'data' => '2025-11-30', 'data_vencimento' => '2025-12-07', 'categoria' => 'IMPOSTOS', 'status' => 'PENDENTE', 'fornecedor' => 'Receita Federal']
        ];

        foreach ($despesas as $despesa) {
            $despesa['created_at'] = now();
            $despesa['updated_at'] = now();
            DB::table('despesas')->insert($despesa);
        }

        // ==================== TREINOS ====================
        echo "Criando treinos...\n";
        
        $treinos = [
            [
                'data' => '2025-12-02',
                'horario' => '09:00:00',
                'tipo' => 'TATICO',
                'descricao' => 'Treino tático com foco em posse de bola e transições.',
                'local' => 'Campo Principal - CT',
                'duracao_minutos' => 90
            ],
            [
                'data' => '2025-12-03',
                'horario' => '08:30:00',
                'tipo' => 'FISICO',
                'descricao' => 'Treino físico: resistência e força.',
                'local' => 'Academia - CT',
                'duracao_minutos' => 120
            ],
            [
                'data' => '2025-12-04',
                'horario' => '09:00:00',
                'tipo' => 'TECNICO',
                'descricao' => 'Trabalho técnico: passes, finalizações e cruzamentos.',
                'local' => 'Campo 2 - CT',
                'duracao_minutos' => 90
            ],
            [
                'data' => '2025-12-05',
                'horario' => '10:00:00',
                'tipo' => 'TATICO',
                'descricao' => 'Ensaio de jogadas de bola parada.',
                'local' => 'Campo Principal - CT',
                'duracao_minutos' => 60
            ],
            [
                'data' => '2025-12-06',
                'horario' => '09:00:00',
                'tipo' => 'RECREATIVO',
                'descricao' => 'Rachão entre os jogadores para descontrair.',
                'local' => 'Campo 2 - CT',
                'duracao_minutos' => 60
            ]
        ];

        foreach ($treinos as $treino) {
            $treino['created_at'] = now();
            $treino['updated_at'] = now();
            DB::table('treinos')->insert($treino);
        }

        // ==================== PARTIDAS ====================
        echo "Criando partidas...\n";
        
        $partidas = [
            [
                'adversario' => 'Sport Club Ribeirão',
                'data' => '2025-12-08',
                'horario' => '16:00:00',
                'local' => 'Estádio Municipal',
                'tipo' => 'CAMPEONATO',
                'competicao' => 'Campeonato Estadual - 2ª Fase',
                'mandante' => true,
                'placar_clube' => null,
                'placar_adversario' => null,
                'observacoes' => 'Jogo decisivo para classificação às semifinais.'
            ],
            [
                'adversario' => 'Atlético Regional',
                'data' => '2025-11-25',
                'horario' => '19:30:00',
                'local' => 'Estádio Municipal',
                'tipo' => 'CAMPEONATO',
                'competicao' => 'Campeonato Estadual - 1ª Fase',
                'mandante' => true,
                'placar_clube' => 3,
                'placar_adversario' => 1,
                'observacoes' => 'Vitória importante. Gols: Thiago (2) e Vinícius.'
            ],
            [
                'adversario' => 'Esporte Clube União',
                'data' => '2025-11-18',
                'horario' => '16:00:00',
                'local' => 'Arena União',
                'tipo' => 'CAMPEONATO',
                'competicao' => 'Campeonato Estadual - 1ª Fase',
                'mandante' => false,
                'placar_clube' => 1,
                'placar_adversario' => 1,
                'observacoes' => 'Empate fora de casa. Gol: Felipe Costa.'
            ],
            [
                'adversario' => 'FC Metropolitano',
                'data' => '2025-12-15',
                'horario' => '20:00:00',
                'local' => 'Estádio Municipal',
                'tipo' => 'AMISTOSO',
                'competicao' => 'Amistoso de Preparação',
                'mandante' => true,
                'placar_clube' => null,
                'placar_adversario' => null,
                'observacoes' => 'Amistoso de preparação para a próxima fase.'
            ]
        ];

        foreach ($partidas as $partida) {
            $partida['created_at'] = now();
            $partida['updated_at'] = now();
            DB::table('partidas')->insert($partida);
        }

        // ==================== EVENTOS (CALENDÁRIO) ====================
        echo "Criando eventos do calendário...\n";
        
        $eventos = [
            [
                'titulo' => 'Jogo - Sport Club Ribeirão',
                'descricao' => 'Campeonato Estadual - 2ª Fase. Jogo decisivo em casa.',
                'data_inicio' => '2025-12-08 16:00:00',
                'data_fim' => '2025-12-08 18:00:00',
                'tipo' => 'JOGO',
                'local' => 'Estádio Municipal',
                'cor' => '#dc3545',
                'lembrete' => true,
                'lembrete_minutos' => 1440,
                'usuario_id' => $usuarioTecnico->id
            ],
            [
                'titulo' => 'Treino Tático',
                'descricao' => 'Preparação para o jogo de domingo.',
                'data_inicio' => '2025-12-02 09:00:00',
                'data_fim' => '2025-12-02 10:30:00',
                'tipo' => 'TREINO',
                'local' => 'CT - Campo Principal',
                'cor' => '#198754',
                'lembrete' => true,
                'lembrete_minutos' => 60,
                'usuario_id' => $usuarioTecnico->id
            ],
            [
                'titulo' => 'Exames Periódicos - Goleiros',
                'descricao' => 'Avaliação cardiológica dos goleiros.',
                'data_inicio' => '2025-12-10 08:00:00',
                'data_fim' => '2025-12-10 12:00:00',
                'tipo' => 'EXAME',
                'local' => 'Clínica Atleta',
                'cor' => '#0dcaf0',
                'lembrete' => true,
                'lembrete_minutos' => 1440,
                'usuario_id' => $usuarioMedico->id
            ],
            [
                'titulo' => 'Reunião Diretoria',
                'descricao' => 'Planejamento financeiro para 2026.',
                'data_inicio' => '2025-12-05 14:00:00',
                'data_fim' => '2025-12-05 16:00:00',
                'tipo' => 'REUNIAO',
                'local' => 'Sala de Reuniões - CT',
                'cor' => '#6c757d',
                'lembrete' => true,
                'lembrete_minutos' => 60,
                'usuario_id' => DB::table('usuarios')->where('perfil', 'DIRETOR_FINANCEIRO')->first()->id
            ],
            [
                'titulo' => 'Treino Físico',
                'descricao' => 'Trabalho de resistência e força.',
                'data_inicio' => '2025-12-03 08:30:00',
                'data_fim' => '2025-12-03 10:30:00',
                'tipo' => 'TREINO',
                'local' => 'Academia - CT',
                'cor' => '#198754',
                'lembrete' => false,
                'lembrete_minutos' => null,
                'usuario_id' => $usuarioPreparador->id
            ],
            [
                'titulo' => 'Amistoso - FC Metropolitano',
                'descricao' => 'Jogo de preparação.',
                'data_inicio' => '2025-12-15 20:00:00',
                'data_fim' => '2025-12-15 22:00:00',
                'tipo' => 'JOGO',
                'local' => 'Estádio Municipal',
                'cor' => '#ffc107',
                'lembrete' => true,
                'lembrete_minutos' => 1440,
                'usuario_id' => $usuarioTecnico->id
            ]
        ];

        foreach ($eventos as $evento) {
            $evento['created_at'] = now();
            $evento['updated_at'] = now();
            DB::table('eventos')->insert($evento);
        }

        // ==================== NOTIFICAÇÕES ====================
        echo "Criando notificações...\n";
        
        $notificacoes = [
            [
                'usuario_id' => $usuarioTecnico->id,
                'titulo' => 'Jogador Lesionado',
                'mensagem' => 'Gabriel Nascimento foi diagnosticado com lesão muscular e está fora por 3 semanas.',
                'tipo' => 'LESAO',
                'lida' => false
            ],
            [
                'usuario_id' => $usuarioMedico->id,
                'titulo' => 'Exames Pendentes',
                'mensagem' => 'Os goleiros Carlos Eduardo e João Victor precisam realizar exames cardiológicos.',
                'tipo' => 'EXAME',
                'lida' => false
            ],
            [
                'usuario_id' => DB::table('usuarios')->where('perfil', 'DIRETOR_FINANCEIRO')->first()->id,
                'titulo' => 'Pagamento Pendente',
                'mensagem' => 'O pagamento dos equipamentos de academia vence em 10/12.',
                'tipo' => 'FINANCEIRO',
                'lida' => false
            ],
            [
                'usuario_id' => $usuarioPreparador->id,
                'titulo' => 'Atleta em Recuperação',
                'mensagem' => 'Henrique Dias completou mais uma etapa da fisioterapia. Previsão de retorno: Fevereiro/2026.',
                'tipo' => 'RECUPERACAO',
                'lida' => true
            ]
        ];

        foreach ($notificacoes as $notificacao) {
            $notificacao['created_at'] = now();
            $notificacao['updated_at'] = now();
            DB::table('notificacoes')->insert($notificacao);
        }

        echo "\n✅ Dados de demonstração criados com sucesso!\n";
        echo "\n📧 Usuários criados (senha: 123456):\n";
        echo "   - tecnico@clubefc.com (TECNICO)\n";
        echo "   - medico@clubefc.com (MEDICO)\n";
        echo "   - preparador@clubefc.com (PREPARADOR)\n";
        echo "   - financeiro@clubefc.com (DIRETOR_FINANCEIRO)\n";
    }
}


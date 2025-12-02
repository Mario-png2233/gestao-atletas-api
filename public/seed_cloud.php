<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

function getEnvVar($key, $default = null) {
    $value = $_ENV[$key] ?? $_SERVER[$key] ?? getenv($key) ?? null;
    return $value !== null && $value !== false ? $value : $default;
}

$host = getEnvVar('DB_HOST', 'localhost');
$port = getEnvVar('DB_PORT', '3306');
$database = getEnvVar('DB_DATABASE', 'railway');
$username = getEnvVar('DB_USERNAME', 'root');
$password = getEnvVar('DB_PASSWORD', '');

try {
    $pdo = new PDO(
        "mysql:host={$host};port={$port};dbname={$database}",
        $username,
        $password,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    
    $results = ['status' => 'starting', 'steps' => []];
    
    // 1. Criar usuários de exemplo
    $usuarios = [
        ['email' => 'medico@clube.com', 'senha' => password_hash('123456', PASSWORD_BCRYPT), 'perfil' => 'MEDICO'],
        ['email' => 'tecnico@clube.com', 'senha' => password_hash('123456', PASSWORD_BCRYPT), 'perfil' => 'TECNICO'],
        ['email' => 'preparador@clube.com', 'senha' => password_hash('123456', PASSWORD_BCRYPT), 'perfil' => 'PREPARADOR'],
        ['email' => 'financeiro@clube.com', 'senha' => password_hash('123456', PASSWORD_BCRYPT), 'perfil' => 'DIRETOR_FINANCEIRO'],
    ];
    
    foreach ($usuarios as $u) {
        $stmt = $pdo->prepare("INSERT IGNORE INTO usuarios (email, senha, perfil, tentativas_login, created_at, updated_at) VALUES (?, ?, ?, 0, NOW(), NOW())");
        $stmt->execute([$u['email'], $u['senha'], $u['perfil']]);
    }
    $results['steps'][] = 'Usuarios criados';
    
    // 2. Criar atletas (11 jogadores - time completo)
    $atletas = [
        ['nome' => 'Carlos Silva', 'data_nascimento' => '1995-03-15', 'posicao' => 'Goleiro', 'altura' => 1.88, 'peso' => 82.0, 'telefone_contato' => '11999990001'],
        ['nome' => 'Rafael Santos', 'data_nascimento' => '1998-07-22', 'posicao' => 'Lateral Direito', 'altura' => 1.76, 'peso' => 72.0, 'telefone_contato' => '11999990002'],
        ['nome' => 'Andre Oliveira', 'data_nascimento' => '1996-01-10', 'posicao' => 'Zagueiro', 'altura' => 1.85, 'peso' => 80.0, 'telefone_contato' => '11999990003'],
        ['nome' => 'Lucas Mendes', 'data_nascimento' => '1997-05-28', 'posicao' => 'Zagueiro', 'altura' => 1.87, 'peso' => 82.0, 'telefone_contato' => '11999990004'],
        ['nome' => 'Bruno Costa', 'data_nascimento' => '1999-11-03', 'posicao' => 'Lateral Esquerdo', 'altura' => 1.74, 'peso' => 70.0, 'telefone_contato' => '11999990005'],
        ['nome' => 'Pedro Almeida', 'data_nascimento' => '1998-09-14', 'posicao' => 'Volante', 'altura' => 1.80, 'peso' => 76.0, 'telefone_contato' => '11999990006'],
        ['nome' => 'Thiago Ferreira', 'data_nascimento' => '1997-12-20', 'posicao' => 'Meia', 'altura' => 1.75, 'peso' => 71.0, 'telefone_contato' => '11999990007'],
        ['nome' => 'Gabriel Souza', 'data_nascimento' => '2000-04-08', 'posicao' => 'Meia', 'altura' => 1.72, 'peso' => 68.0, 'telefone_contato' => '11999990008'],
        ['nome' => 'Matheus Lima', 'data_nascimento' => '1999-06-17', 'posicao' => 'Ponta Direita', 'altura' => 1.73, 'peso' => 69.0, 'telefone_contato' => '11999990009'],
        ['nome' => 'Felipe Rodrigues', 'data_nascimento' => '1998-02-25', 'posicao' => 'Ponta Esquerda', 'altura' => 1.71, 'peso' => 67.0, 'telefone_contato' => '11999990010'],
        ['nome' => 'Diego Martins', 'data_nascimento' => '1996-08-30', 'posicao' => 'Centroavante', 'altura' => 1.82, 'peso' => 78.0, 'telefone_contato' => '11999990011'],
    ];
    
    foreach ($atletas as $a) {
        $stmt = $pdo->prepare("INSERT IGNORE INTO atletas (nome, data_nascimento, posicao, altura, peso, status, telefone_contato, created_at, updated_at) VALUES (?, ?, ?, ?, ?, 'ATIVO', ?, NOW(), NOW())");
        $stmt->execute([$a['nome'], $a['data_nascimento'], $a['posicao'], $a['altura'], $a['peso'], $a['telefone_contato']]);
    }
    $results['steps'][] = '11 Atletas criados';
    
    // 3. Criar partidas
    $partidas = [
        ['adversario' => 'Flamengo', 'data_hora' => '2025-12-10 16:00:00', 'local' => 'Maracana', 'tipo' => 'CAMPEONATO', 'competicao' => 'Brasileirao'],
        ['adversario' => 'Palmeiras', 'data_hora' => '2025-12-15 19:00:00', 'local' => 'Allianz Parque', 'tipo' => 'CAMPEONATO', 'competicao' => 'Brasileirao'],
        ['adversario' => 'Santos', 'data_hora' => '2025-12-20 21:00:00', 'local' => 'Vila Belmiro', 'tipo' => 'AMISTOSO', 'competicao' => 'Amistoso'],
    ];
    
    foreach ($partidas as $p) {
        $stmt = $pdo->prepare("INSERT IGNORE INTO partidas (adversario, data_hora, local, tipo, competicao, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())");
        $stmt->execute([$p['adversario'], $p['data_hora'], $p['local'], $p['tipo'], $p['competicao']]);
    }
    $results['steps'][] = 'Partidas criadas';
    
    // 4. Criar treinos
    $treinos = [
        ['data_hora' => '2025-12-05 09:00:00', 'tipo_treino' => 'TATICO', 'local' => 'CT do Clube', 'descricao' => 'Treino tatico com foco em jogadas ensaiadas', 'duracao_minutos' => 90],
        ['data_hora' => '2025-12-06 09:00:00', 'tipo_treino' => 'FISICO', 'local' => 'CT do Clube', 'descricao' => 'Treino fisico de resistencia', 'duracao_minutos' => 120],
        ['data_hora' => '2025-12-07 09:00:00', 'tipo_treino' => 'TECNICO', 'local' => 'CT do Clube', 'descricao' => 'Treino tecnico de finalizacao', 'duracao_minutos' => 90],
    ];
    
    foreach ($treinos as $t) {
        $stmt = $pdo->prepare("INSERT IGNORE INTO treinos (data_hora, tipo_treino, local, descricao, duracao_minutos, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())");
        $stmt->execute([$t['data_hora'], $t['tipo_treino'], $t['local'], $t['descricao'], $t['duracao_minutos']]);
    }
    $results['steps'][] = 'Treinos criados';
    
    // 5. Criar patrocínios
    $patrocinios = [
        ['empresa' => 'Nike', 'valor_contrato' => 500000.00, 'data_inicio' => '2025-01-01', 'data_fim' => '2025-12-31', 'tipo' => 'MATERIAL_ESPORTIVO', 'status' => 'ATIVO', 'contato' => 'Joao Silva', 'email' => 'joao@nike.com', 'telefone' => '11999001234'],
        ['empresa' => 'Banco do Brasil', 'valor_contrato' => 300000.00, 'data_inicio' => '2025-01-01', 'data_fim' => '2025-12-31', 'tipo' => 'PRINCIPAL', 'status' => 'ATIVO', 'contato' => 'Maria Santos', 'email' => 'maria@bb.com', 'telefone' => '11999005678'],
        ['empresa' => 'Coca-Cola', 'valor_contrato' => 150000.00, 'data_inicio' => '2025-06-01', 'data_fim' => '2025-12-31', 'tipo' => 'SECUNDARIO', 'status' => 'ATIVO', 'contato' => 'Pedro Lima', 'email' => 'pedro@cocacola.com', 'telefone' => '11999009012'],
    ];
    
    foreach ($patrocinios as $p) {
        $stmt = $pdo->prepare("INSERT IGNORE INTO patrocinios (empresa, valor_contrato, data_inicio, data_fim, tipo, status, contato, email, telefone, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())");
        $stmt->execute([$p['empresa'], $p['valor_contrato'], $p['data_inicio'], $p['data_fim'], $p['tipo'], $p['status'], $p['contato'], $p['email'], $p['telefone']]);
    }
    $results['steps'][] = 'Patrocinios criados';
    
    // 6. Criar despesas
    $despesas = [
        ['descricao' => 'Salarios dos jogadores', 'valor' => 250000.00, 'data' => '2025-12-01', 'categoria' => 'SALARIOS', 'status' => 'PAGO'],
        ['descricao' => 'Manutencao do CT', 'valor' => 15000.00, 'data' => '2025-12-01', 'categoria' => 'INFRAESTRUTURA', 'status' => 'PAGO'],
        ['descricao' => 'Equipamentos de treino', 'valor' => 8000.00, 'data' => '2025-12-02', 'categoria' => 'EQUIPAMENTOS', 'status' => 'PENDENTE'],
        ['descricao' => 'Viagem - Jogo contra Flamengo', 'valor' => 25000.00, 'data' => '2025-12-10', 'categoria' => 'VIAGENS', 'status' => 'PENDENTE'],
    ];
    
    foreach ($despesas as $d) {
        $stmt = $pdo->prepare("INSERT IGNORE INTO despesas (descricao, valor, data, categoria, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())");
        $stmt->execute([$d['descricao'], $d['valor'], $d['data'], $d['categoria'], $d['status']]);
    }
    $results['steps'][] = 'Despesas criadas';
    
    // 7. Criar receitas
    $receitas = [
        ['descricao' => 'Bilheteria - Jogo em casa', 'valor' => 120000.00, 'data' => '2025-11-25', 'categoria' => 'BILHETERIA', 'status' => 'RECEBIDO'],
        ['descricao' => 'Venda de camisas', 'valor' => 45000.00, 'data' => '2025-11-28', 'categoria' => 'MERCHANDISING', 'status' => 'RECEBIDO'],
        ['descricao' => 'Cota TV - Dezembro', 'valor' => 200000.00, 'data' => '2025-12-01', 'categoria' => 'DIREITOS_TV', 'status' => 'PENDENTE'],
    ];
    
    foreach ($receitas as $r) {
        $stmt = $pdo->prepare("INSERT IGNORE INTO receitas (descricao, valor, data, categoria, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())");
        $stmt->execute([$r['descricao'], $r['valor'], $r['data'], $r['categoria'], $r['status']]);
    }
    $results['steps'][] = 'Receitas criadas';
    
    // 8. Criar táticas
    $stmt = $pdo->query("SELECT id FROM usuarios WHERE perfil = 'TECNICO' LIMIT 1");
    $tecnico = $stmt->fetch(PDO::FETCH_ASSOC);
    $tecnicoId = $tecnico ? $tecnico['id'] : 1;
    
    $taticas = [
        ['nome' => '4-3-3 Ofensivo', 'descricao' => 'Formacao ofensiva com tres atacantes e meio-campo forte', 'formacao' => '4-3-3'],
        ['nome' => '4-4-2 Classico', 'descricao' => 'Formacao equilibrada com duas linhas de quatro', 'formacao' => '4-4-2'],
        ['nome' => '3-5-2 Compacto', 'descricao' => 'Formacao com tres zagueiros e alas', 'formacao' => '3-5-2'],
    ];
    
    foreach ($taticas as $t) {
        $stmt = $pdo->prepare("INSERT IGNORE INTO taticas (nome, descricao, formacao, usuario_id, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())");
        $stmt->execute([$t['nome'], $t['descricao'], $t['formacao'], $tecnicoId]);
    }
    $results['steps'][] = 'Taticas criadas';
    
    // 9. Criar eventos no calendário
    $eventos = [
        ['titulo' => 'Jogo vs Flamengo', 'descricao' => 'Campeonato Brasileiro', 'data_inicio' => '2025-12-10 16:00:00', 'data_fim' => '2025-12-10 18:00:00', 'tipo' => 'JOGO', 'local' => 'Maracana'],
        ['titulo' => 'Treino Tatico', 'descricao' => 'Preparacao para o jogo', 'data_inicio' => '2025-12-09 09:00:00', 'data_fim' => '2025-12-09 11:00:00', 'tipo' => 'TREINO', 'local' => 'CT do Clube'],
        ['titulo' => 'Exames Medicos', 'descricao' => 'Check-up mensal do elenco', 'data_inicio' => '2025-12-08 08:00:00', 'data_fim' => '2025-12-08 12:00:00', 'tipo' => 'EXAME', 'local' => 'Centro Medico'],
    ];
    
    foreach ($eventos as $e) {
        $stmt = $pdo->prepare("INSERT IGNORE INTO eventos (titulo, descricao, data_inicio, data_fim, tipo, local, usuario_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())");
        $stmt->execute([$e['titulo'], $e['descricao'], $e['data_inicio'], $e['data_fim'], $e['tipo'], $e['local'], $tecnicoId]);
    }
    $results['steps'][] = 'Eventos criados';
    
    // Contar registros
    $counts = [];
    $tables = ['usuarios', 'atletas', 'partidas', 'treinos', 'patrocinios', 'despesas', 'receitas', 'taticas', 'eventos'];
    foreach ($tables as $table) {
        $stmt = $pdo->query("SELECT COUNT(*) as total FROM {$table}");
        $counts[$table] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
    }
    
    $results['status'] = 'SUCCESS';
    $results['counts'] = $counts;
    $results['message'] = 'Dados de exemplo inseridos com sucesso!';
    $results['logins'] = [
        'medico@clube.com / 123456',
        'tecnico@clube.com / 123456',
        'preparador@clube.com / 123456',
        'financeiro@clube.com / 123456'
    ];
    
    echo json_encode($results, JSON_PRETTY_PRINT);
    
} catch (PDOException $e) {
    echo json_encode([
        'status' => 'ERROR',
        'error' => $e->getMessage()
    ], JSON_PRETTY_PRINT);
}

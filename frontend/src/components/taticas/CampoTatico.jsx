import { useState, useRef, useEffect } from 'react';
import { FaSave, FaUndo, FaFutbol } from 'react-icons/fa';

// Formações padrão com posições dos jogadores (x, y em %)
const FORMACOES = {
  '4-4-2': [
    { id: 1, x: 50, y: 90, label: 'GK' },
    { id: 2, x: 15, y: 70, label: 'LD' },
    { id: 3, x: 35, y: 75, label: 'ZAG' },
    { id: 4, x: 65, y: 75, label: 'ZAG' },
    { id: 5, x: 85, y: 70, label: 'LE' },
    { id: 6, x: 15, y: 45, label: 'MD' },
    { id: 7, x: 35, y: 50, label: 'MC' },
    { id: 8, x: 65, y: 50, label: 'MC' },
    { id: 9, x: 85, y: 45, label: 'ME' },
    { id: 10, x: 35, y: 20, label: 'ATA' },
    { id: 11, x: 65, y: 20, label: 'ATA' }
  ],
  '4-3-3': [
    { id: 1, x: 50, y: 90, label: 'GK' },
    { id: 2, x: 15, y: 70, label: 'LD' },
    { id: 3, x: 35, y: 75, label: 'ZAG' },
    { id: 4, x: 65, y: 75, label: 'ZAG' },
    { id: 5, x: 85, y: 70, label: 'LE' },
    { id: 6, x: 30, y: 50, label: 'VOL' },
    { id: 7, x: 50, y: 45, label: 'MC' },
    { id: 8, x: 70, y: 50, label: 'VOL' },
    { id: 9, x: 20, y: 20, label: 'PE' },
    { id: 10, x: 50, y: 15, label: 'CA' },
    { id: 11, x: 80, y: 20, label: 'PD' }
  ],
  '4-2-3-1': [
    { id: 1, x: 50, y: 90, label: 'GK' },
    { id: 2, x: 15, y: 70, label: 'LD' },
    { id: 3, x: 35, y: 75, label: 'ZAG' },
    { id: 4, x: 65, y: 75, label: 'ZAG' },
    { id: 5, x: 85, y: 70, label: 'LE' },
    { id: 6, x: 35, y: 55, label: 'VOL' },
    { id: 7, x: 65, y: 55, label: 'VOL' },
    { id: 8, x: 20, y: 35, label: 'MEI' },
    { id: 9, x: 50, y: 35, label: 'MEI' },
    { id: 10, x: 80, y: 35, label: 'MEI' },
    { id: 11, x: 50, y: 15, label: 'CA' }
  ],
  '3-5-2': [
    { id: 1, x: 50, y: 90, label: 'GK' },
    { id: 2, x: 25, y: 75, label: 'ZAG' },
    { id: 3, x: 50, y: 78, label: 'ZAG' },
    { id: 4, x: 75, y: 75, label: 'ZAG' },
    { id: 5, x: 10, y: 50, label: 'ALD' },
    { id: 6, x: 30, y: 55, label: 'VOL' },
    { id: 7, x: 50, y: 50, label: 'MC' },
    { id: 8, x: 70, y: 55, label: 'VOL' },
    { id: 9, x: 90, y: 50, label: 'ALE' },
    { id: 10, x: 35, y: 20, label: 'ATA' },
    { id: 11, x: 65, y: 20, label: 'ATA' }
  ],
  '3-4-3': [
    { id: 1, x: 50, y: 90, label: 'GK' },
    { id: 2, x: 25, y: 75, label: 'ZAG' },
    { id: 3, x: 50, y: 78, label: 'ZAG' },
    { id: 4, x: 75, y: 75, label: 'ZAG' },
    { id: 5, x: 15, y: 50, label: 'ALD' },
    { id: 6, x: 40, y: 55, label: 'MC' },
    { id: 7, x: 60, y: 55, label: 'MC' },
    { id: 8, x: 85, y: 50, label: 'ALE' },
    { id: 9, x: 20, y: 20, label: 'PE' },
    { id: 10, x: 50, y: 15, label: 'CA' },
    { id: 11, x: 80, y: 20, label: 'PD' }
  ],
  '5-3-2': [
    { id: 1, x: 50, y: 90, label: 'GK' },
    { id: 2, x: 10, y: 70, label: 'ALD' },
    { id: 3, x: 30, y: 75, label: 'ZAG' },
    { id: 4, x: 50, y: 78, label: 'ZAG' },
    { id: 5, x: 70, y: 75, label: 'ZAG' },
    { id: 6, x: 90, y: 70, label: 'ALE' },
    { id: 7, x: 30, y: 50, label: 'MC' },
    { id: 8, x: 50, y: 45, label: 'MC' },
    { id: 9, x: 70, y: 50, label: 'MC' },
    { id: 10, x: 35, y: 20, label: 'ATA' },
    { id: 11, x: 65, y: 20, label: 'ATA' }
  ],
  '4-1-4-1': [
    { id: 1, x: 50, y: 90, label: 'GK' },
    { id: 2, x: 15, y: 70, label: 'LD' },
    { id: 3, x: 35, y: 75, label: 'ZAG' },
    { id: 4, x: 65, y: 75, label: 'ZAG' },
    { id: 5, x: 85, y: 70, label: 'LE' },
    { id: 6, x: 50, y: 60, label: 'VOL' },
    { id: 7, x: 15, y: 40, label: 'MD' },
    { id: 8, x: 38, y: 45, label: 'MC' },
    { id: 9, x: 62, y: 45, label: 'MC' },
    { id: 10, x: 85, y: 40, label: 'ME' },
    { id: 11, x: 50, y: 15, label: 'CA' }
  ],
  '4-5-1': [
    { id: 1, x: 50, y: 90, label: 'GK' },
    { id: 2, x: 15, y: 70, label: 'LD' },
    { id: 3, x: 35, y: 75, label: 'ZAG' },
    { id: 4, x: 65, y: 75, label: 'ZAG' },
    { id: 5, x: 85, y: 70, label: 'LE' },
    { id: 6, x: 15, y: 45, label: 'MD' },
    { id: 7, x: 35, y: 55, label: 'VOL' },
    { id: 8, x: 50, y: 45, label: 'MC' },
    { id: 9, x: 65, y: 55, label: 'VOL' },
    { id: 10, x: 85, y: 45, label: 'ME' },
    { id: 11, x: 50, y: 15, label: 'CA' }
  ]
};

const CampoTatico = ({ formacao = '4-4-2', posicoes: posicoesIniciais, onSave, readOnly = false }) => {
  const canvasRef = useRef(null);
  const [jogadores, setJogadores] = useState([]);
  const [dragging, setDragging] = useState(null);
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 550 });

  // Inicializa jogadores baseado na formação ou posições salvas
  useEffect(() => {
    if (posicoesIniciais && Array.isArray(posicoesIniciais) && posicoesIniciais.length === 11) {
      setJogadores(posicoesIniciais);
    } else if (FORMACOES[formacao]) {
      setJogadores(FORMACOES[formacao]);
    }
  }, [formacao, posicoesIniciais]);

  // Desenha o campo
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const { width, height } = canvasSize;

    // Limpa canvas
    ctx.clearRect(0, 0, width, height);

    // Fundo do campo (verde)
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#2d8a3e');
    gradient.addColorStop(0.5, '#34a047');
    gradient.addColorStop(1, '#2d8a3e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Linhas do campo (branco)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 2;

    // Borda do campo
    const margin = 10;
    ctx.strokeRect(margin, margin, width - margin * 2, height - margin * 2);

    // Linha do meio
    ctx.beginPath();
    ctx.moveTo(margin, height / 2);
    ctx.lineTo(width - margin, height / 2);
    ctx.stroke();

    // Círculo central
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 50, 0, Math.PI * 2);
    ctx.stroke();

    // Ponto central
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 4, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();

    // Área grande superior
    const areaWidth = 150;
    const areaHeight = 70;
    ctx.strokeRect((width - areaWidth) / 2, margin, areaWidth, areaHeight);

    // Área pequena superior
    const areaSmallWidth = 80;
    const areaSmallHeight = 30;
    ctx.strokeRect((width - areaSmallWidth) / 2, margin, areaSmallWidth, areaSmallHeight);

    // Área grande inferior
    ctx.strokeRect((width - areaWidth) / 2, height - margin - areaHeight, areaWidth, areaHeight);

    // Área pequena inferior
    ctx.strokeRect((width - areaSmallWidth) / 2, height - margin - areaSmallHeight, areaSmallWidth, areaSmallHeight);

    // Semicírculos das áreas
    ctx.beginPath();
    ctx.arc(width / 2, margin + areaHeight, 35, 0, Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(width / 2, height - margin - areaHeight, 35, Math.PI, Math.PI * 2);
    ctx.stroke();

    // Escanteios
    const cornerRadius = 15;
    ctx.beginPath();
    ctx.arc(margin, margin, cornerRadius, 0, Math.PI / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(width - margin, margin, cornerRadius, Math.PI / 2, Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(margin, height - margin, cornerRadius, Math.PI * 1.5, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(width - margin, height - margin, cornerRadius, Math.PI, Math.PI * 1.5);
    ctx.stroke();

    // Desenha jogadores
    jogadores.forEach((jogador, index) => {
      const x = (jogador.x / 100) * width;
      const y = (jogador.y / 100) * height;

      // Sombra
      ctx.beginPath();
      ctx.arc(x + 2, y + 2, 18, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fill();

      // Círculo do jogador
      ctx.beginPath();
      ctx.arc(x, y, 18, 0, Math.PI * 2);
      const jogadorGradient = ctx.createRadialGradient(x - 5, y - 5, 0, x, y, 18);
      jogadorGradient.addColorStop(0, '#ffd700');
      jogadorGradient.addColorStop(1, '#ff8c00');
      ctx.fillStyle = jogadorGradient;
      ctx.fill();
      ctx.strokeStyle = '#8b4513';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Número do jogador
      ctx.fillStyle = '#000';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(jogador.id.toString(), x, y);

      // Label da posição
      ctx.fillStyle = 'white';
      ctx.font = 'bold 9px Arial';
      ctx.fillText(jogador.label, x, y + 28);
    });

  }, [jogadores, canvasSize]);

  // Funções de drag
  const getMousePos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / canvasSize.width) * 100,
      y: ((e.clientY - rect.top) / canvasSize.height) * 100
    };
  };

  const handleMouseDown = (e) => {
    if (readOnly) return;
    const pos = getMousePos(e);
    
    // Encontra jogador clicado
    const clicked = jogadores.findIndex(j => {
      const jx = j.x;
      const jy = j.y;
      const dist = Math.sqrt((pos.x - jx) ** 2 + (pos.y - jy) ** 2);
      return dist < 5; // 5% de tolerância
    });

    if (clicked !== -1) {
      setDragging(clicked);
    }
  };

  const handleMouseMove = (e) => {
    if (dragging === null || readOnly) return;
    const pos = getMousePos(e);
    
    setJogadores(prev => prev.map((j, i) => 
      i === dragging 
        ? { ...j, x: Math.max(5, Math.min(95, pos.x)), y: Math.max(5, Math.min(95, pos.y)) }
        : j
    ));
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  const resetFormacao = () => {
    if (FORMACOES[formacao]) {
      setJogadores(FORMACOES[formacao]);
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(jogadores);
    }
  };

  return (
    <div className="campo-tatico">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center gap-2">
          <FaFutbol className="text-success" />
          <span className="fw-bold">Formação: {formacao}</span>
        </div>
        {!readOnly && (
          <div className="btn-group btn-group-sm">
            <button className="btn btn-outline-secondary" onClick={resetFormacao} title="Resetar posições">
              <FaUndo className="me-1" /> Resetar
            </button>
            <button className="btn btn-success" onClick={handleSave} title="Salvar posições">
              <FaSave className="me-1" /> Salvar
            </button>
          </div>
        )}
      </div>
      
      <div className="d-flex justify-content-center">
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          style={{ 
            borderRadius: '8px', 
            cursor: readOnly ? 'default' : (dragging !== null ? 'grabbing' : 'grab'),
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>
      
      {!readOnly && (
        <p className="text-muted text-center mt-2 small">
          <i>Arraste os jogadores para reposicioná-los no campo</i>
        </p>
      )}
    </div>
  );
};

export default CampoTatico;


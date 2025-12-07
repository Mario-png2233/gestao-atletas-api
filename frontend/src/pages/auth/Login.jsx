import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Toast from '../../components/common/Toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [isRegister, setIsRegister] = useState(false);
  const [perfil, setPerfil] = useState('TECNICO');
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegister) {
        await register(email, password, perfil);
        setToast({ message: 'Cadastro realizado com sucesso!', type: 'success' });
      } else {
        await login(email, password);
        setToast({ message: 'Login realizado com sucesso!', type: 'success' });
      }
      setTimeout(() => navigate('/'), 500);
    } catch (error) {
      console.error('Erro de autenticação:', error);
      const errorMessage = error.response?.data?.error 
        || error.response?.data?.message 
        || error.message 
        || 'Erro ao processar solicitação';
      setToast({ message: errorMessage, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      
      <div className="card login-card shadow">
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <h2 className="fw-bold">Sistema de Gerenciamento de Atletas</h2>
            <p className="text-muted">{isRegister ? 'Criar nova conta' : 'Faça login para continuar'}</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Senha</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            {isRegister && (
              <div className="mb-3">
                <label className="form-label">Perfil</label>
                <select 
                  className="form-select"
                  value={perfil}
                  onChange={(e) => setPerfil(e.target.value)}
                >
                  <option value="TECNICO">Técnico (acesso a Táticas)</option>
                  <option value="MEDICO">Médico</option>
                  <option value="PREPARADOR">Preparador Físico</option>
                  <option value="DIRETOR_FINANCEIRO">Diretor Financeiro (acesso a Finanças)</option>
                </select>
                <small className="text-muted">
                  {perfil === 'TECNICO' && '→ Terá acesso ao módulo de Táticas'}
                  {perfil === 'DIRETOR_FINANCEIRO' && '→ Terá acesso ao módulo Financeiro'}
                </small>
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-primary w-100 py-2"
              disabled={loading}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2" />
              ) : null}
              {isRegister ? 'Cadastrar' : 'Entrar'}
            </button>
          </form>

          <div className="text-center mt-4">
            <button 
              className="btn btn-link text-decoration-none"
              onClick={() => setIsRegister(!isRegister)}
            >
              {isRegister ? 'Já tenho uma conta' : 'Criar nova conta'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

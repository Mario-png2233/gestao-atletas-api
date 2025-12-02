import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layout
import Layout from './components/common/Layout';

// Pages
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import AtletasList from './pages/atletas/AtletasList';
import AtletaForm from './pages/atletas/AtletaForm';
import AtletaDetails from './pages/atletas/AtletaDetails';
import LesoesList from './pages/lesoes/LesoesList';
import LesaoForm from './pages/lesoes/LesaoForm';
import ExamesList from './pages/exames/ExamesList';
import ExameForm from './pages/exames/ExameForm';
import PartidasList from './pages/partidas/PartidasList';
import TreinosList from './pages/treinos/TreinosList';
import NotificacoesList from './pages/notificacoes/NotificacoesList';
import Relatorios from './pages/relatorios/Relatorios';

// Novas páginas
import TaticasList from './pages/taticas/TaticasList';
import FinancasDashboard from './pages/financas/FinancasDashboard';
import PatrociniosList from './pages/financas/PatrociniosList';
import DespesasList from './pages/financas/DespesasList';
import ReceitasList from './pages/financas/ReceitasList';
import Calendario from './pages/calendario/Calendario';
import AvaliacaoFisica from './pages/avaliacoes/AvaliacaoFisica';

// Componente para rotas protegidas
const PrivateRoute = ({ children, allowedPerfis }) => {
  const { isAuthenticated, loading, user } = useAuth();
  
  if (loading) {
    return <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="spinner-border text-primary" role="status" />
    </div>;
  }
  
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  // Verifica se o perfil tem acesso
  if (allowedPerfis && !allowedPerfis.includes(user?.perfil)) {
    return <Navigate to="/" />;
  }
  
  return <Layout>{children}</Layout>;
};

// Componente para rota pública (login)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="spinner-border text-primary" role="status" />
    </div>;
  }
  
  return isAuthenticated() ? <Navigate to="/" /> : children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rota Pública */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          
          {/* Rotas Protegidas - Acesso Geral */}
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          
          {/* Atletas */}
          <Route path="/atletas" element={<PrivateRoute><AtletasList /></PrivateRoute>} />
          <Route path="/atletas/novo" element={<PrivateRoute><AtletaForm /></PrivateRoute>} />
          <Route path="/atletas/:id" element={<PrivateRoute><AtletaDetails /></PrivateRoute>} />
          <Route path="/atletas/:id/editar" element={<PrivateRoute><AtletaForm /></PrivateRoute>} />
          
          {/* Lesões */}
          <Route path="/lesoes" element={<PrivateRoute><LesoesList /></PrivateRoute>} />
          <Route path="/atletas/:atletaId/lesoes/nova" element={<PrivateRoute><LesaoForm /></PrivateRoute>} />
          
          {/* Exames */}
          <Route path="/exames" element={<PrivateRoute><ExamesList /></PrivateRoute>} />
          <Route path="/atletas/:atletaId/exames/novo" element={<PrivateRoute><ExameForm /></PrivateRoute>} />
          
          {/* Avaliação Física - MEDICO/PREPARADOR */}
          <Route path="/atletas/:atletaId/avaliacao-fisica" element={
            <PrivateRoute allowedPerfis={['MEDICO', 'PREPARADOR']}>
              <AvaliacaoFisica />
            </PrivateRoute>
          } />
          
          {/* Partidas */}
          <Route path="/partidas" element={<PrivateRoute><PartidasList /></PrivateRoute>} />
          
          {/* Treinos */}
          <Route path="/treinos" element={<PrivateRoute><TreinosList /></PrivateRoute>} />
          
          {/* Calendário */}
          <Route path="/calendario" element={<PrivateRoute><Calendario /></PrivateRoute>} />
          
          {/* Notificações */}
          <Route path="/notificacoes" element={<PrivateRoute><NotificacoesList /></PrivateRoute>} />
          
          {/* Relatórios */}
          <Route path="/relatorios" element={<PrivateRoute><Relatorios /></PrivateRoute>} />
          
          {/* TÁTICAS - Apenas TECNICO */}
          <Route path="/taticas" element={
            <PrivateRoute allowedPerfis={['TECNICO']}>
              <TaticasList />
            </PrivateRoute>
          } />
          
          {/* FINANÇAS - Apenas DIRETOR_FINANCEIRO */}
          <Route path="/financas" element={
            <PrivateRoute allowedPerfis={['DIRETOR_FINANCEIRO']}>
              <FinancasDashboard />
            </PrivateRoute>
          } />
          <Route path="/financas/patrocinios" element={
            <PrivateRoute allowedPerfis={['DIRETOR_FINANCEIRO']}>
              <PatrociniosList />
            </PrivateRoute>
          } />
          <Route path="/financas/despesas" element={
            <PrivateRoute allowedPerfis={['DIRETOR_FINANCEIRO']}>
              <DespesasList />
            </PrivateRoute>
          } />
          <Route path="/financas/receitas" element={
            <PrivateRoute allowedPerfis={['DIRETOR_FINANCEIRO']}>
              <ReceitasList />
            </PrivateRoute>
          } />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

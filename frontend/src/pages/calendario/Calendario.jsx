import { useState, useEffect } from 'react';
import { eventoService } from '../../services/eventoService';
import { FaPlus, FaChevronLeft, FaChevronRight, FaCalendarAlt, FaEdit, FaTrash } from 'react-icons/fa';
import Loading from '../../components/common/Loading';
import Toast from '../../components/common/Toast';
import ConfirmModal from '../../components/common/ConfirmModal';

const Calendario = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
  const [formData, setFormData] = useState({
    titulo: '', descricao: '', data_inicio: '', data_fim: '',
    tipo: 'OUTRO', local: '', cor: '#0d6efd', lembrete: false
  });

  useEffect(() => {
    loadEventos();
  }, [currentDate]);

  const loadEventos = async () => {
    try {
      const mes = currentDate.getMonth() + 1;
      const ano = currentDate.getFullYear();
      const response = await eventoService.calendario(mes, ano);
      setEventos(response.data.data || []);
    } catch (error) {
      setToast({ message: 'Erro ao carregar eventos', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await eventoService.atualizar(editingId, formData);
        setToast({ message: 'Evento atualizado!', type: 'success' });
      } else {
        await eventoService.criar(formData);
        setToast({ message: 'Evento criado!', type: 'success' });
      }
      loadEventos();
      resetForm();
    } catch (error) {
      setToast({ message: error.response?.data?.error || 'Erro ao salvar', type: 'error' });
    }
  };

  const handleDelete = async () => {
    try {
      await eventoService.excluir(deleteModal.id);
      setEventos(eventos.filter(e => e.id !== deleteModal.id));
      setToast({ message: 'Evento excluído!', type: 'success' });
    } catch (error) {
      setToast({ message: 'Erro ao excluir', type: 'error' });
    } finally {
      setDeleteModal({ show: false, id: null });
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: '', descricao: '', data_inicio: '', data_fim: '',
      tipo: 'OUTRO', local: '', cor: '#0d6efd', lembrete: false
    });
    setEditingId(null);
    setShowForm(false);
    setSelectedDate(null);
  };

  const handleDateClick = (date) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    setFormData({ ...formData, data_inicio: `${dateStr}T09:00` });
    setShowForm(true);
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const getEventsForDay = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return eventos.filter(e => e.start?.startsWith(dateStr));
  };

  const { firstDay, daysInMonth } = getDaysInMonth();
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const tipoColors = {
    JOGO: '#dc3545', TREINO: '#198754', EXAME: '#0dcaf0', REUNIAO: '#ffc107', OUTRO: '#6c757d'
  };

  if (loading) return <Loading />;

  return (
    <div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <ConfirmModal
        show={deleteModal.show}
        title="Excluir Evento"
        message="Tem certeza?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ show: false, id: null })}
      />

      <div className="page-header d-flex justify-content-between align-items-center">
        <div>
          <h1 className="h3 mb-0"><FaCalendarAlt className="me-2" />Calendário</h1>
          <p className="text-muted mb-0">Eventos, jogos, treinos e lembretes</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <FaPlus className="me-2" /> Novo Evento
        </button>
      </div>

      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="mb-3">{editingId ? 'Editar' : 'Novo'} Evento</h5>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <input type="text" className="form-control" placeholder="Título *"
                    value={formData.titulo} onChange={e => setFormData({...formData, titulo: e.target.value})} required />
                </div>
                <div className="col-md-3">
                  <select className="form-select" value={formData.tipo} onChange={e => setFormData({...formData, tipo: e.target.value, cor: tipoColors[e.target.value]})}>
                    <option value="JOGO">🏟️ Jogo</option>
                    <option value="TREINO">⚽ Treino</option>
                    <option value="EXAME">🏥 Exame</option>
                    <option value="REUNIAO">📋 Reunião</option>
                    <option value="OUTRO">📌 Outro</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <input type="color" className="form-control form-control-color w-100" value={formData.cor}
                    onChange={e => setFormData({...formData, cor: e.target.value})} title="Cor do evento" />
                </div>
                <div className="col-md-4">
                  <label className="form-label small text-muted">Data/Hora Início *</label>
                  <input type="datetime-local" className="form-control"
                    value={formData.data_inicio} onChange={e => setFormData({...formData, data_inicio: e.target.value})} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label small text-muted">Data/Hora Fim</label>
                  <input type="datetime-local" className="form-control"
                    value={formData.data_fim} onChange={e => setFormData({...formData, data_fim: e.target.value})} />
                </div>
                <div className="col-md-4">
                  <label className="form-label small text-muted">Local</label>
                  <input type="text" className="form-control" placeholder="Local"
                    value={formData.local} onChange={e => setFormData({...formData, local: e.target.value})} />
                </div>
                <div className="col-12">
                  <textarea className="form-control" rows="2" placeholder="Descrição"
                    value={formData.descricao} onChange={e => setFormData({...formData, descricao: e.target.value})} />
                </div>
                <div className="col-12">
                  <div className="form-check">
                    <input type="checkbox" className="form-check-input" id="lembrete"
                      checked={formData.lembrete} onChange={e => setFormData({...formData, lembrete: e.target.checked})} />
                    <label className="form-check-label" htmlFor="lembrete">Ativar lembrete</label>
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <button type="submit" className="btn btn-success me-2">Salvar</button>
                <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <button className="btn btn-outline-secondary btn-sm" onClick={prevMonth}><FaChevronLeft /></button>
          <h5 className="mb-0">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h5>
          <button className="btn btn-outline-secondary btn-sm" onClick={nextMonth}><FaChevronRight /></button>
        </div>
        <div className="card-body p-0">
          <div className="row g-0 text-center border-bottom">
            {dayNames.map(day => (
              <div key={day} className="col p-2 fw-bold bg-light">{day}</div>
            ))}
          </div>
          <div className="row g-0">
            {days.map((day, index) => {
              const dayEvents = day ? getEventsForDay(day) : [];
              const isToday = day && new Date().getDate() === day && 
                new Date().getMonth() === currentDate.getMonth() && 
                new Date().getFullYear() === currentDate.getFullYear();
              
              return (
                <div key={index} className={`col border p-1`} style={{ minHeight: '100px', cursor: day ? 'pointer' : 'default' }}
                  onClick={() => day && handleDateClick(day)}>
                  {day && (
                    <>
                      <div className={`text-end mb-1 ${isToday ? 'badge bg-primary rounded-circle' : ''}`}>
                        {day}
                      </div>
                      {dayEvents.slice(0, 3).map(event => (
                        <div key={event.id} className="small text-truncate px-1 rounded mb-1 text-white"
                          style={{ backgroundColor: event.color, fontSize: '0.7rem' }}
                          onClick={(e) => { e.stopPropagation(); }}>
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="small text-muted">+{dayEvents.length - 3} mais</div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legenda */}
      <div className="mt-3 d-flex gap-3 flex-wrap">
        {Object.entries(tipoColors).map(([tipo, cor]) => (
          <div key={tipo} className="d-flex align-items-center">
            <div className="rounded me-1" style={{ width: '12px', height: '12px', backgroundColor: cor }}></div>
            <small className="text-muted">{tipo}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendario;



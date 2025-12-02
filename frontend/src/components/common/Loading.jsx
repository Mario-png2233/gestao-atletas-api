const Loading = () => {
  return (
    <div className="loading-overlay">
      <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">Carregando...</span>
      </div>
    </div>
  );
};

export default Loading;


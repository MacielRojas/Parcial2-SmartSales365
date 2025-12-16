function QuickLinks() {
  const links = [
    { label: 'Ofertas del Día', icon: 'bi-lightning', color: 'warning' },
    { label: 'Favoritos', icon: 'bi-heart', color: 'danger' },
    { label: 'Soporte', icon: 'bi-headset', color: 'info' },
    { label: 'Mis Pedidos', icon: 'bi-receipt', color: 'secondary' },
  ];

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-info text-white">
        <h5 className="mb-0">Accesos Rápidos</h5>
      </div>
      <div className="card-body">
        <div className="row gy-3 text-center">
          {links.map((l, i) => (
            <div key={i} className="col-6 col-md-3">
              <button className={`btn btn-${l.color} w-100 py-3`}>
                <i className={`bi ${l.icon} fs-3 d-block mb-2`}></i>
                {l.label}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default QuickLinks;

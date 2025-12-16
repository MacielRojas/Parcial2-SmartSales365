const Loading = () => {
    return (
        <div className="card border-0 shadow-sm">
        <div className="card-body text-center py-5">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          {/* <h5 className="text-muted">Cargando...</h5> */}
        </div>
      </div>
    );
}

export default Loading;
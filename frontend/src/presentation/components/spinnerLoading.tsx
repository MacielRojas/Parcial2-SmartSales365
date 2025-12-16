const SpinnerLoading = () => {
    return (
        <div className="container py-4">
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <div className="d-flex align-items-center">
              <strong>Cargando...</strong>
              <div className="spinner-border ms-auto" role="status" aria-hidden="true"></div>
            </div>
          </div>
        </div>
      </div>
    );
}

export default SpinnerLoading;
function CartSummary() {
  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-success text-white">
        <h5 className="mb-0">Tu Carrito</h5>
      </div>
      <div className="card-body">
        <p className="text-muted">
          Aún no tienes productos en tu carrito. ¡Explora y agrega lo que te guste!
        </p>
        <button className="btn btn-outline-success">
          <i className="bi bi-bag"></i> Ir a comprar
        </button>
      </div>
    </div>
  );
}

export default CartSummary;

type HeroBannerProps = {
  setCurrentView: React.Dispatch<React.SetStateAction<{ nombre: string, datos: any }>>
}

function HeroBanner({ setCurrentView }: HeroBannerProps) {
  return (
    <div className="position-relative bg-primary text-white text-center rounded shadow-sm py-5">
      <div className="container">
        <h1 className="fw-bold mb-3">Bienvenido a Nuestra Tienda</h1>
        <p className="lead">Descubre los mejores productos con ofertas exclusivas</p>
        <button className="btn btn-light btn-lg mt-3" onClick={()=> setCurrentView({ nombre: "categoryproduct", datos: null })}>
          Explorar Productos <i className="bi bi-arrow-right"></i>
        </button>
      </div>

      {/* Imagen decorativa opcional */}
      <img
        src="https://via.placeholder.com/1200x300?text=Banner+Promocional"
        alt="Promoción"
        className="img-fluid rounded mt-4 d-none d-md-block"
      />
    </div>
  );
}

export default HeroBanner;

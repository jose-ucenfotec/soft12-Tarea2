import { ESTADOS, claseEstado } from '../../constantes.js';

// Muestra cuántos libros hay en cada estado. Al hacer clic en uno se filtra por ese estado,
// así este componente y Filtros (su hermano) cambian el mismo estado que vive en App.
function Resumen({ resumen, estadoActivo, onElegirEstado }) {
  return (
    <div className="d-flex flex-wrap gap-2">
      {ESTADOS.map((estado) => (
        <button
          key={estado}
          type="button"
          className={`btn btn-light resumen__boton ${estadoActivo === estado ? 'activo' : ''}`}
          onClick={() => onElegirEstado(estadoActivo === estado ? 'todos' : estado)}
        >
          <span className={claseEstado(estado)}>{resumen[estado]}</span>
          <span className="d-block small mt-1">{estado}</span>
        </button>
      ))}
    </div>
  );
}

export default Resumen;
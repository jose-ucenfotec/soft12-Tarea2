import { claseEstado } from '../../constantes.js';

// Una fila de la lista. No cambia nada por su cuenta. Llama a las funciones que le pasa el padre.
function LibroItem({ libro, nombreMiembro, onCambiarEstado, onQuitar }) {
  return (
    <li className="list-group-item d-flex flex-column flex-sm-row align-items-sm-center gap-2">
      <div className="flex-grow-1">
        <div className="fw-semibold">{libro.titulo}</div>
        <div className="small text-muted">
          {libro.autor} · Propuesto por {nombreMiembro}
        </div>
      </div>
      <span className={claseEstado(libro.estado)}>{libro.estado}</span>
      <div className="text-nowrap">
        <button type="button" className="btn btn-sm btn-outline-primary me-1"
          onClick={() => onCambiarEstado(libro.id)}>
          Cambiar estado
        </button>
        <button type="button" className="btn btn-sm btn-outline-danger"
          onClick={() => onQuitar(libro.id)}>
          Quitar
        </button>
      </div>
    </li>
  );
}

export default LibroItem;
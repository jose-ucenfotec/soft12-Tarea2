import { ESTADOS } from '../../constantes.js';

// Muestra los filtros que recibe y avisa los cambios al padre.
function Filtros({ filtros, miembros, onCambiar }) {
  function manejarCambio(evento) {
    const { name, value } = evento.target;
    onCambiar({ ...filtros, [name]: value });
  }

  return (
    <div className="row g-2">
      <div className="col-12 col-sm-6">
        <label htmlFor="filtro-estado" className="form-label small">Estado</label>
        <select id="filtro-estado" name="estado" className="form-select"
          value={filtros.estado} onChange={manejarCambio}>
          <option value="todos">Todos</option>
          {ESTADOS.map((estado) => (
            <option key={estado} value={estado}>{estado}</option>
          ))}
        </select>
      </div>
      <div className="col-12 col-sm-6">
        <label htmlFor="filtro-miembro" className="form-label small">Miembro</label>
        <select id="filtro-miembro" name="miembro" className="form-select"
          value={filtros.miembro} onChange={manejarCambio}>
          <option value="todos">Todos</option>
          {miembros.map((miembro) => (
            <option key={miembro.id} value={miembro.id}>{miembro.nombre}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default Filtros;
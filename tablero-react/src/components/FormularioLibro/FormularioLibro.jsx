import { useState } from 'react';
import { ESTADOS } from '../../constantes.js';

const VACIO = { titulo: '', autor: '', miembroId: '', estado: ESTADOS[0] };

// Devuelve un objeto con un mensaje por cada campo que tenga error
function validar(datos) {
  const errores = {};

  if (datos.titulo.trim().length < 2) {
    errores.titulo = 'El título debe tener al menos 2 caracteres.';
  }
  if (datos.autor.trim().length < 3) {
    errores.autor = 'El autor debe tener al menos 3 caracteres.';
  } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü.' -]+$/.test(datos.autor.trim())) {
    errores.autor = 'El autor solo puede tener letras, espacios y puntos.';
  }
  if (!datos.miembroId) {
    errores.miembroId = 'Elija quién propone el libro.';
  }

  return errores;
}

// Formulario controlado: cada input muestra lo que hay en el estado y cada cambio lo actualiza.
function FormularioLibro({ miembros, onAgregar }) {
  const [datos, setDatos] = useState(VACIO);
  const [errores, setErrores] = useState({});

  function manejarCambio(evento) {
    const { name, value } = evento.target;
    setDatos({ ...datos, [name]: value });
  }

  function manejarEnvio(evento) {
    evento.preventDefault();
    const nuevosErrores = validar(datos);
    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) return;

    onAgregar({ ...datos, titulo: datos.titulo.trim(), autor: datos.autor.trim() });
    setDatos(VACIO);
  }

  // Clase de Bootstrap para pintar en rojo el campo con error
  const clase = (campo, base = 'form-control') => `${base} ${errores[campo] ? 'is-invalid' : ''}`;

  return (
    <form onSubmit={manejarEnvio} noValidate>
      <div className="mb-3">
        <label htmlFor="titulo" className="form-label">Título</label>
        <input id="titulo" name="titulo" className={clase('titulo')}
          value={datos.titulo} onChange={manejarCambio} />
        <div className="invalid-feedback">{errores.titulo}</div>
      </div>

      <div className="mb-3">
        <label htmlFor="autor" className="form-label">Autor</label>
        <input id="autor" name="autor" className={clase('autor')}
          value={datos.autor} onChange={manejarCambio} />
        <div className="invalid-feedback">{errores.autor}</div>
      </div>

      <div className="mb-3">
        <label htmlFor="miembroId" className="form-label">Propuesto por</label>
        <select id="miembroId" name="miembroId" className={clase('miembroId', 'form-select')}
          value={datos.miembroId} onChange={manejarCambio}>
          <option value="">Elija un miembro...</option>
          {miembros.map((miembro) => (
            <option key={miembro.id} value={miembro.id}>{miembro.nombre}</option>
          ))}
        </select>
        <div className="invalid-feedback">{errores.miembroId}</div>
      </div>

      <div className="mb-3">
        <label htmlFor="estado" className="form-label">Estado inicial</label>
        <select id="estado" name="estado" className="form-select"
          value={datos.estado} onChange={manejarCambio}>
          {ESTADOS.map((estado) => (
            <option key={estado} value={estado}>{estado}</option>
          ))}
        </select>
      </div>

      <button type="submit" className="btn btn-primary w-100">Agregar libro</button>
    </form>
  );
}

export default FormularioLibro;
import LibroItem from './LibroItem.jsx';

function ListaLibros({ libros, miembros, onCambiarEstado, onQuitar }) {
  // Renderizado condicional. Si el filtro no deja nada, se avisa en lugar de mostrar una lista vacía
  if (libros.length === 0) {
    return <p className="text-muted mb-0">Ningún libro coincide con los filtros elegidos.</p>;
  }

  function nombreDe(miembroId) {
    return miembros.find((miembro) => miembro.id === miembroId)?.nombre ?? 'Desconocido';
  }

  return (
    <ul className="list-group list-group-flush">
      {libros.map((libro) => (
        <LibroItem
          key={libro.id}
          libro={libro}
          nombreMiembro={nombreDe(libro.miembroId)}
          onCambiarEstado={onCambiarEstado}
          onQuitar={onQuitar}
        />
      ))}
    </ul>
  );
}

export default ListaLibros;
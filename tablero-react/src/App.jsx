import { useState } from 'react';
import { miembros, librosIniciales } from './data/libros.js';
import { ESTADOS } from './constantes.js';
import Panel from './components/Panel/Panel.jsx';
import Filtros from './components/Filtros/Filtros.jsx';
import Resumen from './components/Resumen/Resumen.jsx';
import ListaLibros from './components/ListaLibros/ListaLibros.jsx';
import FormularioLibro from './components/FormularioLibro/FormularioLibro.jsx';

function App() {
  const [libros, setLibros] = useState(librosIniciales);
  const [filtros, setFiltros] = useState({ estado: 'todos', miembro: 'todos' });

  const librosDelMiembro = libros.filter(
    (libro) => filtros.miembro === 'todos' || libro.miembroId === filtros.miembro
  );

  const librosFiltrados = librosDelMiembro.filter(
    (libro) => filtros.estado === 'todos' || libro.estado === filtros.estado
  );

  const resumen = {};
  ESTADOS.forEach((estado) => {
    resumen[estado] = librosDelMiembro.filter((libro) => libro.estado === estado).length;
  });

  //  Actualizaciones inmutables
  function cambiarEstado(id) {
    setLibros(libros.map((libro) => {
      if (libro.id !== id) return libro;
      const siguiente = ESTADOS[(ESTADOS.indexOf(libro.estado) + 1) % ESTADOS.length];
      return { ...libro, estado: siguiente };
    }));
  }

  function quitarLibro(id) {
    setLibros(libros.filter((libro) => libro.id !== id));
  }

  function agregarLibro(datos) {
    setLibros([...libros, { ...datos, id: crypto.randomUUID() }]);
  }
  
  function elegirEstado(estado) {
    setFiltros({ ...filtros, estado });
  }

  return (
    <>
      <nav className="navbar navbar-dark bg-primary">
        <div className="container">
          <span className="navbar-brand fw-bold">Estantería Común · Tablero del club</span>
        </div>
      </nav>

      <main className="container py-4">
        <div className="row g-4">
          <div className="col-12 col-lg-8">
            <Panel titulo="Resumen">
              <Resumen resumen={resumen} estadoActivo={filtros.estado} onElegirEstado={elegirEstado} />
            </Panel>

            <Panel titulo="Filtros">
              <Filtros filtros={filtros} miembros={miembros} onCambiar={setFiltros} />
            </Panel>

            <Panel titulo={`Libros del club (${librosFiltrados.length})`}>
              <ListaLibros
                libros={librosFiltrados}
                miembros={miembros}
                onCambiarEstado={cambiarEstado}
                onQuitar={quitarLibro}
              />
            </Panel>
          </div>

          <div className="col-12 col-lg-4">
            <Panel titulo="Agregar un libro">
              <FormularioLibro miembros={miembros} onAgregar={agregarLibro} />
            </Panel>
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
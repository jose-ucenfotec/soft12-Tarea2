import { useState } from 'react';
import { miembros, librosIniciales } from './data/libros.js';
import { ESTADOS } from './constantes.js';
import Panel from './components/Panel/Panel.jsx';
import ListaLibros from './components/ListaLibros/ListaLibros.jsx';

function App() {
  const [libros, setLibros] = useState(librosIniciales);

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
            <Panel titulo={`Libros del club (${libros.length})`}>
              <ListaLibros
                libros={libros}
                miembros={miembros}
                onCambiarEstado={cambiarEstado}
                onQuitar={quitarLibro}
              />
            </Panel>
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
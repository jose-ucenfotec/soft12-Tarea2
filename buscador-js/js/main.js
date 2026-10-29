import { buscarLibros } from './api.js';
import { mostrarResultados, mostrarEstado, rellenarDetalle } from './render.js';

const formBusqueda = document.getElementById('form-busqueda');
const textoBusqueda = document.getElementById('texto-busqueda');
const estadoBusqueda = document.getElementById('estado-busqueda');
const resultados = document.getElementById('resultados');

// Libros de la última búsqueda, para encontrarlos por id cuando se hace clic en una tarjeta
let librosEncontrados = [];


// Se busca solo cuando se envía el formulario, no con cada tecla
formBusqueda.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  const texto = textoBusqueda.value.trim();
  if (texto.length < 2) {
    mostrarEstado(estadoBusqueda, 'error', 'Escriba al menos 2 caracteres para buscar.');
    return;
  }

  mostrarEstado(estadoBusqueda, 'cargando');
  resultados.replaceChildren();

  try {
    librosEncontrados = await buscarLibros(texto);

    if (librosEncontrados.length === 0) {
      mostrarEstado(estadoBusqueda, 'vacio', `No se encontraron libros para "${texto}".`);
      return;
    }

    mostrarEstado(estadoBusqueda, 'ninguno');
    mostrarResultados(resultados, librosEncontrados);
  } catch (error) {
    librosEncontrados = [];
    mostrarEstado(estadoBusqueda, 'error', 'No se pudo conectar con Open Library. Intente de nuevo en un momento.');
    console.warn('Error en la búsqueda:', error.message);
  }
});

// ---------- Detalle ----------

function buscarPorId(id) {
  return librosEncontrados.find((libro) => libro.id === id);
}

// Bootstrap avisa con show.bs.modal antes de abrir; relatedTarget es la tarjeta que se tocó
document.getElementById('modal-detalle').addEventListener('show.bs.modal', (evento) => {
  rellenarDetalle(buscarPorId(evento.relatedTarget.dataset.id));
});

// Al cerrar, Bootstrap pone aria-hidden en el modal. Si el botón de cerrar sigue con el foco
// la consola muestra un aviso de accesibilidad, así que se quita el foco antes.
document.getElementById('modal-detalle').addEventListener('hide.bs.modal', () => {
  document.activeElement.blur();
});
import { buscarLibros } from './api.js';
import { agregarLectura, siguienteEstado, quitarLectura, cantidadLecturas } from './lista.js';
import {
  mostrarResultados, mostrarEstado, rellenarDetalle, crearAlerta,
  crearFilaLectura, actualizarEstadoFila
} from './render.js';

const formBusqueda = document.getElementById('form-busqueda');
const textoBusqueda = document.getElementById('texto-busqueda');
const estadoBusqueda = document.getElementById('estado-busqueda');
const resultados = document.getElementById('resultados');
const tablaLecturas = document.getElementById('tabla-lecturas');
const listaVacia = document.getElementById('lista-vacia');
const avisoLista = document.getElementById('aviso-lista');

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


//  Resultados (delegación) 

// Una sola escucha para los botones "Agregar" de todas las tarjetas, aunque se creen después
resultados.addEventListener('click', (evento) => {
  const boton = evento.target.closest('[data-accion="agregar"]');
  if (!boton) return;

  // El botón está dentro de la tarjeta, que abre el modal.
  // Se corta la propagación para que agregar no abra también el detalle.
  evento.stopPropagation();

  const tarjeta = boton.closest('.libro');
  agregarALista(buscarPorId(tarjeta.dataset.id));
});

//  Lista de lecturas 

function actualizarMensajeListaVacia() {
  listaVacia.classList.toggle('d-none', cantidadLecturas() > 0);
}

function agregarALista(libro) {
  const lectura = agregarLectura(libro);

  if (!lectura) {
    avisoLista.replaceChildren(crearAlerta('alert-warning py-2', `"${libro.titulo}" ya está en su lista.`));
    return;
  }

  avisoLista.replaceChildren();
  tablaLecturas.append(crearFilaLectura(lectura));
  actualizarMensajeListaVacia();
}

tablaLecturas.addEventListener('click', (evento) => {
  const boton = evento.target.closest('button[data-accion]');
  if (!boton) return;

  const fila = boton.closest('tr');
  const id = fila.dataset.id;

  if (boton.dataset.accion === 'cambiar-estado') {
    const lectura = siguienteEstado(id);
    actualizarEstadoFila(fila, lectura);
  }

  if (boton.dataset.accion === 'quitar') {
    quitarLectura(id);
    fila.remove();
    actualizarMensajeListaVacia();
  }
});
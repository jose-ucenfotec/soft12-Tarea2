// Todo se arma con createElement y textContent; nunca se mete texto de la API como HTML.

const PORTADA_ALTERNATIVA = 'img/sin-portada.svg';

// Helper para no repetir createElement + className + textContent en cada elemento
function crear(etiqueta, clases = '', texto = '') {
  const elemento = document.createElement(etiqueta);
  if (clases) elemento.className = clases;
  if (texto) elemento.textContent = texto;
  return elemento;
}

function crearPortada(libro, clases) {
  const imagen = crear('img', clases);
  imagen.src = libro.portada ?? PORTADA_ALTERNATIVA;
  imagen.alt = `Portada de ${libro.titulo}`;
  imagen.loading = 'lazy';
  // Si la URL existe pero la imagen no carga, también uso la alternativa
  imagen.addEventListener('error', () => {
    imagen.src = PORTADA_ALTERNATIVA;
  }, { once: true });
  return imagen;
}


function crearTarjetaLibro(libro) {
  const tarjeta = crear('article', 'card h-100 libro');
  tarjeta.dataset.id = libro.id;
  tarjeta.dataset.detalle = ''; // marca que al hacer clic se abre el detalle

  const cuerpo = crear('div', 'card-body d-flex flex-column');
  const titulo = crear('h3', 'card-title libro__titulo', libro.titulo);
  const autores = crear('p', 'card-text libro__autores mb-1', libro.autores.join(', '));
  const anio = crear('p', 'card-text small text-muted', `Primera publicación: ${libro.anio}`);

  const boton = crear('button', 'btn btn-sm btn-outline-primary mt-auto', 'Agregar a mi lista');
  boton.type = 'button';
  boton.dataset.accion = 'agregar';

  cuerpo.append(titulo, autores, anio, boton);
  tarjeta.append(crearPortada(libro, 'card-img-top libro__portada'), cuerpo);
  return tarjeta;
}

export function mostrarResultados(contenedor, libros) {
  contenedor.replaceChildren(...libros.map(crearTarjetaLibro));
}

// tipo: 'cargando' | 'error' | 'vacio' | 'ninguno'
export function mostrarEstado(contenedor, tipo, mensaje = '') {
  if (tipo === 'ninguno') {
    contenedor.replaceChildren();
    return;
  }

  if (tipo === 'cargando') {
    const caja = crear('div', 'd-flex align-items-center gap-2 text-primary mb-3');
    const spinner = crear('div', 'spinner-border spinner-border-sm');
    spinner.setAttribute('role', 'status');
    caja.append(spinner, crear('span', '', 'Buscando libros...'));
    contenedor.replaceChildren(caja);
    return;
  }

  const color = tipo === 'error' ? 'alert-danger' : 'alert-info';
  contenedor.replaceChildren(crearAlerta(color, mensaje));
}

export function crearAlerta(color, mensaje) {
  const alerta = crear('div', `alert ${color} mb-3`, mensaje);
  alerta.setAttribute('role', 'alert');
  return alerta;
}

// Rellena el modal; Bootstrap se encarga de abrirlo
export function mostrarDetalle(libro) {
  document.getElementById('detalle-titulo').textContent = libro.titulo;

  const portada = document.getElementById('detalle-portada');
  portada.src = libro.portada ? libro.portada.replace('-M.jpg', '-L.jpg') : PORTADA_ALTERNATIVA;
  portada.alt = `Portada de ${libro.titulo}`;

  const datos = [
    ['Autores', libro.autores.join(', ')],
    ['Primera publicación', libro.anio],
    ['Ediciones', libro.ediciones],
    ['Idiomas', libro.idiomas.length ? libro.idiomas.slice(0, 5).join(', ') : 'Sin dato']
  ];

  const lista = document.getElementById('detalle-datos');
  lista.replaceChildren();
  datos.forEach(([nombre, valor]) => {
    lista.append(crear('dt', '', nombre), crear('dd', '', String(valor)));
  });

  bootstrap.Modal.getOrCreateInstance(document.getElementById('modal-detalle')).show();
}

// ---------- Lista de lecturas ----------

function claseEstado(estado) {
  // 'Leído' -> 'estado--leido'
  const nombre = estado.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  return `badge estado estado--${nombre}`;
}

export function crearFilaLectura(lectura) {
  const fila = crear('tr', 'fila-lectura');
  fila.dataset.id = lectura.id;
  fila.dataset.detalle = '';

  const celdaLibro = crear('td');
  celdaLibro.append(
    crear('div', 'fw-semibold', lectura.titulo),
    crear('div', 'small text-muted', lectura.autores[0])
  );

  const celdaEstado = crear('td');
  celdaEstado.append(crear('span', claseEstado(lectura.estado), lectura.estado));

  const celdaAcciones = crear('td', 'text-end text-nowrap');
  const cambiar = crear('button', 'btn btn-sm btn-outline-primary me-1', 'Cambiar estado');
  cambiar.type = 'button';
  cambiar.dataset.accion = 'cambiar-estado';
  const quitar = crear('button', 'btn btn-sm btn-outline-danger', 'Quitar');
  quitar.type = 'button';
  quitar.dataset.accion = 'quitar';
  celdaAcciones.append(cambiar, quitar);

  fila.append(celdaLibro, celdaEstado, celdaAcciones);
  return fila;
}

// Solo se toca la etiqueta de esa fila, no se vuelve a dibujar la tabla
export function actualizarEstadoFila(fila, lectura) {
  const etiqueta = fila.querySelector('.estado');
  etiqueta.className = claseEstado(lectura.estado);
  etiqueta.textContent = lectura.estado;
}
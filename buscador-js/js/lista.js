// Estado de la lista de lecturas. Vive en memoria mientras la página esté abierta.

export const ESTADOS = ['Pendiente', 'Leyendo', 'Leído'];

const lecturas = [];

export function obtenerLectura(id) {
  return lecturas.find((lectura) => lectura.id === id);
}

// Devuelve la lectura creada, o null si el libro ya estaba en la lista
export function agregarLectura(libro) {
  if (obtenerLectura(libro.id)) {
    return null;
  }

  // Copio todos los datos del libro para poder mostrar su detalle aunque se haga otra búsqueda
  const lectura = { ...libro, estado: ESTADOS[0] };
  lecturas.push(lectura);
  return lectura;
}

// Pasa al siguiente estado del arreglo; después del último vuelve al primero
export function siguienteEstado(id) {
  const lectura = obtenerLectura(id);
  const posicion = ESTADOS.indexOf(lectura.estado);
  lectura.estado = ESTADOS[(posicion + 1) % ESTADOS.length];
  return lectura;
}

export function quitarLectura(id) {
  const posicion = lecturas.findIndex((lectura) => lectura.id === id);
  if (posicion !== -1) {
    lecturas.splice(posicion, 1);
  }
}

export function cantidadLecturas() {
  return lecturas.length;
}
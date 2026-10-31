// Los mismos tres estados de la Parte A. Agregar uno nuevo es sumarlo a este arreglo.
export const ESTADOS = ['Pendiente', 'Leyendo', 'Leído'];

// 'Leído' -> 'estado--leido', para reutilizar las clases de color de la Parte A
export function claseEstado(estado) {
  const nombre = estado.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  return `badge estado estado--${nombre}`;
}
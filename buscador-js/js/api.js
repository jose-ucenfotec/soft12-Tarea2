// Acceso a servicios externos. Este módulo solo hace peticiones y devuelve datos

const URL_BUSQUEDA = 'https://openlibrary.org/search.json';
const URL_PORTADAS = 'https://covers.openlibrary.org/b/id';
const URL_PROPUESTAS = 'https://jsonplaceholder.typicode.com/posts';

export async function buscarLibros(texto) {
  const url = `${URL_BUSQUEDA}?q=${encodeURIComponent(texto)}&limit=12`;
  const respuesta = await fetch(url);

  // fetch solo lanza error si falla la red; un 404 o un 500
  if (!respuesta.ok) {
    throw new Error(`Open Library respondió con estado ${respuesta.status}`);
  }

  const datos = await respuesta.json();
  return datos.docs.map(convertirLibro);
}

// Me quedo solo con los campos que uso
function convertirLibro(doc) {
  return {
    id: doc.key,
    titulo: doc.title,
    autores: doc.author_name ?? ['Autor desconocido'],
    anio: doc.first_publish_year ?? 'Sin dato',
    portada: doc.cover_i ? `${URL_PORTADAS}/${doc.cover_i}-M.jpg` : null,
    ediciones: doc.edition_count ?? 0,
    idiomas: doc.language ?? []
  };
}

export async function enviarPropuesta(propuesta) {
  const respuesta = await fetch(URL_PROPUESTAS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(propuesta)
  });

  if (!respuesta.ok) {
    throw new Error(`El servidor respondió con estado ${respuesta.status}`);
  }

  return respuesta.json();
}
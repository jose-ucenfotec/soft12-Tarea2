// Formulario de propuesta de lectura

import { enviarPropuesta } from './api.js';
import { crearAlerta } from './render.js';

const MIN_AUTORES = 1;
const MAX_AUTORES = 5;

const formulario = document.getElementById('form-propuesta');
const listaAutores = document.getElementById('lista-autores');
const botonAgregarAutor = document.getElementById('agregar-autor');
const botonEnviar = document.getElementById('boton-enviar');
const alerta = document.getElementById('alerta-propuesta');

// Fecha de hoy en formato yyyy-mm-dd usando la hora local
function hoyComoTexto() {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${hoy.getFullYear()}-${mes}-${dia}`;
}

// ---------- Validación ----------

function reglasExtra(campo) {
  if (campo.name === 'anio' && Number(campo.value) > new Date().getFullYear()) {
    return 'El año de publicación no puede ser futuro.';
  }
  if (campo.name === 'fecha' && campo.value && campo.value < hoyComoTexto()) {
    return 'La fecha de la sesión no puede ser anterior a hoy.';
  }
  return '';
}

// Traduce lo que reporta la API de validación (campo.validity) a un mensaje propio
function mensajeDeError(campo) {
  const v = campo.validity;
  if (v.customError) return campo.validationMessage;
  if (v.valueMissing) return 'Este campo es obligatorio.';
  if (v.typeMismatch && campo.type === 'email') return 'Escriba un correo válido, por ejemplo nombre@correo.com.';
  if (v.tooShort) return `Debe tener al menos ${campo.minLength} caracteres.`;
  if (v.tooLong) return `No puede pasar de ${campo.maxLength} caracteres.`;
  if (v.patternMismatch) return 'Solo se permiten letras, espacios, puntos y guiones.';
  if (v.rangeUnderflow) return `El valor mínimo es ${campo.min}.`;
  if (v.rangeOverflow) return `El valor máximo es ${campo.max}.`;
  if (v.stepMismatch || v.badInput) return 'Escriba un número entero.';
  return '';
}

function validarCampo(campo) {
  campo.setCustomValidity(reglasExtra(campo));

  const valido = campo.checkValidity();
  // El mensaje va en el .invalid-feedback que está junto al campo
  const feedback = campo.parentElement.querySelector('.invalid-feedback');
  feedback.textContent = valido ? '' : mensajeDeError(campo);
  campo.classList.toggle('is-invalid', !valido);
  campo.classList.toggle('is-valid', valido);
  return valido;
}

function validarFormulario() {
  const campos = formulario.querySelectorAll('input, select, textarea');
  // map en vez de every para que se marquen todos los campos y no solo el primero con error
  const resultados = [...campos].map(validarCampo);
  return resultados.every(Boolean);
}

// ---------- Autores dinámicos ----------

function camposAutor() {
  return listaAutores.querySelectorAll('.campo-autor');
}

function actualizarBotonesAutor() {
  const cantidad = camposAutor().length;
  botonAgregarAutor.disabled = cantidad >= MAX_AUTORES;
  listaAutores.querySelectorAll('[data-accion="quitar-autor"]').forEach((boton) => {
    boton.disabled = cantidad <= MIN_AUTORES;
  });
}

function agregarCampoAutor() {
  if (camposAutor().length >= MAX_AUTORES) return;

  // Clono el primer campo para que el nuevo tenga los mismos atributos de validación
  const nuevo = camposAutor()[0].cloneNode(true);
  const input = nuevo.querySelector('input');
  input.value = '';
  input.classList.remove('is-valid', 'is-invalid');
  nuevo.querySelector('.invalid-feedback').textContent = '';

  listaAutores.append(nuevo);
  actualizarBotonesAutor();
  input.focus();
}

function quitarCampoAutor(boton) {
  if (camposAutor().length <= MIN_AUTORES) return;
  boton.closest('.campo-autor').remove();
  actualizarBotonesAutor();
}


// ---------- Envío ----------

function leerDatos() {
  const datos = new FormData(formulario);
  return {
    titulo: datos.get('titulo').trim(),
    // getAll trae todos los inputs name="autor", incluidos los que se agregaron después
    autores: datos.getAll('autor').map((autor) => autor.trim()),
    anio: Number(datos.get('anio')),
    paginas: Number(datos.get('paginas')),
    genero: datos.get('genero'),
    correo: datos.get('correo').trim(),
    fecha: datos.get('fecha'),
    motivo: datos.get('motivo').trim()
  };
}

function reiniciarFormulario() {
  formulario.reset();
  // Dejo un solo campo de autor y limpio las marcas de validación
  camposAutor().forEach((campo, i) => {
    if (i > 0) campo.remove();
  });
  formulario.querySelectorAll('.is-valid, .is-invalid').forEach((campo) => {
    campo.classList.remove('is-valid', 'is-invalid');
  });
  actualizarBotonesAutor();
}

async function manejarEnvio(evento) {
  evento.preventDefault();
  alerta.replaceChildren();

  if (!validarFormulario()) {
    formulario.querySelector('.is-invalid').focus();
    return;
  }

  botonEnviar.disabled = true;
  botonEnviar.textContent = 'Enviando...';

  try {
    const respuesta = await enviarPropuesta(leerDatos());
    alerta.replaceChildren(crearAlerta('alert-success', `¡Gracias! Su propuesta quedó registrada con el número ${respuesta.id}.`));
    reiniciarFormulario();
  } catch (error) {
    alerta.replaceChildren(crearAlerta('alert-danger', 'No se pudo enviar la propuesta. Revise su conexión e intente de nuevo.'));
    console.warn('Error al enviar la propuesta:', error.message);
  } finally {
    botonEnviar.disabled = false;
    botonEnviar.textContent = 'Enviar propuesta';
  }
}

export function iniciarFormulario() {
  // Límites que dependen del día actual
  formulario.anio.max = new Date().getFullYear();
  formulario.fecha.min = hoyComoTexto();

  // Una sola escucha de 'input' en el formulario: sirve también para los autores que se agreguen luego
  formulario.addEventListener('input', (evento) => {
    if (evento.target.matches('input, select, textarea')) validarCampo(evento.target);
  });

  listaAutores.addEventListener('click', (evento) => {
    const boton = evento.target.closest('[data-accion="quitar-autor"]');
    if (boton) quitarCampoAutor(boton);
  });

  botonAgregarAutor.addEventListener('click', agregarCampoAutor);
  formulario.addEventListener('submit', manejarEnvio);
  actualizarBotonesAutor();
}
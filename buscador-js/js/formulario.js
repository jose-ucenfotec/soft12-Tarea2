// Formulario de propuesta de lectura

const MIN_AUTORES = 1;
const MAX_AUTORES = 5;

const formulario = document.getElementById('form-propuesta');
const listaAutores = document.getElementById('lista-autores');
const botonAgregarAutor = document.getElementById('agregar-autor');

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

function manejarEnvio(evento) {
  evento.preventDefault();

  if (!validarFormulario()) {
    formulario.querySelector('.is-invalid').focus();
    return;
  }

  console.log('Formulario válido');
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
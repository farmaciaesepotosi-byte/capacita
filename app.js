/**
 * REINDUCCIÓN INSTITUCIONAL DEL SERVICIO FARMACÉUTICO
 * E.S.E. Centro Hospital Luis Antonio Montero - Potosí, Nariño
 * Lógica de Navegación Tecnológica e Interacción
 */

// ==========================================================================
// CONFIGURACIÓN GLOBAL Y ENLACES EDITABLES
// ==========================================================================
const CONFIG = {
  PRETEST_URL: "https://docs.google.com/forms/d/1fuGHId-GTwy4g18Ib-XwaNy1mlU4o2q5zihO9OrypMY/edit",
  POSTEST_URL: "https://docs.google.com/forms/d/e/1FAIpQLScuc1TG4-9SFI_uQclxgXzYHsBPpnlugVoOXRYmbFy7t9c0fw/viewform",
  TOTAL_STATIONS: 10
};

// Estado de la aplicación
let estacionActual = 0;
let sonidoHabilitado = true;

// ==========================================================================
// SÍNTESIS DE AUDIO CON WEB AUDIO API
// ==========================================================================
function reproducirSonido(tipo) {
  if (!sonidoHabilitado) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (tipo === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(500, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.07);
    }
  } catch (e) {
    // Silencio si el navegador restringe audio
  }
}

// ==========================================================================
// CONTROL DE NAVEGACIÓN ENTRE PROCESOS
// ==========================================================================
function cambiarEstacion(numero) {
  if (numero < 0 || numero > CONFIG.TOTAL_STATIONS) return;

  reproducirSonido('click');

  // Ocultar estación previa
  const estacionPrevia = document.getElementById(`station-${estacionActual}`);
  if (estacionPrevia) {
    estacionPrevia.classList.remove('active');
  }

  // Activar nueva estación
  estacionActual = numero;
  const nuevaEstacion = document.getElementById(`station-${estacionActual}`);
  if (nuevaEstacion) {
    nuevaEstacion.classList.add('active');
  }

  // Scroll suave al inicio
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Actualizar controles de interfaz
  actualizarControlesNavegacion();
}

function actualizarControlesNavegacion() {
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const stationSelect = document.getElementById('station-select');
  const stationIndicator = document.getElementById('station-indicator');
  const progressBar = document.getElementById('mission-progress-bar');

  // Estado botones
  if (btnPrev) btnPrev.disabled = (estacionActual === 0);
  if (btnNext) {
    btnNext.disabled = (estacionActual === CONFIG.TOTAL_STATIONS);
    if (estacionActual === CONFIG.TOTAL_STATIONS) {
      btnNext.innerHTML = `<span>Procesos Completados</span> <i class="fa-solid fa-check"></i>`;
    } else if (estacionActual === 0) {
      btnNext.innerHTML = `<span>Iniciar Módulos</span> <i class="fa-solid fa-chevron-right"></i>`;
    } else {
      btnNext.innerHTML = `<span>Siguiente Proceso</span> <i class="fa-solid fa-chevron-right"></i>`;
    }
  }

  // Selector desplegable
  if (stationSelect) {
    stationSelect.value = estacionActual;
  }

  // Indicador numérico
  if (stationIndicator) {
    stationIndicator.textContent = `${estacionActual} / ${CONFIG.TOTAL_STATIONS}`;
  }

  // Barra de progreso
  if (progressBar) {
    const porcentaje = (estacionActual / CONFIG.TOTAL_STATIONS) * 100;
    progressBar.style.width = `${porcentaje}%`;
  }
}

// Navegación con teclado (Flechas)
window.addEventListener('keydown', (e) => {
  if (document.querySelector('.modal.active') || e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
    return;
  }

  if (e.key === 'ArrowRight' || e.key === 'PageDown') {
    if (estacionActual < CONFIG.TOTAL_STATIONS) cambiarEstacion(estacionActual + 1);
  } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
    if (estacionActual > 0) cambiarEstacion(estacionActual - 1);
  }
});

// ==========================================================================
// INTERACTIVIDAD: TARJETAS FLIP (GIRATORIAS)
// ==========================================================================
function voltearTarjeta(elemento) {
  elemento.classList.toggle('is-flipped');
  reproducirSonido('click');
}

// ==========================================================================
// INTERACTIVIDAD: DETALLES DE ALMACENAMIENTO TÉCNICO
// ==========================================================================
const DATOS_ALMACENAMIENTO = {
  'fefo-rule': {
    titulo: 'Disposición Técnica del Sistema FEFO',
    desc: 'Al ingresar un nuevo lote a cualquier anaquel o botiquín institucional, las unidades con fecha de vencimiento más próxima se colocan en la parte delantera de la hilera, y los productos de mayor vida útil en la parte posterior.',
    norma: 'Principio operativo obligatorio en Farmacia Central y botiquines asistenciales de todos los servicios.'
  },
  'segregacion-rule': {
    titulo: 'Segregación Física por Grupos y Formas Farmacéuticas',
    desc: 'Los medicamentos se ubican separados por orden alfabético según su principio activo genérico, distinguiendo formas sólidas (tabletas, cápsulas), líquidos orales (jarabes, soluciones) y parenterales (ampollas, viales). Los medicamentos de alto riesgo y LASA cuentan con rotulación y separación física exclusiva.',
    norma: 'Resolución 1403 de 2007: Buenas Prácticas de Almacenamiento Farmacéutico.'
  },
  'estibas-rule': {
    titulo: 'Distancias Normativas, Estibas y Estanterías',
    desc: 'Ningún insumo debe almacenarse directamente en el piso. Se utilizan estibas a no menos de 15 cm del piso, separadas mínimo a 30 cm de las paredes perimetrales y a más de 60 cm del techo, permitiendo adecuada ventilación, limpieza e inspección.',
    norma: 'Estándar técnico de infraestructura y habilitación Resolución 3100 de 2019.'
  },
  'higiene-rule': {
    titulo: 'Limpieza, Control Ambiental y Rotulación Clara',
    desc: 'Las estanterías deben ser de material higiénico, incombustible, lavable y no absorbente. Las gavetas y estantes deben estar perfectamente identificados con el nombre genérico, presentación y concentración del producto.',
    norma: 'Manual de Condiciones Esenciales del Servicio Farmacéutico.'
  }
};

function mostrarDetalleAlmacenamiento(elemento, tipo) {
  reproducirSonido('click');
  const items = document.querySelectorAll('.storage-interactive-item');
  items.forEach(i => i.classList.remove('active'));
  elemento.classList.add('active');

  const info = DATOS_ALMACENAMIENTO[tipo];
  if (info) {
    document.getElementById('storage-detail-title').textContent = info.titulo;
    document.getElementById('storage-detail-desc').textContent = info.desc;
    document.getElementById('storage-detail-norm').innerHTML = `<i class="fa-solid fa-circle-info"></i> ${info.norma}`;
  }
}

// ==========================================================================
// ESTACIÓN 9: PESTAÑAS DE ÁREAS ASISTENCIALES
// ==========================================================================
function mostrarArea(areaId) {
  reproducirSonido('click');
  const tabs = document.querySelectorAll('.areas-tab-nav .tab-btn');
  const contents = document.querySelectorAll('.area-tab-content');

  tabs.forEach(t => t.classList.remove('active'));
  contents.forEach(c => c.classList.remove('active'));

  const tabActiva = Array.from(tabs).find(t => t.getAttribute('onclick').includes(areaId));
  const contentActivo = document.getElementById(`area-${areaId}`);

  if (tabActiva) tabActiva.classList.add('active');
  if (contentActivo) contentActivo.classList.add('active');
}

// ==========================================================================
// CONTROL DE MODALES (EVALUACIONES, MATERIALES, NORMAS)
// ==========================================================================
function abrirModal(id) {
  reproducirSonido('click');
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function cerrarModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    e.target.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
});

function abrirModalForm(tipo) {
  const modal = document.getElementById('modal-eval');
  const titulo = document.getElementById('eval-modal-title');
  const subtitulo = document.getElementById('eval-modal-sub');
  const urlBox = document.getElementById('eval-active-url');
  const btnReal = document.getElementById('btn-open-real-form');
  const qrImg = document.getElementById('eval-qr-image');

  let activeUrl = "";

  if (tipo === 'pretest') {
    titulo.textContent = "Evaluación Diagnóstica Inicial (Pretest)";
    subtitulo.textContent = "Medición de conocimientos basales en el uso seguro de medicamentos";
    activeUrl = CONFIG.PRETEST_URL;
  } else {
    titulo.textContent = "Evaluación de Salida Institucional (Postest)";
    subtitulo.textContent = "Certificación de aprobación de la Reinducción del Servicio Farmacéutico";
    activeUrl = CONFIG.POSTEST_URL;
  }

  urlBox.textContent = activeUrl;
  btnReal.href = activeUrl;

  if (qrImg) {
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(activeUrl)}`;
  }

  abrirModal('modal-eval');
}

function abrirModalMaterial() {
  abrirModal('modal-material');
}

function abrirModalNormas() {
  abrirModal('modal-normas');
}

// ==========================================================================
// INICIALIZACIÓN AL CARGAR LA PÁGINA
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  actualizarControlesNavegacion();

  // Toggle sonido
  const btnSonido = document.getElementById('btn-sound-toggle');
  if (btnSonido) {
    btnSonido.addEventListener('click', () => {
      sonidoHabilitado = !sonidoHabilitado;
      btnSonido.innerHTML = sonidoHabilitado ?
        `<i class="fa-solid fa-volume-high"></i>` :
        `<i class="fa-solid fa-volume-xmark"></i>`;
    });
  }

  // Toggle Modo Auditorio (Pantalla Completa)
  const btnFullscreen = document.getElementById('btn-fullscreen-toggle');
  if (btnFullscreen) {
    btnFullscreen.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().then(() => {
          btnFullscreen.innerHTML = `<i class="fa-solid fa-compress"></i>`;
        }).catch(err => console.log(err));
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen().then(() => {
            btnFullscreen.innerHTML = `<i class="fa-solid fa-expand"></i>`;
          }).catch(err => console.log(err));
        }
      }
    });
  }

  document.addEventListener('fullscreenchange', () => {
    if (btnFullscreen) {
      btnFullscreen.innerHTML = document.fullscreenElement ?
        `<i class="fa-solid fa-compress"></i>` :
        `<i class="fa-solid fa-expand"></i>`;
    }
  });
});
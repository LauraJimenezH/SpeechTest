/**
 * 
 * Texto a voz con JavaScript usando speechSynthesis
 * [TTS con JS]
 * @author parzibyte
 * 
 * Visita: parzibyte.me/blog
 */
// Seleccionar estos idiomas por defecto, en caso de que existan
const IDIOMAS_PREFERIDOS = ["es-MX", "es-US", "es-ES", "es_US", "es_ES"];

// Esperar a que el que DOM cargue
document.addEventListener("DOMContentLoaded", () => {
    let mic, recorder, soundFile;

let state = 0; // presionar el ratón cambiará el estado de grabar, a parar y a reproducir

function setup() {
  createCanvas(400, 400);
  background(200);
  fill(0);
  text('Enable mic and click the mouse to begin recording', 20, 20);

  // crear una entrada de audio
  mic = new p5.AudioIn();

  // los usuarios deben manualmente permitir en su navegador que el micrófono funcione para que la grabación funcione de manera correcta
  mic.start();

  // crear un nuevo grabador de sonido
  recorder = new p5.SoundRecorder();

  // conectar el micrófono al grabador
  recorder.setInput(mic);

  // crear un archivo de audio vacío que será usado para la reproducción de la grabación
  soundFile = new p5.SoundFile();
}

function mousePressed() {
  // usar el booleano '.enabled' (permitido) para asegurarse que el micrófono haya sido habilitado por el usuario (si no grabaríamos silencio)
  if (state === 0 && mic.enabled) {
    // indicar al grabador que grabe en el objeto p5.SoundFile, que usaremos para la reproducción
    recorder.record(soundFile);

    background(255, 0, 0);
    text('Recording now! Click to stop.', 20, 20);
    state++;
  } else if (state === 1) {
    recorder.stop(); // parar el grabador, y enviar el resultado al archivo de audio soundFile

    background(0, 255, 0);
    text('Recording stopped. Click to play & save', 20, 20);
    state++;
  } else if (state === 2) {
    soundFile.play(); // reproduce el sonido
    saveSound(soundFile, 'mySound.wav'); // almacena el archivo
    state++;
  }
}

  const $voces = document.querySelector("#voces"),
    $boton = document.querySelector("#btnEscuchar"),
    $mensaje = document.querySelector("#mensaje");
  let posibleIndice = 0, vocesDisponibles = [];

  // FunciÃ³n que pone las voces dentro del select
  const cargarVoces = () => {
    if (vocesDisponibles.length > 0) {
      console.log("No se cargan las voces porque ya existen: ", vocesDisponibles);
      return;
    }
    vocesDisponibles = speechSynthesis.getVoices();
    console.log({ vocesDisponibles })
    posibleIndice = vocesDisponibles.findIndex(voz => IDIOMAS_PREFERIDOS.includes(voz.lang));
    if (posibleIndice === -1) posibleIndice = 0;
    vocesDisponibles.forEach((voz, a) => {
      const opcion = document.createElement("option");
      opcion.value = a;
      opcion.innerHTML = voz.name;
      opcion.selected = a === posibleIndice;
      $voces.appendChild(opcion);
    });
  };

  // Si no existe la API, lo indicamos
  if (!'speechSynthesis' in window) return alert("Lo siento, tu navegador no soporta esta tecnologÃ­a");

  // No preguntes por quÃ© pongo esto que se ejecuta dos veces
  // en determinados casos, solo asÃ­ funciona en algunos casos
  cargarVoces();
  // Si hay evento, entonces lo esperamos
  if ('onvoiceschanged' in speechSynthesis) {
    speechSynthesis.onvoiceschanged = function () {
      cargarVoces();
    };
  }
  // El click del botÃ³n. AquÃ­ sucede la magia
  $boton.addEventListener("click", () => {
    let textoAEscuchar = $mensaje.value;
    if (!textoAEscuchar) return alert("Escribe el texto");
    let mensaje = new SpeechSynthesisUtterance();
    mensaje.voice = vocesDisponibles[$voces.value];
    mensaje.rate = 1;
    mensaje.text = textoAEscuchar;
    mensaje.pitch = 1;
    // Â¡Parla!
    speechSynthesis.speak(mensaje);
  });
});


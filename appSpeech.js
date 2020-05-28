
// Esperar a que el que DOM cargue
document.addEventListener("DOMContentLoaded", () => {

  $mensaje = document.querySelector("#mensaje");
  var sysnt = window.speechSynthesis;


  // Si no existe la API, lo indicamos
  if (!'sysnt' in window) return alert("Lo siento, tu navegador no soporta esta tecnologia");


  const tieneSoporteUserMedia = () =>
    !!(navigator.mediaDevices.getUserMedia)

  // Si no soporta...
  // Amable aviso para que el mundo comience a usar navegadores decentes ;)
  if (typeof MediaRecorder === "undefined" || !tieneSoporteUserMedia())
    return alert("Tu navegador web no cumple los requisitos; por favor, actualiza a un navegador decente como Firefox o Google Chrome");


  // Declaración de elementos del DOM
    $duracion = document.querySelector("#duracion"),
    $btnComenzarGrabacion = document.querySelector("#btnComenzarGrabacion"),
    $btnDetenerGrabacion = document.querySelector("#btnDetenerGrabacion");

  const segundosATiempo = numeroDeSegundos => {
    let horas = Math.floor(numeroDeSegundos / 60 / 60);
    numeroDeSegundos -= horas * 60 * 60;
    let minutos = Math.floor(numeroDeSegundos / 60);
    numeroDeSegundos -= minutos * 60;
    numeroDeSegundos = parseInt(numeroDeSegundos);
    if (horas < 10) horas = "0" + horas;
    if (minutos < 10) minutos = "0" + minutos;
    if (numeroDeSegundos < 10) numeroDeSegundos = "0" + numeroDeSegundos;

    return `${horas}:${minutos}:${numeroDeSegundos}`;
  };
  // Variables "globales"
  let tiempoInicio, mediaRecorder, idIntervalo;
  const refrescar = () => {
    $duracion.textContent = segundosATiempo((Date.now() - tiempoInicio) / 1000);
  }
  const comenzarAContar = () => {
    tiempoInicio = Date.now();
    idIntervalo = setInterval(refrescar, 500);
  };

  // Comienza a grabar el audio con el dispositivo seleccionado
  const comenzarAGrabar = () => {
    // if (!$listaDeDispositivos.options.length) return alert("No hay dispositivos");
    // No permitir que se grabe doblemente
    if (mediaRecorder) return alert("Ya se está grabando");
    navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId: '',
      }
    })
      .then(
        stream => {
          // console.log($listaDeDispositivos);
          $btnComenzarGrabacion.disabled = true;
          $btnDetenerGrabacion.disabled = false;

          // Comenzar a grabar con el stream
          mediaRecorder = new MediaRecorder(stream);
          mediaRecorder.start();
          comenzarAContar();

          // En el arreglo pondremos los datos que traiga el evento dataavailable
          const fragmentosDeAudio = [];

          // Escuchar cuando haya datos disponibles
          mediaRecorder.addEventListener("dataavailable", evento => {
            // Y agregarlos a los fragmentos
            fragmentosDeAudio.push(evento.data);
          });
          var textoSpeech = document.getElementById("text-speech").textContent;
          let textoAEscuchar = 'Lo siento, tu navegador no soporta esta tecnologia'
          if (!textoAEscuchar) return alert("Escribe el texto");
          var pendingSpeech = false;
          let mensaje = new SpeechSynthesisUtterance(textoSpeech);
          mensaje.lang = 'es-ES'
          // mensaje.rate = 1;
          // mensaje.text = textoAEscuchar;
          // mensaje.pitch = 1;
          sysnt.speak(mensaje);
          // Cuando se detenga (haciendo click en el botón) se ejecuta esto
          mediaRecorder.addEventListener("stop", () => {
            $btnComenzarGrabacion.disabled = false;
            $btnDetenerGrabacion.disabled = true;
            sysnt.cancel()
            var pendingSpeech = sysnt.pending;
            console.log(sysnt);

            // Detener el stream
            stream.getTracks().forEach(track => track.stop());
            // Detener la cuenta regresiva
            detenerConteo();
            // Convertir los fragmentos a un objeto binario

            // const blobAudio = new Blob(fragmentosDeAudio);
            // console.log(blobAudio)
            // // Crear una URL o enlace para descargar
            // const urlParaDescargar = URL.createObjectURL(blobAudio);
            // console.log(urlParaDescargar)
            // // Crear un elemento <a> invisible para descargar el audio
            // let a = document.createElement("a");
            // document.body.appendChild(a);
            // a.style = "display: none";
            // a.href = urlParaDescargar;
            // a.download = "grabacion_parzibyte.me.webm";
            // // Hacer click en el enlace
            // a.click();
            // // Y remover el objeto
            // window.URL.revokeObjectURL(urlParaDescargar);
          });
        }
      )
      .catch(error => {
        // Aquí maneja el error, tal vez no dieron permiso
        console.log(error)
      });
  };


  const detenerConteo = () => {
    clearInterval(idIntervalo);
    tiempoInicio = null;
    $duracion.textContent = "00:00:00";
  }

  const detenerGrabacion = () => {
    if (!mediaRecorder) return alert("No se está grabando");
    mediaRecorder.stop();
    mediaRecorder = null;
  };


  $btnComenzarGrabacion.addEventListener("click", comenzarAGrabar);
  $btnDetenerGrabacion.addEventListener("click", detenerGrabacion);

  // Cuando ya hemos configurado lo necesario allá arriba llenamos la lista

  // llenarLista();
});


let preguntas = {};  // El objeto de preguntas se llenará con AJAX
let puntosTotales = 0;
let respuestasCorrectas = 0;
let respuestasIncorrectas = 0;
let timerInterval;
let contadorTiempo;
let preguntaIndex = 0;

// Función para cargar el archivo JSON con preguntas (usando fetch y async/await)
async function cargarPreguntas() {
    try {
        const response = await fetch("js/preguntas.json");
        if (!response.ok) {
            throw new Error("No se pudo cargar el archivo JSON");
        }
        preguntas = await response.json();
        console.log("Preguntas cargadas:", preguntas);  // Asegúrate de que las preguntas están cargadas
    } catch (error) {
        console.error("Error al cargar las preguntas:", error);
    }
}

// Función para iniciar el contador de 5 segundos antes de empezar
function iniciarCuentaRegresivaInicio() {
    let contador = 5;
    let popupContent = document.getElementById("popupContent");
    popupContent.innerHTML = `El juego comienza en: ${contador} segundos`;
    document.getElementById("popupOverlay").style.display = "flex"; // Mostrar el popup

    timerInterval = setInterval(() => {
        contador--;
        popupContent.innerHTML = `El juego comienza en: ${contador} segundos`;
        if (contador <= 0) {
            clearInterval(timerInterval);
            document.getElementById("popupOverlay").style.display = "none"; // Ocultar popup
            iniciarJuego();  // Llamar a iniciarJuego después de que termine la cuenta atrás
        }
    }, 1000);
}

// Función para iniciar el juego después de la cuenta regresiva
async function iniciarJuego() {
    let select = document.getElementById("selector");
    let tema = select.value;
    console.log("Tema seleccionado:", tema);  // Asegúrate de que el tema está seleccionado correctamente

    if (tema && preguntas[tema]) {
        let div = document.getElementById("popupContent");
        console.log("Iniciando juego con tema:", tema);
        generarPregunta(div, tema, preguntaIndex);  // Empezar con la primera pregunta
    } else {
        alert("No se han cargado las preguntas o el tema seleccionado no es válido.");
    }
}

// Función para generar la pregunta y el contador de 10 segundos
function generarPregunta(div, tema, preguntaIndex) {
    let pregunta = preguntas[tema][preguntaIndex];
    div.innerHTML = ""; // Limpiar contenido previo

    let cont = 10;  // Tiempo de 10 segundos para la respuesta
    let p = document.createElement("p");

    // Intervalo para el contador de 10 segundos
    const intervalo = setInterval(() => {
        p.textContent = `Tiempo restante para responder: ${cont} segundos`;
        div.appendChild(p);
        cont--;

        if (cont < 0) {
            clearInterval(intervalo);
            p.textContent = ""; // Limpiar contador
            let puntos = Math.max(1000 - (10 - cont) * 100, 1);
            puntosTotales += puntos;

            // Mostrar pregunta y opciones
            mostrarPregunta(div, tema, pregunta, preguntaIndex);
        }
    }, 1000);
}

// Función para mostrar la pregunta y opciones
function mostrarPregunta(div, tema, pregunta, preguntaIndex) {
    let h2 = document.createElement("h2");
    h2.textContent = tema.charAt(0).toUpperCase() + tema.slice(1); // Primer letra en mayúscula
    div.appendChild(h2);

    let fieldset = document.createElement("fieldset");
    div.appendChild(fieldset);

    let legend = document.createElement("legend");
    legend.textContent = pregunta.pregunta;
    fieldset.appendChild(legend);

    pregunta.opciones.forEach(opcion => {
        let divOpcion = document.createElement("div");
        fieldset.appendChild(divOpcion);

        let input = document.createElement("input");
        input.type = "radio";
        input.id = opcion.id;
        input.name = tema + preguntaIndex; // Agrupación correcta
        input.value = opcion.id;
        divOpcion.appendChild(input);

        let label = document.createElement("label");
        label.htmlFor = opcion.id;
        label.textContent = opcion.texto;
        divOpcion.appendChild(label);
    });

    // Botón Enviar
    let buttonEnviar = document.createElement("button");
    buttonEnviar.textContent = "Enviar";
    buttonEnviar.onclick = function () {
        let seleccion = document.querySelector(`input[name="${tema + preguntaIndex}"]:checked`);

        if (seleccion) {
            if (seleccion.value === pregunta.respuestaCorrecta) {
                respuestasCorrectas++;
            } else {
                respuestasIncorrectas++;
            }

            if (preguntaIndex < preguntas[tema].length - 1) {
                preguntaIndex++;
                generarPregunta(div, tema, preguntaIndex);
            } else {
                mostrarResultados();
            }
        } else {
            alert("Debes seleccionar una opción antes de enviar.");
        }
    };
    div.appendChild(buttonEnviar);

    let buttonCancelar = document.createElement("button");
    buttonCancelar.className = "close-btn";
    buttonCancelar.textContent = "Cerrar";
    buttonCancelar.onclick = cerrarPopup;
    div.appendChild(buttonCancelar);
}

function cerrarPopup() {
    document.getElementById("popupOverlay").style.display = "none";
}

function mostrarResultados() {
    document.getElementById("popupOverlay").style.display = "none";
    document.getElementById("resultados").style.display = "block";
    document.getElementById("respuestasCorrectas").textContent = `Respuestas correctas: ${respuestasCorrectas}`;
    document.getElementById("respuestasIncorrectas").textContent = `Respuestas incorrectas: ${respuestasIncorrectas}`;
    document.getElementById("puntosTotales").textContent = `Puntos obtenidos: ${puntosTotales}`;
}

function reiniciarTest() {
    puntosTotales = 0;
    respuestasCorrectas = 0;
    respuestasIncorrectas = 0;
    preguntaIndex = 0;
    document.getElementById("resultados").style.display = "none";
    document.getElementById("popupOverlay").style.display = "none";
    document.getElementById("selector").value = "";
}

// Iniciar el contador cuando se elige un test
let select = document.getElementById("selector");

select.addEventListener("change", async () => {
    if (select.value === "") {
        alert("Debes elegir una opción");
    } else {
        console.log("Test seleccionado, cargando preguntas...");
        await cargarPreguntas();  // Asegurarse de que las preguntas se han cargado correctamente antes de iniciar el juego
        iniciarCuentaRegresivaInicio();  // Iniciar cuenta regresiva de 5 segundos solo cuando las preguntas se han cargado
    }
});
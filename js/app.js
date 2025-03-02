let tests = [];
let currentTest = null;
let currentQuestionIndex = 0;
let correctAnswers = 0;
let wrongAnswers = 0;
let totalPoints = 0;
let timer;

// Cargar tests desde el archivo JSON
fetch('http://localhost:5500/js/preguntas.json')
  .then(response => response.json())
  .then(data => {
    tests = data;
    populateTestSelect();
  });

// Llenar el select con los tests disponibles
function populateTestSelect() {
  const select = document.getElementById('test-select');
  tests.forEach(test => {
    const option = document.createElement('option');
    option.value = test.id;
    option.textContent = test.name;
    select.appendChild(option);
  });
}

// Iniciar el juego
document.getElementById('start-btn').addEventListener('click', () => {
  const testId = document.getElementById('test-select').value;
  if (!testId) return alert('Selecciona un test para comenzar.');

  currentTest = tests.find(test => test.id == testId);
  currentQuestionIndex = 0;
  correctAnswers = 0;
  wrongAnswers = 0;
  totalPoints = 0;

  document.getElementById('start-screen').style.display = 'none';
  document.getElementById('game-screen').style.display = 'block';

  startCountdown();
});

// Mostrar la pregunta actual
function showQuestion() {
  clearInterval(timer);

  const question = currentTest.questions[currentQuestionIndex];
  document.getElementById('question').textContent = question.question;

  const optionsDiv = document.getElementById('options');
  optionsDiv.innerHTML = '';

  question.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.textContent = option;
    button.addEventListener('click', () => checkAnswer(index));
    optionsDiv.appendChild(button);
  });

  startTimer();
}

// Revision de las preguntas
function checkAnswer(selectedIndex) {
  clearInterval(timer);

  // Obtener el tiempo restante desde el temporizador
  const timerElement = document.getElementById('question-timer');
  const match = timerElement.textContent.match(/\d+/);
  let timeLeft = 0;

  if (match) {
    timeLeft = parseInt(match[0], 10);
  }

  // Verificar la respuesta
  const question = currentTest.questions[currentQuestionIndex];
  if (selectedIndex === question.correct) {
    correctAnswers++;
    totalPoints += (10 - timeLeft) * 100;
  } else {
    wrongAnswers++;
  }

  // Pasar a la siguiente pregunta o finalizar el juego
  currentQuestionIndex++;
  if (currentQuestionIndex < currentTest.questions.length) {
    showQuestion();
  } else {
    endGame();
  }
}

// Temporizador de 10 segundos para cada pregunta
function startTimer() {
  clearInterval(timer);
  let timeLeft = 10;
  document.getElementById('question-timer').textContent = `Tiempo restante: ${timeLeft} segundos`;

  timer = setInterval(() => {
    timeLeft--;
    document.getElementById('question-timer').textContent = `Tiempo restante: ${timeLeft} segundos`;

    if (timeLeft <= 0) {
      clearInterval(timer);
      checkAnswer(null); // Tiempo agotado, se trata como respuesta nula
    }
  }, 1000);
}

// Finalizar el juego
function endGame() {
  document.getElementById('game-screen').style.display = 'none';
  document.getElementById('result-screen').style.display = 'block';

  document.getElementById('correct-answers').textContent = correctAnswers;
  document.getElementById('wrong-answers').textContent = wrongAnswers;
  document.getElementById('total-points').textContent = totalPoints;
}

// Reiniciar el juego
document.getElementById('restart-btn').addEventListener('click', () => {
  document.getElementById('result-screen').style.display = 'none';
  document.getElementById('start-screen').style.display = 'block';
});

// Countdown inicial de 5 segundos
function startCountdown() {
  clearInterval(timer);
  let countdown = 5;
  document.getElementById('countdown-timer').textContent = `Tiempo restante: ${countdown} segundos`;
  
  const countdownInterval = setInterval(() => {
    if (countdown <= 0) {
      clearInterval(countdownInterval);
      document.getElementById('countdown-timer').textContent = ''; // Limpia el countdown
      showQuestion();
    } else {
      document.getElementById('countdown-timer').textContent = `Tiempo restante: ${countdown} segundos`;
      console.log(`El juego comenzará en ${countdown} segundos...`);
      countdown--;
    }
  }, 1000);
}
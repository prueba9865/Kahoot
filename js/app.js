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

// Verificar la respuesta
function checkAnswer(selectedIndex) {
  clearInterval(timer);
  const question = currentTest.questions[currentQuestionIndex];
  const timeLeft = parseInt(document.getElementById('timer').textContent);

  if (selectedIndex === question.correct) {
    correctAnswers++;
    totalPoints += (10 - timeLeft) * 100;
  } else {
    wrongAnswers++;
  }

  currentQuestionIndex++;
  if (currentQuestionIndex < currentTest.questions.length) {
    showQuestion();
  } else {
    endGame();
  }
}

// Iniciar el temporizador
function startTimer() {
  let timeLeft = 10;
  document.getElementById('timer').textContent = timeLeft;

  timer = setInterval(() => {
    timeLeft--;
    document.getElementById('timer').textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timer);
      checkAnswer(null); // Tiempo agotado
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

// Contador inicial de 5 segundos
function startCountdown() {
  let countdown = 5;
  const countdownInterval = setInterval(() => {
    if (countdown <= 0) {
      clearInterval(countdownInterval);
      showQuestion();
    } else {
        document.getElementById('timer').textContent = countdown
      console.log(`El juego comenzará en ${countdown} segundos...`);
      countdown--;
    }
  }, 1000);
}
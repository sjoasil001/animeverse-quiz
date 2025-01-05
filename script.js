const popup = document.getElementById("popup");
const startQuizBtn = document.getElementById("start-quiz-btn");
const quizContainer = document.getElementById("quiz-container");
const questionHeader = document.getElementById("question-header");
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");


// Show the popup when the page loads
window.addEventListener("load", () => {
  popup.classList.remove("hidden");
});

const customQuestions = [
  { question: "In Hunter x Hunter, what is the name of the tower used for martial arts training?", options: ["Battle Tower", "Heaven's Arena", "Celestial Pillar", "The Coliseum"], answer: "Heaven's Arena" },
  { question: "In Howl's Moving Castle, the setting is inspired by which region?", options: ["Scandinavia", "Western Europe", "Eastern Europe", "The Mediterranean"], answer: "Western Europe" },
  { question: "In Fate/stay night, the Holy Grail War is inspired by which legendary text?", options: ["King Arthur's Tales", "The Epic of Gilgamesh", "Norse Mythology", "The Bible"], answer: "King Arthur's Tales" },
  { question: "In Yuri on Ice, what real-life skating move does Victor teach Yuri?", options: ["Quadruple Salchow", "Biellmann Spin", "Triple Axel", "Triple Lutz"], answer: "Quadruple Salchow" },
  { question: "In Steins;Gate, what scientific theory is central to time travel in the series?", options: ["String Theory", "Butterfly Effect", "Multiverse Theory", "The Observer Effect"], answer: "Butterfly Effect" },
  { question: "In One Piece, what sea does the Straw Hat crew begin their journey in?", options: ["East Blue", "West Blue", "Grand Line", "Calm Belt"], answer: "East Blue" },
  { question: "In The Tale of the Princess Kaguya, what era of Japan is depicted?", options: ["Heian Period", "Edo Period", "Sengoku Period", "Meiji Era"], answer: "Heian Period" },
  { question: "In Magi: The Labyrinth of Magic, what literary work inspired the anime's setting?", options: ["1001 Nights", "The Arabian Nights", "Tales from the Silk Road", "Journey to the West"], answer: "The Arabian Nights" },
  { question: "In Sk8 the Infinity, what sport is the anime centered around?", options: ["Snowboarding", "Skateboarding", "Surfing", "BMX"], answer: "Skateboarding" },
  { question: "What is Goku's Saiyan name in Dragon Ball Z?", options: ["Kakarot", "Vegeta", "Raditz", "Bardock"], answer: "Kakarot" },
  { question: "In Black Clover, what is the name of Asta's grimoire?", options: ["The Anti-Magic Grimoire", "The Five-Leaf Clover Grimoire", "The Black Clover Grimoire", "The Demon Slayer Grimoire"], answer: "The Five-Leaf Clover Grimoire" },
  { question: "In Dr. Stone, what is the primary goal of Senku Ishigami?", options: ["To rebuild civilization through science", "To defeat Tsukasa", "To escape petrification", "To create new weapons"], answer: "To rebuild civilization through science" },
  { question: "In Fullmetal Alchemist, what is the basic law of alchemy?", options: ["The Law of Conservation", "Newton's Third Law", "The Law of Equivalent Exchange", "The Law of Relativity"], answer: "The Law of Equivalent Exchange" },
  { question: "In Attack on Titan, what element makes up the walls protecting humanity?", options: ["Steel", "Crystal", "Wood", "Stone"], answer: "Crystal" },
  { question: " In Arslan Senki, who is Arslan?", options: ["A wandering warrior", "The crown prince of Pars", "A general in the imperial army", "A rebel leader"], answer: "The crown prince of Pars" },
];


async function fetchApiQuestion() {
  try {
    const response = await fetch("https://opentdb.com/api.php?amount=1&category=31&difficulty=hard&type=boolean");
    const data = await response.json();

    return data.results.map((item) => ({
      question: item.question,
      options: shuffle([...item.incorrect_answers, item.correct_answer]),
      answer: item.correct_answer,
    }))[0]; // Return the first question
  } catch (error) {
    console.error("Error fetching API question:", error);
    return null; // Return null if fetching fails
  }
}

async function getCombinedQuestions() {
  const apiQuestion = await fetchApiQuestion(); // Fetch one database question

  // Combine database question with custom questions
  const allQuestions = apiQuestion ? [apiQuestion, ...customQuestions] : customQuestions;

  // Shuffle and select the first 10 questions
  return shuffle(allQuestions).slice(0, 10);
}


function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}


let questions = [];
let currentQuestionIndex = 0;
let score = 0;


function loadQuestion() {
  if (currentQuestionIndex >= questions.length) {
    endQuiz();
    return;
  }

  resetTimer(); // Reset the timer for each question
  

  const currentQuestion = questions[currentQuestionIndex];
  document.getElementById("question-header").textContent = `Question ${currentQuestionIndex + 1}`;
  document.getElementById("question-text").innerHTML = currentQuestion.question;

  const optionsContainer = document.getElementById("options-container");
  optionsContainer.innerHTML = "";

  currentQuestion.options.forEach((option) => {
    const button = document.createElement("button");
    button.textContent = option;
    button.classList.add("option");
    button.addEventListener("click", () => {
      clearInterval(timerInterval); // Stop the timer when an answer is selected
      handleAnswer(option);
    });
    optionsContainer.appendChild(button);
  });

  updateProgressBar();
}




function handleAnswer(selectedOption) {
  const currentQuestion = questions[currentQuestionIndex];
  if (selectedOption === currentQuestion.answer) {
    score++;
    alert("Correct!");
  } else {
    alert(`Wrong! The correct answer was: ${currentQuestion.answer}`);
  }

  currentQuestionIndex++; // Move to the next question
  updateProgressBar();    // Update the progress bar
  loadQuestion();         // Load the next question
}


function resetProgressBar() {
  const progressBar = document.getElementById("progress-bar");
  progressBar.style.width = "0%"; // Ensure progress bar starts empty
}


function endQuiz() {
  let rank;
  if (score === questions.length) {
    rank = "Trivia Legend";
  } else if (score >= 7) {
    rank = "Trivia Pro";
  } else if (score >= 4) {
    rank = "Trivia Novice";
  } else {
    rank = "Better Luck Next Time";
  }

  document.getElementById("quiz-container").innerHTML = `
    <h2>Quiz Complete!</h2>
    <p class="score-text">Your Score: <strong>${score}/${questions.length}</strong></p>
    <p class="rank-text">Rank: <strong>${rank}</strong></p>
    <button class="restart-btn" onclick="location.reload()">Restart Quiz</button>
  `;
}





// Ensure DOM elements exist before referencing them
const triviaBtn = document.getElementById('trivia-btn');
const loadingScreen = document.getElementById('loading-screen');

// Check if the Play button exists on the page
if (triviaBtn) {
  triviaBtn.addEventListener('click', () => {
    // Show the loading screen
    loadingScreen.classList.remove('hidden');

    // Redirect to trivia.html after 2 seconds
    setTimeout(() => {
      window.location.href = 'trivia.html';
    }, 2000);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  const loadingScreen = document.getElementById("loading-screen");
  const quizContainer = document.getElementById("quiz-container");

  // Simulate loading for 2 seconds
  setTimeout(() => {
    loadingScreen.classList.add("hidden"); // Hide the loading screen
    quizContainer.classList.remove("hidden"); // Show the quiz container
    startQuiz(); // Start the quiz logic
  }, 2000); // Adjust the time if needed
});

async function startQuiz() {
  resetProgressBar(); // Reset progress bar before starting
  questions = await getCombinedQuestions(); // Fetch and combine questions
  loadQuestion(); // Load the first question
}


function updateProgressBar() {
  const progressBar = document.getElementById("progress-bar");
  const progress = (currentQuestionIndex / questions.length) * 100; // Start from 0%
  progressBar.style.width = `${progress}%`;
}


document.getElementById("timer").classList.remove("hidden");

let timeLeft = 15; // Timer starts at 15 seconds
let timerInterval;


function startTimer() {
  const timerElement = document.getElementById("timer");
  timerElement.textContent = `${timeLeft}s`;

  timerInterval = setInterval(() => {
    timeLeft--;
    timerElement.textContent = `${timeLeft}s`;

    if (timeLeft < 0) { // Change condition to allow displaying 0
      clearInterval(timerInterval);
      handleTimeOut(); // Handle what happens when time runs out
    }
  }, 1000); // Update every second
}


function resetTimer() {
  clearInterval(timerInterval);
  timeLeft = 15; // Reset timer to initial value
  startTimer(); // Restart the timer
}


function handleTimeOut() {
  timeLeft = 0; // Ensure no negative values
  alert("Time's up!");
  currentQuestionIndex++;
  updateProgressBar();
  loadQuestion();
}





// Hide the popup and show the quiz when "Start Quiz" is clicked
startQuizBtn.addEventListener("click", () => {
  popup.classList.add("hidden");
  quizContainer.classList.remove("hidden");
});



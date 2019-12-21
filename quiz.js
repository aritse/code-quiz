const questions = [
  {
    title: "Which of the following is an advantage of using JavaScript?",
    choices: ["Less server interaction", "Immediate feedback to the visitors", "Increased interactivity", "All of the above"],
    answer: "All of the above"
  },
  {
    title: "Which of the following type of variable is visible everywhere in your JavaScript code?",
    choices: ["global variable", "local variable", "Both of the above", "None of the above"],
    answer: "global variable"
  },
  {
    title: "Which built-in method adds one or more elements to the end of an array and returns the new length of the array?",
    choices: ["last()", "put()", "push()", "None of the above"],
    answer: "push()"
  },
  {
    title: "Which of the following code creates an object?",
    choices: ["let book = Object();", "let book = new Object();", "let book = new OBJECT();", "let book = new Book();"],
    answer: "let book = new Object();"
  },
  {
    title: "Which of the following function of Boolean object returns a string containing the source of the Boolean object?",
    choices: ["toSource()", "valueOf()", "toString()", "None of the above"],
    answer: "toSource()"
  },
  {
    title:
      "Which of the following function of String object is used to find a match between a regular expression and a string, and to replace the matched substring with a new substring?",
    choices: ["concat()", "match()", "replace()", "search()"],
    answer: "replace()"
  },
  {
    title: "Which of the following function of String object creates a string to be   ed as bold as if it were in a <b> tag?",
    choices: ["anchor()", "big()", "blink()", "bold()"],
    answer: "bold()"
  },
  {
    title: "Which of the following function of String object causes a string to be displayed as a superscript, as if it were in a <sup> tag?",
    choices: ["sup()", "small()", "strike()", "sub()"],
    answer: "sup()"
  },
  {
    title: "Which of the following function of Array object joins all elements of an array into a string?",
    choices: ["concat()", "join()", "pop()", "map()"],
    answer: "join()"
  },
  {
    title: "Which of the following function of Array object returns true if at least one element in this array satisfies the provided testing function?",
    choices: ["reverse()", "shift()", "slice()", "some()"],
    answer: "some()"
  }
];
const numOfQuestions = questions.length;
const secPerQuestion = 10;
const timeLimit = secPerQuestion * numOfQuestions;

let quizScore;
let currentQuestion;
let numOfCorrect;
let secondsLeft;

let interval;

window.onload = loadStartPage;

function loadStartPage() {
  initializeGlobals();
  clearPage();
  renderHeader();
  renderWelcome();
}

function initializeGlobals() {
  quizScore = 0;
  currentQuestion = 0;
  numOfCorrect = 0;
  secondsLeft = timeLimit;
}

function clearPage() {
  document.body.innerHTML = "";
}

function renderHeader() {
  const highScores = document.createElement("span");
  highScores.setAttribute("id", "high-scores");
  highScores.addEventListener("click", viewHighScores);
  highScores.textContent = "High Scores";

  const correctAnswers = document.createElement("span");
  correctAnswers.setAttribute("id", "correct-answers");
  correctAnswers.textContent = "Correct: " + numOfCorrect;

  const timeLeft = document.createElement("span");
  timeLeft.setAttribute("id", "time");
  timeLeft.textContent = "Time: " + secondsLeft;

  const header = document.createElement("div");
  header.className = "header";
  header.appendChild(highScores);
  header.appendChild(correctAnswers);
  header.appendChild(timeLeft);

  document.body.appendChild(header);
}

function viewHighScores() {
  clearPage();

  const highScores = document.createElement("h1");
  highScores.textContent = "High Scores";
  document.body.appendChild(highScores);

  const backButton = document.createElement("button");
  backButton.setAttribute("id", "back-button");
  backButton.addEventListener("click", loadStartPage);
  backButton.textContent = "Go Back";

  const clearButton = document.createElement("button");
  clearButton.setAttribute("id", "clear-button");
  clearButton.addEventListener("click", clearLocalStorage);
  clearButton.textContent = "Clear";

  const keys = Object.keys(localStorage).filter(k => k.startsWith("Quiz"));
  if (keys.length > 0) {
    const ranking = document.createElement("ol");
    keys.forEach(key => {
      const score = localStorage.getItem(key);
      const initials = key.split(": ")[1];

      const entry = document.createElement("li");
      entry.textContent = initials + ": " + score;
      ranking.appendChild(entry);
    });
    document.body.appendChild(ranking);
  } else {
    const message = document.createElement("p");
    message.textContent = "There is no data";
    clearButton.disabled = true;
    document.body.appendChild(message);
  }

  document.body.appendChild(backButton);
  document.body.appendChild(clearButton);
}

function renderWelcome() {
  const greeting = document.createElement("h1");
  greeting.textContent = "Coding Quiz Challenge";

  const instruction = document.createElement("p");
  instruction.setAttribute("id", "instruction");
  instruction.textContent =
    "Answer the following questions within the time limit. Keep in mind that incorrect answers will penalize your score by reducing the time limit by 10 seconds.";

  const startButton = document.createElement("button");
  startButton.addEventListener("click", startQuiz);
  startButton.textContent = "Start Quiz";

  const welcome = document.createElement("div");

  welcome.appendChild(greeting);
  welcome.appendChild(instruction);
  welcome.appendChild(startButton);

  document.body.appendChild(welcome);
}

function startQuiz(event) {
  event.preventDefault();
  clearPage();
  renderHeader();
  createQuestionContainer();
  loadQuestionData();
  interval = setInterval(countDown, 1000);
}

function createQuestionContainer() {
  const progress = document.createElement("p");
  progress.setAttribute("id", "progress");

  const title = document.createElement("p");
  title.setAttribute("id", "title");

  const choices = document.createElement("div");
  choices.setAttribute("id", "choices");
  choices.addEventListener("click", evaluateAnswer);
  for (let i = 0; i < 4; i++) {
    const choice = document.createElement("button");
    choice.setAttribute("id", "button-" + i);
    choices.appendChild(choice);
  }

  const questionContainer = document.createElement("div");
  questionContainer.appendChild(progress);
  questionContainer.appendChild(title);
  questionContainer.appendChild(choices);

  document.body.appendChild(questionContainer);
}

function evaluateAnswer(event) {
  event.preventDefault();
  if (event.target.matches("button")) {
    if (event.target.textContent == questions[currentQuestion].answer) {
      secondsLeft += secPerQuestion;
      numOfCorrect++;
      const correctAnswers = document.querySelector("#correct-answers");
      correctAnswers.textContent = "Correct: " + numOfCorrect;
    } else {
      secondsLeft -= secPerQuestion;
    }
    currentQuestion++;
    loadQuestionData();
  }
}

function loadQuestionData() {
  if (currentQuestion >= numOfQuestions) {
    doneQuiz("All questions answered");
  } else {
    const progress = document.querySelector("#progress");
    progress.textContent = "Question " + (currentQuestion + 1) + " of " + numOfQuestions;

    const title = document.querySelector("#title");
    title.textContent = questions[currentQuestion].title;

    for (let i = 0; i < 4; i++) {
      const choice = document.querySelector("#button-" + i);
      choice.textContent = questions[currentQuestion].choices[i];
    }
  }
}

function countDown() {
  const time = document.querySelector("#time");
  if (secondsLeft > 0) {
    secondsLeft--;
    time.textContent = "Time: " + secondsLeft;
  } else {
    doneQuiz("Time out");
  }
}

function doneQuiz(message) {
  clearInterval(interval);

  clearPage();
  renderHeader();

  const done = document.createElement("h1");
  done.textContent = message;

  quizScore = calculateScore();
  const notification = document.createElement("p");
  notification.textContent = "Your score is: " + quizScore;

  const label = document.createElement("label");
  label.textContent = "Enter your initials: ";

  const initials = document.createElement("input");
  initials.setAttribute("id", "initials");

  const submitButton = document.createElement("button");
  submitButton.addEventListener("click", saveScore);
  submitButton.textContent = "Submit";

  const lastPage = document.createElement("div");

  lastPage.appendChild(done);
  lastPage.appendChild(notification);
  lastPage.appendChild(label);
  lastPage.appendChild(initials);
  lastPage.appendChild(submitButton);

  document.body.appendChild(lastPage);
}

function calculateScore() {
  return numOfCorrect > 0 ? numOfCorrect * secPerQuestion + secondsLeft : 0;
}

function saveScore(event) {
  event.preventDefault();
  const initials = document.querySelector("#initials").value;
  localStorage.setItem("Quiz: " + initials.toUpperCase(), quizScore);
  loadStartPage();
}

function clearLocalStorage(event) {
  event.preventDefault();
  localStorage.clear();
  clearPage();
  viewHighScores();
}

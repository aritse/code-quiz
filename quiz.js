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
let interval;
let secondsLeft;

function renderHeader() {
  const highScores = document.createElement("a");
  highScores.setAttribute("id", "highscores");
  highScores.setAttribute("href", "");
  highScores.addEventListener("click", viewHighScores);
  highScores.textContent = "Highscores";

  const points = document.createElement("span");
  points.setAttribute("id", "points");
  points.textContent = "Correct: 0";

  const time = document.createElement("span");
  time.setAttribute("id", "time");
  time.textContent = "Time: 0";

  const header = document.createElement("div");
  header.setAttribute("id", "header");
  header.appendChild(highScores);
  header.appendChild(points);
  header.appendChild(time);

  document.body.appendChild(header);
}

function renderWelcome() {
  const title = document.createElement("h1");
  title.textContent = "Coding Quiz Challenge";

  const instruction = document.createElement("p");
  instruction.textContent = "Answer the following questions within the time limit. Keep in mind that incorrect answers will penalize your score.";

  const startButton = document.createElement("button");
  startButton.setAttribute("id", "start");
  startButton.addEventListener("click", startQuiz);
  startButton.textContent = "Start";

  const welcome = document.createElement("div");
  welcome.setAttribute("id", "welcome");

  welcome.appendChild(title);
  welcome.appendChild(instruction);
  welcome.appendChild(startButton);

  document.body.appendChild(welcome);
}

function renderStartPage() {
  document.body.innerHTML = "";
  renderHeader();
  renderWelcome();
}

function initializeGlobals() {
  quizScore = 0;
  currentQuestion = 0;
  numOfCorrect = 0;
  secondsLeft = timeLimit;
}

function createElements() {
  const progress = document.createElement("p");
  progress.setAttribute("id", "progress");

  const title = document.createElement("h2");
  title.setAttribute("id", "title");

  const choices = document.createElement("div");
  choices.setAttribute("id", "choices");
  choices.addEventListener("click", nextQuestion);
  for (let i = 0; i < 4; i++) {
    const choice = document.createElement("button");
    choice.setAttribute("id", "button" + i);
    choices.appendChild(choice);
  }

  const questionSection = document.createElement("div");
  questionSection.setAttribute("id", "question-section");
  questionSection.appendChild(progress);
  questionSection.appendChild(title);
  questionSection.appendChild(choices);

  document.body.appendChild(questionSection);
}

function loadQuestion() {
  if (currentQuestion >= numOfQuestions) {
    doneQuiz("All questions answered");
    return;
  }

  const progress = document.querySelector("#progress");
  progress.textContent = "Question " + (currentQuestion + 1) + " of " + numOfQuestions;

  document.querySelector("#title").textContent = questions[currentQuestion].title;

  for (let i = 0; i < 4; i++) {
    const choice = document.querySelector("#button" + i);
    choice.textContent = questions[currentQuestion].choices[i];
  }
}

function startQuiz(event) {
  event.preventDefault();
  initializeGlobals();

  const time = document.querySelector("#time");
  time.textContent = "Time:" + secondsLeft;

  const welcome = document.querySelector("#welcome");
  welcome.parentNode.removeChild(welcome);

  createElements();
  loadQuestion();
  interval = setInterval(countDown, 1000);
}

function clearLocalStorage(event) {
  event.preventDefault();
  localStorage.clear();
  this.disabled = true;
  const highScores = document.querySelector("#highscores");
  highScores.parentNode.removeChild(highScores);
}

function viewHighScores(event) {
  event.preventDefault();
  document.body.innerHTML = "";

  const goBackButton = document.createElement("button");
  goBackButton.addEventListener("click", renderStartPage);
  goBackButton.textContent = "Go Back";

  const clearButton = document.createElement("button");
  clearButton.setAttribute("id", "clear");
  clearButton.addEventListener("click", clearLocalStorage);
  clearButton.textContent = "Clear";

  const students = Object.keys(localStorage).filter(key => key.startsWith("Student:"));
  if (students.length == 0) {
    const h3 = document.createElement("h3");
    h3.textContent = "There is no data";
    document.body.appendChild(h3);
    clearButton.disabled = true;
  } else {
    const highScores = document.createElement("div");
    highScores.setAttribute("id", "highscores");
    for (let i = 0; i < students.length; i++) {
      const input = document.createElement("input");
      input.readOnly = true;
      const score = localStorage.getItem(students[i]);
      input.value = students[i].split(":")[1] + ":" + score;
      highScores.appendChild(input);
    }
    document.body.appendChild(highScores);
  }

  document.body.appendChild(goBackButton);
  document.body.appendChild(clearButton);
}

function nextQuestion(event) {
  event.preventDefault();
  if (event.target.matches("button")) {
    if (event.target.textContent == questions[currentQuestion].answer) {
      secondsLeft += secPerQuestion;
      numOfCorrect++;
      document.querySelector("#points").textContent = "Correct:" + numOfCorrect;
    } else {
      secondsLeft -= secPerQuestion;
    }
    currentQuestion++;
    loadQuestion();
  }
}

function countDown() {
  const timerDisplay = document.querySelector("#time");
  if (secondsLeft > 0) {
    secondsLeft--;
    timerDisplay.textContent = "Time: " + secondsLeft;
  } else {
    doneQuiz("Time out");
  }
}

function saveScore(event) {
  event.preventDefault();
  const initials = document.querySelector("#initials").value;
  localStorage.setItem("Student: " + initials, quizScore);
  renderStartPage();
}

function doneQuiz(message) {
  clearInterval(interval);

  const questionSection = document.querySelector("#question-section");
  questionSection.parentNode.removeChild(questionSection);

  const done = document.createElement("h2");
  done.textContent = message;

  quizScore = calculateScore();
  const grade = document.createElement("h4");
  grade.textContent = "Your score is: " + quizScore;

  const label = document.createElement("label");
  label.textContent = "Enter your initials: ";

  const initials = document.createElement("input");
  initials.setAttribute("id", "initials");

  const submitButton = document.createElement("button");
  submitButton.addEventListener("click", saveScore);
  submitButton.textContent = "Submit";

  const over = document.createElement("div");
  over.setAttribute("id", "over");

  over.appendChild(done);
  over.appendChild(grade);
  over.appendChild(label);
  over.appendChild(initials);
  over.appendChild(submitButton);

  document.body.appendChild(over);
}

function calculateScore() {
  return numOfCorrect > 0 ? numOfCorrect * secPerQuestion + secondsLeft : 0;
}

window.onload = renderStartPage;

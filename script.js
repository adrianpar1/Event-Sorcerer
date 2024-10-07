// Array to store answers
let answers = [];

// Example questions
const questions = [
  'What is the event date?',
  'What is the event location?',
  'Who are the invitees?'
];

// Initialize the first question
let currentQuestionIndex = 0;

function showNextQuestion() {
  if (currentQuestionIndex < questions.length) {
    document.getElementById('question-text').innerText = questions[currentQuestionIndex];
    document.getElementById('answer-input').value = ''; // Clear previous input
    document.getElementById('answer-input').focus(); // Focus on input
  } else {
    showAnswers();
  }
}

function showAnswers() {
  const answersContainer = document.getElementById('answers-container');
  const answersList = document.getElementById('answers-list');

  // Clear previous answers
  answersList.innerHTML = '';

  // Create form elements for each answer
  answers.forEach((answer, index) => {
    const formGroup = document.createElement('div');
    formGroup.classList.add('answer-item');
    
    const label = document.createElement('label');
    label.innerText = questions[index];
    
    const input = document.createElement('input');
    input.type = 'text';
    input.value = answer;
    input.setAttribute('name', `answer-${index}`);
    
    formGroup.appendChild(label);
    formGroup.appendChild(input);
    
    answersList.appendChild(formGroup);
  });

  answersContainer.style.display = 'block'; // Show the answers container
  document.getElementById('question-container').style.display = 'none'; // Hide question container
}

// Handle submit button click
document.getElementById('submit-button').addEventListener('click', () => {
  const answerInput = document.getElementById('answer-input');
  answers.push(answerInput.value);
  currentQuestionIndex++;
  showNextQuestion();
});

// Handle add-to-calendar button click
document.getElementById('add-to-calendar-button').addEventListener('click', () => {
  // Code to add the event to a calendar
});

// Start with the first question
showNextQuestion();
const summarizerBtn = document.getElementById('summarizerBtn');
const classifierBtn = document.getElementById('classifierBtn');

summarizerBtn.addEventListener('click', () => {
  window.location.href = '/summarizer'; // Redirect to summarizer route
});

classifierBtn.addEventListener('click', () => {
  window.location.href = '/classifier'; // Redirect to classifier route
});

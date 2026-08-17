const historyPanel = document.getElementById('historyPanel');
const historyToggle = document.getElementById('historyToggle');
const clearHistory = document.getElementById('clearHistory');
const historyList = document.getElementById('historyList');

let history = JSON.parse(localStorage.getItem('calculatorHistory') || '[]');

function renderHistory() {
  historyList.innerHTML = '';
  if (!history.length) {
    historyList.innerHTML = '<div class="empty">No calculations yet.<br>History is ready for Commit 2.</div>';
    return;
  }
  history.slice().reverse().forEach(item => {
    const div = document.createElement('div');
    div.className = 'history-item';
    div.innerHTML = `<small>${item.time}</small><strong>${item.expression}</strong><div>= ${item.result}</div>`;
    historyList.appendChild(div);
  });
}

historyToggle.addEventListener('click', () => historyPanel.classList.toggle('hidden'));

clearHistory.addEventListener('click', () => {
  history = [];
  localStorage.removeItem('calculatorHistory');
  renderHistory();
});

renderHistory();

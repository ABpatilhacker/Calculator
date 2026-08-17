const expressionEl = document.getElementById('expression');
const resultEl = document.getElementById('result');
const historyList = document.getElementById('historyList');
const historyPanel = document.getElementById('historyPanel');

let expression = '';
let history = JSON.parse(localStorage.getItem('calculatorHistory') || '[]');

function renderHistory(){
  historyList.innerHTML = history.length ? '' : '<div class="empty">No calculations yet.</div>';
  history.slice().reverse().forEach(item=>{
    const el=document.createElement('div');
    el.className='history-item';
    el.innerHTML=`<small>${item.time}</small><strong>${item.expression}</strong><div>= ${item.result}</div>`;
    historyList.appendChild(el);
  });
}

function updateDisplay(){
  expressionEl.textContent = expression || 'Ready';
  if(!expression) resultEl.textContent='0';
}

function calculate(){
  if(!expression) return;
  try{
    const normalized = expression.replace(/%/g,'/100');
    const result = Function('"use strict"; return (' + normalized + ')')();
    if(!Number.isFinite(result)) throw new Error();
    const clean = Number.isInteger(result) ? result : Number(result.toFixed(8));
    resultEl.textContent = clean;
    history.push({expression:expression.replace(/\*/g,'×').replace(/\//g,'÷'),result:clean,time:new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})});
    localStorage.setItem('calculatorHistory',JSON.stringify(history));
    renderHistory();
    expression = String(clean);
    expressionEl.textContent = expression;
  }catch{
    resultEl.textContent='Error';
  }
}

document.querySelectorAll('.keys button').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const value=btn.dataset.value;
    const action=btn.dataset.action;
    if(value){ expression += value; updateDisplay(); }
    if(action==='clear'){ expression=''; updateDisplay(); }
    if(action==='delete'){ expression=expression.slice(0,-1); updateDisplay(); }
    if(action==='equals') calculate();
  });
});

document.getElementById('clearHistory').onclick=()=>{history=[];localStorage.removeItem('calculatorHistory');renderHistory();};
document.getElementById('historyToggle').onclick=()=>historyPanel.classList.toggle('hidden');
renderHistory();

const expressionEl=document.getElementById('expression');
const resultEl=document.getElementById('result');
const historyList=document.getElementById('historyList');
const historyPanel=document.getElementById('historyPanel');

let expression='';
let justCalculated=false;
let history=JSON.parse(localStorage.getItem('calculatorHistory')||'[]');

const pretty=s=>s.replace(/\*/g,'×').replace(/\//g,'÷');

function renderHistory(){
  historyList.innerHTML=history.length?'':'<div class="empty">Your calculations will appear here.</div>';
  history.slice().reverse().forEach((item)=>{
    const el=document.createElement('div');
    el.className='history-item';
    el.title='Tap to reuse this result';
    el.innerHTML=`<small>${item.time}</small><strong>${item.expression}</strong><div>= ${item.result}</div>`;
    el.addEventListener('click',()=>{
      expression=String(item.result);
      expressionEl.textContent=expression;
      resultEl.textContent=item.result;
    });
    historyList.appendChild(el);
  });
}

function updateDisplay(){
  expressionEl.textContent=expression?pretty(expression):'Ready';
  if(!expression) resultEl.textContent='0';
}

function appendValue(value){
  const operators=['+','-','*','/'];
  if(justCalculated && !operators.includes(value) && value!=='%') expression='';
  justCalculated=false;

  const last=expression.slice(-1);
  if(operators.includes(value) && operators.includes(last)){
    expression=expression.slice(0,-1)+value;
  }else{
    expression+=value;
  }
  updateDisplay();
}

function evaluateExpression(){
  if(!expression) return;
  try{
    let safe=expression.replace(/%/g,'/100');
    if(!/^[0-9+\-*/.() ]+$/.test(safe)) throw new Error('Invalid');
    const result=Function('"use strict";return ('+safe+')')();
    if(!Number.isFinite(result)) throw new Error('Math');
    const clean=Number.isInteger(result)?result:Number(result.toFixed(8));

    resultEl.textContent=clean;
    history.push({
      expression:pretty(expression),
      result:clean,
      time:new Date().toLocaleString([], {hour:'2-digit',minute:'2-digit',day:'2-digit',month:'short'})
    });
    if(history.length>30) history=history.slice(-30);
    localStorage.setItem('calculatorHistory',JSON.stringify(history));
    renderHistory();
    expression=String(clean);
    expressionEl.textContent=pretty(expression);
    justCalculated=true;
  }catch{
    resultEl.textContent='Error';
  }
}

function handleAction(action){
  if(action==='clear'){
    expression='';
    justCalculated=false;
    updateDisplay();
  }else if(action==='delete'){
    expression=expression.slice(0,-1);
    updateDisplay();
  }else if(action==='sign'){
    if(!expression) expression='-';
    else if(expression.startsWith('-')) expression=expression.slice(1);
    else expression='-'+expression;
    updateDisplay();
  }else if(action==='equals'){
    evaluateExpression();
  }
}

document.querySelectorAll('.keys button').forEach(btn=>{
  btn.addEventListener('click',()=>{
    if(btn.dataset.value!==undefined) appendValue(btn.dataset.value);
    else handleAction(btn.dataset.action);
  });
});

document.addEventListener('keydown',e=>{
  if(/[0-9.+\-*/%]/.test(e.key) && e.key.length===1) appendValue(e.key);
  else if(e.key==='Enter'||e.key==='=') evaluateExpression();
  else if(e.key==='Backspace') handleAction('delete');
  else if(e.key==='Escape') handleAction('clear');
});

document.getElementById('clearHistory').addEventListener('click',()=>{
  history=[];
  localStorage.removeItem('calculatorHistory');
  renderHistory();
});

document.getElementById('historyToggle').addEventListener('click',()=>{
  historyPanel.classList.toggle('hidden');
});

renderHistory();

/* ============================================
   MISSÃO ROTINA — game.js
   ============================================ */

// ================================================
// CAMINHO BASE DAS IMAGENS
// ================================================
const IMG = 'assets/';

// ================================================
// DADOS DAS FASES
// ================================================
const phases = [
  {
    id: 1, icon: '🌅', title: 'Começar o Dia!',
    bg: 'linear-gradient(135deg,#84E6F8,#3EC8E8)', pbColor: '#0AACCC',
    desc: 'Arraste os blocos na ordem certa para ir à escola',
    mission: 'Hora de começar o dia! Coloque as ações na ordem correta para ir à escola.',
    blocks: [
      { id: 'lb', name: 'Levantar da cama',  icon: '🛏️', img: 'Fundo.png' },
      { id: 'ab', name: 'Arrumar a cama',    icon: '🛋️', img: 'Designer.png' },
      { id: 'tr', name: 'Trocar de roupa',   icon: '👕', img: 'Designer (1).png' },
      { id: 'es', name: 'Escovar os dentes', icon: '🪥', img: 'Designer (2).png' },
      { id: 'mo', name: 'Arrumar a mochila', icon: '🎒', img: 'Designer (4).png' },
      { id: 'ir', name: 'Ir para a escola',  icon: '🏫', img: 'Designer (5).png' }
    ],
    sequence: ['lb', 'ab', 'tr', 'es', 'mo', 'ir']
  },
  {
    id: 2, icon: '📚', title: 'Tarefa de Casa!',
    bg: 'linear-gradient(135deg,#B0E3AC,#5BB751)', pbColor: '#3A8C32',
    desc: 'Organize as etapas para fazer sua lição',
    mission: 'Hora da lição! Organize as etapas para fazer a tarefa de casa.',
    blocks: [
      { id: 'am', name: 'Arrumar o material',   icon: '📦', img: '' },
      { id: 'om', name: 'Organizar a mesa',      icon: '🪑', img: '' },
      { id: 'ac', name: 'Abrir o caderno',       icon: '📖', img: '' },
      { id: 'ra', name: 'Resolver a atividade',  icon: '✏️', img: '' },
      { id: 'ft', name: 'Finalizar a tarefa',    icon: '✅', img: '' },
      { id: 'gm', name: 'Guardar os materiais',  icon: '🎒', img: '' }
    ],
    sequence: ['am', 'om', 'ac', 'ra', 'ft', 'gm']
  },
  {
    id: 3, icon: '🎮', title: 'Hora de Brincar!',
    bg: 'linear-gradient(135deg,#F29CA3,#E06070)', pbColor: '#C62A2A',
    desc: 'Organize o momento de brincar e guardar os brinquedos',
    mission: 'Vamos brincar! Mas primeiro organize as etapas certinho.',
    blocks: [
      { id: 'pb', name: 'Pegar a caixa',        icon: '📦', img: '' },
      { id: 'cb', name: 'Escolher brinquedos',  icon: '🧸', img: '' },
      { id: 'br', name: 'Brincar',              icon: '🎮', img: '' },
      { id: 'db', name: 'Dividir com amigos',   icon: '🤝', img: '' },
      { id: 'ob', name: 'Organizar brinquedos', icon: '🗂️', img: '' },
      { id: 'gb', name: 'Guardar na caixa',     icon: '📫', img: '' }
    ],
    sequence: ['pb', 'cb', 'br', 'db', 'ob', 'gb']
  },
  {
    id: 4, icon: '🥪', title: 'Hora do Lanche!',
    bg: 'linear-gradient(135deg,#F9E784,#F0C800)', pbColor: '#D4A800',
    desc: 'Monte seu sanduíche passo a passo',
    mission: 'Que fome! Vamos fazer um sanduíche gostoso. Siga a sequência!',
    blocks: [
      { id: 'ic',  name: 'Ir à cozinha',         icon: '🚶', img: '' },
      { id: 'si',  name: 'Separar ingredientes', icon: '🥗', img: '' },
      { id: 'pp',  name: 'Pegar um prato',       icon: '🍽️', img: '' },
      { id: 'pa',  name: 'Pegar o pão',          icon: '🍞', img: '' },
      { id: 'cp',  name: 'Pão no prato',         icon: '🥖', img: '' },
      { id: 'mon', name: 'Montar o sanduíche',   icon: '🥪', img: '' },
      { id: 'sm',  name: 'Sentar à mesa',        icon: '🪑', img: '' },
      { id: 'co',  name: 'Comer o lanche',       icon: '😋', img: '' }
    ],
    sequence: ['ic', 'si', 'pp', 'pa', 'cp', 'mon', 'sm', 'co']
  },
  {
    id: 5, icon: '💻', title: 'Computação!',
    bg: 'linear-gradient(135deg,#D8A8E8,#AE5ABF)', pbColor: '#7B2FA0',
    desc: 'Organize as etapas para enviar um arquivo pelo computador',
    mission: 'Vamos aprender computação! Organize as etapas para enviar um arquivo.',
    blocks: [
      { id: 'ca', name: 'Criar o arquivo',      icon: '📄', img: '' },
      { id: 'sa', name: 'Salvar o arquivo',     icon: '💾', img: '' },
      { id: 'ei', name: 'Enviar pela internet', icon: '📤', img: '' },
      { id: 'sr', name: 'Servidor receber',     icon: '🖥️', img: '' },
      { id: 'ga', name: 'Guardar no sistema',   icon: '🗄️', img: '' }
    ],
    sequence: ['ca', 'sa', 'ei', 'sr', 'ga']
  }
];

// ================================================
// ESTADO DO JOGO
// ================================================
let currentPhase   = 0;
let slots          = [];
let score          = 0;
let phaseScores    = [0, 0, 0, 0, 0];
let phaseStars     = [0, 0, 0, 0, 0];
let dragItem       = null;
let hintCount      = 0;
let errorCount     = 0;
let hadError       = false;
let phaseStartTime = 0;
const FAST_TIME_MS = 30000;
// Total máximo de estrelas por fase = 4
const MAX_STARS_PER_PHASE = 4;

const sayings = {
  correct: ['Incrível! Você acertou! 🎉','Muito bem! Continue assim! 🌟','Que esperto! 🏆','Perfeito! Você arrasou! ✨','Show de bola! 🎊'],
  wrong:   ['Quase! Tenta de novo! 💪','Não foi dessa vez! Você consegue! 🙂','Pense bem... qual vem primeiro? 🤔']
};

// ================================================
// SISTEMA DE PONTUAÇÃO
// ================================================
function calcScore(ph, slots, errCnt, hadErr, elapsedMs) {
  const total   = ph.sequence.length;
  const correct = ph.sequence.filter((id, i) => slots[i] === id).length;
  const ratio   = correct / total;
  let base = 0, stars = 0;
  if (correct === total)  { base = 20; stars = 4; }
  else if (ratio >= 0.67) { base = 15; stars = 3; }
  else if (ratio >= 0.50) { base = 10; stars = 2; }
  else if (correct >= 1)  { base =  5; stars = 1; }
  else                    { base =  0; stars = 0; }
  let penalty = 0;
  if (errCnt > 3)      penalty += 5;
  if (ratio < 0.25)    penalty += 3;
  let bonus = 0;
  if (correct === total) {
    if (!hadErr)                   bonus += 10;
    if (elapsedMs <= FAST_TIME_MS) bonus +=  5;
    if (hadErr)                    bonus +=  3;
  }
  return { pts: Math.max(0, base - penalty + bonus), stars, correct, total, base, penalty, bonus, ratio, errCnt };
}

// ================================================
// ESTRELAS NO HEADER — dinâmicas
// Mostra o total de estrelas acumuladas pelo jogador
// ================================================
function updateHeaderStars() {
  const totalEarned = phaseStars.reduce((a, b) => a + b, 0);
  const maxTotal    = phases.length * MAX_STARS_PER_PHASE; // 20
  const starsRow    = document.getElementById('starsRow');

  // Limpa e reconstrói as estrelas (mostra até 20, mas agrupa visualmente)
  starsRow.innerHTML = '';

  // Para não sobrecarregar o header, mostramos barras de 5 estrelas
  // Cada "bloco" de 4 = 1 fase completa
  for (let i = 0; i < maxTotal; i++) {
    const span = document.createElement('span');
    span.className = 'star' + (i < totalEarned ? ' on' : '');
    span.textContent = '⭐';
    starsRow.appendChild(span);
  }

  // Label com contagem
  let label = starsRow.nextElementSibling;
  if (!label || !label.classList.contains('stars-total-label')) {
    label = document.createElement('div');
    label.className = 'stars-total-label';
    starsRow.parentNode.insertBefore(label, starsRow.nextSibling);
  }
  label.textContent = totalEarned + ' / ' + maxTotal + ' ⭐';
}

// ================================================
// TELA DE CONCLUSÃO DE FASE
// ================================================
function showPhaseComplete(result, ph, isLastPhase) {
  const overlay = document.getElementById('phaseCompleteOverlay');
  const icon    = document.getElementById('pcPhaseIcon');
  const title   = document.getElementById('pcTitle');
  const starsW  = document.getElementById('pcStarsWrap');
  const scoreLn = document.getElementById('pcScoreLine');
  const details = document.getElementById('pcDetails');
  const btnNext = document.getElementById('pcBtnNext');

  // Ícone e título
  icon.textContent  = ph.icon;
  title.textContent = 'Fase ' + ph.id + ' Concluída!';

  // Estrelas ganhas nesta fase (máx 4)
  starsW.innerHTML = '';
  for (let i = 0; i < MAX_STARS_PER_PHASE; i++) {
    const s = document.createElement('span');
    s.className = 'pc-star';
    s.textContent = '⭐';
    starsW.appendChild(s);
    // Acende com delay para animação escalonada
    if (i < result.stars) {
      setTimeout(() => s.classList.add('lit'), 80 + i * 220);
    }
  }

  // Pontuação total da fase
  scoreLn.textContent = '+' + result.pts + ' pontos!';
  scoreLn.style.color = result.pts > 0 ? 'var(--verde)' : '#999';

  // Detalhes: base, bônus e penalidades
  details.innerHTML = '';

  // Linha base
  addDetailRow(details, 'base', '🎯', 'Pontuação base (' + result.correct + '/' + result.total + ')', '+' + result.base + ' pts');

  // Linhas de bônus
  if (result.bonus > 0) {
    details.innerHTML += '<div class="pc-detail-divider"></div>';
    if (!hadError && result.correct === result.total)
      addDetailRow(details, 'bonus', '🎯', 'Sequência perfeita!', '+10 pts');
    if (phaseStartTime && (Date.now() - phaseStartTime) <= FAST_TIME_MS && result.correct === result.total)
      addDetailRow(details, 'bonus', '⚡', 'Rapidez!', '+5 pts');
    if (hadError && result.correct === result.total)
      addDetailRow(details, 'bonus', '💪', 'Persistência!', '+3 pts');
  }

  // Penalidades
  if (result.penalty > 0) {
    details.innerHTML += '<div class="pc-detail-divider"></div>';
    if (result.errCnt > 3)
      addDetailRow(details, 'penalty', '⚠️', 'Muitos erros (' + result.errCnt + ')', '-5 pts');
    if (result.ratio < 0.25)
      addDetailRow(details, 'penalty', '⚠️', 'Sequência bagunçada', '-3 pts');
  }

  // Botão
  if (isLastPhase) {
    btnNext.textContent = '🏆 Parabéns! Fim do Jogo!';
    btnNext.className   = 'pc-btn-next game-done';
  } else {
    btnNext.textContent = 'Próxima Fase ➡️';
    btnNext.className   = 'pc-btn-next';
  }

  // Exibe o overlay
  overlay.classList.add('visible');
}

function addDetailRow(container, type, emoji, label, value) {
  const row = document.createElement('div');
  row.className = 'pc-detail-row ' + type;
  row.innerHTML =
    '<span class="pc-detail-label">' + emoji + ' ' + label + '</span>' +
    '<span class="pc-detail-value">' + value + '</span>';
  container.appendChild(row);
}

function advancePhase() {
  const overlay = document.getElementById('phaseCompleteOverlay');
  overlay.classList.remove('visible');
  if (currentPhase < phases.length - 1) {
    currentPhase++;
    initPhase();
  } else {
    showToast('🏆 Você completou todas as fases! Total: ' + score + ' pontos!', 'ok');
    say('Parabéns! Você é incrível! Completou todas as missões!', 0.8);
  }
}

// ================================================
// RENDERIZAR CONTEÚDO — imagem ou emoji fallback
// ================================================
function renderBlockContent(b) {
  if (b.img) {
    return `
      <div class="block-img-wrap">
        <img src="${IMG}${b.img}" alt="${b.name}" class="block-img"
          onerror="this.parentElement.outerHTML='<span class=\\'block-icon\\'>${b.icon}</span>'" />
      </div>
      <span class="block-name">${b.name}</span>`;
  }
  return `<span class="block-icon">${b.icon}</span><span class="block-name">${b.name}</span>`;
}

function renderSlotContent(b) {
  if (b.img) {
    return `
      <div class="slot-img-wrap">
        <img src="${IMG}${b.img}" alt="${b.name}" class="slot-img"
          onerror="this.parentElement.outerHTML='<span class=\\'slot-icon\\'>${b.icon}</span>'" />
      </div>
      <span class="slot-name">${b.name}</span>`;
  }
  return `<span class="slot-icon">${b.icon}</span><span class="slot-name">${b.name}</span>`;
}

// ================================================
// ÁUDIO — WEB SPEECH API
// ================================================
function say(text, speed = 0.9) {
  if (!window.speechSynthesis) return null;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'pt-BR'; u.rate = speed; u.pitch = 1.2;
  const ptVoice = window.speechSynthesis.getVoices().find(v => v.lang.startsWith('pt'));
  if (ptVoice) u.voice = ptVoice;
  window.speechSynthesis.speak(u);
  return u;
}

function speakMission() {
  const btn = document.getElementById('speakMissionBtn');
  btn.classList.add('speaking');
  const u = say(phases[currentPhase].mission, 0.85);
  if (u) u.onend = () => btn.classList.remove('speaking');
  else btn.classList.remove('speaking');
}

function speakSequence() {
  const ph = phases[currentPhase];
  const filled = slots.filter(s => s !== null);
  if (!filled.length) { say('Adicione os blocos primeiro!'); return; }
  const names = slots.map((s, i) => s ? `${i+1}. ${ph.blocks.find(b => b.id === s).name}` : '').filter(Boolean);
  say('A sequência até agora é: ' + names.join(', '), 0.8);
}

// ================================================
// FEEDBACK VISUAL
// ================================================
function showToast(msg, type = 'ok') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'feedback-toast show ' + type;
  setTimeout(() => { t.className = 'feedback-toast'; }, 2600);
}

function setChar(msg) { document.getElementById('charSpeech').textContent = msg; }

// ================================================
// NAVEGAÇÃO DE FASES
// ================================================
function buildPhaseNav() {
  const nav = document.getElementById('phaseNav');
  nav.innerHTML = '';
  phases.forEach((ph, i) => {
    const btn = document.createElement('button');
    let cls = 'phase-btn';
    if (i === currentPhase)       cls += ' active';
    else if (phaseScores[i] > 0)  cls += ' done';
    else if (i > currentPhase)    cls += ' locked';
    btn.className = cls;
    const starsHtml = phaseStars[i] > 0
      ? ' <span class="phase-star-count">' + '⭐'.repeat(phaseStars[i]) + '</span>'
      : '';
    btn.innerHTML = ph.icon + ' Fase ' + ph.id + starsHtml;
    if (phaseScores[i] > 0) btn.title = phaseScores[i] + ' pts';
    btn.onclick = () => {
      if (i <= currentPhase || phaseScores[i] > 0) { currentPhase = i; initPhase(); }
    };
    nav.appendChild(btn);
  });
}

// ================================================
// INICIALIZAR FASE
// ================================================
function initPhase() {
  const ph = phases[currentPhase];
  slots = new Array(ph.sequence.length).fill(null);
  hintCount      = 0;
  errorCount     = 0;
  hadError       = false;
  phaseStartTime = Date.now();
  document.getElementById('missionIcon').textContent        = ph.icon;
  document.getElementById('missionTitle').textContent       = `Fase ${ph.id} — ${ph.title}`;
  document.getElementById('missionDesc').textContent        = ph.desc;
  document.getElementById('missionHeader').style.background = ph.bg;
  document.getElementById('progressFill').style.background  = ph.pbColor;
  updateProgress();
  buildPhaseNav();
  buildBlocks();
  buildSlots();
  updateHeaderStars();
  setChar('Vamos lá!');
  setTimeout(() => speakMission(), 500);
}

// ================================================
// CONSTRUIR BLOCOS
// ================================================
function buildBlocks() {
  const ph   = phases[currentPhase];
  const list = document.getElementById('blockList');
  list.innerHTML = '';
  [...ph.blocks].sort(() => Math.random() - 0.5).forEach(b => {
    const c = document.createElement('div');
    c.className = 'block-card' + (b.img ? ' has-img' : '');
    c.id        = 'blk_' + b.id;
    c.draggable = true;
    c.innerHTML = renderBlockContent(b);
    c.addEventListener('dragstart', () => { dragItem = b.id; c.classList.add('dragging'); });
    c.addEventListener('dragend',   () => c.classList.remove('dragging'));
    c.addEventListener('click', () => {
      say(b.name, 1.0);
      const next = slots.findIndex(s => s === null);
      if (next !== -1) addToSlot(next, b.id);
    });
    list.appendChild(c);
  });
}

// ================================================
// CONSTRUIR SLOTS
// ================================================
function buildSlots() {
  const ph   = phases[currentPhase];
  const zone = document.getElementById('dropZone');
  zone.innerHTML = '';
  ph.sequence.forEach((_, i) => {
    const s = document.createElement('div');
    s.className   = 'drop-slot';
    s.dataset.idx = i;
    s.innerHTML   = `
      <span class="slot-number">${i + 1}</span>
      <div class="slot-content" id="sc${i}"><span style="font-size:26px;color:#ccc">?</span></div>
      <span class="slot-check">✅</span>`;
    s.addEventListener('dragover',  e => { e.preventDefault(); s.classList.add('over'); });
    s.addEventListener('dragleave', () => s.classList.remove('over'));
    s.addEventListener('drop', e => { e.preventDefault(); s.classList.remove('over'); if (dragItem) addToSlot(i, dragItem); });
    s.addEventListener('click', () => { if (slots[i]) removeFromSlot(i); });
    zone.appendChild(s);
  });
}

// ================================================
// ADICIONAR / REMOVER BLOCO
// ================================================
function addToSlot(idx, blockId) {
  const ph = phases[currentPhase];
  if (slots[idx] !== null) removeFromSlot(idx);
  if (slots.includes(blockId)) removeFromSlot(slots.indexOf(blockId));
  slots[idx] = blockId;
  const b = ph.blocks.find(x => x.id === blockId);
  document.getElementById('sc' + idx).innerHTML = renderSlotContent(b);
  const blkEl = document.getElementById('blk_' + blockId);
  if (blkEl) blkEl.classList.add('used');
  say(b.name, 1.0);
  updateProgress();
  dragItem = null;
}

function removeFromSlot(idx) {
  const blockId = slots[idx];
  if (!blockId) return;
  slots[idx] = null;
  document.getElementById('sc' + idx).innerHTML = `<span style="font-size:26px;color:#ccc">?</span>`;
  document.querySelector(`.drop-slot[data-idx="${idx}"]`).className = 'drop-slot';
  const blkEl = document.getElementById('blk_' + blockId);
  if (blkEl) blkEl.classList.remove('used');
  updateProgress();
}

function updateProgress() {
  const pct = Math.round((slots.filter(s => s !== null).length / slots.length) * 100);
  document.getElementById('progressFill').style.width = pct + '%';
}

// ================================================
// VERIFICAR RESPOSTA
// ================================================
function checkAnswer() {
  const ph = phases[currentPhase];
  if (slots.includes(null)) {
    showToast('⚠️ Complete a sequência antes!', 'err');
    say('Complete todos os espaços primeiro!');
    return;
  }

  const allCorrect = ph.sequence.every((id, i) => slots[i] === id);
  const slotEls    = document.querySelectorAll('.drop-slot');
  const elapsed    = Date.now() - phaseStartTime;

  if (allCorrect) {
    slotEls.forEach(s => { s.classList.remove('wrong'); s.classList.add('correct'); });

    const result = calcScore(ph, slots, errorCount, hadError, elapsed);
    phaseScores[currentPhase] = result.pts;
    phaseStars[currentPhase]  = result.stars;
    score = phaseScores.reduce((a, b) => a + b, 0);
    document.getElementById('scoreVal').textContent = score;

    // Atualiza estrelas no header
    updateHeaderStars();

    const msg = sayings.correct[Math.floor(Math.random() * sayings.correct.length)];
    setChar(msg);
    say(msg + '. Você ganhou ' + result.pts + ' pontos!', 0.9);
    buildPhaseNav();

    // Exibe a tela de conclusão após um pequeno delay
    setTimeout(() => {
      showPhaseComplete(result, ph, currentPhase === phases.length - 1);
    }, 900);

  } else {
    errorCount++;
    hadError = true;
    slotEls.forEach((s, i) => {
      s.classList.remove('correct', 'wrong');
      s.classList.add(slots[i] === ph.sequence[i] ? 'correct' : 'wrong');
    });
    const wrongCount = ph.sequence.filter((id, i) => slots[i] !== id).length;
    let penaltyMsg = '';
    if (errorCount > 3)                                   penaltyMsg = ' (⚠️ Muitos erros: -5pts ao final)';
    else if (wrongCount / ph.sequence.length > 0.75)      penaltyMsg = ' (⚠️ Sequência bagunçada: -3pts ao final)';
    const msg = sayings.wrong[Math.floor(Math.random() * sayings.wrong.length)];
    showToast('❌ ' + msg + penaltyMsg, 'err');
    setChar(msg);
    say(msg, 0.9);
    setTimeout(() => slotEls.forEach(s => s.classList.remove('wrong', 'correct')), 1400);
  }
}

// ================================================
// DICA
// ================================================
function showHint() {
  hintCount++;
  const ph = phases[currentPhase];
  const wrongIdx = ph.sequence.findIndex((id, i) => slots[i] !== id);
  if (wrongIdx === -1) { say('Você está indo bem!'); return; }
  const correct = ph.blocks.find(b => b.id === ph.sequence[wrongIdx]);
  const hint = `Na posição ${wrongIdx + 1}, vai o bloco: ${correct.name}`;
  say(hint, 0.85); showToast('💡 ' + hint, 'tip'); setChar(correct.name + ' ' + correct.icon);
}

function resetPhase() { initPhase(); say('Vamos recomeçar!', 0.9); }

window.speechSynthesis && window.speechSynthesis.getVoices();
initPhase();

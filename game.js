/* ============================================
   MISSÃO ROTINA — game.js
   ============================================ */

// ================================================
// DADOS DAS FASES
// ================================================
const phases = [
  {
    id: 1,
    icon: '🌅',
    title: 'Começar o Dia!',
    bg: 'linear-gradient(135deg,#84E6F8,#3EC8E8)',
    pbColor: '#0AACCC',
    desc: 'Arraste os blocos na ordem certa para ir à escola',
    mission: 'Hora de começar o dia! Coloque as ações na ordem correta para ir à escola.',
    blocks: [
      { id: 'lb', name: 'Levantar da cama',  icon: '🛏️' },
      { id: 'ab', name: 'Arrumar a cama',    icon: '🛋️' },
      { id: 'tr', name: 'Trocar de roupa',   icon: '👕' },
      { id: 'es', name: 'Escovar os dentes', icon: '🪥' },
      { id: 'mo', name: 'Arrumar a mochila', icon: '🎒' },
      { id: 'ir', name: 'Ir para a escola',  icon: '🏫' }
    ],
    sequence: ['lb', 'ab', 'tr', 'es', 'mo', 'ir']
  },
  {
    id: 2,
    icon: '📚',
    title: 'Tarefa de Casa!',
    bg: 'linear-gradient(135deg,#B0E3AC,#5BB751)',
    pbColor: '#3A8C32',
    desc: 'Organize as etapas para fazer sua lição',
    mission: 'Hora da lição! Organize as etapas para fazer a tarefa de casa.',
    blocks: [
      { id: 'am', name: 'Arrumar o material',  icon: '📦' },
      { id: 'om', name: 'Organizar a mesa',     icon: '🪑' },
      { id: 'ac', name: 'Abrir o caderno',      icon: '📖' },
      { id: 'ra', name: 'Resolver a atividade', icon: '✏️' },
      { id: 'ft', name: 'Finalizar a tarefa',   icon: '✅' },
      { id: 'gm', name: 'Guardar os materiais', icon: '🎒' }
    ],
    sequence: ['am', 'om', 'ac', 'ra', 'ft', 'gm']
  },
  {
    id: 3,
    icon: '🎮',
    title: 'Hora de Brincar!',
    bg: 'linear-gradient(135deg,#F29CA3,#E06070)',
    pbColor: '#C62A2A',
    desc: 'Organize o momento de brincar e guardar os brinquedos',
    mission: 'Vamos brincar! Mas primeiro organize as etapas certinho.',
    blocks: [
      { id: 'pb', name: 'Pegar a caixa',        icon: '📦' },
      { id: 'cb', name: 'Escolher brinquedos',  icon: '🧸' },
      { id: 'br', name: 'Brincar',              icon: '🎮' },
      { id: 'db', name: 'Dividir com amigos',   icon: '🤝' },
      { id: 'ob', name: 'Organizar brinquedos', icon: '🗂️' },
      { id: 'gb', name: 'Guardar na caixa',     icon: '📫' }
    ],
    sequence: ['pb', 'cb', 'br', 'db', 'ob', 'gb']
  },
  {
    id: 4,
    icon: '🥪',
    title: 'Hora do Lanche!',
    bg: 'linear-gradient(135deg,#F9E784,#F0C800)',
    pbColor: '#D4A800',
    desc: 'Monte seu sanduíche passo a passo',
    mission: 'Que fome! Vamos fazer um sanduíche gostoso. Siga a sequência!',
    blocks: [
      { id: 'ic',  name: 'Ir à cozinha',        icon: '🚶' },
      { id: 'si',  name: 'Separar ingredientes', icon: '🥗' },
      { id: 'pp',  name: 'Pegar um prato',       icon: '🍽️' },
      { id: 'pa',  name: 'Pegar o pão',          icon: '🍞' },
      { id: 'cp',  name: 'Pão no prato',         icon: '🥖' },
      { id: 'mon', name: 'Montar o sanduíche',   icon: '🥪' },
      { id: 'sm',  name: 'Sentar à mesa',        icon: '🪑' },
      { id: 'co',  name: 'Comer o lanche',       icon: '😋' }
    ],
    sequence: ['ic', 'si', 'pp', 'pa', 'cp', 'mon', 'sm', 'co']
  },
  {
    id: 5,
    icon: '💻',
    title: 'Computação!',
    bg: 'linear-gradient(135deg,#D8A8E8,#AE5ABF)',
    pbColor: '#7B2FA0',
    desc: 'Organize as etapas para enviar um arquivo pelo computador',
    mission: 'Vamos aprender computação! Organize as etapas para enviar um arquivo.',
    blocks: [
      { id: 'ca', name: 'Criar o arquivo',      icon: '📄' },
      { id: 'sa', name: 'Salvar o arquivo',     icon: '💾' },
      { id: 'ei', name: 'Enviar pela internet', icon: '📤' },
      { id: 'sr', name: 'Servidor receber',     icon: '🖥️' },
      { id: 'ga', name: 'Guardar no sistema',   icon: '🗄️' }
    ],
    sequence: ['ca', 'sa', 'ei', 'sr', 'ga']
  }
];

// ================================================
// ESTADO DO JOGO
// ================================================
let currentPhase = 0;
let slots        = [];
let score        = 0;
let phaseScores  = [0, 0, 0, 0, 0];
let dragItem     = null;
let hintCount    = 0;

// ================================================
// MENSAGENS DE FEEDBACK
// ================================================
const sayings = {
  correct: [
    'Incrível! Você acertou! 🎉',
    'Muito bem! Continue assim! 🌟',
    'Que esperto! 🏆',
    'Perfeito! Você arrasou! ✨',
    'Show de bola! 🎊'
  ],
  wrong: [
    'Quase! Tenta de novo! 💪',
    'Não foi dessa vez! Você consegue! 🙂',
    'Pense bem... qual vem primeiro? 🤔'
  ]
};

// ================================================
// ÁUDIO — WEB SPEECH API
// ================================================
function say(text, speed = 0.9) {
  if (!window.speechSynthesis) return null;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang  = 'pt-BR';
  u.rate  = speed;
  u.pitch = 1.2;
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
  const names = slots
    .map((s, i) => s ? `${i + 1}. ${ph.blocks.find(b => b.id === s).name}` : '')
    .filter(Boolean);
  say('A sequência até agora é: ' + names.join(', '), 0.8);
}

// ================================================
// FEEDBACK VISUAL (toast + personagem)
// ================================================
function showToast(msg, type = 'ok') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className   = 'feedback-toast show ' + type;
  setTimeout(() => { t.className = 'feedback-toast'; }, 2600);
}

function setChar(msg) {
  document.getElementById('charSpeech').textContent = msg;
}

// ================================================
// NAVEGAÇÃO DE FASES
// ================================================
function buildPhaseNav() {
  const nav = document.getElementById('phaseNav');
  nav.innerHTML = '';
  phases.forEach((ph, i) => {
    const btn = document.createElement('button');
    let cls = 'phase-btn';
    if (i === currentPhase)    cls += ' active';
    else if (phaseScores[i] > 0) cls += ' done';
    else if (i > currentPhase) cls += ' locked';
    btn.className = cls;
    btn.innerHTML = ph.icon + ' Fase ' + ph.id;
    btn.onclick = () => {
      if (i <= currentPhase || phaseScores[i] > 0) {
        currentPhase = i;
        initPhase();
      }
    };
    nav.appendChild(btn);
  });
}

// ================================================
// INICIALIZAR FASE
// ================================================
function initPhase() {
  const ph = phases[currentPhase];
  slots     = new Array(ph.sequence.length).fill(null);
  hintCount = 0;

  document.getElementById('missionIcon').textContent         = ph.icon;
  document.getElementById('missionTitle').textContent        = `Fase ${ph.id} — ${ph.title}`;
  document.getElementById('missionDesc').textContent         = ph.desc;
  document.getElementById('missionHeader').style.background  = ph.bg;
  document.getElementById('progressFill').style.background   = ph.pbColor;

  updateProgress();
  buildPhaseNav();
  buildBlocks();
  buildSlots();
  setChar('Vamos lá!');
  setTimeout(() => speakMission(), 500);
}

// ================================================
// CONSTRUIR BLOCOS (painel esquerdo)
// ================================================
function buildBlocks() {
  const ph   = phases[currentPhase];
  const list = document.getElementById('blockList');
  list.innerHTML = '';

  // embaralhar
  [...ph.blocks].sort(() => Math.random() - 0.5).forEach(b => {
    const c = document.createElement('div');
    c.className  = 'block-card';
    c.id         = 'blk_' + b.id;
    c.draggable  = true;
    c.innerHTML  = `<span class="block-icon">${b.icon}</span><span class="block-name">${b.name}</span>`;

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
// CONSTRUIR SLOTS (zona de drop)
// ================================================
function buildSlots() {
  const ph   = phases[currentPhase];
  const zone = document.getElementById('dropZone');
  zone.innerHTML = '';

  ph.sequence.forEach((_, i) => {
    const s = document.createElement('div');
    s.className    = 'drop-slot';
    s.dataset.idx  = i;
    s.innerHTML    = `
      <span class="slot-number">${i + 1}</span>
      <div class="slot-content" id="sc${i}">
        <span style="font-size:28px;color:#ccc">?</span>
      </div>
      <span class="slot-check">✅</span>
    `;

    s.addEventListener('dragover',  e => { e.preventDefault(); s.classList.add('over'); });
    s.addEventListener('dragleave', () => s.classList.remove('over'));
    s.addEventListener('drop', e => {
      e.preventDefault();
      s.classList.remove('over');
      if (dragItem) addToSlot(i, dragItem);
    });
    s.addEventListener('click', () => { if (slots[i]) removeFromSlot(i); });

    zone.appendChild(s);
  });
}

// ================================================
// ADICIONAR / REMOVER BLOCO DE SLOT
// ================================================
function addToSlot(idx, blockId) {
  const ph = phases[currentPhase];

  // Libera o slot ocupado, se houver
  if (slots[idx] !== null) removeFromSlot(idx);

  // Remove o bloco de outro slot se já estava posicionado
  if (slots.includes(blockId)) removeFromSlot(slots.indexOf(blockId));

  slots[idx] = blockId;
  const b = ph.blocks.find(x => x.id === blockId);

  document.getElementById('sc' + idx).innerHTML =
    `<span class="slot-icon">${b.icon}</span><span class="slot-name">${b.name}</span>`;

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
  document.getElementById('sc' + idx).innerHTML =
    `<span style="font-size:28px;color:#ccc">?</span>`;
  document.querySelector(`.drop-slot[data-idx="${idx}"]`).className = 'drop-slot';

  const blkEl = document.getElementById('blk_' + blockId);
  if (blkEl) blkEl.classList.remove('used');

  updateProgress();
}

// ================================================
// BARRA DE PROGRESSO
// ================================================
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

  const correct  = ph.sequence.every((id, i) => slots[i] === id);
  const slotEls  = document.querySelectorAll('.drop-slot');

  if (correct) {
    slotEls.forEach(s => { s.classList.remove('wrong'); s.classList.add('correct'); });

    const msg = sayings.correct[Math.floor(Math.random() * sayings.correct.length)];
    showToast('🎉 ' + msg, 'ok');
    setChar(msg);
    say(msg, 0.9);

    // Pontuação: 20 pts menos 5 por dica usada (mínimo 5)
    const pts = Math.max(20 - hintCount * 5, 5);
    phaseScores[currentPhase] = pts;
    score = phaseScores.reduce((a, b) => a + b, 0);
    document.getElementById('scoreVal').textContent = score;

    // Atualizar estrelas
    const total = phaseScores.filter(x => x > 0).length;
    ['s1', 's2', 's3'].forEach((id, i) => {
      document.getElementById(id).classList.toggle('on', i < Math.ceil(total / 2));
    });

    buildPhaseNav();

    setTimeout(() => {
      if (currentPhase < phases.length - 1) {
        currentPhase++;
        initPhase();
      } else {
        showToast('🏆 Você completou todas as fases!', 'ok');
        say('Parabéns! Você é incrível! Completou todas as missões!', 0.8);
      }
    }, 2000);

  } else {
    slotEls.forEach((s, i) => {
      s.classList.remove('correct', 'wrong');
      s.classList.add(slots[i] === ph.sequence[i] ? 'correct' : 'wrong');
    });

    const msg = sayings.wrong[Math.floor(Math.random() * sayings.wrong.length)];
    showToast('❌ ' + msg, 'err');
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
  const hint    = `Na posição ${wrongIdx + 1}, vai o bloco: ${correct.name}`;

  say(hint, 0.85);
  showToast('💡 ' + hint, 'tip');
  setChar(correct.name + ' ' + correct.icon);
}

// ================================================
// RECOMEÇAR FASE
// ================================================
function resetPhase() {
  initPhase();
  say('Vamos recomeçar!', 0.9);
}

// ================================================
// INICIALIZAR
// ================================================
window.speechSynthesis && window.speechSynthesis.getVoices();
initPhase();
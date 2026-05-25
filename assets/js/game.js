/* ============================================
   DEBUGUINHO — game.js
   Padronizado conforme Manual de Jogos v1
   ============================================ */

// ================================================
// CAMINHO BASE DAS IMAGENS
// ================================================
const IMG = 'assets/img/';

// ================================================
// DADOS DAS FASES (carregados externamente via JSON, com fallback para abrir por pasta)
// ================================================
let phases = [];

async function loadPhases() {
  try {
    const res = await fetch('assets/data/phases.json?v=20260525-0955', { cache: 'no-store' });
    phases = await res.json();
  } catch (e) {
    console.error('Erro ao carregar fases:', e);
    phases = Array.isArray(window.DEBUGUINHO_PHASES) ? window.DEBUGUINHO_PHASES : [];
  }

  if (phases.length) initPhase();
}

// ================================================
// COMUNICAÇÃO COM A PLATAFORMA — PADRÃO OBRIGATÓRIO
// ================================================
let scoreSent = false;

function sendFinalScore({ score, difficulty } = {}) {
  if (scoreSent) return;
  try {
    window.parent.postMessage({
      type: 'C4A_GAME_SCORE',
      payload: { score, difficulty }
    }, '*');
    scoreSent = true;
  } catch (error) {
    console.log('⚠️ Falha ao enviar score:', error?.message || error);
  }
}

// ================================================
// DIFICULDADE — 5 níveis padronizados por fase
// ================================================
function getPlatformDifficulty() {
  try {
    const params = new URLSearchParams(window.location.search);
    const difficulty = params.get('difficulty') || params.get('dificuldade');
    if (difficulty) return difficulty;
  } catch (_) {}
  return getCurrentDifficulty();
}

function getCurrentDifficulty() {
  return phases[currentPhase]?.difficulty || 'Médio';
}

function getDifficultyPenaltyMultiplier() {
  const multipliers = {
    'Muito Fácil': 0.5,
    'Fácil': 0.75,
    'Médio': 1.0,
    'Difícil': 1.25,
    'Muito Difícil': 1.5
  };
  return multipliers[getCurrentDifficulty()] || 1.0;
}

const FREE_HINTS_BEFORE_PENALTY = 2;
const BASE_HINT_PENALTY = 5;
const MAX_HINT_PENALTY = 20;

function calcHintPenalty(hintCnt) {
  const extraHints = Math.max(0, hintCnt - FREE_HINTS_BEFORE_PENALTY);
  if (!extraHints) return 0;
  return Math.min(MAX_HINT_PENALTY, extraHints * BASE_HINT_PENALTY);
}

function applyDifficulty() {
  // Blocos já embaralhados pelo buildBlocks — nada extra a fazer no modo único
}

function buildDifficultyUI() {
  // Seletor de dificuldade removido da interface
}

// ================================================
// CONTROLE DE ÁUDIO
// ================================================
let audioMuted   = false;
let audioVolume  = 1.0; // 0.0 – 1.0

function toggleMute() {
  audioMuted = !audioMuted;
  const btn = document.getElementById('btnMute');
  if (btn) {
    btn.textContent   = audioMuted ? '🔇' : '🔊';
    btn.setAttribute('aria-label', audioMuted ? 'Ativar áudio' : 'Silenciar áudio');
    btn.setAttribute('aria-pressed', audioMuted ? 'true' : 'false');
  }
  if (audioMuted && window.speechSynthesis) window.speechSynthesis.cancel();
}

function setVolume(val) {
  audioVolume = Math.max(0, Math.min(1, parseFloat(val)));
  const slider = document.getElementById('volumeSlider');
  if (slider) {
    slider.value = audioVolume;
    slider.setAttribute('aria-valuenow', audioVolume);
  }
  // Se há fala em andamento, cancela e re-aplica o volume (a Web Speech API
  // não permite alterar o volume de um utterance já em curso, por isso
  // a próxima chamada a say() já usará o novo audioVolume automaticamente)
  if (window.speechSynthesis && window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
  }
}

// ================================================
// ACESSIBILIDADE — Menu de configurações
// ================================================
let highContrast = false;
let fontSize     = 'normal'; // 'normal' | 'large' | 'xlarge'

function toggleHighContrast() {
  highContrast = !highContrast;
  document.body.classList.toggle('high-contrast', highContrast);
  const btn = document.getElementById('btnHighContrast');
  if (btn) {
    btn.setAttribute('aria-pressed', highContrast ? 'true' : 'false');
    btn.textContent = highContrast ? '🌑 Alto Contraste Preto/Amarelo' : '🌓 Alto Contraste';
    btn.setAttribute('aria-label', highContrast ? 'Desativar alto contraste preto e amarelo' : 'Ativar alto contraste preto e amarelo');
  }
}

function cycleFontSize() {
  const sizes = ['normal', 'large', 'xlarge'];
  const next = sizes[(sizes.indexOf(fontSize) + 1) % sizes.length];
  fontSize = next;
  document.body.classList.remove('font-normal', 'font-large', 'font-xlarge');
  document.body.classList.add('font-' + next);
  const btn = document.getElementById('btnFontSize');
  const labels = { normal: '🔤 Texto Normal', large: '🔤 Texto Grande', xlarge: '🔤 Texto Maior' };
  if (btn) {
    btn.textContent = labels[next];
    btn.setAttribute('aria-label', 'Tamanho de fonte: ' + next);
  }
}

// ================================================
// MODO DALTÔNICO
// ================================================
let colorblindMode = 'none'; // 'none' | 'deuteranopia' | 'protanopia' | 'tritanopia'

const colorblindModes = {
  none: {
    label: '👁️ Daltonismo: Desativado',
    shortLabel: 'desativado',
    className: ''
  },
  deuteranopia: {
    label: '🟡 Daltonismo: Deuteranopia',
    shortLabel: 'deuteranopia, dificuldade verde e vermelho',
    className: 'cb-deuteranopia'
  },
  protanopia: {
    label: '🔵 Daltonismo: Protanopia',
    shortLabel: 'protanopia, baixa percepção do vermelho',
    className: 'cb-protanopia'
  },
  tritanopia: {
    label: '🟣 Daltonismo: Tritanopia',
    shortLabel: 'tritanopia, dificuldade azul e amarelo',
    className: 'cb-tritanopia'
  }
};

function applyColorblindMode(mode = colorblindMode) {
  const nextMode = colorblindModes[mode] ? mode : 'none';
  Object.values(colorblindModes).forEach(({ className }) => {
    if (className) document.body.classList.remove(className);
  });

  colorblindMode = nextMode;
  const active = colorblindModes[colorblindMode];
  if (active.className) document.body.classList.add(active.className);
  document.body.classList.toggle('colorblind-active', colorblindMode !== 'none');

  const btn = document.getElementById('btnColorblind');
  if (btn) {
    btn.textContent = active.label;
    btn.setAttribute('aria-label', 'Modo daltônico: ' + active.shortLabel + '. Pressione para alternar.');
    btn.setAttribute('aria-pressed', colorblindMode !== 'none' ? 'true' : 'false');
    btn.title = 'Modo daltônico (C): ' + active.shortLabel;
  }

  const status = document.getElementById('colorblindStatus');
  if (status) {
    const msg = colorblindMode === 'none'
      ? 'Modo daltônico desativado.'
      : 'Modo daltônico ativado para ' + active.shortLabel + '. Acertos e erros também usam símbolos e contornos.';
    status.textContent = msg;
  }
}

function cycleColorblindMode() {
  const keys = Object.keys(colorblindModes);
  const next = keys[(keys.indexOf(colorblindMode) + 1) % keys.length];
  applyColorblindMode(next);
}

function closeA11yPanel(returnFocus = true) {
  const panel = document.getElementById('a11yPanel');
  if (!panel) return;
  const btn = document.getElementById('btnA11y');
  panel.classList.remove('open');
  if (btn) {
    btn.setAttribute('aria-expanded', 'false');
    if (returnFocus) btn.focus();
  }
}

function toggleA11yPanel(forceOpen) {
  const panel = document.getElementById('a11yPanel');
  if (!panel) return;
  const shouldOpen = typeof forceOpen === 'boolean' ? forceOpen : !panel.classList.contains('open');
  const btn = document.getElementById('btnA11y');
  panel.classList.toggle('open', shouldOpen);
  if (btn) btn.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
  if (shouldOpen) {
    const firstFocusable = panel.querySelector('button, input, select');
    if (firstFocusable) firstFocusable.focus();
  } else if (btn) {
    btn.focus();
  }
}

document.addEventListener('click', (e) => {
  const panel = document.getElementById('a11yPanel');
  const wrap = document.querySelector('.a11y-panel-wrap');
  if (panel && panel.classList.contains('open') && wrap && !wrap.contains(e.target)) {
    closeA11yPanel(false);
  }
});

// ================================================
// TUTORIAL ACESSÍVEL
// ================================================
let tutorialStep = 0;
let tutorialLastFocus = null;

const tutorialSteps = [
  {
    icon: '🎯',
    title: 'Objetivo do jogo',
    text: 'Em cada subfase, organize os blocos na ordem correta para completar uma rotina.',
    items: ['Leia ou ouça a missão atual.', 'Observe os espaços numerados da sequência.', 'Use os blocos disponíveis para montar a ordem certa.']
  },
  {
    icon: '🧩',
    title: 'Adicionar blocos',
    text: 'Você pode jogar sem arrastar.',
    items: ['Clique ou toque em um bloco para colocá-lo no próximo espaço vazio.', 'Com teclado, navegue com Tab e pressione Enter ou Espaço no bloco.', 'O foco avança para o próximo bloco disponível.']
  },
  {
    icon: '↩️',
    title: 'Corrigir a sequência',
    text: 'Se colocar um bloco errado, remova e tente novamente.',
    items: ['Clique ou toque em um espaço preenchido para remover o bloco.', 'Com teclado, pressione Enter, Espaço, Delete ou Backspace no espaço preenchido.', 'Use o botão Dica quando precisar de ajuda.']
  },
  {
    icon: '♿',
    title: 'Recursos de acessibilidade',
    text: 'O jogo tem recursos para diferentes formas de uso.',
    items: ['Alto contraste usa preto, amarelo e bordas fortes.', 'Modo daltônico adiciona paletas e sinais visuais.', 'Modo varredura permite jogar com um único toque no botão Selecionar.']
  },
  {
    icon: '✅',
    title: 'Verificar e pontuar',
    text: 'Quando todos os espaços estiverem preenchidos, verifique a resposta.',
    items: ['Use o botão Verificar ou o atalho V.', 'A pontuação considera acertos, bônus e penalidades.', 'Ao concluir uma subfase, avance para a próxima missão.']
  }
];

function isTutorialOpen() {
  const overlay = document.getElementById('tutorialOverlay');
  return !!(overlay && !overlay.hidden);
}

function setTutorialSeen() {
  try { localStorage.setItem('debuguinhoTutorialSeen', 'true'); } catch (e) { /* localStorage opcional */ }
}

function shouldAutoOpenTutorial() {
  try { return localStorage.getItem('debuguinhoTutorialSeen') !== 'true'; }
  catch (e) { return false; }
}

function renderTutorialStep() {
  const step = tutorialSteps[tutorialStep];
  const icon = document.getElementById('tutorialIcon');
  const title = document.getElementById('tutorialTitle');
  const text = document.getElementById('tutorialText');
  const list = document.getElementById('tutorialList');
  const counter = document.getElementById('tutorialCounter');
  const prev = document.getElementById('tutorialPrevBtn');
  const next = document.getElementById('tutorialNextBtn');

  if (!step || !icon || !title || !text || !list || !counter || !prev || !next) return;

  icon.textContent = step.icon;
  title.textContent = step.title;
  text.textContent = step.text;
  counter.textContent = `${tutorialStep + 1}/${tutorialSteps.length}`;
  list.innerHTML = '';
  step.items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    list.appendChild(li);
  });

  prev.disabled = tutorialStep === 0;
  next.textContent = tutorialStep === tutorialSteps.length - 1 ? 'Começar' : 'Próximo';
  next.setAttribute('aria-label', tutorialStep === tutorialSteps.length - 1 ? 'Fechar tutorial e começar a jogar' : 'Ir para próxima etapa do tutorial');
  announceGameStatus(`Tutorial, etapa ${tutorialStep + 1} de ${tutorialSteps.length}: ${step.title}.`);
}

function openTutorial(options = {}) {
  const overlay = document.getElementById('tutorialOverlay');
  if (!overlay) return;
  tutorialLastFocus = document.activeElement;
  tutorialStep = 0;
  overlay.hidden = false;
  overlay.classList.add('visible');
  renderTutorialStep();
  closeA11yPanel(false);
  setTimeout(() => {
    const closeBtn = document.getElementById('tutorialCloseBtn');
    if (closeBtn) closeBtn.focus();
  }, 50);
  if (options.auto) setTutorialSeen();
}

function closeTutorial(returnFocus = true) {
  const overlay = document.getElementById('tutorialOverlay');
  if (!overlay) return;
  setTutorialSeen();
  overlay.classList.remove('visible');
  overlay.hidden = true;
  announceGameStatus('Tutorial fechado. Você já pode jogar.');
  if (returnFocus && tutorialLastFocus && typeof tutorialLastFocus.focus === 'function') {
    tutorialLastFocus.focus();
  }
}

function nextTutorialStep() {
  if (tutorialStep >= tutorialSteps.length - 1) {
    closeTutorial();
    return;
  }
  tutorialStep++;
  renderTutorialStep();
  const next = document.getElementById('tutorialNextBtn');
  if (next) next.focus();
}

function prevTutorialStep() {
  if (tutorialStep <= 0) return;
  tutorialStep--;
  renderTutorialStep();
  const prev = document.getElementById('tutorialPrevBtn');
  if (prev) prev.focus();
}

function speakTutorialStep() {
  const step = tutorialSteps[tutorialStep];
  if (!step) return;
  const msg = `${step.title}. ${step.text} ${step.items.join(' ')}`;
  announceGameStatus(msg);
  say(msg, 0.85);
}

function getTutorialFocusable() {
  const overlay = document.getElementById('tutorialOverlay');
  if (!overlay || overlay.hidden) return [];
  return [...overlay.querySelectorAll('button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')];
}


// ================================================
// ATALHOS DE TECLADO (documentados via aria-keyshortcuts)
// ================================================
document.addEventListener('keydown', (e) => {
  // Ignorar quando foco está em input/select
  if (['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

  if (isTutorialOpen() && e.key === 'Tab') {
    const focusable = getTutorialFocusable();
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  switch (e.key) {
    case 'v': case 'V':
      if (!e.ctrlKey && !e.metaKey) { e.preventDefault(); checkAnswer(); }
      break;
    case 'd': case 'D':
      if (!e.ctrlKey && !e.metaKey) { e.preventDefault(); showHint(); }
      break;
    case 'r': case 'R':
      if (!e.ctrlKey && !e.metaKey) { e.preventDefault(); resetPhase(); }
      break;
    case 'o': case 'O':
      if (!e.ctrlKey && !e.metaKey) { e.preventDefault(); speakSequence(); }
      break;
    case 'm': case 'M':
      if (!e.ctrlKey && !e.metaKey) { e.preventDefault(); toggleMute(); }
      break;
    case 'a': case 'A':
      if (!e.ctrlKey && !e.metaKey) { e.preventDefault(); toggleA11yPanel(); }
      break;
    case 'c': case 'C':
      if (!e.ctrlKey && !e.metaKey) { e.preventDefault(); cycleColorblindMode(); }
      break;
    case 's': case 'S':
      if (!e.ctrlKey && !e.metaKey) { e.preventDefault(); toggleScanMode(); }
      break;
    case 't': case 'T':
      if (!e.ctrlKey && !e.metaKey) { e.preventDefault(); openTutorial(); }
      break;
    case 'ArrowRight':
      if (isTutorialOpen()) { e.preventDefault(); nextTutorialStep(); }
      break;
    case 'ArrowLeft':
      if (isTutorialOpen()) { e.preventDefault(); prevTutorialStep(); }
      break;
    case 'Enter':
    case ' ':
      if (scanMode && !isTutorialOpen() && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        activateScanTarget();
      }
      break;
    case 'Escape':
      if (isTutorialOpen()) { closeTutorial(); break; }
      const panel = document.getElementById('a11yPanel');
      if (panel && panel.classList.contains('open')) { closeA11yPanel(); }
      const overlay = document.getElementById('phaseCompleteOverlay');
      if (overlay && overlay.classList.contains('visible')) { /* sem ação — usuário deve clicar */ }
      break;
  }
});

// ================================================
// ESTADO DO JOGO
// ================================================
let currentPhase   = 0;
let currentSubphase = 0;
let slots          = [];
let score          = 0;
let subphaseScores = {};
let subphaseStars  = {};
let phaseScores100 = {};
let dragItem       = null;
let hintCount      = 0;
let errorCount     = 0;
let hadError       = false;
let phaseStartTime = 0;
let scanMode       = false;
let scanTimer      = null;
let scanIndex      = -1;
let scanTargets    = [];
const MAX_STARS_PER_PHASE = 4;

const sayings = {
  correct: ['Incrível! Você acertou! 🎉','Muito bem! Continue assim! 🌟','Que esperto! 🏆','Perfeito! Você arrasou! ✨','Show de bola! 🎊'],
  wrong:   ['Quase! Tenta de novo! 💪','Não foi dessa vez! Você consegue! 🙂','Pense bem... qual vem primeiro? 🤔']
};

// ================================================
// MODO VARREDURA — seleção por um toque
// ================================================
function isVisible(el) {
  return !!(el && (el.offsetWidth || el.offsetHeight || el.getClientRects().length));
}

function getElementActionName(el) {
  if (!el) return '';
  return el.getAttribute('aria-label') || el.textContent.trim().replace(/\s+/g, ' ');
}

function getScanTargets() {
  const storySkip = document.getElementById('storySkip');
  if (isVisible(storySkip)) return [storySkip];

  const completeOverlay = document.getElementById('phaseCompleteOverlay');
  const nextBtn = document.getElementById('pcBtnNext');
  if (completeOverlay && completeOverlay.classList.contains('visible') && isVisible(nextBtn)) {
    return [nextBtn];
  }

  const targets = [
    ...document.querySelectorAll('#blockList .block-card:not(.used)'),
    ...document.querySelectorAll('.drop-slot')
  ].filter(el => {
    if (!isVisible(el)) return false;
    if (el.classList.contains('drop-slot')) {
      const idx = Number(el.dataset.idx);
      return slots[idx] !== null;
    }
    return true;
  });

  ['.btn-speak-all', '.btn-hint', '.btn-reset'].forEach(selector => {
    const btn = document.querySelector(selector);
    if (isVisible(btn) && !btn.disabled) targets.push(btn);
  });

  const checkBtn = document.querySelector('.btn-check');
  if (isVisible(checkBtn) && !checkBtn.disabled && !slots.includes(null)) targets.push(checkBtn);

  return targets;
}

function clearScanHighlight() {
  document.querySelectorAll('.scan-active').forEach(el => {
    el.classList.remove('scan-active');
    el.removeAttribute('aria-current');
  });
}

function updateScanButton() {
  const btn = document.getElementById('btnScanMode');
  if (btn) {
    btn.textContent = scanMode ? '🔁 Varredura: Ativada' : '🔁 Varredura: Desativada';
    btn.setAttribute('aria-pressed', scanMode ? 'true' : 'false');
    btn.setAttribute('aria-label', scanMode ? 'Desativar modo varredura' : 'Ativar modo varredura para jogar com um toque');
  }
  document.body.classList.toggle('scan-mode', scanMode);
}

function announceScanTarget(el) {
  const status = document.getElementById('scanStatus');
  const name = getElementActionName(el);
  if (status && name) status.textContent = 'Item destacado: ' + name + '. Toque em Selecionar ou pressione Espaço.';
}

function stepScan() {
  scanTargets = getScanTargets();
  clearScanHighlight();

  if (!scanMode || !scanTargets.length) {
    const status = document.getElementById('scanStatus');
    if (status) status.textContent = 'Nenhum item disponível para varredura.';
    return;
  }

  scanIndex = (scanIndex + 1) % scanTargets.length;
  const active = scanTargets[scanIndex];
  active.classList.add('scan-active');
  active.setAttribute('aria-current', 'true');
  announceScanTarget(active);
}

function startScan() {
  stopScan(false);
  scanIndex = -1;
  stepScan();
  scanTimer = setInterval(stepScan, 1600);
}

function stopScan(clearMode = true) {
  if (scanTimer) clearInterval(scanTimer);
  scanTimer = null;
  scanIndex = -1;
  clearScanHighlight();
  if (clearMode) {
    scanMode = false;
    updateScanButton();
  }
}

function refreshScanTargets() {
  if (!scanMode) return;
  startScan();
}

function toggleScanMode(forceOn) {
  scanMode = typeof forceOn === 'boolean' ? forceOn : !scanMode;
  updateScanButton();
  if (scanMode) {
    closeA11yPanel(false);
    showToast('🔁 Modo varredura ativado. Toque em Selecionar quando o item desejado estiver destacado.', 'tip');
    say('Modo varredura ativado. Toque em selecionar quando o item desejado estiver destacado.', 0.85);
    startScan();
  } else {
    stopScan();
    showToast('Modo varredura desativado.', 'ok');
  }
}

function activateScanTarget() {
  if (!scanMode) return;
  const target = scanTargets[scanIndex];
  if (!target) return;
  target.click();
  refreshScanTargets();
}

function getCurrentSubphase() {
  return phases[currentPhase].subphases[currentSubphase];
}

function getProgressKey(phaseIndex = currentPhase, subphaseIndex = currentSubphase) {
  return `${phaseIndex}-${subphaseIndex}`;
}

function getPhaseScore(phaseIndex) {
  const prefix = `${phaseIndex}-`;
  const phase = phases[phaseIndex];
  if (!phase) return 0;
  const completedScores = Object.keys(subphaseScores)
    .filter(key => key.startsWith(prefix))
    .map(key => subphaseScores[key]);
  if (!completedScores.length) return 0;
  return Math.round(completedScores.reduce((sum, pts) => sum + pts, 0) / phase.subphases.length);
}

function getPhaseStars(phaseIndex) {
  const prefix = `${phaseIndex}-`;
  return Object.keys(subphaseStars)
    .filter(key => key.startsWith(prefix))
    .reduce((max, key) => Math.max(max, subphaseStars[key]), 0);
}

// ================================================
// PONTUAÇÃO — escala 0-100 conforme manual
// ================================================
function calcScore(sub, slots, errCnt, hadErr, elapsedMs, hintCnt = 0) {
  const total   = sub.sequence.length;
  const correct = sub.sequence.filter((id, i) => slots[i] === id).length;
  const ratio   = correct / total;

  // Pontuação base em escala 0-100. Acerto perfeito começa em 90
  // para permitir bônus sem ultrapassar a escala padronizada.
  const base = Math.round(ratio * 90);
  let stars = 0;
  if (correct === total)  stars = 4;
  else if (ratio >= 0.75) stars = 3;
  else if (ratio >= 0.50) stars = 2;
  else if (correct >= 1)  stars = 1;

  // Penalidades por dificuldade
  const penaltyMultiplier = getDifficultyPenaltyMultiplier();
  let penalty = 0;
  if (errCnt > 3)   penalty += Math.round(8 * penaltyMultiplier);
  if (ratio < 0.25) penalty += Math.round(6 * penaltyMultiplier);
  const hintPenalty = calcHintPenalty(hintCnt);
  penalty += hintPenalty;

  let bonus = 0;
  if (correct === total) {
    if (!hadErr) bonus += 10;
    if (hadErr)  bonus +=  5;
  }

  const pts = Math.min(100, Math.max(0, base - penalty + bonus));
  return { pts, stars, correct, total, base, penalty, bonus, ratio, errCnt, hintCnt, hintPenalty };
}

function getLiveScorePreview() {
  const sub = getCurrentSubphase();
  if (!sub) return null;
  const filled = slots.filter(s => s !== null).length;
  const correct = sub.sequence.filter((id, i) => slots[i] === id).length;
  const ratio = sub.sequence.length ? correct / sub.sequence.length : 0;
  const penaltyMultiplier = getDifficultyPenaltyMultiplier();
  let pendingPenalty = 0;
  if (errorCount > 3) pendingPenalty += Math.round(8 * penaltyMultiplier);
  if (filled === sub.sequence.length && ratio < 0.25) pendingPenalty += Math.round(6 * penaltyMultiplier);
  const hintPenalty = calcHintPenalty(hintCount);
  pendingPenalty += hintPenalty;
  return { filled, total: sub.sequence.length, correct, ratio, pendingPenalty, hintPenalty };
}

function updateScoreRulesPanel() {
  const bonusEl = document.getElementById('bonusStatus');
  const hintEl = document.getElementById('hintStatus');
  const errorEl = document.getElementById('errorStatus');
  const panel = document.getElementById('scoreRulesPanel');
  if (!bonusEl || !hintEl || !errorEl || !panel) return;

  const preview = getLiveScorePreview();
  if (!preview) return;

  const bonusText = hadError
    ? 'Bônus de persistência se acertar: +5'
    : 'Bônus perfeito disponível: +10';
  bonusEl.className = 'score-rule-card ' + (hadError ? 'warn' : 'bonus');
  bonusEl.querySelector('.score-rule-text').textContent = bonusText;

  const freeHintsLeft = Math.max(0, FREE_HINTS_BEFORE_PENALTY - hintCount);
  let hintText = `Dicas usadas: ${hintCount} (${freeHintsLeft} sem desconto)`;
  let hintClass = 'neutral';
  if (preview.hintPenalty > 0) {
    hintText = `Dicas usadas: ${hintCount} (penalidade ativa: -${preview.hintPenalty})`;
    hintClass = 'penalty';
  } else if (freeHintsLeft === 0) {
    hintText = `Dicas usadas: ${hintCount} (próxima dica desconta pontos)`;
    hintClass = 'warn';
  }
  hintEl.className = 'score-rule-card ' + hintClass;
  hintEl.querySelector('.score-rule-text').textContent = hintText;

  let errorText = `Tentativas erradas: ${errorCount}`;
  let errorClass = 'neutral';
  if (errorCount > 3) {
    errorText += ` (penalidade ativa: -${Math.round(8 * getDifficultyPenaltyMultiplier())})`;
    errorClass = 'penalty';
  } else if (errorCount > 0) {
    errorText += ' (bônus perfeito perdido)';
    errorClass = 'warn';
  }
  if (preview.filled === preview.total && preview.ratio < 0.25) {
    errorText += `; sequência bagunçada: -${Math.round(6 * getDifficultyPenaltyMultiplier())}`;
    errorClass = 'penalty';
  }
  errorEl.className = 'score-rule-card ' + errorClass;
  errorEl.querySelector('.score-rule-text').textContent = errorText;

  panel.setAttribute(
    'aria-label',
    `${bonusText}. ${hintText}. ${errorText}. Progresso: ${preview.filled} de ${preview.total} blocos, ${preview.correct} na posição correta.`
  );
}

// Converte pontuação interna para escala 0-100
function calcFinalScore100() {
  if (!phases.length) return 0;
  const total = phases.reduce((sum, _, i) => sum + getPhaseScore(i), 0);
  return Math.min(100, Math.max(0, Math.round(total / phases.length)));
}

function savePhaseScore(phaseIndex) {
  const ph = phases[phaseIndex];
  if (!ph) return;
  const phaseScore = getPhaseScore(phaseIndex);
  phaseScores100[phaseIndex] = phaseScore;
  try {
    const progress = {
      phases: phases.map((phase, i) => ({
        id: phase.id,
        title: phase.title,
        difficulty: phase.difficulty,
        score: phaseScores100[i] || getPhaseScore(i)
      })),
      finalScore: calcFinalScore100()
    };
    localStorage.setItem('debuguinhoScoreProgress', JSON.stringify(progress));
  } catch (error) {
    console.log('⚠️ Falha ao salvar progresso local:', error?.message || error);
  }
}

// ================================================
// PONTOS POR FASE NO HEADER
// ================================================
function updateHeaderStars() {
  const row = document.getElementById('phaseScoresRow');
  if (!row) return;
  row.innerHTML = '';
  phases.forEach((ph, i) => {
    const pts  = getPhaseScore(i);
    const span = document.createElement('span');
    span.className = 'phase-score-pill' + (pts > 0 ? ' earned' : '');
    span.textContent = ph.icon + ' ' + (pts > 0 ? pts + '/100' : '–');
    row.appendChild(span);
  });
}

// ================================================
// ANIMAÇÃO DE HISTÓRIA — slideshow das imagens da sequência
// ================================================
function playStoryAnimation(sub, onDone) {
  // Filtra apenas blocos que têm imagem, na ordem correta da sequência
  const storyBlocks = sub.sequence
    .map(id => sub.blocks.find(b => b.id === id))
    .filter(b => b && b.img);

  // Se não há imagens suficientes, pula a animação
  if (storyBlocks.length < 2) { onDone(); return; }

  // Cria overlay
  const overlay = document.createElement('div');
  overlay.id = 'storyOverlay';
  overlay.setAttribute('role', 'presentation');
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = `
    <div class="story-bg" id="storyBg"></div>
    <div class="story-frame" id="storyFrame">
      <div class="story-img-wrap" id="storyImgWrap">
        <img id="storyImg" src="" alt="" />
      </div>
      <div class="story-label" id="storyLabel"></div>
      <div class="story-step-dots" id="storyDots"></div>
      <div class="story-arrow story-arrow-right" id="storyArrow">▶</div>
    </div>
    <div class="story-skip-btn" id="storySkip">Pular ⏭</div>
  `;
  document.body.appendChild(overlay);

  // Dots de progresso
  const dotsEl = document.getElementById('storyDots');
  storyBlocks.forEach((_, i) => {
    const d = document.createElement('span');
    d.className = 'story-dot' + (i === 0 ? ' active' : '');
    dotsEl.appendChild(d);
  });

  let current = 0;
  let autoTimer = null;

  function goTo(idx, dir = 'next') {
    if (idx >= storyBlocks.length) { finish(); return; }
    const b = storyBlocks[idx];
    const frame  = document.getElementById('storyFrame');
    const img    = document.getElementById('storyImg');
    const label  = document.getElementById('storyLabel');
    const bg     = document.getElementById('storyBg');
    const dots   = document.querySelectorAll('.story-dot');

    // Animação de saída
    frame.classList.remove('story-enter-left','story-enter-right');
    frame.classList.add(dir === 'next' ? 'story-exit-left' : 'story-exit-right');

    setTimeout(() => {
      img.src = IMG + b.img;
      img.alt = b.name;
      label.innerHTML = `<span class="story-step-num">${idx + 1}/${storyBlocks.length}</span> ${b.icon} ${b.name}`;
      bg.style.backgroundImage = `url(${IMG + b.img})`;

      dots.forEach((d, i) => d.classList.toggle('active', i === idx));

      frame.classList.remove('story-exit-left','story-exit-right');
      frame.classList.add(dir === 'next' ? 'story-enter-right' : 'story-enter-left');
    }, 220);

    current = idx;

    // Fala o nome do bloco
    say(b.name, 1.0);

    // Auto-avança após 2.2s
    clearTimeout(autoTimer);
    autoTimer = setTimeout(() => goTo(current + 1, 'next'), 2200);
  }

  function finish() {
    clearTimeout(autoTimer);
    overlay.classList.add('story-fade-out');
    setTimeout(() => {
      overlay.remove();
      onDone();
    }, 450);
  }

  // Clique na frame / seta avança
  document.getElementById('storyFrame').addEventListener('click', () => {
    clearTimeout(autoTimer);
    goTo(current + 1, 'next');
  });
  document.getElementById('storySkip').addEventListener('click', (e) => {
    e.stopPropagation();
    finish();
  });

  // Inicia
  overlay.classList.add('story-visible');
  const firstB = storyBlocks[0];
  const img    = document.getElementById('storyImg');
  const label  = document.getElementById('storyLabel');
  const bg     = document.getElementById('storyBg');
  img.src    = IMG + firstB.img;
  img.alt    = firstB.name;
  label.innerHTML = `<span class="story-step-num">1/${storyBlocks.length}</span> ${firstB.icon} ${firstB.name}`;
  bg.style.backgroundImage = `url(${IMG + firstB.img})`;
  document.getElementById('storyFrame').classList.add('story-enter-right');
  say(firstB.name, 1.0);
  autoTimer = setTimeout(() => goTo(1, 'next'), 2200);
}

// ================================================
// TELA DE CONCLUSÃO DE FASE
// ================================================
function showPhaseComplete(result, ph, sub, isLastSubphase, isLastPhase) {
  const overlay = document.getElementById('phaseCompleteOverlay');
  const icon    = document.getElementById('pcPhaseIcon');
  const title   = document.getElementById('pcTitle');
  const starsW  = document.getElementById('pcStarsWrap');
  const scoreLn = document.getElementById('pcScoreLine');
  const details = document.getElementById('pcDetails');
  const btnNext = document.getElementById('pcBtnNext');

  icon.textContent  = ph.icon;
  title.textContent = 'Fase ' + ph.id + '.' + sub.id + ' Concluída!';

  starsW.innerHTML = '';
  for (let i = 0; i < MAX_STARS_PER_PHASE; i++) {
    const s = document.createElement('span');
    s.className   = 'pc-star';
    s.textContent = '⭐';
    starsW.appendChild(s);
    if (i < result.stars) setTimeout(() => s.classList.add('lit'), 80 + i * 220);
  }

  const phaseScore = getPhaseScore(currentPhase);
  scoreLn.textContent = result.pts + '/100 pontos nesta subfase';
  scoreLn.style.color = result.pts > 0 ? 'var(--verde)' : '#999';

  details.innerHTML = '';
  addDetailRow(details, 'base', '🎯', 'Base por acertos (' + result.correct + '/' + result.total + ')', result.base + '/90');

  details.innerHTML += '<div class="pc-detail-divider"></div>';
  if (result.bonus > 0 && !hadError && result.correct === result.total)
    addDetailRow(details, 'bonus', '🎯', 'Bônus: sequência perfeita sem erros', '+10');
  else if (result.bonus > 0 && hadError && result.correct === result.total)
    addDetailRow(details, 'bonus', '💪', 'Bônus: persistência após tentativa', '+5');
  else
    addDetailRow(details, 'bonus', '⭐', 'Bônus', '+0');

  details.innerHTML += '<div class="pc-detail-divider"></div>';
  if (result.penalty > 0) {
    if (result.errCnt > 3)
      addDetailRow(details, 'penalty', '⚠️', 'Penalidade: muitos erros (' + result.errCnt + ')', '-' + Math.round(8 * getDifficultyPenaltyMultiplier()));
    if (result.ratio < 0.25)
      addDetailRow(details, 'penalty', '⚠️', 'Penalidade: sequência bagunçada', '-' + Math.round(6 * getDifficultyPenaltyMultiplier()));
    if (result.hintPenalty > 0)
      addDetailRow(details, 'penalty', '💡', 'Penalidade: dicas extras (' + result.hintCnt + ')', '-' + result.hintPenalty);
  } else {
    addDetailRow(details, 'penalty', '✅', 'Penalidades', '-0');
  }

  details.innerHTML += '<div class="pc-detail-divider"></div>';
  addDetailRow(details, 'base', '📊', 'Resultado da subfase', result.pts + '/100');
  addDetailRow(details, 'base', ph.icon, 'Pontuação atual da fase ' + ph.id + ' (' + ph.difficulty + ')', phaseScore + '/100');

  if (isLastPhase) {
    btnNext.textContent = '🏆 Ver Resultado Final!';
    btnNext.className   = 'pc-btn-next game-done';
  } else {
    btnNext.textContent = isLastSubphase ? 'Próxima Fase ➡️' : 'Próxima Subfase ➡️';
    btnNext.className   = 'pc-btn-next';
  }

  overlay.classList.add('visible');
  setTimeout(() => btnNext.focus(), 100);
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

  const isLastSubphase = currentSubphase >= phases[currentPhase].subphases.length - 1;
  const isLastPhase = currentPhase >= phases.length - 1;

  if (!isLastSubphase) {
    currentSubphase++;
    initPhase();
    setTimeout(() => {
      const firstBlock = document.querySelector('#blockList .block-card:not(.used)');
      if (firstBlock) firstBlock.focus();
    }, 600);
    return;
  }

  if (!isLastPhase) {
    savePhaseScore(currentPhase);
    currentPhase++;
    currentSubphase = 0;
    initPhase();
    setTimeout(() => {
      const firstBlock = document.querySelector('#blockList .block-card:not(.used)');
      if (firstBlock) firstBlock.focus();
    }, 600);
    return;
  }

  savePhaseScore(currentPhase);
  const finalScore100 = calcFinalScore100();
  showToast('🏆 Jogo concluído! Pontuação final: ' + finalScore100 + '/100', 'ok');
  say('Parabéns! Você completou todas as missões com ' + finalScore100 + ' pontos!', 0.8);
  sendFinalScore({ score: finalScore100, difficulty: getPlatformDifficulty() });
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
  if (audioMuted) return null;
  if (!window.speechSynthesis) return null;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang  = 'pt-BR';
  u.rate  = speed;
  u.pitch = 1.2;
  u.volume = audioVolume;
  const ptVoice = window.speechSynthesis.getVoices().find(v => v.lang.startsWith('pt'));
  if (ptVoice) u.voice = ptVoice;
  window.speechSynthesis.speak(u);
  return u;
}

function speakMission() {
  const btn = document.getElementById('speakMissionBtn');
  if (btn) btn.classList.add('speaking');
  const u = say(getCurrentSubphase().mission, 0.85);
  if (u) u.onend = () => { if (btn) btn.classList.remove('speaking'); };
  else if (btn) btn.classList.remove('speaking');
}

function speakSequence() {
  const sub    = getCurrentSubphase();
  const filled = slots.filter(s => s !== null);
  if (!filled.length) {
    announceGameStatus('A sequência ainda está vazia. Adicione pelo menos um bloco antes de ouvir.');
    say('Adicione os blocos primeiro!');
    return;
  }
  const names = slots.map((s, i) => s ? `${i + 1}. ${sub.blocks.find(b => b.id === s).name}` : '').filter(Boolean);
  const msg = 'A sequência até agora é: ' + names.join(', ');
  announceGameStatus(msg);
  say(msg, 0.8);
}

// ================================================
// FEEDBACK VISUAL
// ================================================

/*
 * SPRITES DE FEEDBACK DO PERSONAGEM
 * ------------------------------------------------------------------
 * Substitua os valores abaixo pelos caminhos reais das suas imagens.
 * As três variáveis correspondem aos três estados de feedback:
 *
 *   FEEDBACK_IMG_NEUTRAL  — personagem neutro / aguardando
 *   FEEDBACK_IMG_GOOD     — personagem feliz / acerto parcial
 *   FEEDBACK_IMG_GREAT    — personagem muito feliz / acerto total / perfeito
 *
 * Exemplo:
 *   const FEEDBACK_IMG_NEUTRAL = 'assets/img/char_neutro.png';
 *   const FEEDBACK_IMG_GOOD    = 'assets/img/char_bom.png';
 *   const FEEDBACK_IMG_GREAT   = 'assets/img/char_muitobom.png';
 * ------------------------------------------------------------------
 */
const FEEDBACK_IMG_NEUTRAL = ''; // TODO: adicione o caminho da imagem neutra
const FEEDBACK_IMG_GOOD    = ''; // TODO: adicione o caminho da imagem de feedback bom
const FEEDBACK_IMG_GREAT   = ''; // TODO: adicione o caminho da imagem de feedback muito bom

/**
 * Atualiza a imagem do personagem conforme o nível de feedback.
 * @param {'neutral'|'good'|'great'} level
 */
function setCharFeedbackImage(level) {
  const charEl = document.querySelector('.char');
  if (!charEl) return;

  const map = {
    neutral: FEEDBACK_IMG_NEUTRAL,
    good:    FEEDBACK_IMG_GOOD,
    great:   FEEDBACK_IMG_GREAT
  };
  const src = map[level] || '';

  if (src) {
    // Se há imagem definida, substitui o emoji por <img>
    charEl.innerHTML = `<img src="${src}" alt="Personagem ${level}" class="char-feedback-img" />`;
  } else {
    // Sem imagem ainda: mantém o emoji padrão
    if (!charEl.querySelector('img')) charEl.textContent = '🧒';
  }
}

/**
 * Reseta o personagem para o estado neutro.
 * Chamado no início de cada fase.
 */
function resetCharImage() {
  setCharFeedbackImage('neutral');
  const charEl = document.querySelector('.char');
  if (charEl && !FEEDBACK_IMG_NEUTRAL) charEl.textContent = '🧒';
}
function showToast(msg, type = 'ok') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className   = 'feedback-toast show ' + type;
  setTimeout(() => { t.className = 'feedback-toast'; }, 2600);
}

function announceGameStatus(msg) {
  const status = document.getElementById('gameStatus');
  if (status) status.textContent = msg;
}

function setChar(msg) {
  const el = document.getElementById('charSpeech');
  if (el) el.textContent = msg;
}

// ================================================
// NAVEGAÇÃO DE FASES
// ================================================
function buildPhaseNav() {
  const nav = document.getElementById('phaseNav');
  nav.innerHTML = '';
  phases.forEach((ph, i) => {
    const btn = document.createElement('button');
    const phaseScore = getPhaseScore(i);
    const phaseStars = getPhaseStars(i);
    let cls = 'phase-btn';
    if (i === currentPhase)      cls += ' active';
    else if (phaseScore > 0) cls += ' done';
    else if (i > currentPhase)   cls += ' locked';
    btn.className = cls;
    const starsHtml = phaseStars > 0
      ? ' <span class="phase-star-count">' + '⭐'.repeat(phaseStars) + '</span>'
      : '';
    const activeProgress = i === currentPhase ? ' • ' + (currentSubphase + 1) + '/' + ph.subphases.length : '';
    btn.innerHTML = ph.icon + ' Fase ' + ph.id + activeProgress + starsHtml;
    if (phaseScore > 0) btn.title = phaseScore + '/100';
    btn.setAttribute('aria-label', 'Fase ' + ph.id + ': ' + ph.title + ', dificuldade ' + ph.difficulty + (phaseScore > 0 ? ', ' + phaseScore + ' de 100 pontos' : ''));
    btn.setAttribute('aria-current', i === currentPhase ? 'true' : 'false');
    btn.onclick = () => {
      if (i <= currentPhase || phaseScore > 0) { currentPhase = i; currentSubphase = 0; initPhase(); }
    };
    nav.appendChild(btn);
  });
}

// ================================================
// INICIALIZAR FASE
// ================================================
function initPhase() {
  const ph       = phases[currentPhase];
  const sub      = getCurrentSubphase();
  slots          = new Array(sub.sequence.length).fill(null);
  hintCount      = 0;
  errorCount     = 0;
  hadError       = false;
  phaseStartTime = Date.now();

  document.getElementById('missionIcon').textContent        = ph.icon;
  document.getElementById('missionTitle').textContent       = `Fase ${ph.id} — ${ph.title} — ${ph.difficulty} — Subfase ${sub.id}: ${sub.title}`;
  document.getElementById('missionDesc').textContent        = sub.desc;
  document.getElementById('missionHeader').style.background = ph.bg;
  document.getElementById('progressFill').style.background  = ph.pbColor;
  document.getElementById('scoreVal').textContent           = getPhaseScore(currentPhase) + '/100';
  document.getElementById('scoreVal').setAttribute('aria-label', 'Pontuação da fase atual: ' + getPhaseScore(currentPhase) + ' de 100 pontos');

  updateProgress();
  updateScoreRulesPanel();
  buildPhaseNav();
  buildBlocks();
  buildSlots();
  updateHeaderStars();
  setChar('Vamos lá!');
  resetCharImage();
  applyDifficulty();
  refreshScanTargets();
  announceGameStatus(`Fase ${ph.id}, ${ph.title}, dificuldade ${ph.difficulty}. Subfase ${sub.id}: ${sub.title}. ${sub.mission}`);
  setTimeout(() => speakMission(), 500);
}

// ================================================
// CONSTRUIR BLOCOS
// ================================================
function buildBlocks() {
  const sub  = getCurrentSubphase();
  const list = document.getElementById('blockList');
  list.innerHTML = '';
  [...sub.blocks].sort(() => Math.random() - 0.5).forEach(b => {
    const c = document.createElement('div');
    c.className = 'block-card' + (b.img ? ' has-img' : '');
    c.id        = 'blk_' + b.id;
    c.draggable = true;
    c.setAttribute('role', 'button');
    c.setAttribute('tabindex', '0');
    c.setAttribute('aria-label', b.name + '. Bloco disponível. Pressione Enter ou Espaço para adicionar na próxima posição vazia.');
    c.setAttribute('aria-pressed', 'false');
    c.setAttribute('aria-describedby', 'gameInstructions');
    c.innerHTML = renderBlockContent(b);

    c.addEventListener('dragstart', () => { dragItem = b.id; c.classList.add('dragging'); });
    c.addEventListener('dragend',   () => c.classList.remove('dragging'));
    c.addEventListener('click', () => {
      say(b.name, 1.0);
      const next = slots.findIndex(s => s === null);
      if (next !== -1) addToSlot(next, b.id, { moveFocus: true });
      else showToast('⚠️ Todos os espaços estão preenchidos!', 'err');
    });
    c.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const next = slots.findIndex(s => s === null);
        if (next !== -1) { say(b.name, 1.0); addToSlot(next, b.id, { moveFocus: true }); }
        else showToast('⚠️ Todos os espaços estão preenchidos!', 'err');
      }
    });
    list.appendChild(c);
  });
}

// ================================================
// CONSTRUIR SLOTS
// ================================================
function buildSlots() {
  const sub  = getCurrentSubphase();
  const zone = document.getElementById('dropZone');
  zone.innerHTML = '';
  sub.sequence.forEach((_, i) => {
    const s = document.createElement('div');
    s.className   = 'drop-slot';
    s.dataset.idx = i;
    s.setAttribute('role', 'group');
    s.setAttribute('tabindex', '-1');
    s.setAttribute('aria-label', `Posição ${i + 1} de ${sub.sequence.length}, vazia`);
    s.setAttribute('aria-describedby', 'gameInstructions');
    s.innerHTML = `
      <span class="slot-number" aria-hidden="true">${i + 1}</span>
      <div class="slot-content" id="sc${i}"><span style="font-size:26px;color:#ccc" aria-hidden="true">?</span></div>
      <span class="slot-check" aria-hidden="true">✅</span>`;
    s.addEventListener('dragover',  e => { e.preventDefault(); s.classList.add('over'); });
    s.addEventListener('dragleave', () => s.classList.remove('over'));
    s.addEventListener('drop', e => { e.preventDefault(); s.classList.remove('over'); if (dragItem) addToSlot(i, dragItem); });
    s.addEventListener('click', () => { if (slots[i]) removeFromSlot(i, { returnFocus: true }); });
    s.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && slots[i]) { e.preventDefault(); removeFromSlot(i, { returnFocus: true }); }
      if ((e.key === 'Delete' || e.key === 'Backspace') && slots[i]) { e.preventDefault(); removeFromSlot(i, { returnFocus: true }); }
    });
    zone.appendChild(s);
  });
}

// ================================================
// ADICIONAR / REMOVER BLOCO
// ================================================
function focusNextPlayTarget(blockId) {
  const availableBlocks = [...document.querySelectorAll('#blockList .block-card:not(.used)')];
  const nextBlock = availableBlocks.find(el => el.id !== 'blk_' + blockId) || availableBlocks[0];
  if (nextBlock) {
    nextBlock.focus();
    return;
  }
  const checkBtn = document.querySelector('.btn-check');
  if (checkBtn) checkBtn.focus();
}

function addToSlot(idx, blockId, options = {}) {
  const sub = getCurrentSubphase();
  if (slots[idx] !== null) removeFromSlot(idx, { returnFocus: false });
  if (slots.includes(blockId)) removeFromSlot(slots.indexOf(blockId), { returnFocus: false });
  slots[idx] = blockId;
  const b = sub.blocks.find(x => x.id === blockId);
  document.getElementById('sc' + idx).innerHTML = renderSlotContent(b);
  const blkEl = document.getElementById('blk_' + blockId);
  if (blkEl) {
    blkEl.classList.add('used');
    blkEl.setAttribute('aria-label', b.name + '. Bloco já adicionado à sequência.');
    blkEl.setAttribute('aria-pressed', 'true');
    blkEl.setAttribute('tabindex', '-1');
  }
  const slotEl = document.querySelector(`.drop-slot[data-idx="${idx}"]`);
  if (slotEl) {
    slotEl.setAttribute('tabindex', '0');
    slotEl.setAttribute('role', 'button');
    slotEl.setAttribute('aria-label', `Posição ${idx + 1} de ${sub.sequence.length}: ${b.name}. Pressione Enter, Espaço, Delete ou Backspace para remover.`);
  }
  say(b.name, 1.0);
  updateProgress();
  updateScoreRulesPanel();
  const filledCount = slots.filter(s => s !== null).length;
  announceGameStatus(`${b.name} adicionado na posição ${idx + 1}. ${filledCount} de ${slots.length} posições preenchidas.`);
  dragItem = null;
  if (options.moveFocus) focusNextPlayTarget(blockId);
  refreshScanTargets();
}

function removeFromSlot(idx, options = {}) {
  const sub     = getCurrentSubphase();
  const blockId = slots[idx];
  if (!blockId) return;
  const b = sub.blocks.find(x => x.id === blockId);
  slots[idx] = null;
  document.getElementById('sc' + idx).innerHTML = `<span style="font-size:26px;color:#ccc" aria-hidden="true">?</span>`;
  const slotEl = document.querySelector(`.drop-slot[data-idx="${idx}"]`);
  if (slotEl) {
    slotEl.className = 'drop-slot';
    slotEl.setAttribute('role', 'group');
    slotEl.setAttribute('tabindex', '-1');
    slotEl.setAttribute('aria-label', `Posição ${idx + 1} de ${sub.sequence.length}, vazia`);
  }
  const blkEl = document.getElementById('blk_' + blockId);
  if (blkEl) {
    blkEl.classList.remove('used');
    blkEl.setAttribute('aria-label', b.name + '. Bloco disponível. Pressione Enter ou Espaço para adicionar na próxima posição vazia.');
    blkEl.setAttribute('aria-pressed', 'false');
    blkEl.setAttribute('tabindex', '0');
    if (options.returnFocus) blkEl.focus();
  }
  updateProgress();
  updateScoreRulesPanel();
  announceGameStatus(`${b.name} removido da posição ${idx + 1}.`);
  refreshScanTargets();
}

function updateProgress() {
  const pct = Math.round((slots.filter(s => s !== null).length / slots.length) * 100);
  document.getElementById('progressFill').style.width = pct + '%';
  const bar = document.getElementById('progressBar');
  if (bar) {
    bar.setAttribute('aria-valuenow', pct);
    bar.setAttribute('aria-valuetext', `${slots.filter(s => s !== null).length} de ${slots.length} blocos colocados`);
  }
}

// ================================================
// VERIFICAR RESPOSTA
// ================================================
function checkAnswer() {
  const ph = phases[currentPhase];
  const sub = getCurrentSubphase();
  if (slots.includes(null)) {
    showToast('⚠️ Complete a sequência antes!', 'err');
    announceGameStatus('Sequência incompleta. Complete todos os espaços antes de verificar.');
    say('Complete todos os espaços primeiro!');
    return;
  }

  const allCorrect = sub.sequence.every((id, i) => slots[i] === id);
  const slotEls    = document.querySelectorAll('.drop-slot');
  const elapsed    = Date.now() - phaseStartTime;

  if (allCorrect) {
    slotEls.forEach(s => { s.classList.remove('wrong'); s.classList.add('correct'); });

    const result = calcScore(sub, slots, errorCount, hadError, elapsed, hintCount);
    const progressKey = getProgressKey();
    subphaseScores[progressKey] = result.pts;
    subphaseStars[progressKey]  = result.stars;
    phaseScores100[currentPhase] = getPhaseScore(currentPhase);
    score = getPhaseScore(currentPhase);

    document.getElementById('scoreVal').textContent = score + '/100';
    document.getElementById('scoreVal').setAttribute('aria-label', 'Pontuação da fase atual: ' + score + ' de 100 pontos');

    updateHeaderStars();

    const msg = sayings.correct[Math.floor(Math.random() * sayings.correct.length)];
    setChar(msg);
    announceGameStatus(`Sequência correta. Pontuação desta subfase: ${result.pts} de 100 pontos.`);

    // Feedback por imagem: perfeito (sem erro) = muito bom; com erro = bom
    setCharFeedbackImage(hadError ? 'good' : 'great');
    say(msg + '. Sua pontuação nesta subfase foi ' + result.pts + ' de 100!', 0.9);
    buildPhaseNav();

    setTimeout(() => {
      playStoryAnimation(sub, () => {
        const isLastSubphase = currentSubphase >= ph.subphases.length - 1;
        const isLastPhase = currentPhase >= phases.length - 1;
        showPhaseComplete(result, ph, sub, isLastSubphase, isLastPhase && isLastSubphase);
      });
    }, 900);

  } else {
    errorCount++;
    hadError = true;
    updateScoreRulesPanel();
    slotEls.forEach((s, i) => {
      s.classList.remove('correct', 'wrong');
      s.classList.add(slots[i] === sub.sequence[i] ? 'correct' : 'wrong');
    });
    const wrongCount = sub.sequence.filter((id, i) => slots[i] !== id).length;
    let penaltyMsg = '';
    if (errorCount > 3)                              penaltyMsg = ' (⚠️ Muitos erros: penalidade ao final)';
    else if (wrongCount / sub.sequence.length > 0.75) penaltyMsg = ' (⚠️ Sequência bagunçada: penalidade ao final)';
    const msg = sayings.wrong[Math.floor(Math.random() * sayings.wrong.length)];
    showToast('❌ ' + msg + penaltyMsg, 'err');
    announceGameStatus(`Sequência incorreta. ${wrongCount} ${wrongCount === 1 ? 'posição está fora da ordem' : 'posições estão fora da ordem'}. Tente novamente ou peça uma dica.`);
    setChar(msg);
    // Feedback por imagem: erro = neutro (personagem pensativo)
    setCharFeedbackImage('neutral');
    say(msg, 0.9);
    setTimeout(() => slotEls.forEach(s => s.classList.remove('wrong', 'correct')), 1400);
  }
}

// ================================================
// DICA
// ================================================
function showHint() {
  const sub      = getCurrentSubphase();
  const wrongIdx = sub.sequence.findIndex((id, i) => slots[i] !== id);
  if (wrongIdx === -1) {
    announceGameStatus('Nenhuma dica necessária agora. A sequência já está correta.');
    say('Você está indo bem!');
    return;
  }
  hintCount++;
  updateScoreRulesPanel();
  const correct = sub.blocks.find(b => b.id === sub.sequence[wrongIdx]);
  const hint = `Na posição ${wrongIdx + 1}, vai o bloco: ${correct.name}`;
  say(hint, 0.85);
  showToast('💡 ' + hint, 'tip');
  const hintPenalty = calcHintPenalty(hintCount);
  const penaltyInfo = hintPenalty > 0 ? ` Penalidade por dicas ativa: menos ${hintPenalty} pontos.` : '';
  announceGameStatus('Dica: ' + hint + penaltyInfo);
  setChar(correct.name + ' ' + correct.icon);
}

function resetPhase() {
  initPhase();
  say('Vamos recomeçar!', 0.9);
}

// ================================================
// INICIALIZAÇÃO
// ================================================
window.speechSynthesis && window.speechSynthesis.getVoices();
loadPhases().then(() => {
  subphaseScores = {};
  subphaseStars  = {};
  phaseScores100 = {};
  buildDifficultyUI();
  if (shouldAutoOpenTutorial()) {
    setTimeout(() => openTutorial({ auto: true }), 700);
  }
});

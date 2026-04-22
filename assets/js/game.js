/* ============================================
   DEBUGUINHO — game.js
   Padronizado conforme Manual de Jogos v1
   ============================================ */

// ================================================
// CAMINHO BASE DAS IMAGENS
// ================================================
const IMG = 'assets/img/';

// ================================================
// DADOS DAS FASES (carregados externamente via JSON)
// ================================================
let phases = [];

async function loadPhases() {
  try {
    const res = await fetch('assets/data/phases.json');
    phases = await res.json();
    initPhase();
  } catch (e) {
    console.error('Erro ao carregar fases:', e);
  }
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
// DIFICULDADE — 3 NÍVEIS PADRONIZADOS: Fácil | Médio | Difícil
// ================================================
const DIFFICULTY_LEVELS = ['Fácil', 'Médio', 'Difícil'];
let currentDifficulty = 'Médio';

function getPlatformDifficulty() {
  // Tenta ler da plataforma; senão usa o selecionado pelo jogador
  try {
    const params = new URLSearchParams(window.location.search);
    const d = params.get('difficulty');
    if (d && DIFFICULTY_LEVELS.includes(d)) return d;
  } catch (_) {}
  return currentDifficulty;
}

function applyDifficulty() {
  // Fácil: blocos em ordem; Médio: embaralhados; Difícil: sem dica disponível + más penalidades exibidas
  const ph = phases[currentPhase];
  if (!ph) return;
  const listEl = document.getElementById('blockList');
  if (!listEl) return;

  if (currentDifficulty === 'Fácil') {
    // Blocos em ordem — já montados pelo buildBlocks, reordena no DOM
    const cards = [...listEl.querySelectorAll('.block-card')];
    cards.sort((a, b) => {
      const ai = ph.sequence.indexOf(a.id.replace('blk_', ''));
      const bi = ph.sequence.indexOf(b.id.replace('blk_', ''));
      return ai - bi;
    });
    cards.forEach(c => listEl.appendChild(c));
  }

  const hintBtn = document.querySelector('.btn-hint');
  if (hintBtn) {
    hintBtn.disabled = currentDifficulty === 'Difícil';
    hintBtn.title = currentDifficulty === 'Difícil' ? 'Dicas desativadas no modo Difícil' : '';
    hintBtn.setAttribute('aria-disabled', currentDifficulty === 'Difícil' ? 'true' : 'false');
  }
}

function buildDifficultyUI() {
  const sel = document.getElementById('difficultySelect');
  if (!sel) return;
  sel.innerHTML = '';
  DIFFICULTY_LEVELS.forEach(lv => {
    const opt = document.createElement('option');
    opt.value = lv;
    opt.textContent = lv;
    if (lv === currentDifficulty) opt.selected = true;
    sel.appendChild(opt);
  });
  sel.addEventListener('change', () => {
    currentDifficulty = sel.value;
    resetPhase();
  });
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
  if (slider) slider.value = audioVolume;
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
    btn.textContent = highContrast ? '🌑 Alto Contraste ON' : '🌓 Alto Contraste';
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

function toggleA11yPanel() {
  const panel = document.getElementById('a11yPanel');
  if (!panel) return;
  const isOpen = panel.classList.toggle('open');
  const btn = document.getElementById('btnA11y');
  if (btn) btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  if (isOpen) {
    const firstFocusable = panel.querySelector('button, input, select');
    if (firstFocusable) firstFocusable.focus();
  }
}

// ================================================
// ATALHOS DE TECLADO (documentados via aria-keyshortcuts)
// ================================================
document.addEventListener('keydown', (e) => {
  // Ignorar quando foco está em input/select
  if (['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

  switch (e.key) {
    case 'v': case 'V':
      if (!e.ctrlKey && !e.metaKey) { e.preventDefault(); checkAnswer(); }
      break;
    case 'd': case 'D':
      if (!e.ctrlKey && !e.metaKey && currentDifficulty !== 'Difícil') { e.preventDefault(); showHint(); }
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
    case 'Escape':
      const panel = document.getElementById('a11yPanel');
      if (panel && panel.classList.contains('open')) { toggleA11yPanel(); }
      const overlay = document.getElementById('phaseCompleteOverlay');
      if (overlay && overlay.classList.contains('visible')) { /* sem ação — usuário deve clicar */ }
      break;
  }
});

// ================================================
// ESTADO DO JOGO
// ================================================
let currentPhase   = 0;
let slots          = [];
let score          = 0;
let phaseScores    = [];
let phaseStars     = [];
let dragItem       = null;
let hintCount      = 0;
let errorCount     = 0;
let hadError       = false;
let phaseStartTime = 0;
const MAX_STARS_PER_PHASE = 4;

const sayings = {
  correct: ['Incrível! Você acertou! 🎉','Muito bem! Continue assim! 🌟','Que esperto! 🏆','Perfeito! Você arrasou! ✨','Show de bola! 🎊'],
  wrong:   ['Quase! Tenta de novo! 💪','Não foi dessa vez! Você consegue! 🙂','Pense bem... qual vem primeiro? 🤔']
};

// ================================================
// PONTUAÇÃO — escala 0-100 conforme manual
// ================================================
function calcScore(ph, slots, errCnt, hadErr, elapsedMs) {
  const total   = ph.sequence.length;
  const correct = ph.sequence.filter((id, i) => slots[i] === id).length;
  const ratio   = correct / total;

  // Pontuação base por fase: máx 20 pts por fase × 5 fases = 100 total
  let base = 0, stars = 0;
  if (correct === total)  { base = 20; stars = 4; }
  else if (ratio >= 0.67) { base = 15; stars = 3; }
  else if (ratio >= 0.50) { base = 10; stars = 2; }
  else if (correct >= 1)  { base =  5; stars = 1; }
  else                    { base =  0; stars = 0; }

  // Penalidades por dificuldade
  const penaltyMultiplier = currentDifficulty === 'Fácil' ? 0.5
                          : currentDifficulty === 'Difícil' ? 1.5 : 1.0;
  let penalty = 0;
  if (errCnt > 3)   penalty += Math.round(5  * penaltyMultiplier);
  if (ratio < 0.25) penalty += Math.round(3  * penaltyMultiplier);

  let bonus = 0;
  if (correct === total) {
    if (!hadErr) bonus += 10;
    if (hadErr)  bonus +=  3;
  }

  const pts = Math.max(0, base - penalty + bonus);
  return { pts, stars, correct, total, base, penalty, bonus, ratio, errCnt };
}

// Converte pontuação interna para escala 0-100
function calcFinalScore100() {
  const totalPossible = phases.length * 30; // máx por fase: 20 base + 10 bônus
  const raw = phaseScores.reduce((a, b) => a + b, 0);
  return Math.min(100, Math.max(0, Math.round((raw / totalPossible) * 100)));
}

// ================================================
// PONTOS POR FASE NO HEADER
// ================================================
function updateHeaderStars() {
  const row = document.getElementById('phaseScoresRow');
  if (!row) return;
  row.innerHTML = '';
  phases.forEach((ph, i) => {
    const pts  = phaseScores[i] || 0;
    const span = document.createElement('span');
    span.className = 'phase-score-pill' + (pts > 0 ? ' earned' : '');
    span.textContent = ph.icon + ' ' + (pts > 0 ? '+' + pts : '–');
    row.appendChild(span);
  });
}

// ================================================
// ANIMAÇÃO DE HISTÓRIA — slideshow das imagens da sequência
// ================================================
function playStoryAnimation(ph, onDone) {
  // Filtra apenas blocos que têm imagem, na ordem correta da sequência
  const storyBlocks = ph.sequence
    .map(id => ph.blocks.find(b => b.id === id))
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
function showPhaseComplete(result, ph, isLastPhase) {
  const overlay = document.getElementById('phaseCompleteOverlay');
  const icon    = document.getElementById('pcPhaseIcon');
  const title   = document.getElementById('pcTitle');
  const starsW  = document.getElementById('pcStarsWrap');
  const scoreLn = document.getElementById('pcScoreLine');
  const details = document.getElementById('pcDetails');
  const btnNext = document.getElementById('pcBtnNext');

  icon.textContent  = ph.icon;
  title.textContent = 'Fase ' + ph.id + ' Concluída!';

  starsW.innerHTML = '';
  for (let i = 0; i < MAX_STARS_PER_PHASE; i++) {
    const s = document.createElement('span');
    s.className   = 'pc-star';
    s.textContent = '⭐';
    starsW.appendChild(s);
    if (i < result.stars) setTimeout(() => s.classList.add('lit'), 80 + i * 220);
  }

  scoreLn.textContent = '+' + result.pts + ' pontos!';
  scoreLn.style.color = result.pts > 0 ? 'var(--verde)' : '#999';

  details.innerHTML = '';
  addDetailRow(details, 'base', '🎯', 'Pontuação base (' + result.correct + '/' + result.total + ')', '+' + result.base + ' pts');

  if (result.bonus > 0) {
    details.innerHTML += '<div class="pc-detail-divider"></div>';
    if (!hadError && result.correct === result.total)
      addDetailRow(details, 'bonus', '🎯', 'Sequência perfeita!', '+10 pts');
    if (hadError && result.correct === result.total)
      addDetailRow(details, 'bonus', '💪', 'Persistência!', '+3 pts');
  }

  if (result.penalty > 0) {
    details.innerHTML += '<div class="pc-detail-divider"></div>';
    if (result.errCnt > 3)
      addDetailRow(details, 'penalty', '⚠️', 'Muitos erros (' + result.errCnt + ')', '-' + Math.round(5 * (currentDifficulty === 'Fácil' ? 0.5 : currentDifficulty === 'Difícil' ? 1.5 : 1)) + ' pts');
    if (result.ratio < 0.25)
      addDetailRow(details, 'penalty', '⚠️', 'Sequência bagunçada', '-' + Math.round(3 * (currentDifficulty === 'Fácil' ? 0.5 : currentDifficulty === 'Difícil' ? 1.5 : 1)) + ' pts');
  }

  if (isLastPhase) {
    const finalScore100 = calcFinalScore100();
    btnNext.textContent = '🏆 Ver Resultado Final!';
    btnNext.className   = 'pc-btn-next game-done';
    // Envia score ao finalizar jogo
    setTimeout(() => {
      sendFinalScore({ score: finalScore100, difficulty: getPlatformDifficulty() });
    }, 800);
  } else {
    btnNext.textContent = 'Próxima Fase ➡️';
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
  if (currentPhase < phases.length - 1) {
    currentPhase++;
    initPhase();
    setTimeout(() => {
      const firstBlock = document.querySelector('#blockList .block-card:not(.used)');
      if (firstBlock) firstBlock.focus();
    }, 600);
  } else {
    const finalScore100 = calcFinalScore100();
    showToast('🏆 Jogo concluído! Pontuação final: ' + finalScore100 + '/100', 'ok');
    say('Parabéns! Você é incrível! Completou todas as missões com ' + finalScore100 + ' pontos!', 0.8);
    sendFinalScore({ score: finalScore100, difficulty: getPlatformDifficulty() });
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
  const u = say(phases[currentPhase].mission, 0.85);
  if (u) u.onend = () => { if (btn) btn.classList.remove('speaking'); };
  else if (btn) btn.classList.remove('speaking');
}

function speakSequence() {
  const ph     = phases[currentPhase];
  const filled = slots.filter(s => s !== null);
  if (!filled.length) { say('Adicione os blocos primeiro!'); return; }
  const names = slots.map((s, i) => s ? `${i + 1}. ${ph.blocks.find(b => b.id === s).name}` : '').filter(Boolean);
  say('A sequência até agora é: ' + names.join(', '), 0.8);
}

// ================================================
// FEEDBACK VISUAL
// ================================================
function showToast(msg, type = 'ok') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className   = 'feedback-toast show ' + type;
  setTimeout(() => { t.className = 'feedback-toast'; }, 2600);
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
    let cls = 'phase-btn';
    if (i === currentPhase)      cls += ' active';
    else if (phaseScores[i] > 0) cls += ' done';
    else if (i > currentPhase)   cls += ' locked';
    btn.className = cls;
    const starsHtml = phaseStars[i] > 0
      ? ' <span class="phase-star-count">' + '⭐'.repeat(phaseStars[i]) + '</span>'
      : '';
    btn.innerHTML = ph.icon + ' Fase ' + ph.id + starsHtml;
    if (phaseScores[i] > 0) btn.title = phaseScores[i] + ' pts';
    btn.setAttribute('aria-label', 'Fase ' + ph.id + ': ' + ph.title + (phaseScores[i] > 0 ? ', ' + phaseScores[i] + ' pontos' : ''));
    btn.setAttribute('aria-current', i === currentPhase ? 'true' : 'false');
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
  const ph       = phases[currentPhase];
  slots          = new Array(ph.sequence.length).fill(null);
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
  applyDifficulty();
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
    c.setAttribute('role', 'listitem');
    c.setAttribute('tabindex', '0');
    c.setAttribute('aria-label', b.name + ' — clique ou pressione Enter para adicionar à sequência');
    c.setAttribute('aria-pressed', 'false');
    c.innerHTML = renderBlockContent(b);

    c.addEventListener('dragstart', () => { dragItem = b.id; c.classList.add('dragging'); });
    c.addEventListener('dragend',   () => c.classList.remove('dragging'));
    c.addEventListener('click', () => {
      say(b.name, 1.0);
      const next = slots.findIndex(s => s === null);
      if (next !== -1) addToSlot(next, b.id);
      else showToast('⚠️ Todos os espaços estão preenchidos!', 'err');
    });
    c.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const next = slots.findIndex(s => s === null);
        if (next !== -1) { say(b.name, 1.0); addToSlot(next, b.id); }
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
  const ph   = phases[currentPhase];
  const zone = document.getElementById('dropZone');
  zone.innerHTML = '';
  ph.sequence.forEach((_, i) => {
    const s = document.createElement('div');
    s.className   = 'drop-slot';
    s.dataset.idx = i;
    s.setAttribute('role', 'listitem');
    s.setAttribute('tabindex', '0');
    s.setAttribute('aria-label', `Posição ${i + 1} de ${ph.sequence.length}, vazio`);
    s.innerHTML = `
      <span class="slot-number" aria-hidden="true">${i + 1}</span>
      <div class="slot-content" id="sc${i}"><span style="font-size:26px;color:#ccc" aria-hidden="true">?</span></div>
      <span class="slot-check" aria-hidden="true">✅</span>`;
    s.addEventListener('dragover',  e => { e.preventDefault(); s.classList.add('over'); });
    s.addEventListener('dragleave', () => s.classList.remove('over'));
    s.addEventListener('drop', e => { e.preventDefault(); s.classList.remove('over'); if (dragItem) addToSlot(i, dragItem); });
    s.addEventListener('click', () => { if (slots[i]) removeFromSlot(i); });
    s.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && slots[i]) { e.preventDefault(); removeFromSlot(i); }
      if ((e.key === 'Delete' || e.key === 'Backspace') && slots[i]) { e.preventDefault(); removeFromSlot(i); }
    });
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
  if (blkEl) {
    blkEl.classList.add('used');
    blkEl.setAttribute('aria-label', b.name + ' — já adicionado à sequência');
    blkEl.setAttribute('aria-pressed', 'true');
    blkEl.setAttribute('tabindex', '-1');
  }
  const slotEl = document.querySelector(`.drop-slot[data-idx="${idx}"]`);
  if (slotEl) slotEl.setAttribute('aria-label', `Posição ${idx + 1} de ${ph.sequence.length}: ${b.name} — pressione Enter para remover`);
  say(b.name, 1.0);
  updateProgress();
  dragItem = null;
}

function removeFromSlot(idx) {
  const ph      = phases[currentPhase];
  const blockId = slots[idx];
  if (!blockId) return;
  const b = ph.blocks.find(x => x.id === blockId);
  slots[idx] = null;
  document.getElementById('sc' + idx).innerHTML = `<span style="font-size:26px;color:#ccc" aria-hidden="true">?</span>`;
  const slotEl = document.querySelector(`.drop-slot[data-idx="${idx}"]`);
  if (slotEl) {
    slotEl.className = 'drop-slot';
    slotEl.setAttribute('aria-label', `Posição ${idx + 1} de ${ph.sequence.length}, vazio`);
  }
  const blkEl = document.getElementById('blk_' + blockId);
  if (blkEl) {
    blkEl.classList.remove('used');
    blkEl.setAttribute('aria-label', b.name + ' — clique ou pressione Enter para adicionar à sequência');
    blkEl.setAttribute('aria-pressed', 'false');
    blkEl.setAttribute('tabindex', '0');
  }
  updateProgress();
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
    document.getElementById('scoreVal').setAttribute('aria-label', 'Pontuação total: ' + score + ' pontos');

    updateHeaderStars();

    const msg = sayings.correct[Math.floor(Math.random() * sayings.correct.length)];
    setChar(msg);
    say(msg + '. Você ganhou ' + result.pts + ' pontos!', 0.9);
    buildPhaseNav();

    setTimeout(() => {
      playStoryAnimation(ph, () => {
        showPhaseComplete(result, ph, currentPhase === phases.length - 1);
      });
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
    if (errorCount > 3)                              penaltyMsg = ' (⚠️ Muitos erros: penalidade ao final)';
    else if (wrongCount / ph.sequence.length > 0.75) penaltyMsg = ' (⚠️ Sequência bagunçada: penalidade ao final)';
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
  if (currentDifficulty === 'Difícil') {
    showToast('⚠️ Dicas desativadas no modo Difícil!', 'err');
    return;
  }
  hintCount++;
  const ph       = phases[currentPhase];
  const wrongIdx = ph.sequence.findIndex((id, i) => slots[i] !== id);
  if (wrongIdx === -1) { say('Você está indo bem!'); return; }
  const correct = ph.blocks.find(b => b.id === ph.sequence[wrongIdx]);
  const hint = `Na posição ${wrongIdx + 1}, vai o bloco: ${correct.name}`;
  say(hint, 0.85);
  showToast('💡 ' + hint, 'tip');
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
  phaseScores = new Array(phases.length).fill(0);
  phaseStars  = new Array(phases.length).fill(0);
  buildDifficultyUI();
});
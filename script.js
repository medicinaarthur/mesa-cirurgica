/**
 * ═══════════════════════════════════════════════════════════════════
 *  MONTAGEM DA MESA CIRÚRGICA — script.js  v2.0
 *  Jogo educacional de memorização de instrumentos cirúrgicos.
 *  Recursos: Drag & Drop, Hint, Flash Cards, Sons, Progresso por Categoria.
 * ═══════════════════════════════════════════════════════════════════
 */

'use strict';

/* ══════════════════════════════════════════════════════
   1. CONFIGURAÇÃO GLOBAL
══════════════════════════════════════════════════════ */

/**
 * SURGEON_SIDE: lado onde o CIRURGIÃO está posicionado.
 * A MESA fica sempre NO LADO OPOSTO ao cirurgião.
 *   'right' → cirurgião à direita, mesa à esquerda (padrão / imagem referência)
 *   'left'  → cirurgião à esquerda, mesa à direita (espelhado)
 */
let SURGEON_SIDE = 'right';

/** Modo de jogo: 'study' (Modo Estudo) | 'exam' (Modo Prova) */
let GAME_MODE = 'study';

/** Gabarito visível? */
let SHOW_ANSWER = false;

/** ID do instrumento selecionado na bandeja (para hint) */
let SELECTED_INSTRUMENT_ID = null;

/* ══════════════════════════════════════════════════════
   2. MAPA DE CATEGORIAS (para cores e progresso)
══════════════════════════════════════════════════════ */

/** group → classes CSS usadas nos cards da bandeja e tags */
const CAT_CONFIG = {
  dierese:    { trayClass: 'tray-dierese',    tagClass: 'tray-cat-dierese',    detailClass: 'cat-tag-dierese',    progId: 'dierese'    },
  hemostasia: { trayClass: 'tray-hemostasia', tagClass: 'tray-cat-hemostasia', detailClass: 'cat-tag-hemostasia', progId: 'hemostasia' },
  especiais:  { trayClass: 'tray-especiais',  tagClass: 'tray-cat-especiais',  detailClass: 'cat-tag-especiais',  progId: 'especiais'  },
  sintese:    { trayClass: 'tray-sintese',    tagClass: 'tray-cat-sintese',    detailClass: 'cat-tag-sintese',    progId: 'sintese'    },
};

/* ══════════════════════════════════════════════════════
   3. DADOS DOS INSTRUMENTOS
══════════════════════════════════════════════════════ */

const INSTRUMENTS = [
  {
    id: 'babykocher',
    asset: 'babykocher.png',
    name: 'Pinça Baby Kocher',
    category: 'Especiais',
    description: 'Versão menor da Kocher, com anéis e dente na ponta.',
    functionText: 'Preensão firme e hemostasia em estruturas menores.',
    group: 'especiais',
    placed: false,
  },
  {
    id: 'coracao',
    asset: 'coracao.png',
    name: 'Pinça Collin Coração',
    category: 'Especiais',
    description: 'Pinça de cabo longo com ponta em formato de coração.',
    functionText: 'Preensão delicada de tecidos e campos cirúrgicos sem traumatizar.',
    group: 'especiais',
    placed: false,
  },
  {
    id: 'backaus',
    asset: 'backaus.png',
    name: 'Pinça Backhaus',
    category: 'Especiais',
    description: 'Pinça com pontas perfurantes curvas e trava.',
    functionText: 'Fixar campos cirúrgicos ao paciente.',
    group: 'especiais',
    placed: false,
  },
  {
    id: 'allis',
    asset: 'allis.png',
    name: 'Pinça Allis',
    category: 'Especiais',
    description: 'Pinça com anéis, trava e ponta com múltiplos dentes.',
    functionText: 'Apreender tecidos com firmeza sem esmagar.',
    group: 'especiais',
    placed: false,
  },
  {
    id: 'mixter',
    asset: 'mixter.png',
    name: 'Pinça Mixter',
    category: 'Especiais',
    description: 'Pinça longa e robusta com ponta curva acentuada.',
    functionText: 'Dissecção e passagem de fios ao redor de estruturas.',
    group: 'especiais',
    placed: false,
  },
  {
    id: 'portaagulhavidea',
    asset: 'portaagulhavidea.png',
    name: 'Porta-agulha Videa',
    category: 'Síntese',
    description: 'Instrumento com anéis, trava e mandíbulas estriadas.',
    functionText: 'Segurar e guiar a agulha durante suturas.',
    group: 'sintese',
    placed: false,
  },
  {
    id: 'pincadentederato',
    asset: 'pincadentederato.png',
    name: 'Pinça Dente de Rato',
    category: 'Síntese',
    description: 'Pinça delicada com 1×2 dentes nas extremidades.',
    functionText: 'Apreensão firme de tecidos na sutura.',
    group: 'sintese',
    placed: false,
  },
  {
    id: 'pincaanatomica',
    asset: 'pincaanatomica.png',
    name: 'Pinça Anatômica',
    category: 'Síntese',
    description: 'Pinça delicada sem dentes, lisa nas pontas.',
    functionText: 'Manipular tecidos delicados sem traumatizar.',
    group: 'sintese',
    placed: false,
  },
  {
    id: 'farabeuf',
    asset: 'farabeuf.png',
    name: 'Afastador Farabeuf',
    category: 'Especiais',
    description: 'Afastador manual metálico em formato de "s".',
    functionText: 'Afastar bordas da incisão e ampliar o campo cirúrgico.',
    group: 'especiais',
    placed: false,
  },
  {
    id: 'kocher',
    asset: 'kocher.png',
    name: 'Pinça Kocher',
    category: 'Hemostasia',
    description: 'Pinça hemostática com dentes e trava resistente.',
    functionText: 'Apreensão firme de tecidos resistentes e hemostasia.',
    group: 'hemostasia',
    placed: false,
  },
  {
    id: 'kellyreta',
    asset: 'kellyreta.png',
    name: 'Pinça Kelly Reta',
    category: 'Hemostasia',
    description: 'Pinça hemostática reta com trava e estrias transversais.',
    functionText: 'Hemostasia e pinçamento de vasos.',
    group: 'hemostasia',
    placed: false,
  },
  {
    id: 'kellycurva',
    asset: 'kellycurva.png',
    name: 'Pinça Kelly Curva',
    category: 'Hemostasia',
    description: 'Pinça hemostática com ponta levemente curva.',
    functionText: 'Hemostasia em locais de difícil acesso.',
    group: 'hemostasia',
    placed: false,
  },
  {
    id: 'kellymosquito',
    asset: 'kellymosquito.png',
    name: 'Pinça Kelly Mosquito',
    category: 'Hemostasia',
    description: 'Hemostática delicada e menor que a Kelly padrão.',
    functionText: 'Hemostasia de vasos pequenos e tecidos delicados.',
    group: 'hemostasia',
    placed: false,
  },
  {
    id: 'metzenbaumreta',
    asset: 'metzenbaum reta.png',
    name: 'Tesoura Metzenbaum Reta',
    category: 'Diérese',
    description: 'Tesoura delicada com lâminas retas e ponta romba.',
    functionText: 'Corte e dissecção delicada de tecidos.',
    group: 'dierese',
    placed: false,
  },
  {
    id: 'mayo',
    asset: 'mayo.png',
    name: 'Tesoura Mayo',
    category: 'Diérese',
    description: 'Tesoura robusta com lâminas retas e mais espessas.',
    functionText: 'Corte de tecidos mais espessos e materiais como fios de sutura.',
    group: 'dierese',
    placed: false,
  },
  {
    id: 'metzenbaumcurva',
    asset: 'metzenbaum curva.png',
    name: 'Tesoura Metzenbaum Curva',
    category: 'Diérese',
    description: 'Tesoura delicada com lâminas curvas.',
    functionText: 'Dissecção e corte de tecidos delicados em ângulo.',
    group: 'dierese',
    placed: false,
  },
  {
    id: 'bisturi',
    asset: 'bisturi.png',
    name: 'Cabo de Bisturi',
    category: 'Diérese',
    description: 'Cabo reto metálico (nº 3 ou 4) onde se encaixa a lâmina.',
    functionText: 'Realizar incisões precisas na pele e tecidos.',
    group: 'dierese',
    placed: false,
  },
];

/* ══════════════════════════════════════════════════════
   4. LAYOUT DOS SLOTS (% relativo à mesa)
   ─────────────────────────────────────────────────────
   REGRA CLÍNICA: A mesa fica sempre no lado OPOSTO ao cirurgião.
   LEFT_LAYOUT_SLOTS = mesa à ESQUERDA (cirurgião à DIREITA) — imagem referência.
   RIGHT_LAYOUT_SLOTS = gerado por espelhamento (cirurgião à ESQUERDA).
══════════════════════════════════════════════════════ */

const LEFT_LAYOUT_SLOTS = [
  // ── METADE SUPERIOR — Especiais e Síntese ──────────────────────────
  // flipImg:true → só a IMAGEM é invertida, o slot (label/número) fica normal
  { id: 'backaus',          slotX:  0,  slotY: 36, slotW:  7, slotH: 18, rotation: -12, flipImg: true,  order: 1  },
  { id: 'babykocher',       slotX: 15,  slotY: 12, slotW:  8, slotH: 28, rotation: -10, flipImg: true,  order: 2  },
  { id: 'coracao',          slotX:  4,  slotY: 11, slotW:  8, slotH: 28, rotation:  -8, flipImg: true,  order: 3  },
  { id: 'allis',            slotX: 27,  slotY: 22, slotW:  8, slotH: 28, rotation:  -8, flipImg: true,  order: 4  },
  { id: 'farabeuf',         slotX: 32,  slotY: 50, slotW: 16, slotH:  9, rotation:   0, flipImg: false, order: 5  },
  { id: 'mixter',           slotX: 47,  slotY: 18, slotW:  8, slotH: 32, rotation:  -4, flipImg: true,  order: 6  },
  { id: 'portaagulhavidea', slotX: 59,  slotY:  8, slotW:  8, slotH: 30, rotation:   0, flipImg: true,  order: 7  },
  { id: 'pincadentederato', slotX: 72,  slotY:  6, slotW:  5, slotH: 30, rotation:   0, flipImg: true,  order: 8  },
  { id: 'pincaanatomica',   slotX: 82,  slotY: 10, slotW:  5, slotH: 30, rotation:   0, flipImg: true,  order: 9  },
  // ── METADE INFERIOR — Hemostasia e Diérese ─────────────────────────
  { id: 'kocher',           slotX:  9,  slotY: 64, slotW:  8, slotH: 30, rotation:  -8, flipImg: true,  order: 10 },
  { id: 'kellyreta',        slotX: 21,  slotY: 65, slotW:  8, slotH: 28, rotation:  -6, flipImg: true,  order: 11 },
  { id: 'kellycurva',       slotX: 33,  slotY: 64, slotW:  8, slotH: 28, rotation:  -4, flipImg: true,  order: 12 },
  { id: 'kellymosquito',    slotX: 45,  slotY: 63, slotW:  7, slotH: 26, rotation:  -2, flipImg: true,  order: 13 },
  // Tesouras/bisturi: PNG já orientado corretamente
  { id: 'metzenbaumreta',   slotX: 57,  slotY: 57, slotW:  6, slotH: 34, rotation:   0, flipImg: false, order: 14 },
  { id: 'mayo',             slotX: 67,  slotY: 59, slotW:  8, slotH: 32, rotation:   0, flipImg: false, order: 15 },
  { id: 'metzenbaumcurva',  slotX: 78,  slotY: 57, slotW:  6, slotH: 32, rotation:   2, flipImg: false, order: 16 },
  { id: 'bisturi',          slotX: 89,  slotY: 63, slotW:  4, slotH: 26, rotation:   0, flipImg: false, order: 17 },
];

/** Espelhamento horizontal para mesa à DIREITA (cirurgião à ESQUERDA) */
const RIGHT_LAYOUT_SLOTS = LEFT_LAYOUT_SLOTS.map(s => ({
  ...s,
  slotX: 100 - s.slotX - s.slotW,
  rotation: -s.rotation,
}));

/* ══════════════════════════════════════════════════════
   5. ESTADO DO JOGO
══════════════════════════════════════════════════════ */

const state = {
  score: 0,
  total: INSTRUMENTS.length,
  instruments: [],    // cópia mutável
  activeSlotId: null,
  draggingId: null,
  ghostOffsetX: 0,
  ghostOffsetY: 0,
};

/* ══════════════════════════════════════════════════════
   6. REFS DOM
══════════════════════════════════════════════════════ */

const DOM = {
  table:             () => document.getElementById('surgical-table'),
  tray:              () => document.getElementById('instrument-tray'),
  scoreCount:        () => document.getElementById('score-count'),
  scoreTotal:        () => document.getElementById('score-total'),
  modeBadge:         () => document.getElementById('mode-badge'),
  sideBadge:         () => document.getElementById('side-badge'),
  tableSideInfo:     () => document.getElementById('table-side-info'),
  feedbackMsg:       () => document.getElementById('feedback-msg'),
  victoryOverlay:    () => document.getElementById('victory-overlay'),
  victorySideInfo:   () => document.getElementById('victory-side-info'),
  answerOverlay:     () => document.getElementById('answer-overlay'),
  answerGrid:        () => document.getElementById('answer-grid'),
  answerSideLabel:   () => document.getElementById('answer-side-label'),
  detailPlaceholder: () => document.getElementById('detail-placeholder'),
  detailContent:     () => document.getElementById('detail-content'),
  detailImg:         () => document.getElementById('detail-img'),
  detailName:        () => document.getElementById('detail-name'),
  detailCategory:    () => document.getElementById('detail-category'),
  detailDesc:        () => document.getElementById('detail-description'),
  detailFunc:        () => document.getElementById('detail-function'),
  detailSelectedInfo:() => document.getElementById('detail-selected-info'),
  flashcardOverlay:  () => document.getElementById('flashcard-overlay'),
  fcImg:             () => document.getElementById('fc-img'),
  fcName:            () => document.getElementById('fc-name'),
  fcCategory:        () => document.getElementById('fc-category'),
  fcDesc:            () => document.getElementById('fc-desc'),
  fcFunc:            () => document.getElementById('fc-func'),
  fcFront:           () => document.getElementById('fc-front'),
  fcBack:            () => document.getElementById('fc-back'),
  fcProgressText:    () => document.getElementById('fc-progress-text'),
};

/* ══════════════════════════════════════════════════════
   7. WEB AUDIO API — Sons Simples
══════════════════════════════════════════════════════ */

let _audioCtx = null;
function getAudioCtx() {
  if (!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return _audioCtx;
}

function playSound(type) {
  try {
    const ctx = getAudioCtx();
    if (ctx.state === 'suspended') ctx.resume();

    if (type === 'success') {
      const freqs = [880, 1100];
      freqs.forEach((f, i) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.frequency.setValueAtTime(f, ctx.currentTime + i * 0.1);
        g.gain.setValueAtTime(0.28, ctx.currentTime + i * 0.1);
        g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.1 + 0.25);
        o.start(ctx.currentTime + i * 0.1);
        o.stop(ctx.currentTime + i * 0.1 + 0.25);
      });

    } else if (type === 'error') {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sawtooth';
      o.connect(g); g.connect(ctx.destination);
      o.frequency.setValueAtTime(220, ctx.currentTime);
      o.frequency.linearRampToValueAtTime(160, ctx.currentTime + 0.2);
      g.gain.setValueAtTime(0.22, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      o.start(ctx.currentTime);
      o.stop(ctx.currentTime + 0.3);

    } else if (type === 'victory') {
      // Melodia de vitória: C5 E5 G5 C6
      [523, 659, 784, 1047].forEach((freq, i) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.18);
        g.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.18);
        g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.18 + 0.35);
        o.start(ctx.currentTime + i * 0.18);
        o.stop(ctx.currentTime + i * 0.18 + 0.35);
      });
    }
  } catch (e) {
    console.warn('Audio indisponível:', e);
  }
}

/* ══════════════════════════════════════════════════════
   8. DRAG GHOST VISUAL
══════════════════════════════════════════════════════ */

let dragGhost = null;

function createDragGhost(asset) {
  if (dragGhost) dragGhost.remove();
  dragGhost = document.createElement('div');
  dragGhost.id = 'drag-ghost';
  const img = document.createElement('img');
  img.src = asset; img.alt = '';
  dragGhost.appendChild(img);
  document.body.appendChild(dragGhost);
}

function moveDragGhost(x, y) {
  if (!dragGhost) return;
  dragGhost.style.left = (x - state.ghostOffsetX) + 'px';
  dragGhost.style.top  = (y - state.ghostOffsetY) + 'px';
}

function removeDragGhost() {
  if (dragGhost) { dragGhost.remove(); dragGhost = null; }
}

/* ══════════════════════════════════════════════════════
   9. CONSTRUÇÃO DA MESA (SLOTS)
══════════════════════════════════════════════════════ */

function getLayoutSlots() {
  // Mesa SEMPRE no lado oposto ao cirurgião:
  // cirurgião à DIREITA → mesa à ESQUERDA → LEFT_LAYOUT_SLOTS
  // cirurgião à ESQUERDA → mesa à DIREITA → RIGHT_LAYOUT_SLOTS
  return SURGEON_SIDE === 'right' ? LEFT_LAYOUT_SLOTS : RIGHT_LAYOUT_SLOTS;
}

function getInstrumentById(id) { return state.instruments.find(i => i.id === id); }
function getSlotById(id)       { return getLayoutSlots().find(s => s.id === id); }

function buildTableSlots() {
  const table = DOM.table();
  table.querySelectorAll('.slot').forEach(el => el.remove());

  getLayoutSlots().forEach(slot => {
    const ins = getInstrumentById(slot.id);
    const div = document.createElement('div');
    div.classList.add('slot');
    div.dataset.slotId = slot.id;
    div.style.left      = slot.slotX + '%';
    div.style.top       = slot.slotY + '%';
    div.style.width     = slot.slotW + '%';
    div.style.height    = slot.slotH + '%';
    div.style.transform = `rotate(${slot.rotation}deg)`;

    const order = document.createElement('div');
    order.classList.add('slot-order');
    order.textContent = slot.order;
    div.appendChild(order);

    const label = document.createElement('div');
    label.classList.add('slot-label');
    label.textContent = ins ? ins.name : slot.id;
    div.appendChild(label);

    if (ins && ins.placed) div.classList.add('slot-filled');

    div.addEventListener('dragover',  onSlotDragOver);
    div.addEventListener('dragleave', onSlotDragLeave);
    div.addEventListener('drop',      onSlotDrop);
    div.addEventListener('pointerover', onSlotPointerOver);
    div.addEventListener('pointerout',  onSlotPointerOut);

    table.appendChild(div);
  });
}

/* ══════════════════════════════════════════════════════
   10. CONSTRUÇÃO DA BANDEJA
══════════════════════════════════════════════════════ */

function buildTray() {
  const tray = DOM.tray();
  tray.innerHTML = '';
  const shuffled = [...state.instruments].sort(() => Math.random() - 0.5);

  shuffled.forEach(ins => {
    const cfg = CAT_CONFIG[ins.group] || {};

    const card = document.createElement('div');
    card.classList.add('tray-instrument', cfg.trayClass || '');
    card.dataset.instrumentId = ins.id;
    if (ins.placed) card.classList.add('placed');

    // Imagem
    const img = document.createElement('img');
    img.src = ins.asset; img.alt = ins.name;
    card.appendChild(img);

    // Nome
    const name = document.createElement('span');
    name.classList.add('tray-instrument-name');
    name.textContent = ins.name;
    card.appendChild(name);

    // Tag de categoria
    const catTag = document.createElement('span');
    catTag.classList.add('tray-cat-tag', cfg.tagClass || '');
    catTag.textContent = ins.category;
    card.appendChild(catTag);

    // Drag events
    card.setAttribute('draggable', 'true');
    card.addEventListener('dragstart', onTrayDragStart);
    card.addEventListener('dragend',   onTrayDragEnd);
    card.addEventListener('pointerdown', onTrayPointerDown);

    // Clique → selecionar + mostrar detalhe + highlight slot
    card.addEventListener('click', e => {
      if (state.draggingId) return;
      selectInstrument(ins.id);
    });

    tray.appendChild(card);
  });
}

/* ══════════════════════════════════════════════════════
   11. SELEÇÃO DE INSTRUMENTO + HINT (destacar slot)
══════════════════════════════════════════════════════ */

function selectInstrument(instrId) {
  // Desabilitar seleção anterior
  document.querySelectorAll('.tray-instrument.selected').forEach(c => c.classList.remove('selected'));
  clearHintHighlights();

  if (SELECTED_INSTRUMENT_ID === instrId) {
    // Segundo clique no mesmo → deselecionar
    SELECTED_INSTRUMENT_ID = null;
    hideDetail();
    return;
  }

  SELECTED_INSTRUMENT_ID = instrId;
  const card = document.querySelector(`.tray-instrument[data-instrument-id="${instrId}"]`);
  if (card) card.classList.add('selected');

  showDetail(instrId);
  highlightSlot(instrId);
}

function highlightSlot(instrId) {
  clearHintHighlights();
  const slotEl = document.querySelector(`.slot[data-slot-id="${instrId}"]`);
  if (!slotEl) return;
  slotEl.classList.add('hint-active');
  // Remove a classe após a animação terminar (3 pulses × 0.7s = 2.1s)
  setTimeout(() => slotEl.classList.remove('hint-active'), 2200);
}

function clearHintHighlights() {
  document.querySelectorAll('.slot.hint-active').forEach(el => el.classList.remove('hint-active'));
}

/* ══════════════════════════════════════════════════════
   12. RENDERIZAR INSTRUMENTOS COLOCADOS NA MESA
══════════════════════════════════════════════════════ */

function renderPlacedInstruments() {
  const table = DOM.table();
  table.querySelectorAll('.instrument-placed').forEach(el => el.remove());

  const slots = getLayoutSlots();
  state.instruments.forEach(ins => {
    if (!ins.placed) return;
    const slot = slots.find(s => s.id === ins.id);
    if (!slot) return;

    const el = document.createElement('div');
    el.classList.add('instrument-placed');
    el.dataset.instrumentId = ins.id;
    el.style.left      = slot.slotX + '%';
    el.style.top       = slot.slotY + '%';
    el.style.width     = slot.slotW + '%';
    el.style.height    = slot.slotH + '%';
    el.style.transform = `rotate(${slot.rotation}deg)`;
    el.style.zIndex    = '10';

    const img = document.createElement('img');
    img.src = ins.asset; img.alt = ins.name;
    // Aplica flip SOMENTE na imagem — slot (label/número) não é afetado
    if (slot.flipImg) img.classList.add('flip-img');
    el.appendChild(img);

    el.addEventListener('click', () => showDetail(ins.id));
    table.appendChild(el);
  });
}

/* ══════════════════════════════════════════════════════
   13. DRAG & DROP — HTML5 API
══════════════════════════════════════════════════════ */

function onTrayDragStart(e) {
  const card = e.currentTarget;
  const id   = card.dataset.instrumentId;
  const ins  = getInstrumentById(id);
  if (!ins || ins.placed) { e.preventDefault(); return; }

  state.draggingId = id;
  card.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', id);

  const blank = new Image();
  blank.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  e.dataTransfer.setDragImage(blank, 0, 0);

  const rect = card.getBoundingClientRect();
  state.ghostOffsetX = e.clientX - rect.left + rect.width / 2;
  state.ghostOffsetY = e.clientY - rect.top  + rect.height / 2;
  createDragGhost(ins.asset);
  moveDragGhost(e.clientX, e.clientY);
}

function onTrayDragEnd(e) {
  e.currentTarget.classList.remove('dragging');
  state.draggingId = null;
  removeDragGhost();
  clearAllSlotHighlights();
}

document.addEventListener('dragover', e => { e.preventDefault(); moveDragGhost(e.clientX, e.clientY); });

function onSlotDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  e.currentTarget.classList.add('drag-over');
  state.activeSlotId = e.currentTarget.dataset.slotId;
}

function onSlotDragLeave(e) {
  e.currentTarget.classList.remove('drag-over');
  if (state.activeSlotId === e.currentTarget.dataset.slotId) state.activeSlotId = null;
}

function onSlotDrop(e) {
  e.preventDefault();
  const slot   = e.currentTarget;
  const slotId = slot.dataset.slotId;
  const instrId = e.dataTransfer.getData('text/plain') || state.draggingId;
  slot.classList.remove('drag-over');
  clearAllSlotHighlights();
  removeDragGhost();
  if (!instrId) return;
  handleDrop(instrId, slotId);
}

/* ══════════════════════════════════════════════════════
   14. DRAG & DROP — POINTER EVENTS (touch)
══════════════════════════════════════════════════════ */

let pointerDragging = false;
let pointerInstrId  = null;

function onTrayPointerDown(e) {
  const id  = e.currentTarget.dataset.instrumentId;
  const ins = getInstrumentById(id);
  if (!ins || ins.placed) return;
  if (e.pointerType === 'mouse') return;
  e.preventDefault();
  pointerDragging = true; pointerInstrId = state.draggingId = id;
  const rect = e.currentTarget.getBoundingClientRect();
  state.ghostOffsetX = e.clientX - rect.left + rect.width / 2;
  state.ghostOffsetY = e.clientY - rect.top  + rect.height / 2;
  createDragGhost(ins.asset);
  moveDragGhost(e.clientX, e.clientY);
  e.currentTarget.setPointerCapture(e.pointerId);
  e.currentTarget.addEventListener('pointermove',   onPointerMove);
  e.currentTarget.addEventListener('pointerup',     onPointerUp);
  e.currentTarget.addEventListener('pointercancel', onPointerCancel);
}

function onPointerMove(e) {
  if (!pointerDragging) return;
  moveDragGhost(e.clientX, e.clientY);
  clearAllSlotHighlights();
  const el = document.elementFromPoint(e.clientX, e.clientY);
  const slotEl = el && el.closest('.slot');
  if (slotEl) { slotEl.classList.add('drag-over'); state.activeSlotId = slotEl.dataset.slotId; }
  else         { state.activeSlotId = null; }
}

function onPointerUp(e) {
  clearPointerDrag(e);
  if (pointerInstrId && state.activeSlotId) handleDrop(pointerInstrId, state.activeSlotId);
  else if (pointerInstrId) setFeedback('Solte sobre um slot da mesa!', 'idle');
  clearAllSlotHighlights();
}

function onPointerCancel(e) { clearPointerDrag(e); }

function clearPointerDrag(e) {
  pointerDragging = false;
  const id = pointerInstrId;
  pointerInstrId = state.draggingId = null;
  removeDragGhost();
  if (e && e.currentTarget) {
    e.currentTarget.removeEventListener('pointermove',   onPointerMove);
    e.currentTarget.removeEventListener('pointerup',     onPointerUp);
    e.currentTarget.removeEventListener('pointercancel', onPointerCancel);
  }
  return id;
}

function onSlotPointerOver(e) {
  if (!pointerDragging) return;
  e.currentTarget.classList.add('drag-over');
  state.activeSlotId = e.currentTarget.dataset.slotId;
}

function onSlotPointerOut(e) {
  if (!pointerDragging) return;
  e.currentTarget.classList.remove('drag-over');
}

function clearAllSlotHighlights() {
  document.querySelectorAll('.slot.drag-over').forEach(s => s.classList.remove('drag-over'));
  state.activeSlotId = null;
}

/* ══════════════════════════════════════════════════════
   15. LÓGICA DE ACERTO / ERRO
══════════════════════════════════════════════════════ */

function handleDrop(instrId, slotId) {
  const ins = getInstrumentById(instrId);
  if (!ins || ins.placed) return;

  const alreadyPlaced = state.instruments.find(i => i.placed && i.id === slotId);
  if (alreadyPlaced) {
    setFeedback(`Slot já ocupado por "${alreadyPlaced.name}".`, 'error');
    animateTrayCard(instrId, 'anim-error');
    playSound('error');
    return;
  }

  if (instrId === slotId) {
    // ── ACERTO ──
    ins.placed = true;
    state.score++;
    updateScore();
    setFeedback(`✅ Correto! "${ins.name}" encaixado.`, 'success');
    animateTrayCard(instrId, 'anim-success');
    markTrayCardPlaced(instrId);
    playSound('success');

    const slotEl = document.querySelector(`.slot[data-slot-id="${slotId}"]`);
    if (slotEl) slotEl.classList.add('slot-filled');

    // Limpa seleção se era o instrumento hints
    if (SELECTED_INSTRUMENT_ID === instrId) {
      SELECTED_INSTRUMENT_ID = null;
      document.querySelectorAll('.tray-instrument.selected').forEach(c => c.classList.remove('selected'));
      clearHintHighlights();
    }

    renderPlacedInstruments();
    updateProgressBars();

    if (state.score >= state.total) setTimeout(showVictory, 900);

  } else {
    // ── ERRO ──
    setFeedback(`❌ Posição incorreta para "${ins.name}". Tente outro slot!`, 'error');
    animateTrayCard(instrId, 'anim-error');
    playSound('error');
  }
}

/* ══════════════════════════════════════════════════════
   16. BARRAS DE PROGRESSO POR CATEGORIA
══════════════════════════════════════════════════════ */

/** Total de instrumentos por grupo */
function getCatTotals() {
  const totals = {};
  INSTRUMENTS.forEach(i => { totals[i.group] = (totals[i.group] || 0) + 1; });
  return totals;
}

function updateProgressBars() {
  const totals = getCatTotals();
  Object.keys(CAT_CONFIG).forEach(group => {
    const cfg      = CAT_CONFIG[group];
    const total    = totals[group] || 0;
    const placed   = state.instruments.filter(i => i.group === group && i.placed).length;
    const pct      = total > 0 ? (placed / total * 100) : 0;

    const bar = document.getElementById(`prog-bar-${cfg.progId}`);
    const count = document.getElementById(`prog-count-${cfg.progId}`);
    if (bar)   bar.style.width = pct + '%';
    if (count) count.textContent = `${placed}/${total}`;
  });
}

/* ══════════════════════════════════════════════════════
   17. FEEDBACK, SCORE, ANIMAÇÕES BANDEJA
══════════════════════════════════════════════════════ */

function updateScore() {
  DOM.scoreCount().textContent = state.score;
  DOM.scoreTotal().textContent = state.total;
}

function markTrayCardPlaced(instrId) {
  const card = document.querySelector(`.tray-instrument[data-instrument-id="${instrId}"]`);
  if (card) card.classList.add('placed');
}

function animateTrayCard(instrId, cls) {
  const card = document.querySelector(`.tray-instrument[data-instrument-id="${instrId}"]`);
  if (!card) return;
  card.classList.add(cls);
  card.addEventListener('animationend', () => card.classList.remove(cls), { once: true });
}

let feedbackTimeout = null;
function setFeedback(msg, type = 'idle') {
  const el = DOM.feedbackMsg();
  el.textContent = msg;
  el.className = `feedback-${type}`;
  if (feedbackTimeout) clearTimeout(feedbackTimeout);
  if (type !== 'idle') {
    feedbackTimeout = setTimeout(() => {
      el.textContent = 'Continue arrastando os instrumentos…';
      el.className = 'feedback-idle';
    }, 3500);
  }
}

/* ══════════════════════════════════════════════════════
   18. PAINEL DE DETALHES
══════════════════════════════════════════════════════ */

function showDetail(instrId) {
  const ins = getInstrumentById(instrId);
  if (!ins) return;
  const cfg = CAT_CONFIG[ins.group] || {};

  DOM.detailPlaceholder().classList.add('hidden');
  DOM.detailContent().classList.remove('hidden');

  DOM.detailImg().src = ins.asset;
  DOM.detailImg().alt = ins.name;
  DOM.detailName().textContent = ins.name;
  DOM.detailCategory().textContent = ins.category;
  DOM.detailCategory().className = `category-tag ${cfg.detailClass || ''}`;
  DOM.detailDesc().textContent = ins.description;
  DOM.detailFunc().textContent = ins.functionText;
  DOM.detailSelectedInfo().classList.toggle('hidden', instrId !== SELECTED_INSTRUMENT_ID);
}

function hideDetail() {
  DOM.detailPlaceholder().classList.remove('hidden');
  DOM.detailContent().classList.add('hidden');
}

/* ══════════════════════════════════════════════════════
   19. FLASH CARDS
══════════════════════════════════════════════════════ */

let fcIndex = 0;
let fcFlipped = false;
const FC_INSTRUMENTS = [...INSTRUMENTS]; // ordem fixa para flash cards

function openFlashCards() {
  fcIndex   = 0;
  fcFlipped = false;
  renderFlashCard();
  DOM.flashcardOverlay().classList.remove('hidden');
}

function closeFlashCards() {
  DOM.flashcardOverlay().classList.add('hidden');
}

function renderFlashCard() {
  const ins = FC_INSTRUMENTS[fcIndex];
  const cfg = CAT_CONFIG[ins.group] || {};

  DOM.fcImg().src = ins.asset;
  DOM.fcName().textContent = ins.name;
  DOM.fcCategory().textContent = ins.category;
  DOM.fcCategory().className = `category-tag ${cfg.detailClass || ''}`;
  DOM.fcDesc().textContent = ins.description;
  DOM.fcFunc().textContent = ins.functionText;
  DOM.fcProgressText().textContent = `${fcIndex + 1} / ${FC_INSTRUMENTS.length}`;

  // Reset flip state
  fcFlipped = false;
  DOM.fcFront().classList.remove('hidden');
  DOM.fcBack().classList.add('hidden');
}

function flipFlashCard() {
  fcFlipped = !fcFlipped;
  DOM.fcFront().classList.toggle('hidden', fcFlipped);
  DOM.fcBack().classList.toggle('hidden', !fcFlipped);
}

/* ══════════════════════════════════════════════════════
   20. MODAL DE VITÓRIA
══════════════════════════════════════════════════════ */

function showVictory() {
  playSound('victory');
  const sLabel = getSurgeonSideLabel();
  DOM.victorySideInfo().textContent = `Mesa montada — ${sLabel}`;
  DOM.victoryOverlay().classList.remove('hidden');
}

function hideVictory() { DOM.victoryOverlay().classList.add('hidden'); }

/* ══════════════════════════════════════════════════════
   21. GABARITO
══════════════════════════════════════════════════════ */

function buildAnswerGrid() {
  const grid = DOM.answerGrid();
  grid.innerHTML = '';
  getLayoutSlots().forEach(slot => {
    const ins = getInstrumentById(slot.id);
    if (!ins) return;
    const card = document.createElement('div');
    card.classList.add('answer-card');
    if (ins.placed) card.classList.add('answer-placed');

    const num  = document.createElement('div'); num.classList.add('answer-num');
    num.textContent = `#${slot.order} — ${ins.category}`;

    const img  = document.createElement('img');
    img.src = ins.asset; img.alt = ins.name;

    const name = document.createElement('div'); name.classList.add('answer-name');
    name.textContent = ins.name;

    card.appendChild(num); card.appendChild(img); card.appendChild(name);
    grid.appendChild(card);
  });
}

/* ══════════════════════════════════════════════════════
   22. LADO DO CIRURGIÃO — label e aplicação
══════════════════════════════════════════════════════ */

function getSurgeonSideLabel() {
  const surgeon = SURGEON_SIDE === 'right' ? 'Direito' : 'Esquerdo';
  const table   = SURGEON_SIDE === 'right' ? 'Esquerda' : 'Direita';
  return `Cirurgião: ${surgeon} | Mesa: ${table}`;
}

function applySurgeonSide() {
  const label = getSurgeonSideLabel();
  DOM.sideBadge().textContent = `🔪 ${label}`;
  const tableInfo = DOM.tableSideInfo();
  if (tableInfo) {
    const mesa = SURGEON_SIDE === 'right' ? 'Mesa à esquerda do cirurgião' : 'Mesa à direita do cirurgião';
    tableInfo.textContent = mesa;
  }
  DOM.answerSideLabel().textContent = label;
  DOM.victorySideInfo().textContent = `Mesa montada — ${label}`;
}

/* ══════════════════════════════════════════════════════
   23. MODO DE JOGO (estudo / prova)
══════════════════════════════════════════════════════ */

function applyGameMode() {
  document.body.classList.toggle('mode-study', GAME_MODE === 'study');
  document.body.classList.toggle('mode-exam',  GAME_MODE === 'exam');

  const btn  = document.getElementById('btn-toggle-mode');
  const badge = DOM.modeBadge();

  if (GAME_MODE === 'study') {
    badge.textContent = '📚 Modo Estudo';
    badge.className   = 'badge badge-study';
    btn.textContent   = '🎓 Modo Prova';
  } else {
    badge.textContent = '🎓 Modo Prova';
    badge.className   = 'badge badge-exam';
    btn.textContent   = '📚 Modo Estudo';
  }
}

/* ══════════════════════════════════════════════════════
   24. GABARITO (toggle)
══════════════════════════════════════════════════════ */

function toggleAnswer() {
  SHOW_ANSWER = !SHOW_ANSWER;
  document.body.classList.toggle('show-answer', SHOW_ANSWER);
  if (SHOW_ANSWER) {
    buildAnswerGrid();
    DOM.answerOverlay().classList.remove('hidden');
  } else {
    DOM.answerOverlay().classList.add('hidden');
  }
}

/* ══════════════════════════════════════════════════════
   25. REINICIAR
══════════════════════════════════════════════════════ */

function restartGame() {
  SHOW_ANSWER = false;
  SELECTED_INSTRUMENT_ID = null;
  document.body.classList.remove('show-answer');
  DOM.answerOverlay().classList.add('hidden');
  DOM.victoryOverlay().classList.add('hidden');
  hideDetail();
  initGame();
}

/* ══════════════════════════════════════════════════════
   26. INICIALIZAÇÃO
══════════════════════════════════════════════════════ */

function initGame() {
  state.score = 0;
  state.instruments = INSTRUMENTS.map(i => ({ ...i, placed: false }));

  applyGameMode();
  applySurgeonSide();
  updateScore();
  updateProgressBars();
  buildTableSlots();
  buildTray();
  renderPlacedInstruments();

  setFeedback('Clique num instrumento para ver o slot, depois arraste para colocar na mesa!', 'idle');
}

/* ══════════════════════════════════════════════════════
   27. BINDINGS DE BOTÕES
══════════════════════════════════════════════════════ */

function bindButtons() {
  document.getElementById('btn-restart').addEventListener('click', restartGame);

  document.getElementById('btn-toggle-mode').addEventListener('click', () => {
    GAME_MODE = GAME_MODE === 'study' ? 'exam' : 'study';
    applyGameMode();
  });

  document.getElementById('btn-toggle-side').addEventListener('click', () => {
    SURGEON_SIDE = SURGEON_SIDE === 'right' ? 'left' : 'right';
    restartGame();
  });

  document.getElementById('btn-show-answer').addEventListener('click', toggleAnswer);

  document.getElementById('btn-hint').addEventListener('click', () => {
    if (!SELECTED_INSTRUMENT_ID) {
      setFeedback('💡 Primeiro clique num instrumento na bandeja para selecionar!', 'info');
      return;
    }
    highlightSlot(SELECTED_INSTRUMENT_ID);
    setFeedback('💡 Slot correto destacado na mesa!', 'info');
  });

  document.getElementById('btn-flashcards').addEventListener('click', openFlashCards);

  document.getElementById('btn-victory-restart').addEventListener('click', restartGame);

  document.getElementById('btn-close-answer').addEventListener('click', () => {
    SHOW_ANSWER = false;
    document.body.classList.remove('show-answer');
    DOM.answerOverlay().classList.add('hidden');
  });

  document.getElementById('btn-close-detail').addEventListener('click', () => {
    hideDetail();
    SELECTED_INSTRUMENT_ID = null;
    document.querySelectorAll('.tray-instrument.selected').forEach(c => c.classList.remove('selected'));
    clearHintHighlights();
  });

  // Flash Cards
  document.getElementById('btn-close-fc').addEventListener('click', closeFlashCards);
  document.getElementById('btn-fc-flip').addEventListener('click', flipFlashCard);
  document.getElementById('fc-card').addEventListener('click', flipFlashCard);

  document.getElementById('btn-fc-prev').addEventListener('click', () => {
    fcIndex = (fcIndex - 1 + FC_INSTRUMENTS.length) % FC_INSTRUMENTS.length;
    renderFlashCard();
  });

  document.getElementById('btn-fc-next').addEventListener('click', () => {
    fcIndex = (fcIndex + 1) % FC_INSTRUMENTS.length;
    renderFlashCard();
  });

  // Teclas de atalho nos flash cards
  document.addEventListener('keydown', e => {
    if (DOM.flashcardOverlay().classList.contains('hidden')) return;
    if (e.key === 'ArrowRight' || e.key === ' ') { fcIndex = (fcIndex + 1) % FC_INSTRUMENTS.length; renderFlashCard(); e.preventDefault(); }
    if (e.key === 'ArrowLeft')                   { fcIndex = (fcIndex - 1 + FC_INSTRUMENTS.length) % FC_INSTRUMENTS.length; renderFlashCard(); e.preventDefault(); }
    if (e.key === 'Enter' || e.key === 'f')       { flipFlashCard(); e.preventDefault(); }
    if (e.key === 'Escape')                        { closeFlashCards(); }
  });
}

/* ── START ── */
document.addEventListener('DOMContentLoaded', () => {
  bindButtons();
  initGame();
});

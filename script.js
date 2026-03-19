/**
 * ═══════════════════════════════════════════════════════════════════
 *  MONTAGEM DA MESA CIRÚRGICA — script.js
 *  Jogo educacional de memorização de instrumentos cirúrgicos.
 *  Drag & Drop puro (sem libs), modos Estudo/Prova, orientação cirurgião.
 * ═══════════════════════════════════════════════════════════════════
 */

'use strict';

/* ══════════════════════════════════════════════════════
   1. CONFIGURAÇÃO GLOBAL
══════════════════════════════════════════════════════ */

/**
 * Modo inicial: "study" = Modo Estudo | "exam" = Modo Prova
 * Editável aqui ou pelo botão da interface.
 */
let GAME_MODE = 'study';

/**
 * Lado do cirurgião: "left" = Esquerdo (padrão, conforme imagem ref.)
 *                    "right" = Direito (espelhado)
 * Editável aqui ou pelo botão da interface.
 */
let SURGEON_SIDE = 'left';

/** Gabarito visível? */
let SHOW_ANSWER = false;

/* ══════════════════════════════════════════════════════
   2. DADOS DOS INSTRUMENTOS
   Edite aqui os textos, imagens e categorias de cada peça.
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
    id: 'backaus',
    asset: 'backaus.png',
    name: 'Pinça Backhaus',
    category: 'Especiais',
    description: 'Pinça com pontas perfurantes e trava.',
    functionText: 'Fixar campos cirúrgicos.',
    group: 'especiais',
    placed: false,
  },
  {
    id: 'allis',
    asset: 'allis.png',
    name: 'Pinça Allis',
    category: 'Especiais',
    description: 'Pinça com anéis, trava e ponta com dentes para preensão.',
    functionText: 'Apreender tecidos com firmeza.',
    group: 'especiais',
    placed: false,
  },
  {
    id: 'mixter',
    asset: 'mixter.png',
    name: 'Pinça Mixter',
    category: 'Especiais',
    description: 'Pinça longa com ponta curva acentuada.',
    functionText: 'Dissecção e passagem ao redor de estruturas.',
    group: 'especiais',
    placed: false,
  },
  {
    id: 'portaagulhavidea',
    asset: 'portaagulhavidea.png',
    name: 'Porta-agulha Videa',
    category: 'Síntese',
    description: 'Instrumento com anéis e trava para segurar agulha.',
    functionText: 'Realizar suturas.',
    group: 'sintese',
    placed: false,
  },
  {
    id: 'pincadentederato',
    asset: 'pincadentederato.png',
    name: 'Pinça dente de rato',
    category: 'Síntese',
    description: 'Pinça com dentes na ponta.',
    functionText: 'Apreensão firme de tecidos.',
    group: 'sintese',
    placed: false,
  },
  {
    id: 'pincaanatomica',
    asset: 'pincaanatomica.png',
    name: 'Pinça anatômica',
    category: 'Síntese',
    description: 'Pinça delicada sem dente.',
    functionText: 'Manipular tecidos delicados.',
    group: 'sintese',
    placed: false,
  },
  {
    id: 'farabeuf',
    asset: 'farabeuf.png',
    name: 'Afastador Farabeuf',
    category: 'Especiais',
    description: 'Afastador manual metálico.',
    functionText: 'Afastar tecidos e ampliar a exposição do campo.',
    group: 'especiais',
    placed: false,
  },
  {
    id: 'kocher',
    asset: 'kocher.png',
    name: 'Pinça Kocher',
    category: 'Hemostasia',
    description: 'Pinça com trava e dente na ponta.',
    functionText: 'Apreensão firme de tecidos resistentes.',
    group: 'hemostasia',
    placed: false,
  },
  {
    id: 'kellyreta',
    asset: 'kellyreta.png',
    name: 'Pinça Kelly reta',
    category: 'Hemostasia',
    description: 'Pinça hemostática reta com trava.',
    functionText: 'Hemostasia e pinçamento.',
    group: 'hemostasia',
    placed: false,
  },
  {
    id: 'kellycurva',
    asset: 'kellycurva.png',
    name: 'Pinça Kelly curva',
    category: 'Hemostasia',
    description: 'Pinça hemostática com ponta curva.',
    functionText: 'Hemostasia e pinçamento.',
    group: 'hemostasia',
    placed: false,
  },
  {
    id: 'kellymosquito',
    asset: 'kellymosquito.png',
    name: 'Pinça Kelly mosquito',
    category: 'Hemostasia',
    description: 'Hemostática menor e delicada.',
    functionText: 'Hemostasia de vasos pequenos.',
    group: 'hemostasia',
    placed: false,
  },
  {
    id: 'metzenbaumreta',
    asset: 'metzenbaum reta.png',
    name: 'Tesoura Metzenbaum reta',
    category: 'Diérese',
    description: 'Tesoura delicada de ponta reta.',
    functionText: 'Corte e dissecção delicada.',
    group: 'dierese',
    placed: false,
  },
  {
    id: 'mayo',
    asset: 'mayo.png',
    name: 'Tesoura Mayo',
    category: 'Diérese',
    description: 'Tesoura mais robusta.',
    functionText: 'Corte de tecidos mais espessos e materiais.',
    group: 'dierese',
    placed: false,
  },
  {
    id: 'metzenbaumcurva',
    asset: 'metzenbaum curva.png',
    name: 'Tesoura Metzenbaum curva',
    category: 'Diérese',
    description: 'Tesoura delicada de ponta curva.',
    functionText: 'Dissecção e corte de tecidos delicados.',
    group: 'dierese',
    placed: false,
  },
  {
    id: 'bisturi',
    asset: 'bisturi.png',
    name: 'Cabo de bisturi',
    category: 'Diérese',
    description: 'Cabo reto metálico onde se encaixa a lâmina.',
    functionText: 'Realizar incisões e cortes.',
    group: 'dierese',
    placed: false,
  },
];

/* ══════════════════════════════════════════════════════
   3. LAYOUT DOS SLOTS (coordenadas em % relativo à mesa)
   ─────────────────────────────────────────────────────
   Coordenadas baseadas na imagem de referência (lado ESQUERDO).
   slotX, slotY: posição em % (left, top) do centro do slot.
   slotW, slotH: largura e altura em % da mesa.
   rotation: rotação em graus (0 = vertical, 90 = horizontal).

   DICA: Use o Modo Estudo + Gabarito para ajustar visualmente.
   Altere LEFT_LAYOUT_SLOTS (e/ou RIGHT_LAYOUT_SLOTS) conforme necessário.
══════════════════════════════════════════════════════ */

/**
 * Posições para montagem no LADO ESQUERDO do cirurgião.
 * Corresponde à imagem de referência fornecida.
 * Cada objeto: { id, slotX, slotY, slotW, slotH, rotation, order }
 * slotX/slotY em % (0–100), slotW/slotH em % da dimensão da mesa.
 */
const LEFT_LAYOUT_SLOTS = [
  // ── LINHA SUPERIOR ESQUERDA ─────────────────────────────────────────
  // Backhaus — menor, canto esquerdo meso
  { id: 'backaus',          slotX:  6, slotY: 38, slotW:  7, slotH: 18, rotation: -12, order: 1  },
  // Baby Kocher — pinça média, ligeiramente inclinada
  { id: 'babykocher',       slotX: 16, slotY: 16, slotW:  8, slotH: 28, rotation: -10, order: 2  },
  // Allis — pinça média
  { id: 'allis',            slotX: 28, slotY: 26, slotW:  8, slotH: 28, rotation:  -8, order: 3  },

  // ── CENTRO ──────────────────────────────────────────────────────────
  // Farabeuf — horizontal, centro da mesa
  { id: 'farabeuf',         slotX: 32, slotY: 50, slotW: 16, slotH:  9, rotation:   0, order: 4  },

  // ── LINHA SUPERIOR DIREITA ──────────────────────────────────────────
  // Mixter — pinça longa, centro-direita
  { id: 'mixter',           slotX: 48, slotY: 22, slotW:  8, slotH: 32, rotation:  -4, order: 5  },
  // Porta-agulha Videa — direita, vertical
  { id: 'portaagulhavidea', slotX: 60, slotY: 12, slotW:  8, slotH: 30, rotation:   0, order: 6  },
  // Pinça dente de rato — fina, vertical
  { id: 'pincadentederato', slotX: 73, slotY: 10, slotW:  5, slotH: 30, rotation:   0, order: 7  },
  // Pinça anatômica — muito fina, extrema direita
  { id: 'pincaanatomica',   slotX: 83, slotY: 14, slotW:  5, slotH: 30, rotation:   0, order: 8  },

  // ── LINHA INFERIOR ──────────────────────────────────────────────────
  // Kocher — clamp robusto, esquerda inferior
  { id: 'kocher',           slotX: 10, slotY: 65, slotW:  8, slotH: 30, rotation:  -8, order: 9  },
  // Kelly reta
  { id: 'kellyreta',        slotX: 22, slotY: 66, slotW:  8, slotH: 28, rotation:  -6, order: 10 },
  // Kelly curva
  { id: 'kellycurva',       slotX: 34, slotY: 65, slotW:  8, slotH: 28, rotation:  -4, order: 11 },
  // Kelly mosquito — menor
  { id: 'kellymosquito',    slotX: 46, slotY: 64, slotW:  7, slotH: 26, rotation:  -2, order: 12 },
  // Tesoura Metzenbaum reta — longa e fina
  { id: 'metzenbaumreta',   slotX: 58, slotY: 58, slotW:  6, slotH: 34, rotation:   0, order: 13 },
  // Tesoura Mayo — robusta
  { id: 'mayo',             slotX: 68, slotY: 60, slotW:  8, slotH: 32, rotation:   0, order: 14 },
  // Tesoura Metzenbaum curva
  { id: 'metzenbaumcurva',  slotX: 78, slotY: 58, slotW:  6, slotH: 32, rotation:   2, order: 15 },
  // Cabo de bisturi — muito fino
  { id: 'bisturi',          slotX: 89, slotY: 64, slotW:  4, slotH: 26, rotation:   0, order: 16 },
];

/**
 * Posições para montagem no LADO DIREITO do cirurgião.
 * Gerado automaticamente por espelhamento horizontal dos slots esquerdo.
 * Para personalizar manualmente, substitua com um array próprio.
 */
const RIGHT_LAYOUT_SLOTS = LEFT_LAYOUT_SLOTS.map(slot => ({
  ...slot,
  slotX: 100 - slot.slotX - slot.slotW, // espelha horizontalmente
  rotation: -slot.rotation,             // inverte rotação
}));

/* ══════════════════════════════════════════════════════
   4. ESTADO DO JOGO
══════════════════════════════════════════════════════ */

const state = {
  score: 0,
  total: INSTRUMENTS.length,
  // Cópia mutável dos instrumentos (placed reset ao reiniciar)
  instruments: [],
  // Slot ativo que está sobre o elemento arrastado
  activeSlotId: null,
  // ID do instrumento sendo arrastado
  draggingId: null,
  // Offset para o ghost (clone visual)
  ghostOffsetX: 0,
  ghostOffsetY: 0,
};

/* ══════════════════════════════════════════════════════
   5. REFS DOS ELEMENTOS DOM
══════════════════════════════════════════════════════ */

const DOM = {
  table:          () => document.getElementById('surgical-table'),
  tray:           () => document.getElementById('instrument-tray'),
  scoreCount:     () => document.getElementById('score-count'),
  scoreTotal:     () => document.getElementById('score-total'),
  modeBadge:      () => document.getElementById('mode-badge'),
  sideBadge:      () => document.getElementById('side-badge'),
  feedbackMsg:    () => document.getElementById('feedback-msg'),
  victoryOverlay: () => document.getElementById('victory-overlay'),
  victorySideInfo:() => document.getElementById('victory-side-info'),
  answerOverlay:  () => document.getElementById('answer-overlay'),
  answerGrid:     () => document.getElementById('answer-grid'),
  answerSideLabel:() => document.getElementById('answer-side-label'),
  detailPlaceholder: () => document.getElementById('detail-placeholder'),
  detailContent:  () => document.getElementById('detail-content'),
  detailImg:      () => document.getElementById('detail-img'),
  detailName:     () => document.getElementById('detail-name'),
  detailCategory: () => document.getElementById('detail-category'),
  detailDesc:     () => document.getElementById('detail-description'),
  detailFunc:     () => document.getElementById('detail-function'),
};

/* ══════════════════════════════════════════════════════
   6. DRAG & DROP — GHOST VISUAL
══════════════════════════════════════════════════════ */

let dragGhost = null;

function createDragGhost(asset) {
  if (dragGhost) dragGhost.remove();
  dragGhost = document.createElement('div');
  dragGhost.id = 'drag-ghost';
  const img = document.createElement('img');
  img.src = asset;
  img.alt = '';
  dragGhost.appendChild(img);
  document.body.appendChild(dragGhost);
}

function moveDragGhost(clientX, clientY) {
  if (!dragGhost) return;
  dragGhost.style.left = (clientX - state.ghostOffsetX) + 'px';
  dragGhost.style.top  = (clientY - state.ghostOffsetY) + 'px';
}

function removeDragGhost() {
  if (dragGhost) { dragGhost.remove(); dragGhost = null; }
}

/* ══════════════════════════════════════════════════════
   7. CONSTRUÇÃO DO DOM DA MESA (SLOTS)
══════════════════════════════════════════════════════ */

function getLayoutSlots() {
  return SURGEON_SIDE === 'left' ? LEFT_LAYOUT_SLOTS : RIGHT_LAYOUT_SLOTS;
}

function getInstrumentById(id) {
  return state.instruments.find(ins => ins.id === id);
}

function getSlotById(id) {
  return getLayoutSlots().find(s => s.id === id);
}

/**
 * Constrói os slots (alvos) na mesa com base no layout atual.
 */
function buildTableSlots() {
  const table = DOM.table();
  // Remove slots anteriores (mantém instrumentos colocados)
  table.querySelectorAll('.slot').forEach(el => el.remove());

  const slots = getLayoutSlots();
  slots.forEach(slot => {
    const ins = getInstrumentById(slot.id);
    const div = document.createElement('div');
    div.classList.add('slot');
    div.dataset.slotId = slot.id;
    div.style.left     = slot.slotX + '%';
    div.style.top      = slot.slotY + '%';
    div.style.width    = slot.slotW + '%';
    div.style.height   = slot.slotH + '%';
    div.style.transform = `rotate(${slot.rotation}deg)`;

    // Número de ordem
    const order = document.createElement('div');
    order.classList.add('slot-order');
    order.textContent = slot.order;
    div.appendChild(order);

    // Label do slot (nome do instrumento)
    const label = document.createElement('div');
    label.classList.add('slot-label');
    label.textContent = ins ? ins.name : slot.id;
    div.appendChild(label);

    // Se já colocado, marcar slot como preenchido
    if (ins && ins.placed) {
      div.classList.add('slot-filled');
    }

    // Eventos de drop nos slots
    div.addEventListener('dragover', onSlotDragOver);
    div.addEventListener('dragleave', onSlotDragLeave);
    div.addEventListener('drop', onSlotDrop);

    // Suporte touch: pointer events
    div.addEventListener('pointerover', onSlotPointerOver);
    div.addEventListener('pointerout', onSlotPointerOut);

    table.appendChild(div);
  });
}

/* ══════════════════════════════════════════════════════
   8. CONSTRUÇÃO DO DOM DA BANDEJA
══════════════════════════════════════════════════════ */

function buildTray() {
  const tray = DOM.tray();
  tray.innerHTML = '';

  // Embaralhar instrumentos (Fisher-Yates)
  const shuffled = [...state.instruments].sort(() => Math.random() - 0.5);

  shuffled.forEach(ins => {
    const card = document.createElement('div');
    card.classList.add('tray-instrument');
    card.dataset.instrumentId = ins.id;
    if (ins.placed) card.classList.add('placed');

    // Imagem
    const img = document.createElement('img');
    img.src = ins.asset;
    img.alt = ins.name;
    card.appendChild(img);

    // Nome
    const name = document.createElement('span');
    name.classList.add('tray-instrument-name');
    name.textContent = ins.name;
    card.appendChild(name);

    // Drag events
    card.setAttribute('draggable', 'true');
    card.addEventListener('dragstart', onTrayDragStart);
    card.addEventListener('dragend', onTrayDragEnd);

    // Pointer/touch events para suporte a dispositivos touch
    card.addEventListener('pointerdown', onTrayPointerDown);

    // Clique para detalhes
    card.addEventListener('click', (e) => {
      if (state.draggingId) return; // evita abrir durante drag
      showDetail(ins.id);
    });

    tray.appendChild(card);
  });
}

/* ══════════════════════════════════════════════════════
   9. INSTRUMENTOS SOBRE A MESA (colocados corretamente)
══════════════════════════════════════════════════════ */

function renderPlacedInstruments() {
  const table = DOM.table();
  // Remove instrumentos colocados anteriores
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
    img.src = ins.asset;
    img.alt = ins.name;
    el.appendChild(img);

    // Clique para detalhes
    el.addEventListener('click', () => showDetail(ins.id));

    table.appendChild(el);
  });
}

/* ══════════════════════════════════════════════════════
   10. DRAG & DROP — EVENTOS (HTML5 API)
══════════════════════════════════════════════════════ */

function onTrayDragStart(e) {
  const card = e.currentTarget;
  const id = card.dataset.instrumentId;
  const ins = getInstrumentById(id);
  if (!ins || ins.placed) { e.preventDefault(); return; }

  state.draggingId = id;
  card.classList.add('dragging');

  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', id);

  // Ghost transparente para o evento nativo (usamos nosso próprio)
  const blankImg = new Image();
  blankImg.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  e.dataTransfer.setDragImage(blankImg, 0, 0);

  // Calcular offsets para o ghost
  const rect = card.getBoundingClientRect();
  state.ghostOffsetX = e.clientX - rect.left + rect.width / 2;
  state.ghostOffsetY = e.clientY - rect.top  + rect.height / 2;

  createDragGhost(ins.asset);
  moveDragGhost(e.clientX, e.clientY);
}

function onTrayDragEnd(e) {
  const card = e.currentTarget;
  card.classList.remove('dragging');
  state.draggingId = null;
  removeDragGhost();
  clearAllSlotHighlights();
}

function onSlotDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  const slot = e.currentTarget;
  slot.classList.add('drag-over');
  state.activeSlotId = slot.dataset.slotId;
}

function onSlotDragLeave(e) {
  const slot = e.currentTarget;
  slot.classList.remove('drag-over');
  if (state.activeSlotId === slot.dataset.slotId) state.activeSlotId = null;
}

async function onSlotDrop(e) {
  e.preventDefault();
  const slot      = e.currentTarget;
  const slotId    = slot.dataset.slotId;
  const instrId   = e.dataTransfer.getData('text/plain') || state.draggingId;

  slot.classList.remove('drag-over');
  clearAllSlotHighlights();
  removeDragGhost();

  if (!instrId) return;

  handleDrop(instrId, slotId);
}

/* ══════════════════════════════════════════════════════
   11. DRAG & DROP — POINTER EVENTS (touch + mouse)
   Implementação secundária para suporte total em touch.
══════════════════════════════════════════════════════ */

let pointerDragging = false;
let pointerInstrId  = null;

function onTrayPointerDown(e) {
  // Só ativa se o instrumento não foi colocado
  const id  = e.currentTarget.dataset.instrumentId;
  const ins = getInstrumentById(id);
  if (!ins || ins.placed) return;
  if (e.pointerType === 'mouse') return; // mouse usa HTML5 DnD

  e.preventDefault();
  pointerDragging = true;
  pointerInstrId  = id;
  state.draggingId = id;

  const rect = e.currentTarget.getBoundingClientRect();
  state.ghostOffsetX = e.clientX - rect.left + rect.width / 2;
  state.ghostOffsetY = e.clientY - rect.top  + rect.height / 2;
  createDragGhost(ins.asset);
  moveDragGhost(e.clientX, e.clientY);

  e.currentTarget.setPointerCapture(e.pointerId);
  e.currentTarget.addEventListener('pointermove',  onPointerMove);
  e.currentTarget.addEventListener('pointerup',    onPointerUp);
  e.currentTarget.addEventListener('pointercancel',onPointerCancel);
}

function onPointerMove(e) {
  if (!pointerDragging) return;
  moveDragGhost(e.clientX, e.clientY);

  // Highlight do slot sob o cursor
  clearAllSlotHighlights();
  const el = document.elementFromPoint(e.clientX, e.clientY);
  const slotEl = el && el.closest('.slot');
  if (slotEl) {
    slotEl.classList.add('drag-over');
    state.activeSlotId = slotEl.dataset.slotId;
  } else {
    state.activeSlotId = null;
  }
}

function onPointerUp(e) {
  clearPointerDrag(e);
  if (pointerInstrId && state.activeSlotId) {
    handleDrop(pointerInstrId, state.activeSlotId);
  } else if (pointerInstrId) {
    setFeedback('Solte sobre um slot da mesa!', 'idle');
  }
  clearAllSlotHighlights();
}

function onPointerCancel(e) {
  clearPointerDrag(e);
}

function clearPointerDrag(e) {
  pointerDragging = false;
  const id = pointerInstrId;
  pointerInstrId  = null;
  state.draggingId = null;
  removeDragGhost();
  if (e && e.currentTarget) {
    e.currentTarget.removeEventListener('pointermove',  onPointerMove);
    e.currentTarget.removeEventListener('pointerup',    onPointerUp);
    e.currentTarget.removeEventListener('pointercancel',onPointerCancel);
  }
}

function onSlotPointerOver(e) {
  if (!pointerDragging) return;
  const slot = e.currentTarget;
  slot.classList.add('drag-over');
  state.activeSlotId = slot.dataset.slotId;
}

function onSlotPointerOut(e) {
  if (!pointerDragging) return;
  const slot = e.currentTarget;
  slot.classList.remove('drag-over');
}

function clearAllSlotHighlights() {
  document.querySelectorAll('.slot.drag-over').forEach(s => s.classList.remove('drag-over'));
  state.activeSlotId = null;
}

/* ══════════════════════════════════════════════════════
   12. LÓGICA DE ACERTO / ERRO
══════════════════════════════════════════════════════ */

/**
 * Verifica se instrId corresponde ao slot slotId.
 * Retorna true se correto, false se errado.
 */
function handleDrop(instrId, slotId) {
  const ins = getInstrumentById(instrId);
  if (!ins) return;
  if (ins.placed) return; // já colocado

  // Verificar se o slot já está ocupado
  const alreadyPlaced = state.instruments.find(i => i.placed && i.id === slotId);
  if (alreadyPlaced) {
    setFeedback(`Slot já ocupado por "${alreadyPlaced.name}".`, 'error');
    animateTrayCard(instrId, 'anim-error');
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

    // Marcar slot como preenchido
    const slotEl = document.querySelector(`.slot[data-slot-id="${slotId}"]`);
    if (slotEl) slotEl.classList.add('slot-filled');

    // Renderizar instrumento sobre a mesa
    renderPlacedInstruments();

    // Verificar vitória
    if (state.score >= state.total) {
      setTimeout(showVictory, 800);
    }

  } else {
    // ── ERRO ──
    setFeedback(`❌ Posição incorreta para "${ins.name}".`, 'error');
    animateTrayCard(instrId, 'anim-error');
  }
}

/** Atualiza o contador de pontuação */
function updateScore() {
  DOM.scoreCount().textContent = state.score;
  DOM.scoreTotal().textContent = state.total;
}

/** Marca o card da bandeja como colocado (opaco) */
function markTrayCardPlaced(instrId) {
  const card = document.querySelector(`.tray-instrument[data-instrument-id="${instrId}"]`);
  if (card) card.classList.add('placed');
}

/** Anima o card na bandeja com classe de sucesso ou erro */
function animateTrayCard(instrId, animClass) {
  const card = document.querySelector(`.tray-instrument[data-instrument-id="${instrId}"]`);
  if (!card) return;
  card.classList.add(animClass);
  card.addEventListener('animationend', () => card.classList.remove(animClass), { once: true });
}

/* ══════════════════════════════════════════════════════
   13. FEEDBACK VISUAL DE MENSAGENS
══════════════════════════════════════════════════════ */

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
    }, 3000);
  }
}

/* ══════════════════════════════════════════════════════
   14. PAINEL DE DETALHES DO INSTRUMENTO
══════════════════════════════════════════════════════ */

function showDetail(instrId) {
  const ins = getInstrumentById(instrId);
  if (!ins) return;

  DOM.detailPlaceholder().classList.add('hidden');
  DOM.detailContent().classList.remove('hidden');

  DOM.detailImg().src = ins.asset;
  DOM.detailImg().alt = ins.name;
  DOM.detailName().textContent = ins.name;
  DOM.detailCategory().textContent = ins.category;
  DOM.detailDesc().textContent = ins.description;
  DOM.detailFunc().textContent = ins.functionText;
}

function hideDetail() {
  DOM.detailPlaceholder().classList.remove('hidden');
  DOM.detailContent().classList.add('hidden');
}

/* ══════════════════════════════════════════════════════
   15. MODAL DE VITÓRIA
══════════════════════════════════════════════════════ */

function showVictory() {
  const sideLabel = SURGEON_SIDE === 'left' ? 'Esquerdo' : 'Direito';
  DOM.victorySideInfo().textContent = `Mesa montada para o lado ${sideLabel} do cirurgião.`;
  DOM.victoryOverlay().classList.remove('hidden');
}

function hideVictory() {
  DOM.victoryOverlay().classList.add('hidden');
}

/* ══════════════════════════════════════════════════════
   16. GABARITO
══════════════════════════════════════════════════════ */

function buildAnswerGrid() {
  const grid = DOM.answerGrid();
  grid.innerHTML = '';
  const slots = getLayoutSlots();

  slots.forEach(slot => {
    const ins = getInstrumentById(slot.id);
    if (!ins) return;

    const card = document.createElement('div');
    card.classList.add('answer-card');
    if (ins.placed) card.classList.add('answer-placed');

    const num = document.createElement('div');
    num.classList.add('answer-num');
    num.textContent = `#${slot.order} — ${ins.category}`;

    const img = document.createElement('img');
    img.src = ins.asset;
    img.alt = ins.name;

    const name = document.createElement('div');
    name.classList.add('answer-name');
    name.textContent = ins.name;

    const group = document.createElement('div');
    group.classList.add('answer-group');
    group.textContent = ins.group;

    card.appendChild(num);
    card.appendChild(img);
    card.appendChild(name);
    card.appendChild(group);
    grid.appendChild(card);
  });
}

function toggleAnswerOverlay() {
  const overlay = DOM.answerOverlay();
  if (overlay.classList.contains('hidden')) {
    buildAnswerGrid();
    const sideLabel = SURGEON_SIDE === 'left' ? 'Esquerdo' : 'Direito';
    DOM.answerSideLabel().textContent = `Lado do cirurgião: ${sideLabel}`;
    overlay.classList.remove('hidden');
  } else {
    overlay.classList.add('hidden');
  }
}

/* ══════════════════════════════════════════════════════
   17. MODOS DE JOGO
══════════════════════════════════════════════════════ */

function applyGameMode() {
  document.body.classList.remove('mode-study', 'mode-exam');
  document.body.classList.add(GAME_MODE === 'study' ? 'mode-study' : 'mode-exam');

  const badge = DOM.modeBadge();
  const btn   = document.getElementById('btn-toggle-mode');
  if (GAME_MODE === 'study') {
    badge.textContent = '📚 Modo Estudo';
    badge.className = 'badge badge-study';
    btn.textContent = '🎓 Modo Prova';
  } else {
    badge.textContent = '🎓 Modo Prova';
    badge.className = 'badge badge-exam';
    btn.textContent = '📚 Modo Estudo';
  }
}

function toggleGameMode() {
  GAME_MODE = GAME_MODE === 'study' ? 'exam' : 'study';
  applyGameMode();
}

/* ══════════════════════════════════════════════════════
   18. LADO DO CIRURGIÃO
══════════════════════════════════════════════════════ */

function applySurgeonSide() {
  const sideLabel = SURGEON_SIDE === 'left' ? '⬅ Lado: Esquerdo' : 'Lado: Direito ➡';
  DOM.sideBadge().textContent = sideLabel;
}

function toggleSurgeonSide() {
  SURGEON_SIDE = SURGEON_SIDE === 'left' ? 'right' : 'left';
  applySurgeonSide();
  restartGame();
  setFeedback(`Lado trocado para: ${SURGEON_SIDE === 'left' ? 'Esquerdo' : 'Direito'}. Mesa reiniciada!`, 'info');
}

/* ══════════════════════════════════════════════════════
   19. REINICIAR JOGO
══════════════════════════════════════════════════════ */

function restartGame() {
  // Resetar estado interno
  state.score = 0;
  state.draggingId = null;
  state.activeSlotId = null;
  state.instruments = INSTRUMENTS.map(ins => ({ ...ins, placed: false }));

  // Esconder modais
  hideVictory();
  DOM.answerOverlay().classList.add('hidden');

  // Limpar gabarito visual
  SHOW_ANSWER = false;
  document.body.classList.remove('show-answer');

  // Remover instrumentos da mesa
  DOM.table().querySelectorAll('.instrument-placed').forEach(el => el.remove());

  // Reconstruir
  buildTableSlots();
  buildTray();
  updateScore();
  hideDetail();
  setFeedback('Jogo reiniciado! Arraste os instrumentos para a mesa.', 'idle');
}

/* ══════════════════════════════════════════════════════
   20. MOUSE MOVE GLOBAL (move o ghost durante drag HTML5)
══════════════════════════════════════════════════════ */

document.addEventListener('dragover', (e) => {
  e.preventDefault();
  moveDragGhost(e.clientX, e.clientY);
});

/* Garantir que o ghost some se o drag acabar fora de um slot */
document.addEventListener('dragend', () => {
  removeDragGhost();
  clearAllSlotHighlights();
});

/* ══════════════════════════════════════════════════════
   21. BOTÕES DA INTERFACE
══════════════════════════════════════════════════════ */

function bindButtons() {
  // Reiniciar
  document.getElementById('btn-restart').addEventListener('click', () => {
    restartGame();
  });

  // Alternar modo estudo/prova
  document.getElementById('btn-toggle-mode').addEventListener('click', () => {
    toggleGameMode();
  });

  // Trocar lado do cirurgião
  document.getElementById('btn-toggle-side').addEventListener('click', () => {
    toggleSurgeonSide();
  });

  // Mostrar gabarito
  document.getElementById('btn-show-answer').addEventListener('click', () => {
    toggleAnswerOverlay();
  });

  // Fechar gabarito
  document.getElementById('btn-close-answer').addEventListener('click', () => {
    DOM.answerOverlay().classList.add('hidden');
  });

  // Fechar vitória / reiniciar
  document.getElementById('btn-victory-restart').addEventListener('click', () => {
    hideVictory();
    restartGame();
  });

  // Fechar detalhe
  document.getElementById('btn-close-detail').addEventListener('click', () => {
    hideDetail();
  });

  // Fechar modais ao clicar fora
  DOM.victoryOverlay().addEventListener('click', (e) => {
    if (e.target === DOM.victoryOverlay()) hideVictory();
  });
  DOM.answerOverlay().addEventListener('click', (e) => {
    if (e.target === DOM.answerOverlay()) DOM.answerOverlay().classList.add('hidden');
  });
}

/* ══════════════════════════════════════════════════════
   22. INICIALIZAÇÃO
══════════════════════════════════════════════════════ */

function init() {
  // Clonar instrumentos no estado (sem mutar o array original)
  state.instruments = INSTRUMENTS.map(ins => ({ ...ins, placed: false }));
  state.total = INSTRUMENTS.length;

  applyGameMode();
  applySurgeonSide();
  buildTableSlots();
  buildTray();
  updateScore();
  bindButtons();

  setFeedback('Bem-vindo! Arraste os instrumentos para os slots da mesa.', 'idle');

  console.log('[MesaCirúrgica] Jogo iniciado. Modo:', GAME_MODE, '| Lado:', SURGEON_SIDE);
}

// Aguarda o DOM estar pronto
document.addEventListener('DOMContentLoaded', init);

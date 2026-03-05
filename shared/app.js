/* ================================================
   EFW Artifacts — Week 1 Application Logic
   Starting a Meeting
   Step Up Professional Language Services
   ================================================
   To reuse for Week 2–4: swap only the JSON file
   (or update EMBEDDED_DATA below).
   ================================================ */

'use strict';

/* ── Embedded JSON fallback ──────────────────────
   This is a copy of data.week-01.json.
   Used automatically when the file is pasted into
   WordPress without a local server (no fetch).
   ─────────────────────────────────────────────── */
const EMBEDDED_DATA = {
  "course": "English for Work – Professional Activation",
  "week": 1,
  "week_title": "Starting a Meeting",
  "functional_focus": "Starting and opening a professional meeting in English.",
  "outcome": "By the end of this week, learners can greet participants, start a meeting, and introduce the purpose using clear professional expressions.",
  "tabs": [
    {
      "id": "greeting",
      "title": "Greeting Participants",
      "micro_tip": "Keep it simple and professional. A clear greeting sets the tone.",
      "expressions": [
        {"id":"g1","en":"Good morning, everyone.","es":"Buenos días a todos."},
        {"id":"g2","en":"Good afternoon, everyone.","es":"Buenas tardes a todos."},
        {"id":"g3","en":"Hello everyone, thanks for joining.","es":"Hola a todos, gracias por unirse."},
        {"id":"g4","en":"Thank you all for being here today.","es":"Gracias a todos por estar aquí hoy."},
        {"id":"g5","en":"It's great to see everyone here.","es":"Es un gusto verlos a todos aquí."},
        {"id":"g6","en":"Thanks for taking the time to join this meeting.","es":"Gracias por tomarse el tiempo para unirse a esta reunión."}
      ]
    },
    {
      "id": "start",
      "title": "Starting the Meeting",
      "micro_tip": "Use a clear signal to begin. Short phrases work best.",
      "expressions": [
        {"id":"s1","en":"Let's get started.","es":"Empecemos."},
        {"id":"s2","en":"Shall we begin?","es":"¿Empezamos?"},
        {"id":"s3","en":"Let's begin the meeting.","es":"Comencemos la reunión."},
        {"id":"s4","en":"I think we can start now.","es":"Creo que podemos empezar ahora."},
        {"id":"s5","en":"Let's go ahead and start.","es":"Bueno, empecemos."},
        {"id":"s6","en":"Let's get the meeting started.","es":"Demos inicio a la reunión."}
      ]
    },
    {
      "id": "purpose",
      "title": "Introducing the Purpose",
      "micro_tip": "State one clear purpose. Keep it short and specific.",
      "expressions": [
        {"id":"p1","en":"The purpose of today's meeting is to discuss the new project.","es":"El propósito de la reunión de hoy es hablar del nuevo proyecto."},
        {"id":"p2","en":"Today we want to review the project progress.","es":"Hoy queremos revisar el progreso del proyecto."},
        {"id":"p3","en":"Today's meeting is about the new marketing strategy.","es":"La reunión de hoy es sobre la nueva estrategia de marketing."},
        {"id":"p4","en":"We are here today to talk about the next steps.","es":"Estamos aquí hoy para hablar de los próximos pasos."},
        {"id":"p5","en":"In this meeting, we will discuss the project timeline.","es":"En esta reunión, hablaremos del cronograma del proyecto."},
        {"id":"p6","en":"The goal of today's meeting is to share some updates.","es":"El objetivo de la reunión de hoy es compartir algunas actualizaciones."}
      ]
    }
  ],
  "stories": [
    {
      "id": "story1",
      "title": "Internal Team Meeting",
      "text": [
        "Maria enters the meeting room and looks at the team.",
        "She smiles and says, \u201cGood morning, everyone. Thanks for joining.\u201d",
        "After everyone sits down, she continues, \u201cAlright, let\u2019s get started.\u201d",
        "She opens her laptop and says, \u201cThe purpose of today\u2019s meeting is to review our project progress and discuss the next steps.\u201d",
        "The team members nod and prepare to share their updates."
      ]
    },
    {
      "id": "story2",
      "title": "Meeting with a Client",
      "text": [
        "David begins the meeting with the client.",
        "He says, \u201cGood afternoon, everyone. Thank you for being here today.\u201d",
        "He looks around the room and adds, \u201cShall we begin?\u201d",
        "Then he explains the objective of the meeting.",
        "\u201cToday we want to discuss the new marketing strategy and review the project timeline.\u201d",
        "The client listens carefully and opens their notebook to take notes."
      ]
    }
  ],
  "ui_copy": {
    "title": "Guided Meeting Opener Builder",
    "subtitle": "Build a professional meeting opener step by step using this week\u2019s expressions.",
    "step_labels": ["Choose a greeting", "Start the meeting", "Introduce the purpose"],
    "cta_build": "Build my meeting opener",
    "cta_swap": "Swap one line",
    "cta_reset": "Start over",
    "context_label": "See it in context",
    "output_label": "Your meeting opener"
  }
};

/* ── App State ───────────────────────────────── */
const state = {
  data: null,
  selections: {},   // { tabId: exprObject }
  activeSwapTab: null,
  activeStory: null
};

/* ── Bootstrap ───────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  loadData();
});

function loadData() {
  // Try to fetch the local JSON first (works when served as files)
  fetch('data.week-01.json')
    .then(res => {
      if (!res.ok) throw new Error('fetch failed');
      return res.json();
    })
    .then(data => init(data))
    .catch(() => {
      // Fallback: use embedded data (WordPress / static paste)
      init(EMBEDDED_DATA);
    });
}

/* ── Init & Render ───────────────────────────── */
function init(data) {
  state.data = data;
  state.selections = {};
  state.activeSwapTab = null;
  state.activeStory = data.stories[0]?.id || null;

  renderHeader(data);
  renderBuilderSection(data);
  hideOutputSection();
}

function renderHeader(data) {
  setTextById('course-label', data.course);
  setTextById('week-badge', 'Week ' + data.week);
  setTextById('week-title', data.week_title);
  setTextById('week-outcome', data.outcome);
  setTextById('ui-title', data.ui_copy.title);
  setTextById('ui-subtitle', data.ui_copy.subtitle);
  setTextById('output-label-title', data.ui_copy.output_label);
  setTextById('context-label', data.ui_copy.context_label);
}

function renderBuilderSection(data) {
  const container = document.getElementById('steps-container');
  if (!container) return;

  container.innerHTML = data.tabs.map((tab, index) => {
    const stepLabel = data.ui_copy.step_labels[index] || tab.title;
    return `
      <div class="step-card" id="step-card-${tab.id}" role="group" aria-labelledby="step-title-${tab.id}">
        ${index > 0 ? '<div class="step-divider"></div>' : ''}
        <div class="step-header">
          <div class="step-number" aria-hidden="true">
            <span class="step-number-digit">${index + 1}</span>
          </div>
          <div class="step-info">
            <div class="step-label-small">Step ${index + 1}</div>
            <h3 class="step-title" id="step-title-${tab.id}">${escapeHtml(tab.title)}</h3>
          </div>
        </div>
        <div class="micro-tip" role="note">
          <span class="micro-tip-icon" aria-hidden="true">💡</span>
          <span class="micro-tip-text">${escapeHtml(tab.micro_tip)}</span>
        </div>
        <div class="expression-grid" role="group" aria-label="Expressions for ${escapeHtml(tab.title)}">
          ${tab.expressions.map(expr => renderExpressionBtn(tab.id, expr)).join('')}
        </div>
      </div>
    `;
  }).join('');

  // Wire up expression buttons
  container.querySelectorAll('.expression-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tabId;
      const exprId = btn.dataset.exprId;
      handleSelect(tabId, exprId);
    });
    btn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });

  // Wire up build button
  const btnBuild = document.getElementById('btn-build');
  if (btnBuild) {
    setTextById('btn-build-label', data.ui_copy.cta_build);
    btnBuild.addEventListener('click', handleBuild);
  }

  // Wire up reset button
  const btnReset = document.getElementById('btn-reset');
  if (btnReset) {
    setTextById('btn-reset', '↺ ' + data.ui_copy.cta_reset);
    btnReset.addEventListener('click', handleReset);
  }
}

function renderExpressionBtn(tabId, expr) {
  return `
    <button
      class="expression-btn"
      data-tab-id="${escapeHtml(tabId)}"
      data-expr-id="${escapeHtml(expr.id)}"
      aria-pressed="false"
      aria-label="${escapeHtml(expr.en)}"
    >
      <span class="expr-en">${escapeHtml(expr.en)}</span>
      <span class="expr-es">${escapeHtml(expr.es)}</span>
    </button>
  `;
}

/* ── Selection Logic ─────────────────────────── */
function handleSelect(tabId, exprId) {
  const tab = state.data.tabs.find(t => t.id === tabId);
  if (!tab) return;
  const expr = tab.expressions.find(e => e.id === exprId);
  if (!expr) return;

  // If same expression is clicked again, deselect
  const current = state.selections[tabId];
  if (current && current.id === exprId) {
    delete state.selections[tabId];
  } else {
    state.selections[tabId] = expr;
  }

  updateExpressionButtons(tabId);
  updateStepCompletedState(tabId);
  checkAllSelected();

  // If output is visible, update it live
  if (!document.getElementById('output-section').classList.contains('hidden')) {
    if (isAllSelected()) {
      renderOpenerScript();
      updateSwapOptions();
      renderStoryPanel(state.activeStory);
    } else {
      // Some selections cleared — hide output
      hideOutputSection();
    }
  }
}

function updateExpressionButtons(tabId) {
  const sel = state.selections[tabId];
  document.querySelectorAll(`.expression-btn[data-tab-id="${tabId}"]`).forEach(btn => {
    const isSelected = sel && btn.dataset.exprId === sel.id;
    btn.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
  });
}

function updateStepCompletedState(tabId) {
  const card = document.getElementById('step-card-' + tabId);
  if (!card) return;
  if (state.selections[tabId]) {
    card.classList.add('completed');
  } else {
    card.classList.remove('completed');
  }
}

function isAllSelected() {
  return state.data.tabs.every(tab => !!state.selections[tab.id]);
}

function checkAllSelected() {
  const btnBuild = document.getElementById('btn-build');
  const hint = document.getElementById('build-hint');
  if (!btnBuild) return;

  const allDone = isAllSelected();
  btnBuild.disabled = !allDone;

  if (allDone) {
    if (hint) hint.textContent = 'All steps complete — click to build your opener!';
    announce('All expressions selected. Ready to build your meeting opener.');
  } else {
    const remaining = state.data.tabs.filter(t => !state.selections[t.id]);
    const names = remaining.map(t => t.title).join(', ');
    if (hint) hint.textContent = `Still needed: ${names}.`;
  }
}

/* ── Build the Opener ────────────────────────── */
function handleBuild() {
  if (!isAllSelected()) return;

  const outputSection = document.getElementById('output-section');
  outputSection.classList.remove('hidden');

  renderOpenerScript();
  renderWhyItWorks();
  renderSwapSection();
  renderContextSection();

  outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  announce('Your meeting opener has been built. Scroll down to see it.');
}

function renderOpenerScript() {
  const container = document.getElementById('opener-script');
  if (!container) return;

  const icons = ['👋', '▶', '🎯'];
  const functions = ['Greeting', 'Starting', 'Purpose'];

  container.innerHTML = state.data.tabs.map((tab, i) => {
    const sel = state.selections[tab.id];
    if (!sel) return '';
    return `
      <div class="opener-line">
        <div class="line-icon" aria-hidden="true">${icons[i]}</div>
        <div class="line-body">
          <div class="line-function">${escapeHtml(functions[i])}</div>
          <div class="line-text">${escapeHtml(sel.en)}</div>
          <div class="line-translation">${escapeHtml(sel.es)}</div>
        </div>
        <button
          class="btn-audio"
          aria-label="Audio coming soon for: ${escapeHtml(sel.en)}"
          data-tooltip="Audio coming soon"
          tabindex="0"
        >🔊</button>
      </div>
    `;
  }).join('');
}

function renderWhyItWorks() {
  const container = document.getElementById('why-it-works');
  if (!container) return;

  const tipData = state.data.tabs.map(tab => ({
    label: tab.title,
    tip: tab.micro_tip
  }));

  container.innerHTML = `
    <span class="tip-icon" aria-hidden="true">💡</span>
    <div class="tip-body">
      <div class="tip-heading">Why it works</div>
      <div class="tip-items">
        ${tipData.map(t => `
          <div class="tip-item">
            <span class="tip-item-dot" aria-hidden="true">▸</span>
            <span><strong>${escapeHtml(t.label)}:</strong> ${escapeHtml(t.tip)}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/* ── Swap Section ────────────────────────────── */
function renderSwapSection() {
  const tabsContainer = document.getElementById('swap-tabs');
  const optionsContainer = document.getElementById('swap-options');
  if (!tabsContainer || !optionsContainer) return;

  // Default to first tab
  if (!state.activeSwapTab) {
    state.activeSwapTab = state.data.tabs[0].id;
  }

  tabsContainer.innerHTML = state.data.tabs.map(tab => `
    <button
      class="btn-tab ${tab.id === state.activeSwapTab ? 'active' : ''}"
      data-swap-tab="${escapeHtml(tab.id)}"
      aria-pressed="${tab.id === state.activeSwapTab}"
      aria-label="Swap ${escapeHtml(tab.title)}"
    >${escapeHtml(tab.title)}</button>
  `).join('');

  tabsContainer.querySelectorAll('.btn-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      state.activeSwapTab = btn.dataset.swapTab;
      renderSwapSection();
    });
  });

  updateSwapOptions();
}

function updateSwapOptions() {
  const container = document.getElementById('swap-options');
  if (!container || !state.activeSwapTab) return;

  const tab = state.data.tabs.find(t => t.id === state.activeSwapTab);
  if (!tab) return;

  const currentSel = state.selections[state.activeSwapTab];

  container.innerHTML = tab.expressions.map(expr => {
    const isCurrent = currentSel && currentSel.id === expr.id;
    return `
      <button
        class="swap-expr-btn ${isCurrent ? 'current' : ''}"
        data-swap-tab-id="${escapeHtml(tab.id)}"
        data-swap-expr-id="${escapeHtml(expr.id)}"
        ${isCurrent ? 'aria-current="true"' : ''}
        aria-label="${isCurrent ? 'Currently selected: ' : 'Switch to: '}${escapeHtml(expr.en)}"
      >
        <span class="swap-en">${escapeHtml(expr.en)}</span>
        <span class="swap-es">${escapeHtml(expr.es)}</span>
      </button>
    `;
  }).join('');

  container.querySelectorAll('.swap-expr-btn:not(.current)').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.swapTabId;
      const exprId = btn.dataset.swapExprId;
      handleSwapSelect(tabId, exprId);
    });
  });
}

function handleSwapSelect(tabId, exprId) {
  const tab = state.data.tabs.find(t => t.id === tabId);
  if (!tab) return;
  const expr = tab.expressions.find(e => e.id === exprId);
  if (!expr) return;

  state.selections[tabId] = expr;
  updateExpressionButtons(tabId);
  updateStepCompletedState(tabId);

  renderOpenerScript();
  updateSwapOptions();
  renderStoryPanel(state.activeStory);

  announce(`Swapped to: ${expr.en}`);
}

/* ── Context / Stories Section ───────────────── */
function renderContextSection() {
  const storyTabsContainer = document.getElementById('story-tabs');
  const storyContent = document.getElementById('story-content');
  if (!storyTabsContainer || !storyContent) return;

  if (!state.activeStory) {
    state.activeStory = state.data.stories[0]?.id || null;
  }

  // Render story tab buttons
  storyTabsContainer.innerHTML = state.data.stories.map(story => `
    <button
      class="btn-story-tab"
      role="tab"
      data-story-id="${escapeHtml(story.id)}"
      aria-selected="${story.id === state.activeStory}"
      aria-controls="story-panel-${escapeHtml(story.id)}"
      id="story-tab-${escapeHtml(story.id)}"
    >${escapeHtml(story.title)}</button>
  `).join('');

  storyTabsContainer.querySelectorAll('.btn-story-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      state.activeStory = btn.dataset.storyId;
      updateStoryTabButtons();
      renderStoryPanel(state.activeStory);
    });
    btn.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const tabs = [...storyTabsContainer.querySelectorAll('.btn-story-tab')];
        const idx = tabs.indexOf(btn);
        const next = e.key === 'ArrowRight'
          ? tabs[(idx + 1) % tabs.length]
          : tabs[(idx - 1 + tabs.length) % tabs.length];
        next.focus();
        next.click();
      }
    });
  });

  renderStoryPanel(state.activeStory);
}

function updateStoryTabButtons() {
  document.querySelectorAll('.btn-story-tab').forEach(btn => {
    const isActive = btn.dataset.storyId === state.activeStory;
    btn.setAttribute('aria-selected', isActive);
  });
}

function renderStoryPanel(storyId) {
  const container = document.getElementById('story-content');
  if (!container) return;

  const story = state.data.stories.find(s => s.id === storyId);
  if (!story) { container.innerHTML = ''; return; }

  // Collect all currently-selected expressions for highlighting
  const selectedExprs = Object.values(state.selections).filter(Boolean);

  // Check if any expression appears in this story
  const allText = story.text.join(' ').toLowerCase();
  const anyMatch = selectedExprs.some(expr => {
    const words = expr.en.toLowerCase().split(' ').slice(0, 4).join(' ');
    return allText.includes(words.slice(0, Math.min(20, words.length)));
  });

  container.innerHTML = `
    <div class="story-panel active" role="tabpanel" id="story-panel-${escapeHtml(story.id)}">
      <div class="story-context-label">${escapeHtml(story.title)}</div>
      <div class="story-body">
        ${story.text.map(sentence => `
          <p class="story-para">${highlightAll(sentence, selectedExprs)}</p>
        `).join('')}
      </div>
      ${anyMatch
        ? `<p class="story-no-match" style="color:var(--teal-dark);font-style:normal;font-weight:600;margin-top:var(--space-3);font-size:var(--font-size-xs);">
            ✓ Your selected expressions appear highlighted in the story above.
           </p>`
        : `<p class="story-no-match">
            Your selected expressions don't appear directly in this story — try the other story, or swap an expression!
           </p>`
      }
    </div>
  `;
}

/* ── Reset ───────────────────────────────────── */
function handleReset() {
  state.selections = {};
  state.activeSwapTab = null;
  state.activeStory = state.data.stories[0]?.id || null;

  // Clear all visual selection states
  state.data.tabs.forEach(tab => {
    updateExpressionButtons(tab.id);
    updateStepCompletedState(tab.id);
  });

  const hint = document.getElementById('build-hint');
  if (hint) hint.textContent = 'Select one expression from each step to continue.';

  const btnBuild = document.getElementById('btn-build');
  if (btnBuild) btnBuild.disabled = true;

  hideOutputSection();

  // Scroll back to top
  document.querySelector('.builder-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  announce('Restarted. Please choose your expressions again.');
}

function hideOutputSection() {
  const outputSection = document.getElementById('output-section');
  if (outputSection) outputSection.classList.add('hidden');
}

/* ── Helpers ─────────────────────────────────── */
function setTextById(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function escapeHtml(str) {
  if (!str && str !== 0) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlightAll(sentence, expressions) {
  if (!expressions || expressions.length === 0) return escapeHtml(sentence);

  let result = escapeHtml(sentence);

  for (const expr of expressions) {
    if (!expr || !expr.en) continue;
    const safeText = escapeHtml(expr.en);

    // Full match (case-insensitive)
    const fullRe = new RegExp(`(${escapeRegex(safeText)})`, 'gi');
    if (fullRe.test(result)) {
      result = result.replace(fullRe, '<mark>$1</mark>');
      continue;
    }

    // Partial: first 4 words (handles paraphrased story sentences)
    const words = safeText.trim().split(/\s+/);
    if (words.length >= 3) {
      const pivot = words.slice(0, Math.min(4, words.length)).join(' ');
      const pivotRe = new RegExp(`(${escapeRegex(pivot)}\\S*)`, 'gi');
      if (pivotRe.test(result)) {
        result = result.replace(pivotRe, '<mark>$1</mark>');
        continue;
      }
      // Even shorter — try 2 key words
      const short = words.slice(0, 2).join(' ');
      if (short.length > 5) {
        const shortRe = new RegExp(`(${escapeRegex(short)}[a-z,.]*)`, 'gi');
        result = result.replace(shortRe, '<mark>$1</mark>');
      }
    }
  }

  return result;
}

function announce(msg) {
  let region = document.getElementById('sr-announcer');
  if (!region) {
    region = document.createElement('div');
    region.id = 'sr-announcer';
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    region.className = 'sr-only';
    document.body.appendChild(region);
  }
  region.textContent = '';
  setTimeout(() => { region.textContent = msg; }, 60);
}

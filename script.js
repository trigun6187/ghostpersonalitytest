/* ============================================================
   Ghost Personality Test — IPIP Big Five 50-Item Scale
   Questions & scoring based on Goldberg (1992)
   ============================================================ */

const QUESTIONS = [
  "I am the life of the party.",
  "I feel little concern for others.",
  "I am always prepared.",
  "I get stressed out easily.",
  "I have a rich vocabulary.",
  "I don't talk a lot.",
  "I am interested in people.",
  "I leave my belongings around.",
  "I am relaxed most of the time.",
  "I have difficulty understanding abstract ideas.",
  "I feel comfortable around people.",
  "I insult people.",
  "I pay attention to details.",
  "I worry about things.",
  "I have a vivid imagination.",
  "I keep in the background.",
  "I sympathize with others' feelings.",
  "I make a mess of things.",
  "I seldom feel blue.",
  "I am not interested in abstract ideas.",
  "I start conversations.",
  "I am not interested in other people's problems.",
  "I get chores done right away.",
  "I am easily disturbed.",
  "I have excellent ideas.",
  "I have little to say.",
  "I have a soft heart.",
  "I often forget to put things back in their proper place.",
  "I get upset easily.",
  "I do not have a good imagination.",
  "I talk to a lot of different people at parties.",
  "I am not really interested in others.",
  "I like order.",
  "I change my mood a lot.",
  "I am quick to understand things.",
  "I don't like to draw attention to myself.",
  "I take time out for others.",
  "I shirk my duties.",
  "I have frequent mood swings.",
  "I use difficult words.",
  "I don't mind being the center of attention.",
  "I feel others' emotions.",
  "I follow a schedule.",
  "I get irritated easily.",
  "I spend time reflecting on things.",
  "I am quiet around strangers.",
  "I make people feel at ease.",
  "I am exacting in my work.",
  "I often feel blue.",
  "I am full of ideas."
];

/* Scoring key
   R = reverse-scored items (6 - raw)
   Each factor: 10 items, average → 1.0–5.0
*/
const FACTORS = {
  extraversion: {
    label: "Extraversion",
    icon: "🎉",
    color: "#ec4899",
    items: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45],
    reverse: [5, 15, 25, 35, 45], // 0-indexed: items 6, 16, 26, 36, 46
    high: "Outgoing, energetic, sociable — you thrive around people.",
    low: "Reserved, independent, thoughtful — you value your alone time."
  },
  agreeableness: {
    label: "Agreeableness",
    icon: "💚",
    color: "#22c55e",
    items: [1, 6, 11, 16, 21, 26, 31, 36, 41, 46],
    reverse: [1, 11, 21, 31], // items 2, 12, 22, 32
    high: "Compassionate, cooperative, trusting — you put others first.",
    low: "Competitive, direct, skeptical — you value truth over harmony."
  },
  conscientiousness: {
    label: "Conscientiousness",
    icon: "📋",
    color: "#3b82f6",
    items: [2, 7, 12, 17, 22, 27, 32, 37, 42, 47],
    reverse: [7, 17, 27, 37], // items 8, 18, 28, 38
    high: "Organized, reliable, disciplined — you get things done.",
    low: "Spontaneous, flexible, easygoing — you go with the flow."
  },
  neuroticism: {
    label: "Neuroticism",
    icon: "🌊",
    color: "#ef4444",
    items: [3, 8, 13, 18, 23, 28, 33, 38, 43, 48],
    /* Emotional Stability items: +keyed (9, 19) stay as-is
       -keyed items reverse-scored.
       Since we're scoring Neuroticism:
       Items that indicate Emotional Stability (9, 19) are REVERSED for N.
       Items that indicate Neuroticism stay as-is.
       
       Items 4, 14, 24, 29, 34, 39, 44, 49 → +keyed for N (as-is)
       Items 9, 19 → -keyed for N (reverse)
       
       In 0-indexed: items 3 (q4), 8 (q9), 13 (q14), 18 (q19), 
       23 (q24), 28 (q29), 33 (q34), 38 (q39), 43 (q44), 48 (q49)
    */
    reverse: [8, 18], // items 9, 19 — the ES +keyed items, reversed for N
    high: "Sensitive, reactive, perceptive — you feel things deeply.",
    low: "Calm, resilient, steady — you keep your cool under pressure."
  },
  openness: {
    label: "Openness",
    icon: "🧠",
    color: "#f59e0b",
    items: [4, 9, 14, 19, 24, 29, 34, 39, 44, 49],
    reverse: [9, 19, 29], // items 10, 20, 30
    high: "Curious, creative, imaginative — you love new ideas and experiences.",
    low: "Practical, grounded, conventional — you prefer the familiar."
  }
};

// ===== STATE =====
let answers = new Array(50).fill(null);
let currentIndex = 0;

// ===== DOM REFS =====
const intro    = document.getElementById('intro');
const test     = document.getElementById('test');
const results  = document.getElementById('results');
const startBtn = document.getElementById('startBtn');

const qNum      = document.getElementById('qNum');
const qText     = document.getElementById('qText');
const likertBtns = document.querySelectorAll('.likert-btn');
const prevBtn   = document.getElementById('prevBtn');
const nextBtn   = document.getElementById('nextBtn');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');

const resultsGrid = document.getElementById('resultsGrid');
const traitDescs  = document.getElementById('traitDescs') || document.getElementById('traitDescriptions');
const restartBtn  = document.getElementById('restartBtn');
const radarCanvas = document.getElementById('radarChart');

// ===== SCREEN MANAGEMENT =====
function showScreen(screen) {
  [intro, test, results].forEach(s => s.classList.remove('active'));
  screen.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== START =====
startBtn.addEventListener('click', () => {
  answers.fill(null);
  currentIndex = 0;
  showScreen(test);
  renderQuestion();
});

restartBtn.addEventListener('click', () => {
  showScreen(intro);
});

// ===== RENDER QUESTION =====
function renderQuestion() {
  qNum.textContent = `Question ${currentIndex + 1} of 50`;
  qText.textContent = QUESTIONS[currentIndex];

  // Progress
  const pct = ((currentIndex + 1) / 50) * 100;
  progressFill.style.width = pct + '%';
  progressText.textContent = `${currentIndex + 1} / 50`;

  // Clear selection
  likertBtns.forEach(btn => btn.classList.remove('selected'));

  // Restore previous answer if exists
  const val = answers[currentIndex];
  if (val !== null) {
    likertBtns.forEach(btn => {
      if (parseInt(btn.dataset.val) === val) btn.classList.add('selected');
    });
  }

  // Update button states
  prevBtn.style.visibility = currentIndex === 0 ? 'hidden' : 'visible';
  updateNextButton();

  // Scroll to top of question card
  document.querySelector('.question-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ===== LIKERT CLICK =====
likertBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const val = parseInt(btn.dataset.val);
    answers[currentIndex] = val;
    likertBtns.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    updateNextButton();

    // Auto-advance after a brief delay
    setTimeout(() => {
      if (currentIndex < 49) {
        currentIndex++;
        renderQuestion();
      } else {
        showResults();
      }
    }, 250);
  });
});

function updateNextButton() {
  const hasAnswer = answers[currentIndex] !== null;
  if (currentIndex === 49) {
    nextBtn.textContent = hasAnswer ? 'See Results →' : 'Finish →';
  } else {
    nextBtn.textContent = 'Next →';
  }
  nextBtn.disabled = !hasAnswer;
}

// ===== NAVIGATION =====
prevBtn.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    renderQuestion();
  }
});

nextBtn.addEventListener('click', () => {
  if (answers[currentIndex] === null) return;
  if (currentIndex < 49) {
    currentIndex++;
    renderQuestion();
  } else {
    showResults();
  }
});

// Keyboard support
document.addEventListener('keydown', (e) => {
  if (!test.classList.contains('active')) return;
  if (e.key === 'ArrowLeft' && currentIndex > 0) {
    prevBtn.click();
  } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
    if (!nextBtn.disabled) nextBtn.click();
  }
  // Number keys 1-5 for Likert
  const num = parseInt(e.key);
  if (num >= 1 && num <= 5) {
    likertBtns[num - 1].click();
  }
});

// ===== SCORING =====
function computeScores() {
  const scores = {};
  for (const [key, factor] of Object.entries(FACTORS)) {
    let sum = 0;
    factor.items.forEach((itemIdx, i) => {
      let raw = answers[itemIdx];
      if (factor.reverse.includes(itemIdx)) {
        raw = 6 - raw; // reverse
      }
      sum += raw;
    });
    scores[key] = sum / 10; // average 1.0–5.0
  }
  return scores;
}

// ===== RESULTS =====
function showResults() {
  showScreen(results);
  const scores = computeScores();

  // Trait cards
  resultsGrid.innerHTML = '';
  const order = ['extraversion', 'agreeableness', 'conscientiousness', 'neuroticism', 'openness'];

  order.forEach(key => {
    const f = FACTORS[key];
    const score = scores[key];
    const pct = ((score - 1) / 4) * 100; // 1→0%, 5→100%
    const label = score >= 3.5 ? 'High' : score >= 2.5 ? 'Moderate' : 'Low';

    const card = document.createElement('div');
    card.className = 'trait-card';
    card.innerHTML = `
      <div class="trait-icon">${f.icon}</div>
      <div class="trait-name" style="color:${f.color}">${f.label}</div>
      <div class="trait-score" style="color:${f.color}">${score.toFixed(1)}</div>
      <div class="trait-label">${label}</div>
      <div class="trait-bar">
        <div class="trait-bar-fill" style="width:0%; background:${f.color};"></div>
      </div>
    `;
    resultsGrid.appendChild(card);

    // Animate bar after render
    requestAnimationFrame(() => {
      const bar = card.querySelector('.trait-bar-fill');
      bar.style.width = pct + '%';
    });
  });

  // Trait descriptions
  traitDescs.innerHTML = '';
  order.forEach(key => {
    const f = FACTORS[key];
    const score = scores[key];
    const desc = score >= 3.5 ? f.high : score <= 2.5 ? f.low :
      `You show a balanced mix of both sides.`;
    const label = score >= 3.5 ? 'High' : score <= 2.5 ? 'Low' : 'Moderate';

    const div = document.createElement('div');
    div.className = 'trait-desc-card';
    div.innerHTML = `
      <div class="desc-header">
        <span class="desc-icon">${f.icon}</span>
        <h3 style="color:${f.color}">${f.label}: ${label} (${score.toFixed(1)})</h3>
      </div>
      <p>${desc}</p>
    `;
    traitDescs.appendChild(div);
  });

  // Radar chart
  drawRadar(scores);
}

// ===== RADAR CHART =====
function drawRadar(scores) {
  const canvas = radarCanvas;
  const ctx = canvas.getContext('2d');

  // Handle high-DPI
  const dpr = window.devicePixelRatio || 1;
  const size = Math.min(400, window.innerWidth - 60);
  canvas.style.width = size + 'px';
  canvas.style.height = size + 'px';
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  ctx.scale(dpr, dpr);

  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.35;

  const order = ['extraversion', 'agreeableness', 'conscientiousness', 'neuroticism', 'openness'];
  const labels = ['Extraversion', 'Agreeableness', 'Conscientiousness', 'Neuroticism', 'Openness'];
  const colors = ['#ec4899', '#22c55e', '#3b82f6', '#ef4444', '#f59e0b'];
  const n = order.length;

  // Convert score (1-5) to radius distance
  function scoreToR(score) {
    return ((score - 1) / 4) * radius; // 1→0, 5→radius
  }

  const angleStep = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2; // start at top

  // Grid circles
  for (let ring = 1; ring <= 5; ring++) {
    const r = (ring / 5) * radius;
    ctx.beginPath();
    for (let i = 0; i <= n; i++) {
      const angle = startAngle + i * angleStep;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Axis lines
  for (let i = 0; i < n; i++) {
    const angle = startAngle + i * angleStep;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(x, y);
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Data polygon
  ctx.beginPath();
  for (let i = 0; i <= n; i++) {
    const idx = i % n;
    const key = order[idx];
    const val = scores[key];
    const r = scoreToR(val);
    const angle = startAngle + i * angleStep;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = 'rgba(168,85,247,0.2)';
  ctx.fill();
  ctx.strokeStyle = '#a855f7';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Data points
  for (let i = 0; i < n; i++) {
    const key = order[i];
    const val = scores[key];
    const r = scoreToR(val);
    const angle = startAngle + i * angleStep;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);

    ctx.beginPath();
    ctx.arc(x, y, 4, 0, 2 * Math.PI);
    ctx.fillStyle = colors[i];
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // Labels
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '600 11px Inter, sans-serif';
  for (let i = 0; i < n; i++) {
    const angle = startAngle + i * angleStep;
    const labelR = radius + 28;
    const x = cx + labelR * Math.cos(angle);
    const y = cy + labelR * Math.sin(angle);
    ctx.fillStyle = colors[i];
    ctx.fillText(labels[i], x, y);
  }

  // Center score labels
  ctx.font = '500 10px Inter, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  for (let ring = 1; ring <= 4; ring++) {
    const r = (ring / 5) * radius;
    const val = 1 + (ring / 5) * 4;
    ctx.fillText(val.toFixed(0), cx + r + 6, cy + 4);
  }
}

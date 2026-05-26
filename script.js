/* ============================================================
   Ghost Personality Test — IPIP Big Five 50-Item Scale
   Questions & scoring based on Goldberg (1992)
   ============================================================ */

// roundRect polyfill for older browsers
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
    if (r > w / 2) r = w / 2;
    if (r > h / 2) r = h / 2;
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    return this;
  };
}

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

const FACTORS = {
  extraversion: {
    label: "Extraversion", icon: "🎉", color: "#ec4899",
    items: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45],
    reverse: [5, 15, 25, 35, 45],
    high: "an outgoing, energetic force who draws energy from being around others. You're probably the one starting conversations, bringing people together, and feeling most alive in social settings. Your natural warmth and assertiveness make you a magnetic presence — people are drawn to your enthusiasm, and you thrive when you're in the middle of the action.",
    low: "more of an inward-battery type — you're thoughtful, observant, and perfectly content with your own company or a small circle of trusted people. Social situations can drain you, not because you dislike them, but because your mind is busy processing, reflecting, and observing rather than performing. Your depth and independence are your superpowers, even if the world doesn't always see them."
  },
  agreeableness: {
    label: "Agreeableness", icon: "💚", color: "#22c55e",
    items: [1, 6, 11, 16, 21, 26, 31, 36, 41, 46],
    reverse: [1, 11, 21, 31],
    high: "someone who leads with empathy and cooperation. You genuinely care about how others feel, and you go out of your way to maintain harmony and support the people around you. Trust comes naturally to you, and you believe the best in people — which makes you the friend everyone turns to when they need a listening ear or a warm heart.",
    low: "someone who values honesty over harmony — you'd rather tell a hard truth than a comfortable lie. You're naturally skeptical, independent, and not afraid to challenge people or push back when something doesn't sit right with you. This directness can rub some people the wrong way, but it also means people always know where they stand with you, and you won't waste time on surface-level pleasantries."
  },
  conscientiousness: {
    label: "Conscientiousness", icon: "📋", color: "#3b82f6",
    items: [2, 7, 12, 17, 22, 27, 32, 37, 42, 47],
    reverse: [7, 17, 27, 37],
    high: "a planner, a finisher, someone who takes their commitments seriously. You like having a system, a schedule, a way of doing things that ensures nothing falls through the cracks. People count on you because you show up prepared and follow through — whether it's work, relationships, or personal goals, you bring a level of reliability that's rare and deeply appreciated.",
    low: "someone who moves through life with flexibility and spontaneity. Structure and routine feel stifling to you — you'd rather adapt in the moment than lock yourself into a plan. This makes you incredibly resourceful when things go sideways and you bring a sense of freedom and improvisation that keeps life interesting for everyone around you."
  },
  neuroticism: {
    label: "Neuroticism", icon: "🌊", color: "#ef4444",
    items: [3, 8, 13, 18, 23, 28, 33, 38, 43, 48],
    reverse: [8, 18],
    high: "someone who feels things deeply and experiences the full emotional spectrum in vivid color. You're sensitive to stress, attuned to subtle shifts in mood and environment, and your inner world is rich with thoughts and feelings that demand to be processed. This makes you deeply perceptive and emotionally intelligent — you notice what others miss — but it also means you carry a heavier emotional load day to day.",
    low: "someone with a steady emotional core — calm, resilient, hard to rattle. Stress rolls off you in situations where others might spiral, and you have a natural ability to keep your cool and think clearly under pressure. This emotional stability makes you a grounding presence for the people around you — the one everyone looks to when things get chaotic."
  },
  openness: {
    label: "Openness", icon: "🧠", color: "#f59e0b",
    items: [4, 9, 14, 19, 24, 29, 34, 39, 44, 49],
    reverse: [9, 19, 29],
    high: "a curious soul with a restless imagination. You're drawn to new ideas, new experiences, new ways of seeing the world — routine and convention bore you. Your mind is always exploring, questioning, connecting dots that others don't see. This makes you creative and visionary, but it also means you're easily bored by the familiar and always looking for the next horizon.",
    low: "someone who values the concrete and the proven. You prefer things that are real, practical, and straightforward — you trust experience over theory and tradition over novelty. This groundedness makes you reliable and clear-headed in situations where others get lost in hypotheticals."
  }
};

// ===== STATE =====
let answers = new Array(50).fill(null);
let currentIndex = 0;
let userName = '';
let lastScores = null;

// ===== DOM REFS =====
const intro    = document.getElementById('intro');
const test     = document.getElementById('test');
const results  = document.getElementById('results');
const startBtn = document.getElementById('startBtn');
const nameInput = document.getElementById('nameInput');

const qNum      = document.getElementById('qNum');
const qText     = document.getElementById('qText');
const likertBtns = document.querySelectorAll('.likert-btn');
const prevBtn   = document.getElementById('prevBtn');
const nextBtn   = document.getElementById('nextBtn');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');

const resultsGrid = document.getElementById('resultsGrid');
const traitDescs  = document.getElementById('traitDescriptions');
const restartBtn  = document.getElementById('restartBtn');
const downloadBtn = document.getElementById('downloadBtn');
const radarCanvas = document.getElementById('radarChart');
const resultsHeading = document.getElementById('resultsHeading');

// ===== SCREEN MANAGEMENT =====
function showScreen(screen) {
  [intro, test, results].forEach(s => s.classList.remove('active'));
  screen.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== START =====
startBtn.addEventListener('click', () => {
  userName = nameInput.value.trim();
  answers.fill(null);
  currentIndex = 0;
  lastScores = null;
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

  const pct = ((currentIndex + 1) / 50) * 100;
  progressFill.style.width = pct + '%';
  progressText.textContent = `${currentIndex + 1} / 50`;

  likertBtns.forEach(btn => btn.classList.remove('selected'));

  const val = answers[currentIndex];
  if (val !== null) {
    likertBtns.forEach(btn => {
      if (parseInt(btn.dataset.val) === val) btn.classList.add('selected');
    });
  }

  prevBtn.style.visibility = currentIndex === 0 ? 'hidden' : 'visible';
  updateNextButton();
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
  if (currentIndex > 0) { currentIndex--; renderQuestion(); }
});

nextBtn.addEventListener('click', () => {
  if (answers[currentIndex] === null) return;
  if (currentIndex < 49) { currentIndex++; renderQuestion(); }
  else { showResults(); }
});

document.addEventListener('keydown', (e) => {
  if (!test.classList.contains('active')) return;
  if (e.key === 'ArrowLeft' && currentIndex > 0) prevBtn.click();
  else if (e.key === 'ArrowRight' || e.key === 'Enter') { if (!nextBtn.disabled) nextBtn.click(); }
  const num = parseInt(e.key);
  if (num >= 1 && num <= 5) likertBtns[num - 1].click();
});

// ===== SCORING =====
function computeScores() {
  const scores = {};
  for (const [key, factor] of Object.entries(FACTORS)) {
    let sum = 0;
    factor.items.forEach((itemIdx) => {
      let raw = answers[itemIdx];
      if (factor.reverse.includes(itemIdx)) raw = 6 - raw;
      sum += raw;
    });
    scores[key] = sum / 10;
  }
  return scores;
}

// ===== NARRATIVE GENERATOR =====
function generateNarrative(scores) {
  const order = ['extraversion', 'agreeableness', 'conscientiousness', 'neuroticism', 'openness'];
  const sorted = Object.entries(scores)
    .map(([key, val]) => ({ key, val, ...FACTORS[key] }))
    .sort((a, b) => b.val - a.val);

  const primary = sorted[0];
  const secondary = sorted[1];
  const lowest = sorted[4];

  function desc(trait) {
    if (trait.val >= 3.5) return trait.high;
    if (trait.val <= 2.5) return trait.low;
    return null;
  }

  const pDesc = desc(primary);
  const sDesc = desc(secondary);
  const lDesc = desc(lowest);

  let p1 = pDesc
    ? `The most defining aspect of your personality is <strong>${primary.label.toLowerCase()}</strong>. You're ${pDesc}`
    : `You have a balanced personality where no single trait completely dominates — you adapt to situations rather than being locked into one mode of being.`;

  let p2 = '';
  if (sDesc && secondary.val >= 3 && primary.val - secondary.val < 1.5) {
    p2 = `This is complemented by your <strong>${secondary.label.toLowerCase()}</strong>, where you're ${sDesc}`;
  } else if (lDesc && lowest.val <= 2.5) {
    const lowKey = lowest.label.toLowerCase();
    const relationMap = { extraversion: 'inner life', agreeableness: 'directness', conscientiousness: 'spontaneity', neuroticism: 'emotional steadiness', openness: 'practicality' };
    p2 = `At the same time, you're notably low in <strong>${lowKey}</strong>, which gives you a natural ${relationMap[lowest.key] || lowKey} that balances out your other qualities.`;
  } else if (pDesc) {
    p2 = `Across all traits, what makes you <em>you</em> is how these tendencies work together to shape the way you navigate relationships, work, and the world around you.`;
  } else {
    p2 = `Your scores sit in the moderate range across most traits, which means you have the flexibility to draw on different parts of your personality depending on what the situation calls for. This adaptability is a strength in itself.`;
  }

  const archetypes = { extraversion: ['social connector', 'energizer', 'people person'], agreeableness: ['harmonizer', 'caretaker', 'team player'], conscientiousness: ['achiever', 'architect', 'perfectionist'], neuroticism: ['deep feeler', 'perceptive soul', 'highly sensitive thinker'], openness: ['visionary', 'explorer', 'creative mind'] };
  const topKeys = sorted.slice(0, 2).filter(t => t.val >= 3).map(t => t.key);
  let archetypePhrase = '';

  if (topKeys.length >= 2) {
    const a1 = archetypes[topKeys[0]][0];
    const a2 = archetypes[topKeys[1]][1] || archetypes[topKeys[1]][0];
    archetypePhrase = `In many ways, you're a <strong>${a1} and a ${a2}</strong> — someone who `;
    const combo = topKeys.slice(0, 2).sort();
    const combos = {
      'extraversion,openness': 'brings social energy to every new idea and adventure you chase.',
      'agreeableness,conscientiousness': 'shows up for others with both reliability and genuine care.',
      'conscientiousness,extraversion': 'brings both social drive and disciplined follow-through to everything you do.',
      'neuroticism,openness': 'turns your deep emotions into creative fuel and original thinking.',
      'agreeableness,neuroticism': 'feels other people\'s pain as your own and cares deeply, sometimes to a fault.',
      'extraversion,neuroticism': 'wears their heart on their sleeve and isn\'t afraid to let people see the real them.',
      'agreeableness,openness': 'combines genuine warmth with an open, curious mind.'
    };
    archetypePhrase += combos[combo.join(',')] || 'moves through the world with a unique blend of these qualities.';
  } else if (topKeys.length === 1) {
    archetypePhrase = `At your core, you're a <strong>${archetypes[topKeys[0]][2]}</strong> — this is the lens through which you experience most of life.`;
  } else {
    archetypePhrase = 'Your balanced profile means you have the rare ability to understand and connect with many different kinds of people.';
  }

  return `
    <div class="narrative-block">
      <p class="narrative-p">${p1}</p>
      <p class="narrative-p">${p2}</p>
      <p class="narrative-p">${archetypePhrase}</p>
    </div>
  `;
}

// ===== RESULTS =====
function showResults() {
  showScreen(results);
  const scores = computeScores();
  lastScores = scores;

  const displayName = userName || 'You';
  resultsHeading.textContent = `${displayName}'s Personality Profile`;

  const order = ['extraversion', 'agreeableness', 'conscientiousness', 'neuroticism', 'openness'];

  resultsGrid.innerHTML = '';
  order.forEach(key => {
    const f = FACTORS[key];
    const score = scores[key];
    const pct = ((score - 1) / 4) * 100;
    const label = score >= 3.5 ? 'High' : score >= 2.5 ? 'Moderate' : 'Low';

    const card = document.createElement('div');
    card.className = 'trait-card';
    card.innerHTML = `
      <div class="trait-icon">${f.icon}</div>
      <div class="trait-name" style="color:${f.color}">${f.label}</div>
      <div class="trait-score" style="color:${f.color}">${score.toFixed(1)}</div>
      <div class="trait-label">${label}</div>
      <div class="trait-bar"><div class="trait-bar-fill" style="width:0%;background:${f.color};"></div></div>
    `;
    resultsGrid.appendChild(card);
    requestAnimationFrame(() => { card.querySelector('.trait-bar-fill').style.width = pct + '%'; });
  });

  traitDescs.innerHTML = `<div class="narrative-section">${generateNarrative(scores)}</div>`;
  drawRadar(scores);
}

// ===== DOWNLOAD INSTAGRAM CARD =====
downloadBtn.addEventListener('click', () => {
  if (!lastScores) return;
  downloadBtn.textContent = '⏳ Generating...';
  downloadBtn.disabled = true;

  // Use requestAnimationFrame to let UI update, then generate
  requestAnimationFrame(() => setTimeout(generateCard, 50));
});

function generateCard() {
  const W = 1080, H = 1080;
  const dpr = 2;
  const cvs = document.createElement('canvas');
  cvs.width = W * dpr;
  cvs.height = H * dpr;
  const ctx = cvs.getContext('2d');
  ctx.scale(dpr, dpr);

  // --- Background ---
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, '#0f0c29');
  grad.addColorStop(0.5, '#302b63');
  grad.addColorStop(1, '#24243e');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // --- Subtle border ---
  ctx.strokeStyle = 'rgba(168,85,247,0.2)';
  ctx.lineWidth = 3;
  ctx.strokeRect(24, 24, W - 48, H - 48);

  // --- Branding header ---
  ctx.textAlign = 'center';
  ctx.font = 'bold 20px Inter, sans-serif';
  ctx.fillStyle = '#a855f7';
  ctx.fillText('👻  GHOST  PERSONALITY  TEST', W / 2, 60);

  // --- Name ---
  const displayName = (userName || 'You').toUpperCase();
  ctx.font = 'bold 40px Inter, sans-serif';
  ctx.fillStyle = '#f0eef8';
  ctx.fillText(displayName, W / 2, 132);

  // --- Divider ---
  ctx.strokeStyle = 'rgba(168,85,247,0.15)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(160, 152);
  ctx.lineTo(W - 160, 152);
  ctx.stroke();

  // --- 2-COLUMN LAYOUT: Bars (left) + Radar (right) ---
  const order = ['extraversion', 'agreeableness', 'conscientiousness', 'neuroticism', 'openness'];
  const colors = ['#ec4899', '#22c55e', '#3b82f6', '#ef4444', '#f59e0b'];
  const shortLabels = ['Extraversion', 'Agreeableness', 'Conscientiousness', 'Neuroticism', 'Openness'];

  // Left column: trait bars
  const barStartX = 90;
  const labelW = 170;
  const barW = 340;
  const barH = 20;
  const barGap = 48;
  const barStartY = 195;

  order.forEach((key, i) => {
    const score = lastScores[key];
    const pct = Math.max(0, Math.min(100, ((score - 1) / 4) * 100));
    const y = barStartY + i * barGap;

    // Label
    ctx.textAlign = 'right';
    ctx.font = '500 18px Inter, sans-serif';
    ctx.fillStyle = colors[i];
    ctx.fillText(shortLabels[i], barStartX + labelW - 8, y + 7);

    // Score
    ctx.textAlign = 'right';
    ctx.font = 'bold 22px Inter, sans-serif';
    ctx.fillStyle = '#f0eef8';
    ctx.fillText(score.toFixed(1), barStartX + labelW + barW + 10, y + 7);

    // Bar bg
    const barX = barStartX + labelW;
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.beginPath();
    ctx.roundRect(barX, y - 5, barW, barH, 10);
    ctx.fill();

    // Bar fill
    const fillW = Math.max(3, (pct / 100) * barW);
    const grad2 = ctx.createLinearGradient(barX, 0, barX + fillW, 0);
    grad2.addColorStop(0, colors[i]);
    grad2.addColorStop(1, colors[i] + '99');
    ctx.fillStyle = grad2;
    ctx.beginPath();
    ctx.roundRect(barX, y - 5, fillW, barH, 10);
    ctx.fill();

    // End dot
    ctx.beginPath();
    ctx.arc(barX + fillW, y + 5, 5, 0, 2 * Math.PI);
    ctx.fillStyle = colors[i];
    ctx.fill();
  });

  // Right column: radar chart
  const radarX = 800;
  const radarY = 320;
  const radius = 110;

  // Grid rings
  for (let ring = 1; ring <= 5; ring++) {
    const r = (ring / 5) * radius;
    ctx.beginPath();
    for (let i = 0; i <= 5; i++) {
      const angle = -Math.PI / 2 + i * (2 * Math.PI / 5);
      const x = radarX + r * Math.cos(angle);
      const y = radarY + r * Math.sin(angle);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = 'rgba(255,255,255,0.07)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Axes
  for (let i = 0; i < 5; i++) {
    const angle = -Math.PI / 2 + i * (2 * Math.PI / 5);
    ctx.beginPath();
    ctx.moveTo(radarX, radarY);
    ctx.lineTo(radarX + radius * Math.cos(angle), radarY + radius * Math.sin(angle));
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.stroke();
  }

  // Data polygon
  ctx.beginPath();
  for (let i = 0; i <= 5; i++) {
    const idx = i % 5;
    const r = ((lastScores[order[idx]] - 1) / 4) * radius;
    const angle = -Math.PI / 2 + i * (2 * Math.PI / 5);
    const x = radarX + r * Math.cos(angle);
    const y = radarY + r * Math.sin(angle);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = 'rgba(168,85,247,0.12)';
  ctx.fill();
  ctx.strokeStyle = '#a855f7';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Data points
  for (let i = 0; i < 5; i++) {
    const r = ((lastScores[order[i]] - 1) / 4) * radius;
    const angle = -Math.PI / 2 + i * (2 * Math.PI / 5);
    const x = radarX + r * Math.cos(angle);
    const y = radarY + r * Math.sin(angle);
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, 2 * Math.PI);
    ctx.fillStyle = colors[i];
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // Axis labels (cardinal directions only - top, right, bottom, left for readability)
  const cardinalLabels = [
    { label: 'Extraversion', angle: -Math.PI / 2, color: colors[0] },
    { label: 'Agreeableness', angle: -Math.PI / 2 + 2 * Math.PI / 5, color: colors[1] },
    { label: 'Conscientiousness', angle: -Math.PI / 2 + 4 * Math.PI / 5, color: colors[2] },
    { label: 'Neuroticism', angle: -Math.PI / 2 + 6 * Math.PI / 5, color: colors[3] },
    { label: 'Openness', angle: -Math.PI / 2 + 8 * Math.PI / 5, color: colors[4] }
  ];
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 12px Inter, sans-serif';
  cardinalLabels.forEach(({ label, angle, color }) => {
    const lr = radius + 28;
    ctx.fillStyle = color;
    ctx.fillText(label, radarX + lr * Math.cos(angle), radarY + lr * Math.sin(angle));
  });

  // --- Archetype banner ---
  const archetypePhrase = getArchetypeTagline();
  ctx.textAlign = 'center';
  ctx.font = 'bold 26px Inter, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.fillText(archetypePhrase, W / 2, 535);

  // --- Bottom divider ---
  ctx.strokeStyle = 'rgba(168,85,247,0.1)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(200, 565);
  ctx.lineTo(W - 200, 565);
  ctx.stroke();

  // --- Footer ---
  ctx.font = '14px Inter, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.fillText('🔒 No data stored · ghostpersonalitytest.com', W / 2, 595);

  ctx.font = 'bold 15px Inter, sans-serif';
  ctx.fillStyle = 'rgba(168,85,247,0.35)';
  ctx.fillText('#GhostPersonalityTest', W / 2, 624);

  // --- Download ---
  const link = document.createElement('a');
  link.download = `personality-${userName || 'results'}.jpg`;
  link.href = cvs.toDataURL('image/jpeg', 0.92);
  link.click();

  downloadBtn.textContent = '📸 Download for Instagram';
  downloadBtn.disabled = false;
}

function getArchetypeTagline() {
  if (!lastScores) return 'Discover your personality';
  const sorted = Object.entries(lastScores)
    .map(([key, val]) => ({ key, val, ...FACTORS[key] }))
    .sort((a, b) => b.val - a.val);

  const topKeys = sorted.slice(0, 2).filter(t => t.val >= 3).map(t => t.key);
  const archetypes = { extraversion: 'Social Connector', agreeableness: 'The Harmonizer', conscientiousness: 'The Achiever', neuroticism: 'Deep Feeler', openness: 'The Explorer' };

  if (topKeys.length >= 2) return `${archetypes[topKeys[0]]} & ${archetypes[topKeys[1]]}`;
  if (topKeys.length === 1) return archetypes[topKeys[0]];
  return 'Balanced & Adaptable';
}

// ===== RADAR CHART =====
function drawRadar(scores) {
  const canvas = radarCanvas;
  const ctx = canvas.getContext('2d');

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
  const n = 5;

  function scoreToR(score) { return ((score - 1) / 4) * radius; }

  const angleStep = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2;

  for (let ring = 1; ring <= 5; ring++) {
    const r = (ring / 5) * radius;
    ctx.beginPath();
    for (let i = 0; i <= n; i++) {
      const angle = startAngle + i * angleStep;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  for (let i = 0; i < n; i++) {
    const angle = startAngle + i * angleStep;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.stroke();
  }

  ctx.beginPath();
  for (let i = 0; i <= n; i++) {
    const idx = i % n;
    const r = scoreToR(scores[order[idx]]);
    const angle = startAngle + i * angleStep;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = 'rgba(168,85,247,0.2)';
  ctx.fill();
  ctx.strokeStyle = '#a855f7';
  ctx.lineWidth = 2;
  ctx.stroke();

  for (let i = 0; i < n; i++) {
    const r = scoreToR(scores[order[i]]);
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

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '600 11px Inter, sans-serif';
  for (let i = 0; i < n; i++) {
    const angle = startAngle + i * angleStep;
    const lr = radius + 28;
    ctx.fillStyle = colors[i];
    ctx.fillText(labels[i], cx + lr * Math.cos(angle), cy + lr * Math.sin(angle));
  }

  ctx.font = '500 10px Inter, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  for (let ring = 1; ring <= 4; ring++) {
    const r = (ring / 5) * radius;
    ctx.fillText((1 + (ring / 5) * 4).toFixed(0), cx + r + 6, cy + 4);
  }
}

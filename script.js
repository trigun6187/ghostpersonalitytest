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

const FACTORS = {
  extraversion: {
    label: "Extraversion",
    icon: "🎉",
    color: "#ec4899",
    items: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45],
    reverse: [5, 15, 25, 35, 45],
    high: "an outgoing, energetic force who draws energy from being around others. You're probably the one starting conversations, bringing people together, and feeling most alive in social settings. Your natural warmth and assertiveness make you a magnetic presence — people are drawn to your enthusiasm, and you thrive when you're in the middle of the action.",
    low: "more of an inward-battery type — you're thoughtful, observant, and perfectly content with your own company or a small circle of trusted people. Social situations can drain you, not because you dislike them, but because your mind is busy processing, reflecting, and observing rather than performing. Your depth and independence are your superpowers, even if the world doesn't always see them."
  },
  agreeableness: {
    label: "Agreeableness",
    icon: "💚",
    color: "#22c55e",
    items: [1, 6, 11, 16, 21, 26, 31, 36, 41, 46],
    reverse: [1, 11, 21, 31],
    high: "someone who leads with empathy and cooperation. You genuinely care about how others feel, and you go out of your way to maintain harmony and support the people around you. Trust comes naturally to you, and you believe the best in people — which makes you the friend everyone turns to when they need a listening ear or a warm heart.",
    low: "someone who values honesty over harmony — you'd rather tell a hard truth than a comfortable lie. You're naturally skeptical, independent, and not afraid to challenge people or push back when something doesn't sit right with you. This directness can rub some people the wrong way, but it also means people always know where they stand with you, and you won't waste time on surface-level pleasantries."
  },
  conscientiousness: {
    label: "Conscientiousness",
    icon: "📋",
    color: "#3b82f6",
    items: [2, 7, 12, 17, 22, 27, 32, 37, 42, 47],
    reverse: [7, 17, 27, 37],
    high: "a planner, a finisher, someone who takes their commitments seriously. You like having a system, a schedule, a way of doing things that ensures nothing falls through the cracks. People count on you because you show up prepared and follow through — whether it's work, relationships, or personal goals, you bring a level of reliability that's rare and deeply appreciated.",
    low: "someone who moves through life with flexibility and spontaneity. Structure and routine feel stifling to you — you'd rather adapt in the moment than lock yourself into a plan. This makes you incredibly resourceful when things go sideways (because you never expected them to go smoothly anyway), and you bring a sense of freedom and improvisation that keeps life interesting for everyone around you."
  },
  neuroticism: {
    label: "Neuroticism",
    icon: "🌊",
    color: "#ef4444",
    items: [3, 8, 13, 18, 23, 28, 33, 38, 43, 48],
    reverse: [8, 18],
    high: "someone who feels things deeply and experiences the full emotional spectrum in vivid color. You're sensitive to stress, attuned to subtle shifts in mood and environment, and your inner world is rich with thoughts and feelings that demand to be processed. This makes you deeply perceptive and emotionally intelligent — you notice what others miss — but it also means you carry a heavier emotional load day to day.",
    low: "someone with a steady emotional core — calm, resilient, hard to rattle. Stress rolls off you in situations where others might spiral, and you have a natural ability to keep your cool and think clearly under pressure. This emotional stability makes you a grounding presence for the people around you — the one everyone looks to when things get chaotic, because you're still standing solid while the storm passes."
  },
  openness: {
    label: "Openness",
    icon: "🧠",
    color: "#f59e0b",
    items: [4, 9, 14, 19, 24, 29, 34, 39, 44, 49],
    reverse: [9, 19, 29],
    high: "a curious soul with a restless imagination. You're drawn to new ideas, new experiences, new ways of seeing the world — routine and convention bore you. Your mind is always exploring, questioning, connecting dots that others don't see. This makes you creative and visionary, but it also means you're easily bored by the familiar and always looking for the next horizon.",
    low: "someone who values the concrete and the proven over the abstract and the untested. You prefer things that are real, practical, and straightforward — you trust experience over theory and tradition over novelty. This groundedness makes you reliable and clear-headed in situations where others get lost in hypotheticals, and your practical wisdom is something the dreamers in your life rely on to keep their feet on the ground."
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

document.addEventListener('keydown', (e) => {
  if (!test.classList.contains('active')) return;
  if (e.key === 'ArrowLeft' && currentIndex > 0) {
    prevBtn.click();
  } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
    if (!nextBtn.disabled) nextBtn.click();
  }
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
    factor.items.forEach((itemIdx) => {
      let raw = answers[itemIdx];
      if (factor.reverse.includes(itemIdx)) {
        raw = 6 - raw;
      }
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

  // Paragraph 1: The defining trait
  let p1 = '';
  if (pDesc) {
    p1 = `The most defining aspect of your personality is <strong>${primary.label.toLowerCase()}</strong>. You're ${pDesc}`;
  } else {
    p1 = `You have a balanced personality where no single trait completely dominates — you adapt to situations rather than being locked into one mode of being.`;
  }

  // Paragraph 2: Secondary trait contrast
  let p2 = '';
  if (sDesc && secondary.val >= 3 && primary.val - secondary.val < 1.5) {
    p2 = `This is complemented by your <strong>${secondary.label.toLowerCase()}</strong>, where you're ${sDesc}`;
  } else if (lDesc && lowest.val <= 2.5) {
    const lowKey = lowest.label.toLowerCase();
    const relationMap = {
      extraversion: 'inner life',
      agreeableness: 'directness',
      conscientiousness: 'spontaneity',
      neuroticism: 'emotional steadiness',
      openness: 'practicality'
    };
    const angle = relationMap[lowest.key] || lowKey;
    p2 = `At the same time, you're notably low in <strong>${lowKey}</strong>, which gives you a natural ${angle} that balances out your other qualities. ${lowest.key === 'agreeableness' && pDesc ? "You're not afraid to ruffle feathers when it matters." : ''} ${lowest.key === 'conscientiousness' && pDesc ? 'You prefer to keep your options open rather than locking into rigid plans.' : ''}`;
  } else if (pDesc) {
    p2 = `Across all traits, what makes you <em>you</em> is how these tendencies work together to shape the way you navigate relationships, work, and the world around you.`;
  } else {
    p2 = `Your scores sit in the moderate range across most traits, which means you have the flexibility to draw on different parts of your personality depending on what the situation calls for. This adaptability is a strength in itself.`;
  }

  // Paragraph 3: Archetype summary
  const archetypes = {
    extraversion: ['social connector', 'energizer', 'people person'],
    agreeableness: ['harmonizer', 'caretaker', 'team player'],
    conscientiousness: ['achiever', 'architect', 'perfectionist'],
    neuroticism: ['deep feeler', 'perceptive soul', 'highly sensitive thinker'],
    openness: ['visionary', 'explorer', 'creative mind']
  };

  const topKeys = sorted.slice(0, 2).filter(t => t.val >= 3).map(t => t.key);
  const bottomKeys = sorted.slice(-2).filter(t => t.val <= 2.5).map(t => t.key);

  let archetypePhrase = '';
  if (topKeys.length >= 2) {
    const a1 = archetypes[topKeys[0]][0];
    const a2 = archetypes[topKeys[1]][1] || archetypes[topKeys[1]][0];
    archetypePhrase = `In many ways, you're a <strong>${a1} and a ${a2}</strong> — someone who `;

    const combo = topKeys.slice(0, 2).sort();
    if (combo.includes('extraversion') && combo.includes('openness')) {
      archetypePhrase += 'brings social energy to every new idea and adventure you chase.';
    } else if (combo.includes('conscientiousness') && combo.includes('agreeableness')) {
      archetypePhrase += 'shows up for others with both reliability and genuine care.';
    } else if (combo.includes('extraversion') && combo.includes('conscientiousness')) {
      archetypePhrase += 'brings both social drive and disciplined follow-through to everything you do.';
    } else if (combo.includes('openness') && combo.includes('neuroticism')) {
      archetypePhrase += 'turns your deep emotions into creative fuel and original thinking.';
    } else if (combo.includes('agreeableness') && combo.includes('neuroticism')) {
      archetypePhrase += 'feels other people\'s pain as your own and cares deeply, sometimes to a fault.';
    } else if (combo.includes('extraversion') && combo.includes('neuroticism')) {
      archetypePhrase += 'wears their heart on their sleeve and isn\'t afraid to let people see the real them.';
    } else if (combo.includes('agreeableness') && combo.includes('openness')) {
      archetypePhrase += 'combines genuine warmth with an open, curious mind.';
    } else {
      archetypePhrase += 'moves through the world with a unique blend of these qualities.';
    }
  } else if (topKeys.length === 1) {
    const a = archetypes[topKeys[0]][2];
    archetypePhrase = `At your core, you're a <strong>${a}</strong> — this is the lens through which you experience most of life.`;
  } else {
    archetypePhrase = 'Your balanced profile means you have the rare ability to understand and connect with many different kinds of people, because parts of all of them live in you.';
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

  const order = ['extraversion', 'agreeableness', 'conscientiousness', 'neuroticism', 'openness'];

  // Trait score cards
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
      <div class="trait-bar">
        <div class="trait-bar-fill" style="width:0%; background:${f.color};"></div>
      </div>
    `;
    resultsGrid.appendChild(card);

    requestAnimationFrame(() => {
      const bar = card.querySelector('.trait-bar-fill');
      bar.style.width = pct + '%';
    });
  });

  // Personality narrative
  const narrative = generateNarrative(scores);
  traitDescs.innerHTML = `
    <div class="narrative-section">
      ${narrative}
    </div>
  `;

  // Radar chart
  drawRadar(scores);
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
  const n = order.length;

  function scoreToR(score) {
    return ((score - 1) / 4) * radius;
  }

  const angleStep = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2;

  // Grid rings
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

  ctx.font = '500 10px Inter, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  for (let ring = 1; ring <= 4; ring++) {
    const r = (ring / 5) * radius;
    const val = 1 + (ring / 5) * 4;
    ctx.fillText(val.toFixed(0), cx + r + 6, cy + 4);
  }
}

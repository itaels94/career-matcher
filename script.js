// ============================================================
// script.js — Controller ראשי של "מה הדרך שלך?"
// מותאם לנשים, כולל תיקון bug לימוד + שמירת PDF
// ============================================================

// ===== State =====
const state = {
  profile: {},
  path: null,
  answers: {},
  questions: [],
  currentIdx: 0,
  scores: null,
  results: null,
  timing: null,
};

// ===== DOM =====
function $(id) { return document.getElementById(id); }

// ===== Screens =====
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  $(id).classList.add('active');
  window.scrollTo(0, 0);
}

// ===== Start =====
function startQuiz() {
  state.questions = buildQuestionList(null);
  state.currentIdx = 0;
  showScreen('quiz');
  renderQuestion();
}

// ===== Render Question =====
function renderQuestion() {
  const q = state.questions[state.currentIdx];
  if (!q) return;

  const total = state.questions.length;
  const current = state.currentIdx + 1;
  const pct = Math.round((state.currentIdx / total) * 100);

  $('progress-fill').style.width = pct + '%';
  $('progress-text').textContent = `${current} מתוך ${total}`;
  $('section-label').textContent = getSectionLabel(q.section);

  const card = $('question-card');
  card.innerHTML = renderQuestionHTML(q);

  restoreAnswer(q);

  $('btn-back').style.display = state.currentIdx === 0 ? 'none' : 'flex';
  updateNextBtn(q);
}

function getSectionLabel(section) {
  const map = {
    profile:     'על עצמך',
    military:    'שירות צבאי',
    background:  'רקע',
    personality: 'אישיות',
    interests:   'תחומי עניין',
    skills:      'כישורים',
    values:      'ערכים',
    future:      'עתיד',
  };
  return map[section] || '';
}

// ===== Render HTML per type =====
function renderQuestionHTML(q) {
  let inputHTML = '';

  if (q.type === 'single') {
    inputHTML = `<div class="options-grid">` +
      q.options.map(opt =>
        `<button class="option-btn" data-value="${opt.value}"
          onclick="selectSingle(this, '${q.id}')">${opt.label}</button>`
      ).join('') +
      `</div>`;
  }

  else if (q.type === 'multi') {
    inputHTML = `<div class="options-grid" id="multi-${q.id}">` +
      q.options.map(opt =>
        `<button class="option-btn" data-value="${opt.value}"
          onclick="selectMulti(this, '${q.id}', ${q.max})">${opt.label}</button>`
      ).join('') +
      `</div>`;
    inputHTML += `<p class="question-hint">בחרי עד ${q.max}</p>`;
  }

  else if (q.type === 'scale') {
    inputHTML = `
      <div class="scale-wrap">
        <div class="scale-buttons">
          ${[1,2,3,4,5].map(n =>
            `<button class="scale-btn" data-value="${n}"
              onclick="selectScale(this, '${q.id}')">${n}</button>`
          ).join('')}
        </div>
        <div class="scale-labels">
          <span class="scale-label-right">${q.min_label}</span>
          <span class="scale-label-left">${q.max_label}</span>
        </div>
      </div>`;
  }

  else if (q.type === 'text') {
    const optional = q.optional
      ? `<span class="optional-tag">אופציונלי</span>`
      : '';
    inputHTML = `
      <textarea class="text-input" id="text-${q.id}"
        placeholder="${q.placeholder || ''}"
        oninput="saveText('${q.id}', this.value)"
        rows="5">${state.answers[q.id] || ''}</textarea>
      ${optional}`;
  }

  return `
    <p class="question-text">${q.text}</p>
    ${inputHTML}
  `;
}

// ===== Selection handlers =====
function selectSingle(btn, qId) {
  const container = btn.closest('.options-grid');
  container.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  state.answers[qId] = btn.dataset.value;

  if (qId === 'P3') {
    state.path = btn.dataset.value;
  }

  updateNextBtn(state.questions[state.currentIdx]);
  setTimeout(() => goNext(), 350);
}

function selectMulti(btn, qId, max) {
  btn.classList.toggle('selected');
  const container = btn.closest('.options-grid');
  const selected = [...container.querySelectorAll('.option-btn.selected')];

  if (selected.length > max) {
    btn.classList.remove('selected');
    return;
  }

  state.answers[qId] = selected.map(b => b.dataset.value);
  updateNextBtn(state.questions[state.currentIdx]);
}

function selectScale(btn, qId) {
  const container = btn.closest('.scale-buttons');
  container.querySelectorAll('.scale-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  state.answers[qId] = Number(btn.dataset.value);
  updateNextBtn(state.questions[state.currentIdx]);
  setTimeout(() => goNext(), 350);
}

function saveText(qId, val) {
  state.answers[qId] = val;
  updateNextBtn(state.questions[state.currentIdx]);
}

// ===== Restore saved answer =====
function restoreAnswer(q) {
  const saved = state.answers[q.id];
  if (!saved) return;

  if (q.type === 'single') {
    document.querySelectorAll(`[data-value="${saved}"]`).forEach(btn => {
      if (btn.classList.contains('option-btn')) btn.classList.add('selected');
    });
  }
  else if (q.type === 'multi' && Array.isArray(saved)) {
    const container = document.getElementById(`multi-${q.id}`);
    if (!container) return;
    saved.forEach(val => {
      const btn = container.querySelector(`[data-value="${val}"]`);
      if (btn) btn.classList.add('selected');
    });
  }
  else if (q.type === 'scale') {
    document.querySelectorAll(`.scale-btn[data-value="${saved}"]`).forEach(btn =>
      btn.classList.add('selected')
    );
  }
}

// ===== Next / Back =====
function updateNextBtn(q) {
  const btn = $('btn-next');
  const autoAdvance = q.type === 'single' || q.type === 'scale';

  if (autoAdvance) {
    btn.style.display = 'none';
  } else {
    btn.style.display = 'flex';
    const isAnswered = isQuestionAnswered(q);
    btn.disabled = !isAnswered;
    btn.textContent = state.currentIdx === state.questions.length - 1
      ? '← קבלי תוצאות'
      : '← מתקדמות';
  }
}

function isQuestionAnswered(q) {
  if (q.optional) return true;
  const ans = state.answers[q.id];
  if (ans === undefined || ans === null || ans === '') return false;
  if (Array.isArray(ans) && ans.length === 0) return false;
  return true;
}

function goNext() {
  const q = state.questions[state.currentIdx];

  // After P3 — rebuild question list with correct path
  if (q.id === 'P3' && state.path) {
    state.questions = buildQuestionList(state.path);
  }

  if (state.currentIdx < state.questions.length - 1) {
    state.currentIdx++;
    renderQuestion();
  } else {
    submitQuiz();
  }
}

function goBack() {
  if (state.currentIdx > 0) {
    state.currentIdx--;
    renderQuestion();
  }
}

// ===== Submit =====
async function submitQuiz() {
  showScreen('loading');
  startLoadingAnimation();

  const scores = calculateScores(state.answers);
  const matches = getRankedMatches(scores);
  state.scores = scores;

  const payload = {
    profile: state.answers,
    path: state.path,
    matches: matches,
    freeText: state.answers['F3'] || '',
    studyWillingness: state.answers['F1'] || 'degree',
  };

  try {
    const API_BASE = window.location.hostname === 'localhost'
      ? ''
      : 'https://career-matcher-server.onrender.com';
    const response = await fetch(API_BASE + '/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error('Server error ' + response.status);
    const data = await response.json();
    state.results = { matches, claude: data };

    await delay(500);
    showTimingScreen();
  } catch (err) {
    console.error(err);
    state.results = { matches, claude: null };
    showTimingScreen();
  }
}

// ===== Timing Screen =====
function showTimingScreen() {
  showScreen('timing');
}

function selectTiming(btn) {
  state.timing = btn.dataset.value;
  renderResults();
}

// ===== Loading animation =====
async function startLoadingAnimation() {
  const steps = [
    { id: 'step-1', label: 'מנתחת רקע וניסיון...' },
    { id: 'step-2', label: 'מחשבת התאמות לפי 15 תחומים...' },
    { id: 'step-3', label: 'יוצרת המלצות אישיות...' },
    { id: 'step-4', label: 'מסיימת...' },
  ];

  const container = $('loading-steps');
  container.innerHTML = steps.map(s =>
    `<div class="loading-step" id="${s.id}">
       <span class="step-icon">⏳</span>
       <span>${s.label}</span>
     </div>`
  ).join('');

  for (let i = 0; i < steps.length; i++) {
    const el = document.getElementById(steps[i].id);
    el.classList.add('active');
    el.querySelector('.step-icon').textContent = '✨';
    await delay(i === 2 ? 2000 : 800);
    el.classList.remove('active');
    el.classList.add('done');
    el.querySelector('.step-icon').textContent = '✓';
  }
}

// ===== Results =====
function renderResults() {
  showScreen('results');
  const { matches, claude } = state.results;

  // Personal insight
  const insightEl = $('insight-text');
  if (claude && claude.personalInsight) {
    insightEl.textContent = claude.personalInsight;
    $('ai-label').style.display = 'flex';
  } else {
    $('insight-card').style.display = 'none';
  }

  // Matches
  const matchesEl = $('matches-container');
  const studyWillingness = state.answers['F1'] || 'degree';

  matchesEl.innerHTML = matches.slice(0, 3).map((m, i) => {
    const career = CAREERS[m.domain];
    if (!career) return '';
    const claudeMatch = claude
      ? (i === 0 ? claude.match1 : i === 1 ? claude.match2 : claude.match3)
      : null;
    return renderMatchCard(m, career, claudeMatch, i === 0, studyWillingness);
  }).join('');

  // Radar chart
  const radarEl = $('radar-container');
  if (radarEl) radarEl.innerHTML = renderRadarChart(state.answers);

  // Animate bars
  setTimeout(() => {
    document.querySelectorAll('.match-bar-fill').forEach(bar => {
      bar.style.width = bar.dataset.pct + '%';
    });
    const firstBody = document.querySelector('.match-body');
    if (firstBody) firstBody.classList.add('open');
  }, 100);

  // WhatsApp — הודעה מפורטת לאיטה
  const WA_NUMBER = '972547074406';
  const waText = encodeURIComponent(buildWAMessage(matches, state.answers, state.path, state.timing));
  const waLink = $('wa-link');
  if (waLink) waLink.href = `https://wa.me/${WA_NUMBER}?text=${waText}`;
}

// ===== Render Match Card =====
function renderMatchCard(match, career, claudeData, isFirst, studyWillingness) {
  // הסבר why — Claude אם קיים, אחרת ניתוח מקומי מהתשובות
  const claudeWhy = claudeData
    ? (isFirst ? claudeData.whyYou : claudeData.brief) || ''
    : '';
  const personalWhy = claudeWhy || generateLocalWhy(career, state.answers);

  const personalHTML = `
    <div class="match-personal-why">
      <span class="match-personal-label">💡 למה זה מתאים לך?</span>
      <p class="match-personal-text">${personalWhy}</p>
    </div>`;

  const warningHTML = (isFirst && claudeData?.warning)
    ? `<div class="match-warning">⚠️ ${claudeData.warning}</div>`
    : '';

  const nextStepHTML = (isFirst && claudeData?.nextStep)
    ? `<div class="match-next">👣 ${claudeData.nextStep}</div>`
    : '';

  const studyHTML = renderLearningSection(career, studyWillingness, isFirst);

  const rolesHTML = `
    <div class="roles-section">
      <div class="roles-label">תפקידים בתחום</div>
      <div class="roles-list">
        ${career.roles.slice(0, isFirst ? 8 : 5).map(r => `<span class="role-tag">${r}</span>`).join('')}
      </div>
    </div>`;

  const chevron = `<span class="match-chevron" id="chevron-${match.domain}">${isFirst ? '▲' : '▼'}</span>`;

  return `
    <div class="match-card" id="card-${match.domain}">
      <div class="match-header" onclick="toggleMatchBody('${match.domain}')">
        <span class="match-icon">${career.icon}</span>
        <div class="match-info">
          <div class="match-name">${career.name}</div>
          <div class="match-tagline">${career.tagline}</div>
        </div>
        <div class="match-score-wrap">
          <div class="match-score">${match.score}<span class="match-pct">%</span></div>
          ${chevron}
        </div>
      </div>
      <div class="match-bar-wrap">
        <div class="match-bar-fill" data-pct="${match.score}" style="width:0%"></div>
      </div>
      <div class="match-body ${isFirst ? 'open' : ''}" id="body-${match.domain}">
        ${personalHTML}
        ${rolesHTML}
        ${studyHTML}
        ${warningHTML}
        ${nextStepHTML}
      </div>
    </div>`;
}

// ===== Learning Section — מותנית ב-F1 =====
function renderLearningSection(career, studyWillingness, isFirst) {
  const l = career.learning;
  if (!l) return '';

  // כרטיסים 2–3: גרסה קומפקטית
  if (!isFirst) {
    const mainPath = (studyWillingness === 'degree' || studyWillingness === 'postgrad')
      ? l.degree
      : l.fast;
    return `
      <div class="study-section study-compact">
        <div class="study-label">כיוון לימוד</div>
        <div class="study-card">
          <div class="study-detail">${mainPath}</div>
          <div class="study-detail" style="margin-top:4px; color:var(--text-soft)">⏱ ${l.time_to_job}</div>
        </div>
      </div>`;
  }

  // כרטיס ראשון — מלא
  if (studyWillingness === 'no_study') {
    return `
      <div class="study-section">
        <div class="study-label">איך להגיע לתחום בלי לימודים ארוכים</div>
        <div class="study-card">
          <div class="study-title">⚡ דרך מהירה</div>
          <div class="study-detail">${l.fast}</div>
        </div>
        <div class="study-card">
          <div class="study-title">💡 אפשר גם עצמאית</div>
          <div class="study-detail">${l.self}</div>
        </div>
        <div class="study-detail" style="margin-top:4px">⏱ זמן עד לעבודה ראשונה: ${l.time_to_job}</div>
      </div>`;
  }

  if (studyWillingness === 'short_course') {
    return `
      <div class="study-section">
        <div class="study-label">כיוון לימוד מוצע</div>
        <div class="study-card">
          <div class="study-title">⚡ ${l.fast}</div>
        </div>
        <div class="study-card">
          <div class="study-title">💡 עצמאית</div>
          <div class="study-detail">${l.self}</div>
        </div>
        <div class="study-detail" style="margin-top:4px">⏱ ${l.time_to_job}</div>
      </div>`;
  }

  return `
    <div class="study-section">
      <div class="study-label">כיוון לימוד מוצע</div>
      <div class="study-card">
        <div class="study-title">🎓 ${l.degree}</div>
      </div>
      ${l.fast ? `<div class="study-card">
        <div class="study-title">⚡ או: ${l.fast}</div>
      </div>` : ''}
      <div class="study-detail" style="margin-top:4px">⏱ ${l.time_to_job} · שכר: ${l.salary_range}</div>
    </div>`;
}

// ===== ניתוח "למה זה מתאים לך" מהתשובות — fallback ללא Claude =====
function generateLocalWhy(career, answers) {
  const domain = career.id;
  const techSkill     = (answers['S1'] || 0) >= 4;
  const commSkill     = (answers['S2'] || 0) >= 4;
  const analyticSkill = (answers['S3'] || 0) >= 4;
  const creativeSkill = (answers['S4'] || 0) >= 4;
  const leaderSkill   = (answers['S5'] || 0) >= 4;
  const likesPeople   = (answers['L1'] || 3) >= 4;
  const satisfaction  = answers['L7'] || '';
  const moneyGoal     = answers['V1'] || '';
  const riskLevel     = answers['L6'] || 3;
  const dreamImpact   = answers['I3'] || '';
  const interests     = [].concat(answers['I2'] || []);
  const hobbies       = [].concat(answers['I1'] || []);
  const future        = answers['F2'] || '';

  const t = {
    tech: [
      techSkill      && 'הציינת שיש לך יכולות טכנולוגיות חזקות — זו נקודת הפתיחה המושלמת לתחום.',
      analyticSkill  && 'החשיבה האנליטית שלך היא יתרון גדול בפיתוח ובניתוח מוצרים.',
      moneyGoal === 'growth' && 'הפוטנציאל הכלכלי שחשוב לך קיים כאן — שכר ההייטק מהגבוהים בישראל.',
    ],
    data_analytics: [
      analyticSkill  && 'ציינת שאת חזקה בחשיבה אנליטית — זה בדיוק ה-DNA של עבודה עם נתונים.',
      satisfaction === 'numbers' && 'הציינת שתוצאות מדידות ומספרים נותנים לך סיפוק — תחום הנתונים בנוי בשבילך.',
      techSkill      && 'היכולות הטכנולוגיות שלך ישרתו אותך נהדר בכלים כמו SQL ו-BI.',
    ],
    healthcare: [
      likesPeople    && 'הציינת שאת פורחת בעבודה עם אנשים — בריאות ורפואה בנויים על הקשר האנושי.',
      satisfaction === 'people' && 'מה שנותן לך סיפוק הוא השפעה על אנשים ספציפיים — זה בדיוק ליבת עבודת הבריאות.',
      dreamImpact === 'health' && 'כתבת שאת רוצה לעשות שינוי בתחום הבריאות — כאן הוא יקרה.',
    ],
    nutrition_wellness: [
      dreamImpact === 'health' && 'הרצון שלך לעשות שינוי בתחום הבריאות ישיר אותך לתחום שמשלב מדע, טיפול ואנשים.',
      likesPeople    && 'אהבת העבודה עם אנשים שציינת — כאן תפגשי מטופלות שבאות לקבל כוח ושינוי.',
      satisfaction === 'people' && 'סיפוק מהשפעה על אנשים ספציפיים? תזונה ורווחה הם בדיוק זה.',
    ],
    psychology_therapy: [
      likesPeople    && 'הציינת שאת פורחת בעבודה עם אנשים — טיפול ופסיכולוגיה הם ייעוד שמחכה לאנשים כמוך.',
      satisfaction === 'people' && 'כשמה שמשמח אותך הוא השפעה על אנשים — אין תחום שנותן את זה יותר מהטיפול הנפשי.',
      commSkill      && 'כישורי התקשורת שלך הם כלי עיקרי בעבודה טיפולית.',
    ],
    education: [
      satisfaction === 'people' && 'הציינת שמה שנותן לך סיפוק הוא השפעה על אנשים — חינוך הוא ההשפעה העמוקה ביותר.',
      leaderSkill    && 'כישורי המנהיגות שלך ישרתו אותך נהדר בהובלת כיתה, קבוצה או תוכנית.',
      dreamImpact === 'education' && 'הרצון לשנות בתחום החינוך — זה לא מקרי, זה כיוון.',
    ],
    social: [
      likesPeople    && 'הציינת שאת פורחת בעבודה עם אנשים — עבודה סוציאלית היא בדיוק זה.',
      satisfaction === 'people' && 'הסיפוק שלך מהשפעה על אנשים ספציפיים יקבל ביטוי מלא בעבודה סוציאלית.',
      dreamImpact === 'social_equality' && 'הרצון שלך לשינוי חברתי ישמש אותך כמנוע בתחום הזה.',
    ],
    business: [
      analyticSkill  && 'החשיבה האנליטית שלך תהיה נכס בכל תפקיד עסקי — מניהול עד אסטרטגיה.',
      satisfaction === 'numbers' && 'תוצאות מדידות — זה בדיוק מה שעסקים מכבדים ומתגמלים.',
      moneyGoal === 'growth' && 'הבנת שכסף גדל עם הוכחת ערך — בעסקים בדיוק כך זה עובד.',
    ],
    marketing_pr: [
      commSkill      && 'כישורי התקשורת והשכנוע שלך הם הנשק הכי חזק בשיווק.',
      creativeSkill  && 'החוש היצירתי שלך הוא בדיוק מה שנדרש ליצירת קמפיינים שנזכרים.',
      likesPeople    && 'שיווק הוא להבין אנשים לעומק — ואת ציינת שאת פורחת בחיבור לאנשים.',
    ],
    creative: [
      creativeSkill  && 'הציינת חוש אסתטי ויצירתיות גבוהה — זהו ה-DNA של תחומי העיצוב והיצירה.',
      satisfaction === 'product' && 'מה שנותן לך סיפוק הוא לראות תוצר שבנית — תחומי היצירה מלאים ברגעים האלו.',
      hobbies.includes('art') && 'הציינת אמנות כתחביב — זה לא במקרה, זה כישרון שאפשר לפתח.',
    ],
    entrepreneurship: [
      riskLevel >= 4 && 'הציינת שאת נוחה עם סיכון — יזמות מתגמלת בדיוק את האנשים שמוכנות להמר על עצמן.',
      moneyGoal === 'own_biz' && 'כתבת שפוטנציאל בעלות על עסק חשוב לך — יזמות היא הדרך הישירה לשם.',
      leaderSkill    && 'כישורי המנהיגות שלך הם אבן הפינה של בניית עסק.',
    ],
    hr_people: [
      likesPeople    && 'הציינת שאת פורחת בעבודה עם אנשים — HR הוא ניהול ההון האנושי שבלבו אנשים.',
      commSkill      && 'כישורי התקשורת שלך מתאימים מצוין לגיוס, ראיונות והכשרות.',
      satisfaction === 'people' && 'הסיפוק מהשפעה על אנשים ספציפיים — ב-HR תראי אנשים גדלים ומצליחים.',
    ],
    law: [
      analyticSkill  && 'החשיבה האנליטית שלך היא כלי חיוני בבניית טיעונים ופתרון בעיות משפטיות.',
      commSkill      && 'כישורי התקשורת שלך יועילו לך בעריכת דין, משא ומתן וייצוג לקוחות.',
      satisfaction === 'numbers' && 'משפטים דורשים דיוק, עובדות וחשיבה סדורה — בדיוק מה שנותן לך סיפוק.',
    ],
    fashion_beauty: [
      creativeSkill  && 'החוש האסתטי שלך הוא הבסיס לכל עבודה בתחומי האופנה והיופי.',
      hobbies.includes('fashion') && 'הציינת אופנה כתחביב — זה לא במקרה, זה כישרון שאפשר לפתח לקריירה.',
      likesPeople    && 'עבודה עם לקוחות, יצירה ואנשים — אופנה ויופי מציעים בדיוק את זה.',
    ],
    events_hospitality: [
      likesPeople    && 'הציינת שאת פורחת עם אנשים — ניהול אירועים ואירוח הוא 100% עבודה עם אנשים.',
      creativeSkill  && 'היצירתיות שלך תבוא לידי ביטוי בכל פרט — מהעיצוב ועד חוויית האורחים.',
      leaderSkill    && 'ניהול אירוע דורש מנהיגות ויכולת לפתור בעיות תחת לחץ — בדיוק מה שיש לך.',
    ],
    science: [
      analyticSkill  && 'החשיבה האנליטית שלך תהפוך לנכס מרכזי בכל תפקיד מחקרי.',
      satisfaction === 'product' && 'הסיפוק שלך מלראות תוצר שבנית — ממצאי מחקר הם בדיוק אותו רגע מרגש.',
      interests.includes('science') && 'ציינת עניין בנושאי מדע — תחום המחקר מחכה לאנשים כמוך.',
    ],
  };

  const msgs = (t[domain] || []).filter(Boolean);
  if (msgs.length >= 2) return msgs.slice(0, 2).join(' ');
  if (msgs.length === 1) return msgs[0] + ' ' + career.description;
  return career.description;
}

// ===== בניית הודעת וואטסאפ מפורטת =====
function buildWAMessage(matches, answers, path, timing) {
  const timingMap = {
    now:       '🔥 מוכנה להתחיל עכשיו',
    months:    '📅 בוחנת אפשרויות לחודשים הקרובים',
    year:      '🗓 מתכננת לשנה הקרובה',
    exploring: '🔍 סקרנית לגלות את האפשרויות שלי',
  };
  const pathMap = {
    A: 'סיום שירות צבאי',
    B: 'סטודנטית שחושבת לשנות כיוון',
    C: 'עובדת ורוצה שינוי',
    D: 'חזרה אחרי הפסקה',
    E: 'מחפשת עבודה ראשונה',
  };
  const ageMap = {
    '18-22': '18–22',
    '23-29': '23–29',
    '30-40': '30–40',
    '40+':   '40+',
  };
  const studyMap = {
    no_study:     'לא רוצה ללמוד — רוצה לעבוד עכשיו',
    short_course: 'מוכנה לקורס קצר (עד שנתיים)',
    degree:       'מוכנה לתואר ראשון',
    postgrad:     'מוכנה לתואר שני ומעלה',
  };
  const envMap = {
    startup:    'סטארטאפ דינמי',
    corp:       'ארגון גדול ויציב',
    freelance:  'עצמאית / פרילנס',
    social_org: 'עמותה / ארגון חברתי',
    own_biz:    'עסק שלה',
  };
  const satisfactionMap = {
    numbers: 'תוצאות מדידות ומספרים',
    people:  'השפעה על אנשים ספציפיים',
    product: 'לראות תוצר שבנתה',
    growth:  'צמיחה כלכלית',
  };
  const futureMap = {
    own_company: 'מנכ"לית / בעלת חברה',
    expert:      'מומחית מוכרת בתחום',
    meaningful:  'עבודה משמעותית שמשנה חיים',
    stable_fam:  'קריירה יציבה ומשפחה',
    creative_own:'אמנית / יוצרת עם קהל',
    senior_mgmt: 'מנהלת בכירה בארגון גדול',
  };

  const topMatches = matches.slice(0, 3)
    .map((m, i) => {
      const name = CAREERS[m.domain]?.name || m.domain;
      return `${i + 1}. ${name} — ${m.score}%`;
    }).join('\n');

  const age        = ageMap[answers['P1']]      ? `גיל: ${ageMap[answers['P1']]}` : '';
  const situation  = pathMap[path]               ? `מצב: ${pathMap[path]}` : '';
  const whyMap = {
    lost:      'לא יודעת מה אני רוצה — מחפשת כיוון',
    validate:  'יש לי רעיון, רוצה אישור או פרספקטיבה',
    check_fit: 'רוצה לדעת אם הנתיב שבחרתי מתאים לי',
    inspire:   'מחפשת השראה ואפשרויות שלא חשבתי עליהן',
  };
  const why        = whyMap[answers['P4']]       ? `למה כאן: ${whyMap[answers['P4']]}` : '';
  const study      = studyMap[answers['F1']]     ? `נכונות ללמוד: ${studyMap[answers['F1']]}` : '';
  const env        = envMap[answers['L3']]       ? `סביבה מועדפת: ${envMap[answers['L3']]}` : '';
  const satisf     = satisfactionMap[answers['L7']] ? `מה נותן סיפוק: ${satisfactionMap[answers['L7']]}` : '';
  const future     = futureMap[answers['F2']]    ? `חלום ל-10 שנים: ${futureMap[answers['F2']]}` : '';
  const freeText   = answers['F3']               ? `"${answers['F3']}"` : '';

  const profileLines = [age, situation, why, study, env, satisf, future].filter(Boolean).join('\n');
  const timingLine   = timingMap[timing] || '';

  return [
    `היי איטה! ${timingLine}`,
    `סיימתי את השאלון "מה הדרך שלך?" 🧭`,
    '',
    `📊 ההתאמות שלי:`,
    topMatches,
    '',
    `👤 על עצמי:`,
    profileLines,
    freeText ? `\n💭 בלי פחד מכישלון: ${freeText}` : '',
    '',
    `אשמח לשוחח 💜`,
  ].filter(l => l !== undefined).join('\n');
}

// ===== Radar Chart (SVG) =====
function renderRadarChart(answers) {
  const cx = 115, cy = 115, r = 80;
  const skills = [
    { label: 'טכנולוגיה',  val: answers['S1'] || 1 },
    { label: 'תקשורת',     val: answers['S2'] || 1 },
    { label: 'אנליזה',     val: answers['S3'] || 1 },
    { label: 'יצירתיות',   val: answers['S4'] || 1 },
    { label: 'מנהיגות',    val: answers['S5'] || 1 },
  ];
  const n = skills.length;

  function pt(i, radius) {
    const angle = (Math.PI * 2 * i / n) - Math.PI / 2;
    return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
  }

  const grid = [1, 2, 3, 4, 5].map(lv => {
    const pts = skills.map((_, i) => { const p = pt(i, (lv / 5) * r); return `${p.x},${p.y}`; });
    const opacity = lv === 5 ? '0.35' : '0.18';
    return `<polygon points="${pts.join(' ')}" fill="none" stroke="#7c5cbf" stroke-width="1" opacity="${opacity}"/>`;
  }).join('');

  const axes = skills.map((_, i) => {
    const p = pt(i, r);
    return `<line x1="${cx}" y1="${cy}" x2="${p.x}" y2="${p.y}" stroke="#c4b0e8" stroke-width="1"/>`;
  }).join('');

  const dataPts = skills.map((s, i) => { const p = pt(i, (s.val / 5) * r); return `${p.x},${p.y}`; }).join(' ');
  const dataPolygon = `<polygon points="${dataPts}" fill="rgba(124,92,191,0.22)" stroke="#7c5cbf" stroke-width="2"/>`;

  const dots = skills.map((s, i) => {
    const p = pt(i, (s.val / 5) * r);
    return `<circle cx="${p.x}" cy="${p.y}" r="4.5" fill="#7c5cbf"/>`;
  }).join('');

  const labels = skills.map((s, i) => {
    const p = pt(i, r + 24);
    return `<text x="${p.x}" y="${p.y}" text-anchor="middle" dominant-baseline="middle"
      font-size="11.5" fill="#2d4a7a" font-weight="600" font-family="Rubik, Arial">${s.label}</text>`;
  }).join('');

  const hasData = skills.some(s => s.val > 1);
  if (!hasData) return '';

  return `
    <div class="radar-wrap">
      <div class="radar-title">הפרופיל שלך</div>
      <svg viewBox="0 0 230 230" xmlns="http://www.w3.org/2000/svg" class="radar-svg">
        ${grid}${axes}${dataPolygon}${dots}${labels}
      </svg>
    </div>`;
}

function toggleMatchBody(domain) {
  const body    = document.getElementById('body-' + domain);
  const chevron = document.getElementById('chevron-' + domain);
  if (!body) return;
  const isOpen = body.classList.toggle('open');
  if (chevron) chevron.textContent = isOpen ? '▲' : '▼';
}

// ===== PDF Save =====
function savePDF() {
  window.print();
}

// ===== Utils =====
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
  showScreen('landing');
});

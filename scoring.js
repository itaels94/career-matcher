// ============================================================
// scoring.js — אלגוריתם ניקוד לתחומי קריירה
// ============================================================

// כל שאלה ממפה תשובות לנקודות בתחומים
// domains: tech, healthcare, business, entrepreneurship, social, education, creative, law, science, security

const WEIGHTS = {

  // ===== נתיב א — צבא =====
  A1: {
    combat:     { entrepreneurship: 2, security: 3 },
    tech:       { tech: 3, law: 2, science: 1 },
    medical:    { healthcare: 5, social: 1 },
    instructor: { education: 4, social: 1 },
    logistics:  { business: 2, tech: 1 },
    admin:      { business: 2, law: 1 },
  },
  A2: { // multi — מחשב כל בחירה
    leading:    { entrepreneurship: 3, education: 2 },
    technical:  { tech: 3, science: 2 },
    helping:    { social: 3, healthcare: 3 },
    physical:   { security: 2 },
    learning:   { science: 2, education: 1 },
    order:      { law: 3, business: 2 },
    creative:   { creative: 3, entrepreneurship: 2 },
    tech_work:  { tech: 3 },
  },
  A3: { // inverse — מה הפריע = מה להוסיף כ"בריחה"
    bureaucracy:  { entrepreneurship: 2 },
    no_autonomy:  { entrepreneurship: 3 },
    repetitive:   { creative: 2, entrepreneurship: 1 },
    no_creative:  { creative: 3 },
    big_team:     { entrepreneurship: 1, science: 1 },
    no_impact:    { social: 3, education: 2 },
  },
  A4: {
    crisis:    { healthcare: 2, security: 2, entrepreneurship: 2 },
    teaching:  { education: 3, social: 1 },
    analysis:  { tech: 3, science: 2, business: 2 },
    technical: { tech: 2, security: 1 },
    comms:     { business: 2, social: 2 },
    logistics: { business: 2 },
    strategy:  { entrepreneurship: 3, business: 2 },
  },
  A5: (val) => { // סקאלה 1-5
    if (val >= 4) return { entrepreneurship: 3, education: 2 };
    if (val <= 2) return { tech: 1, science: 1 };
    return {};
  },
  A6: {
    service:       { social: 2, healthcare: 1 },
    tech_work:     { tech: 2 },
    creative_work: { creative: 3 },
    sales:         { business: 2, entrepreneurship: 1 },
    no: {},
    other_work: {},
  },

  // ===== נתיב ב — סטודנט =====
  B1: {
    tech:     { tech: 2 },
    business: { business: 2 },
    social:   { social: 2 },
    law:      { law: 2 },
    health:   { healthcare: 2 },
    arts:     { creative: 2 },
    education:{ education: 2 },
    other_b:  {},
  },
  B2: { // אין ניקוד ישיר — נשמר ל-Claude prompt
  },
  B3: {
    profession: {}, // ייפתח תחומים חדשים
    method:     {}, // אולי אותו תחום בדרך אחרת
    not_sure_b: {},
  },

  // ===== נתיב ג — עובד ורוצה שינוי =====
  C1: { // bonus על ניסיון קיים
    tech_c:     { tech: 2 },
    business_c: { business: 2 },
    health_c:   { healthcare: 2 },
    edu_c:      { education: 2 },
    creative_c: { creative: 2 },
    service_c:  { social: 1, business: 1 },
    other_c:    {},
  },
  C2: {}, // ניסיון — נשמר ל-Claude
  C3: {
    burnout:     { creative: 1, entrepreneurship: 1 },
    ceiling:     { entrepreneurship: 3, business: 1 },
    low_salary:  { tech: 1, business: 1 },
    no_meaning:  { social: 2, education: 2 },
    new_passion: { creative: 2 },
  },

  // ===== נתיב ד =====
  D1: {}, // נשמר ל-Claude
  D2: {
    flex:    { education: 2, social: 1 },
    meaning: { social: 3, healthcare: 2, education: 2 },
    fresh:   {}, // פתוח
    stable:  { business: 2, healthcare: 1, law: 1 },
  },

  // ===== נתיב ה =====
  E1: {
    talking:    { business: 3, social: 2, law: 2 },
    making:     { tech: 2, creative: 3 },
    helping:    { social: 3, healthcare: 3, education: 2 },
    organizing: { business: 2, education: 1 },
    analyzing:  { tech: 2, science: 3, business: 2 },
    learning:   { science: 2, tech: 1 },
  },

  // ===== ליבה — אישיות =====
  L1: (val) => { // introvert ←→ extrovert
    if (val <= 2) return { tech: 3, science: 2, creative: 1 };
    if (val >= 4) return { social: 3, education: 2, business: 2, healthcare: 2 };
    return {};
  },
  L2: {
    research:   { science: 2, business: 2, law: 2 },
    intuition:  { entrepreneurship: 2, creative: 2 },
    consult:    { social: 2, education: 2 },
    analyze:    { business: 3, tech: 2, law: 2 },
  },
  L3: {
    startup:    { tech: 3, entrepreneurship: 3 },
    corp:       { business: 2, healthcare: 2, law: 2 },
    freelance:  { creative: 3, entrepreneurship: 2 },
    social_org: { social: 3, education: 2 },
    own_biz:    { entrepreneurship: 4 },
  },
  L4: (val) => { // routine
    if (val <= 2) return { entrepreneurship: 2, creative: 2 };
    if (val >= 4) return { business: 2, law: 2, healthcare: 2 };
    return {};
  },
  L5: (val) => { // team
    if (val <= 2) return { science: 2, tech: 1, creative: 1 };
    if (val >= 4) return { social: 2, education: 2, healthcare: 1 };
    return {};
  },
  L6: (val) => { // risk
    if (val <= 2) return { business: 2, healthcare: 2, law: 1 };
    if (val >= 4) return { entrepreneurship: 4, tech: 1 };
    return {};
  },
  L7: {
    numbers:  { business: 3, tech: 2, science: 2 },
    people:   { social: 3, healthcare: 2, education: 2 },
    product:  { tech: 2, creative: 2, entrepreneurship: 1 },
    growth:   { entrepreneurship: 3, business: 2 },
  },

  // ===== עניין =====
  I1: {
    read_learn: { science: 3, tech: 2 },
    create:     { creative: 3, tech: 1 },
    sport:      { healthcare: 2, security: 1 },
    socialize:  { social: 2, business: 1, education: 1 },
    games:      { tech: 2, science: 1 },
    art:        { creative: 3 },
    business_h: { entrepreneurship: 3, business: 2 },
    volunteer:  { social: 3, education: 1 },
  },
  I2: {
    tech_sci:   { tech: 3, science: 2 },
    psychology: { social: 3, education: 2, healthcare: 1 },
    money_eco:  { business: 3, entrepreneurship: 2 },
    art_design: { creative: 3 },
    law_pol:    { law: 3, business: 1 },
    health_med: { healthcare: 3 },
    education_i:{ education: 3 },
    security:   { security: 3, law: 1 },
  },
  I3: {
    tech_change: { tech: 3, entrepreneurship: 2 },
    help_people: { social: 3, healthcare: 2, education: 2 },
    build_biz:   { entrepreneurship: 4, business: 2 },
    educate:     { education: 4, social: 1 },
    heal:        { healthcare: 4 },
    protect:     { security: 3, law: 2 },
    create_art:  { creative: 4 },
  },
  I4: (val) => { // realistic ←→ artistic
    if (val <= 2) return { tech: 2, security: 2 };
    if (val >= 4) return { creative: 3, business: 1 };
    return {};
  },
  I5: {
    numbers_l:  { tech: 3, business: 3, science: 3 },
    words:      { law: 3, education: 2, creative: 2, business: 1 },
    visual:     { creative: 3 },
    people_l:   { social: 3, healthcare: 2, education: 2 },
  },

  // ===== כישורים =====
  S1: (val) => { // tech skills
    if (val >= 4) return { tech: 3, business: 1, science: 1 };
    if (val <= 2) return {};
    return { tech: 1 };
  },
  S2: (val) => { // communication
    if (val >= 4) return { business: 3, law: 2, education: 2, entrepreneurship: 2 };
    return {};
  },
  S3: (val) => { // analytical
    if (val >= 4) return { business: 3, tech: 2, science: 2, law: 2 };
    return {};
  },
  S4: (val) => { // creative/aesthetic
    if (val >= 4) return { creative: 3, business: 1 };
    return {};
  },
  S5: (val) => { // leadership
    if (val >= 4) return { entrepreneurship: 3, education: 2 };
    return {};
  },

  // ===== ערכים =====
  V1: {
    stable_salary:  { business: 2, healthcare: 2, law: 1 },
    growing_salary: { tech: 2, business: 2, entrepreneurship: 1 },
    own_business:   { entrepreneurship: 4, business: 1 },
    not_money:      { social: 3, education: 2, science: 1 },
  },
  V2: (val) => { // stability ←→ excitement
    if (val <= 2) return { business: 2, law: 2, healthcare: 2 };
    if (val >= 4) return { entrepreneurship: 3, tech: 1 };
    return {};
  },
  V3: {
    fixed_hours:  { education: 2, law: 1 },
    flex_hours:   { tech: 1, creative: 1 },
    all_in:       { entrepreneurship: 2, tech: 1 },
    no_choice:    {}, // neutral
  },
  V4: {
    help_specific: { social: 3, healthcare: 3, education: 2 },
    mass_impact:   { tech: 3, entrepreneurship: 3 },
    expertise:     { science: 3, healthcare: 2, law: 2 },
    org_lead:      { entrepreneurship: 3, business: 2 },
    creative_rec:  { creative: 4 },
  },
  V5: (val) => { // ambiguity tolerance
    if (val <= 2) return { tech: 1, business: 1, healthcare: 1 };
    if (val >= 4) return { entrepreneurship: 2, science: 2, creative: 1 };
    return {};
  },

  // ===== עתיד =====
  F1: {
    no_study:     { tech: 2, business: 2, entrepreneurship: 2 }, // bootcamp paths
    short_course: { tech: 2, creative: 2, healthcare: 1 },
    degree:       {}, // neutral — all paths
    postgrad:     { science: 3, law: 2, healthcare: 2 },
  },
  F2: {
    own_company:  { entrepreneurship: 4, business: 2 },
    expert:       { science: 3, healthcare: 2, law: 2, tech: 2 },
    meaningful:   { social: 3, healthcare: 2, education: 2 },
    stable_fam:   { business: 2, healthcare: 2, education: 1 },
    creative_own: { creative: 4 },
    senior_mgmt:  { business: 3, tech: 1, entrepreneurship: 1 },
  },
  // F3 — free text, נשלח ל-Claude, לא נשקל באלגוריתם
};

// ============================================================
// פונקציית הניקוד הראשית
// ============================================================

function calculateScores(answers) {
  const scores = {
    tech: 0, healthcare: 0, business: 0, entrepreneurship: 0,
    social: 0, education: 0, creative: 0, law: 0, science: 0, security: 0
  };

  for (const [qId, answer] of Object.entries(answers)) {
    const weightDef = WEIGHTS[qId];
    if (!weightDef) continue;

    let additions = {};

    if (typeof weightDef === 'function') {
      // סקאלה — מעבירים את הערך הנומרי
      additions = weightDef(Number(answer)) || {};
    } else if (Array.isArray(answer)) {
      // multi-select
      for (const choice of answer) {
        const w = weightDef[choice];
        if (!w) continue;
        for (const [domain, pts] of Object.entries(w)) {
          additions[domain] = (additions[domain] || 0) + pts;
        }
      }
    } else {
      // single select
      additions = weightDef[answer] || {};
    }

    for (const [domain, pts] of Object.entries(additions)) {
      scores[domain] += pts;
    }
  }

  return scores;
}

// נרמול 0-100 ומיון
function getRankedMatches(scores) {
  const max = Math.max(...Object.values(scores));
  if (max === 0) return [];

  return Object.entries(scores)
    .map(([domain, score]) => ({
      domain,
      score: Math.round((score / max) * 100),
      raw: score,
    }))
    .filter(m => m.score >= 30)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

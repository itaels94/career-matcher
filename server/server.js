// ============================================================
// server.js — Backend: Claude API + Rate Limiting
// מותאם לנשים + הסבר WHY על בסיס תשובות ספציפיות
// ============================================================
const express   = require('express');
const cors      = require('cors');
const path      = require('path');
const rateLimit = require('express-rate-limit');
const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const app    = express();
const PORT   = process.env.PORT || 3000;
const client = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY });

app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));

app.use('/api/', rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: 'יותר מדי בקשות. נסי שוב בעוד שעה.' },
}));

// ===== POST /api/analyze =====
app.post('/api/analyze', async (req, res) => {
  const { profile, path, matches, freeText, studyWillingness } = req.body;
  if (!matches || matches.length === 0) {
    return res.status(400).json({ error: 'No matches data' });
  }

  try {
    const prompt = buildPrompt(profile, path, matches, freeText, studyWillingness);

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1200,
      system: `את יועצת קריירה מנוסה לנשים ישראליות בנקודות מפנה בחיים שלהן.
את מדברת בעברית שוטפת, בגוף שני נקבה (את, שלך, תגיעי), בצורה חמה וישירה — לא פטרנליסטית.
המטרה שלך: לגרום לאישה לראות את עצמה — "כן, זה אני!" — ולהבין למה ההמלצה נכונה לה ספציפית.
תמיד מחזירה JSON תקני בלבד, ללא טקסט נוסף.

JSON format:
{
  "personalInsight": "פסקה קצרה — מי האישה הזו, מה מניע אותה, מה החוזקות שלה (2-3 משפטים בגוף שני נקבה)",
  "match1": {
    "domain": "שם התחום",
    "score": 87,
    "whyYou": "הסבר אישי ומדויק: למה ספציפית ההתאמה הזו נכונה לה — חייב להתייחס לדברים שהיא ציינה בשאלון (2-3 משפטים)",
    "warning": "דבר אחד שכדאי לדעת לפני שמחליטות — משפט אחד",
    "nextStep": "צעד אחד קטן ומעשי שאפשר לעשות השבוע — משפט אחד"
  },
  "match2": {
    "domain": "שם התחום",
    "score": 74,
    "brief": "2 משפטים — למה זו גם אפשרות טובה עבורה"
  },
  "match3": {
    "domain": "שם התחום",
    "score": 68,
    "brief": "2 משפטים — למה זו גם אפשרות טובה עבורה"
  }
}`,
      messages: [{ role: 'user', content: prompt }],
    });

    const raw = message.content[0].text.trim();
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');

    const parsed = JSON.parse(jsonMatch[0]);
    res.json(parsed);

  } catch (err) {
    console.error('Claude API error:', err.message);
    res.status(500).json({ error: 'שגיאה בניתוח. הוצג מידע בסיסי.' });
  }
});

// ===== Build Prompt =====
function buildPrompt(profile, path, matches, freeText, studyWillingness) {

  const pathLabels = {
    A: 'סיום שירות צבאי',
    B: 'סטודנטית שחושבת לשנות כיוון',
    C: 'עובדת שרוצה שינוי',
    D: 'חזרה אחרי הפסקה',
    E: 'מחפשת עבודה ראשונה',
  };

  const studyLabels = {
    no_study:     'לא מוכנה ללמוד — רוצה לעבוד עכשיו',
    short_course: 'מוכנה עד שנתיים (קורס / דיפלומה)',
    degree:       'מוכנה לתואר ראשון (3–4 שנים)',
    postgrad:     'מוכנה לתואר שני ומעלה',
  };

  const workEnvLabels = {
    startup:   'סטארטאפ דינמי',
    corp:      'ארגון גדול ויציב',
    freelance: 'עצמאית / פרילנס',
    social_org:'עמותה / ארגון חברתי',
    own_biz:   'עסק שלה',
  };

  const satisfactionLabels = {
    numbers:  'תוצאות מדידות ומספרים',
    people:   'השפעה על אנשים ספציפיים',
    product:  'לראות תוצר שבנתה',
    growth:   'הצמיחה הכלכלית שלה',
  };

  const futureLabels = {
    own_company: 'מנכ"לית / בעלת חברה',
    expert:      'מומחית מוכרת בתחום',
    meaningful:  'עבודה משמעותית שמשנה חיים',
    stable_fam:  'קריירה יציבה ומשפחה',
    creative_own:'אמנית / יוצרת עם קהל',
    senior_mgmt: 'מנהלת בכירה בארגון גדול',
  };

  // איסוף תשובות רלוונטיות
  const situation    = pathLabels[path] || 'לא ידוע';
  const age          = profile['P1'] || 'לא צוין';
  const whyHere      = profile['P4'] || 'לא צוין';
  const study        = studyLabels[studyWillingness] || 'לא ידוע';
  const workEnv      = workEnvLabels[profile['L3']] || '';
  const satisfaction = satisfactionLabels[profile['L7']] || '';
  const future       = futureLabels[profile['F2']] || '';
  const moneyGoal    = profile['V1'] || '';
  const riskLevel    = profile['L6'] ? `סקאלת סיכון: ${profile['L6']}/5` : '';
  const energySource = profile['L1'] ? (profile['L1'] <= 2 ? 'מעדיפה עבודה עצמאית ושקטה' : profile['L1'] >= 4 ? 'פורחת בעבודה עם אנשים' : 'גמישה בין עצמאי לצוות') : '';

  // תחומי עניין
  const interests    = [].concat(profile['I2'] || []).join(', ');
  const hobbies      = [].concat(profile['I1'] || []).join(', ');
  const dreamImpact  = profile['I3'] || '';

  // רקע צבאי (אם רלוונטי)
  let militaryContext = '';
  if (path === 'A') {
    const role  = profile['A1'] || '';
    const liked = [].concat(profile['A2'] || []).join(', ');
    const skills= [].concat(profile['A4'] || []).join(', ');
    militaryContext = `
תפקיד צבאי: ${role}
מה אהבה בצבא: ${liked}
כישורים שפיתחה: ${skills}`;
  }

  // כישורים בולטים
  const skillsContext = [
    profile['S1'] >= 4 ? 'יכולות טכנולוגיות גבוהות' : '',
    profile['S2'] >= 4 ? 'כישורי תקשורת ושכנוע מצוינים' : '',
    profile['S3'] >= 4 ? 'חשיבה אנליטית חזקה' : '',
    profile['S4'] >= 4 ? 'חוש אסתטי ויצירתיות גבוהה' : '',
    profile['S5'] >= 4 ? 'כישורי מנהיגות ברורים' : '',
  ].filter(Boolean).join(', ');

  const top3 = matches.slice(0, 3).map((m, i) =>
    `${i + 1}. ${m.domain} — ${m.score}% התאמה`
  ).join('\n');

  return `
פרטים על האישה שמולנו:
- גיל: ${age}
- מצב: ${situation}
- למה הגיעה: ${whyHere}
- נכונות ללמוד: ${study}
${militaryContext}

מה חשוב לה:
- סביבת עבודה רצויה: ${workEnv}
- מה נותן לה סיפוק: ${satisfaction}
- איפה רוצה להיות בעוד 10 שנים: ${future}
- יחס לכסף: ${moneyGoal}
- ${riskLevel}
- ${energySource}

תחומי עניין: ${interests}
תחביבים: ${hobbies}
השינוי שרוצה לעשות בעולם: ${dreamImpact}

כישורים בולטים: ${skillsContext || 'לא צוינו בצורה בולטת'}

ההתאמות שהאלגוריתם חישב:
${top3}

${freeText ? `בלי פחד מכישלון, היא אמרה: "${freeText}"` : ''}

חשוב מאוד: ב-whyYou של match1 — הסבירי למה ספציפית ההתאמה נכונה לה על בסיס הדברים שציינה.
לדוגמה: אם היא ציינה שאוהבת לעזור לאנשים ומחפשת משמעות, וההתאמה הראשונה היא Healthcare — חברי בין הדברים.
כתבי JSON בלבד.
  `.trim();
}

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

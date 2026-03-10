// ============================================================
// questions.js — כל השאלות של "מה הדרך שלך?"
// מותאם לנשים בלבד
// ============================================================

// סוגי שאלות:
// 'single'   — כפתור אחד בבחירה
// 'scale'    — סקאלה 1-5
// 'multi'    — checkbox, max: N
// 'text'     — שדה טקסט חופשי (אופציונלי)

const QUESTIONS = [

  // ===== פרופיל =====
  {
    id: 'P1', path: 'profile', section: 'profile',
    text: 'כמה את בת?',
    type: 'single',
    options: [
      { value: '18-22', label: '18–22' },
      { value: '23-29', label: '23–29' },
      { value: '30-40', label: '30–40' },
      { value: '40+',   label: '40+' },
    ]
  },
  {
    id: 'P3', path: 'profile', section: 'profile',
    text: 'מה המצב שלך כיום?',
    type: 'single',
    options: [
      { value: 'A', label: 'סיימתי צבא ומחפשת כיוון' },
      { value: 'B', label: 'סטודנטית שחושבת לשנות כיוון' },
      { value: 'C', label: 'עובדת ומחפשת שינוי' },
      { value: 'D', label: 'חזרה אחרי הפסקה (ילדים, בריאות, אחר)' },
      { value: 'E', label: 'מחפשת עבודה ראשונה, ללא ניסיון' },
    ]
  },
  {
    id: 'P4', path: 'profile', section: 'profile',
    text: 'מה הביא אותך לכאן?',
    type: 'single',
    options: [
      { value: 'lost',      label: 'לא יודעת מה אני רוצה — מחפשת כיוון' },
      { value: 'validate',  label: 'יש לי רעיון, רוצה אישור או פרספקטיבה' },
      { value: 'check_fit', label: 'רוצה לדעת אם הנתיב שבחרתי מתאים לי' },
      { value: 'inspire',   label: 'מחפשת השראה ואפשרויות שלא חשבתי עליהן' },
    ]
  },
  {
    id: 'P5', path: 'profile', section: 'profile',
    text: 'מה הרמה האקדמית שלך?',
    type: 'single',
    options: [
      { value: 'highschool', label: 'תיכון / בגרות' },
      { value: 'diploma',    label: 'דיפלומה / הנדסאית' },
      { value: 'degree',     label: 'תואר ראשון' },
      { value: 'postgrad',   label: 'תואר שני ומעלה' },
    ]
  },

  // ===== נתיב א — אחרי צבא =====
  {
    id: 'A1', path: 'A', section: 'military',
    text: 'מה היה תפקידך בצבא?',
    type: 'single',
    options: [
      { value: 'combat',    label: 'קרבית (חי"ר, שריון, צנחנים...)' },
      { value: 'tech',      label: 'טכנולוגיה / מודיעין / סייבר' },
      { value: 'medical',   label: 'רפואי (חובשת, אח"מ, רפואה)' },
      { value: 'instructor',label: 'מדריכה' },
      { value: 'logistics', label: 'לוגיסטיקה / תחזוקה' },
      { value: 'admin',     label: 'מנהלתי / מטה' },
    ]
  },
  {
    id: 'A2', path: 'A', section: 'military',
    text: 'מה הכי אהבת בשירות? (עד 2)',
    type: 'multi', max: 2,
    options: [
      { value: 'leading',   label: 'להוביל ולקבל החלטות' },
      { value: 'technical', label: 'לפתור בעיות טכניות' },
      { value: 'helping',   label: 'לעזור לאחרות' },
      { value: 'physical',  label: 'האתגר הפיזי והמשימות' },
      { value: 'learning',  label: 'ללמוד דברים חדשים' },
      { value: 'order',     label: 'הסדר והמבנה הברור' },
      { value: 'creative',  label: 'פתרונות יצירתיים' },
      { value: 'tech_work', label: 'עבודה עם טכנולוגיה' },
    ]
  },
  {
    id: 'A3', path: 'A', section: 'military',
    text: 'מה הכי הפריע לך? (עד 2)',
    type: 'multi', max: 2,
    options: [
      { value: 'bureaucracy', label: 'הביורוקרטיה והנהלים' },
      { value: 'no_autonomy', label: 'חוסר חופש ואוטונומיה' },
      { value: 'repetitive',  label: 'חזרה על אותן משימות' },
      { value: 'no_creative', label: 'חוסר יצירתיות' },
      { value: 'big_team',    label: 'עבודה בצוות גדול' },
      { value: 'no_impact',   label: 'תחושת חוסר השפעה' },
    ]
  },
  {
    id: 'A4', path: 'A', section: 'military',
    text: 'אילו כישורים פיתחת? (עד 3)',
    type: 'multi', max: 3,
    options: [
      { value: 'crisis',    label: 'ניהול לחץ ומשברים' },
      { value: 'teaching',  label: 'הדרכה והוראה' },
      { value: 'analysis',  label: 'ניתוח מידע' },
      { value: 'technical', label: 'תחזוקה טכנית' },
      { value: 'comms',     label: 'תקשורת בינאישית' },
      { value: 'logistics', label: 'ארגון ולוגיסטיקה' },
      { value: 'strategy',  label: 'חשיבה אסטרטגית' },
    ]
  },
  {
    id: 'A5', path: 'A', section: 'military',
    text: 'מה רמת האחריות שלך הייתה?',
    type: 'scale',
    min_label: 'ביצועית בלבד — עקבתי אחרי פקודות',
    max_label: 'ניהלתי יחידה / מערכת גדולה',
  },
  {
    id: 'A6', path: 'A', section: 'military',
    text: 'עבדת בצד במהלך השירות? (קייטנה, מכירות...)',
    type: 'single',
    options: [
      { value: 'no',           label: 'לא' },
      { value: 'service',      label: 'כן — שירות / אנשים' },
      { value: 'tech_work',    label: 'כן — טכנולוגיה / מחשבים' },
      { value: 'creative_work',label: 'כן — יצירה / עיצוב / מוזיקה' },
      { value: 'sales',        label: 'כן — מכירות / שיווק' },
      { value: 'other_work',   label: 'כן — אחר' },
    ]
  },

  // ===== נתיב ב — סטודנטית שחושבת לשנות =====
  {
    id: 'B1', path: 'B', section: 'background',
    text: 'מה את לומדת כיום?',
    type: 'single',
    options: [
      { value: 'tech',     label: 'מדמ"ח / הנדסה / מדעים' },
      { value: 'business', label: 'כלכלה / עסקים / מנהל' },
      { value: 'social',   label: 'מדעי חברה / פסיכולוגיה / תקשורת' },
      { value: 'law',      label: 'משפטים' },
      { value: 'health',   label: 'רפואה / סיעוד / בריאות' },
      { value: 'arts',     label: 'אמנות / עיצוב / מוזיקה' },
      { value: 'education',label: 'חינוך / הוראה' },
      { value: 'other_b',  label: 'אחר' },
    ]
  },
  {
    id: 'B2', path: 'B', section: 'background',
    text: 'מה הסיבה שאת חושבת לשנות?',
    type: 'single',
    options: [
      { value: 'wrong_field', label: 'הבנתי שזה לא בשבילי' },
      { value: 'no_jobs',     label: 'אין עבודות טובות בתחום' },
      { value: 'no_passion',  label: 'חסרה לי תשוקה ללימודים' },
      { value: 'salary',      label: 'רוצה פוטנציאל שכר גבוה יותר' },
      { value: 'explore',     label: 'פשוט רוצה לגלות מה קיים' },
    ]
  },
  {
    id: 'B3', path: 'B', section: 'background',
    text: 'האם הבעיה היא המקצוע, או איך למדת אותו?',
    type: 'single',
    options: [
      { value: 'profession',  label: 'המקצוע עצמו לא מתאים לי' },
      { value: 'method',      label: 'הנושא בסדר, אבל הלימוד לא מתאים לי' },
      { value: 'not_sure_b',  label: 'לא בטוחה' },
    ]
  },

  // ===== נתיב ג — עובדת ורוצה שינוי =====
  {
    id: 'C1', path: 'C', section: 'background',
    text: 'באיזה תחום עבדת עד היום?',
    type: 'single',
    options: [
      { value: 'tech_c',    label: 'טכנולוגיה / הייטק' },
      { value: 'business_c',label: 'עסקים / מכירות / שיווק' },
      { value: 'health_c',  label: 'בריאות / רפואה' },
      { value: 'edu_c',     label: 'חינוך / הדרכה' },
      { value: 'creative_c',label: 'יצירה / עיצוב / מדיה' },
      { value: 'service_c', label: 'שירות לקוחות / אירוח' },
      { value: 'other_c',   label: 'אחר' },
    ]
  },
  {
    id: 'C2', path: 'C', section: 'background',
    text: 'מה הסיבה שאת רוצה לשנות?',
    type: 'single',
    options: [
      { value: 'burnout',     label: 'שחיקה — עייפתי מהתחום' },
      { value: 'ceiling',     label: 'גג זכוכית — אין לאן לגדול' },
      { value: 'low_salary',  label: 'שכר נמוך מדי' },
      { value: 'no_meaning',  label: 'חסרה לי משמעות' },
      { value: 'new_passion', label: 'יש לי תשוקה חדשה שרוצה לרדוף אחריה' },
    ]
  },
  {
    id: 'C3', path: 'C', section: 'background',
    text: 'את מוכנה לחזור ולהתחיל מהתחלה?',
    type: 'single',
    options: [
      { value: 'yes_start',  label: 'כן — אני מוכנה ללמוד מחדש' },
      { value: 'partial',    label: 'רק אם זה לא יקח יותר מדי זמן' },
      { value: 'transfer',   label: 'מעדיפה להשתמש בניסיון הקיים' },
    ]
  },

  // ===== נתיב ד — חזרה אחרי הפסקה =====
  {
    id: 'D1', path: 'D', section: 'background',
    text: 'כמה שנים את בהפסקה?',
    type: 'single',
    options: [
      { value: '1-2',  label: '1–2 שנים' },
      { value: '3-5',  label: '3–5 שנים' },
      { value: '5+',   label: 'יותר מ-5 שנים' },
    ]
  },
  {
    id: 'D2', path: 'D', section: 'background',
    text: 'מה השתנה עבורך מבחינת עדיפויות?',
    type: 'single',
    options: [
      { value: 'flex',    label: 'גמישות שעות חשובה לי עכשיו' },
      { value: 'meaning', label: 'אני מחפשת משמעות, לא רק שכר' },
      { value: 'fresh',   label: 'רוצה להתחיל בתחום חדש לחלוטין' },
      { value: 'stable',  label: 'בעיקר יציבות וביטחון תעסוקתי' },
    ]
  },

  // ===== נתיב ה — ללא ניסיון =====
  {
    id: 'E1', path: 'E', section: 'background',
    text: 'מה את טובה בו מטבע הדברים? (עד 2)',
    type: 'multi', max: 2,
    options: [
      { value: 'talking',   label: 'לדבר, לשכנע, לתקשר' },
      { value: 'making',    label: 'לבנות, ליצור, לעצב' },
      { value: 'helping',   label: 'לעזור לאנשים' },
      { value: 'organizing',label: 'לארגן ולתכנן' },
      { value: 'analyzing', label: 'לחשוב, לנתח, לפתור בעיות' },
      { value: 'learning',  label: 'ללמוד דברים חדשים במהירות' },
    ]
  },

  // ===== שאלות ליבה — כולן =====
  {
    id: 'L1', path: 'all', section: 'personality',
    text: 'מה נותן לך יותר אנרגיה?',
    type: 'scale',
    min_label: 'עבודה שקטה לבד, להתעמק',
    max_label: 'עבודה עם אנשים, שיחות, קשרים',
  },
  {
    id: 'L2', path: 'all', section: 'personality',
    text: 'כשאת צריכה לקבל החלטה חשובה, את...',
    type: 'single',
    options: [
      { value: 'research',  label: 'אוספת מידע לפני הכל' },
      { value: 'intuition', label: 'סומכת על האינטואיציה' },
      { value: 'consult',   label: 'מתייעצת עם אנשים שאני סומכת עליהם' },
      { value: 'analyze',   label: 'מנתחת יתרונות וחסרונות' },
    ]
  },
  {
    id: 'L3', path: 'all', section: 'personality',
    text: 'איזו סביבת עבודה הכי מתאימה לך?',
    type: 'single',
    options: [
      { value: 'startup',   label: 'סטארטאפ קטן, הרבה שינויים' },
      { value: 'corp',      label: 'ארגון גדול ויציב' },
      { value: 'freelance', label: 'עצמאית / פרילנס' },
      { value: 'social_org',label: 'עמותה / ארגון חברתי' },
      { value: 'own_biz',   label: 'עסק שלי' },
    ]
  },
  {
    id: 'L4', path: 'all', section: 'personality',
    text: 'מה את מרגישה לגבי שגרה יומיומית?',
    type: 'scale',
    min_label: 'שגרה הורגת אותי — אני צריכה גיוון תמידי',
    max_label: 'שגרה נותנת לי ביטחון ויעילות',
  },
  {
    id: 'L5', path: 'all', section: 'personality',
    text: 'כמה חשוב לך לעבוד בצוות?',
    type: 'scale',
    min_label: 'מעדיפה לעבוד לבד',
    max_label: 'אני פורחת בתוך צוות',
  },
  {
    id: 'L6', path: 'all', section: 'personality',
    text: 'מה גישתך לסיכון מקצועי?',
    type: 'scale',
    min_label: 'מעדיפה וודאות גם אם הרווח נמוך',
    max_label: 'מוכנה לסכן הכל למען פוטנציאל גבוה',
  },
  {
    id: 'L7', path: 'all', section: 'personality',
    text: 'מה ייתן לך את הסיפוק הגדול ביותר בעבודה?',
    type: 'single',
    options: [
      { value: 'numbers',  label: 'תוצאות מדידות — נתונים, מספרים' },
      { value: 'people',   label: 'השפעה על אנשים ספציפיים' },
      { value: 'product',  label: 'לראות תוצר שבניתי' },
      { value: 'growth',   label: 'הצמיחה הכלכלית שלי' },
    ]
  },

  // ===== עניין =====
  {
    id: 'I1', path: 'all', section: 'interests',
    text: 'מה את עושה בזמן הפנוי כשאת הכי מאושרת? (עד 3)',
    type: 'multi', max: 3,
    options: [
      { value: 'read_learn',label: 'קוראת, לומדת — מדע, טכנולוגיה, היסטוריה' },
      { value: 'create',    label: 'בונה / יוצרת משהו' },
      { value: 'sport',     label: 'מתאמנת, ספורט, פעילות גופנית' },
      { value: 'socialize', label: 'מבלה עם אנשים, אירועים' },
      { value: 'games',     label: 'משחקי וידאו / שחמט / אסטרטגיה' },
      { value: 'art',       label: 'מנגנת / מצייר / כותבת' },
      { value: 'business_h',label: 'עושה עסקים קטנים, מוכרת' },
      { value: 'volunteer', label: 'מסייעת לאחרות, מתנדבת' },
    ]
  },
  {
    id: 'I2', path: 'all', section: 'interests',
    text: 'אילו נושאים גורמים לך לשכוח את הזמן? (עד 2)',
    type: 'multi', max: 2,
    options: [
      { value: 'tech_sci',   label: 'טכנולוגיה, AI, מדע' },
      { value: 'psychology', label: 'פסיכולוגיה ואנשים' },
      { value: 'money_eco',  label: 'כסף, השקעות, כלכלה' },
      { value: 'art_design', label: 'אמנות, עיצוב, מוזיקה' },
      { value: 'law_pol',    label: 'חוק, פוליטיקה, חברה' },
      { value: 'health_med', label: 'בריאות, גוף, מדע הרפואה' },
      { value: 'education_i',label: 'חינוך, ילדים, הוראה' },
      { value: 'beauty_fas', label: 'יופי, אופנה, סגנון חיים' },
      { value: 'food_nutr',  label: 'אוכל, תזונה, בישול' },
    ]
  },
  {
    id: 'I3', path: 'all', section: 'interests',
    text: 'איזה שינוי בעולם הכי היית רוצה לעשות?',
    type: 'single',
    options: [
      { value: 'tech_change',  label: 'לפתח טכנולוגיה שמשנה חיים' },
      { value: 'help_people',  label: 'לעזור לאנשים פגיעים' },
      { value: 'build_biz',    label: 'לבנות עסק מצליח ולהעסיק אנשים' },
      { value: 'educate',      label: 'לחנך דור חדש' },
      { value: 'heal',         label: 'לרפא ולשפר איכות חיים' },
      { value: 'empower',      label: 'לחזק ולהעצים נשים' },
      { value: 'create_art',   label: 'ליצור יופי ולהשפיע תרבותית' },
    ]
  },
  {
    id: 'I4', path: 'all', section: 'interests',
    text: 'מה יותר מושך אותך?',
    type: 'scale',
    min_label: 'לבנות, לתקן, לעבוד עם ידיים וכלים',
    max_label: 'ליצור, לבטא, לעצב, לשכנע',
  },
  {
    id: 'I5', path: 'all', section: 'interests',
    text: 'עם מה את מסתדרת הכי טוב?',
    type: 'single',
    options: [
      { value: 'numbers_l',  label: 'מספרים, נתונים, קוד, לוגיקה' },
      { value: 'words',      label: 'מילים, שפה, תקשורת, שכנוע' },
      { value: 'visual',     label: 'תמונות, צבע, צורות, מרחב' },
      { value: 'people_l',   label: 'אנשים, רגשות, דינמיקה קבוצתית' },
    ]
  },

  // ===== כישורים =====
  {
    id: 'S1', path: 'all', section: 'skills',
    text: 'כמה נוח לך עם טכנולוגיה ומחשבים?',
    type: 'scale',
    min_label: 'בקושי משתמשת במחשב',
    max_label: 'קידוד, ניתוח נתונים, מנהלת מערכות',
  },
  {
    id: 'S2', path: 'all', section: 'skills',
    text: 'כמה את טובה בתקשורת ושכנוע?',
    type: 'scale',
    min_label: 'מעדיפה לכתוב ולא לדבר',
    max_label: 'מצוינת בהרצאות, משא ומתן, מכירות',
  },
  {
    id: 'S3', path: 'all', section: 'skills',
    text: 'כמה את טובה בניתוח מידע ופתרון בעיות לוגיות?',
    type: 'scale',
    min_label: 'מתקשה עם לוגיקה ומתמטיקה',
    max_label: 'מנתחת נתונים, חדה בחשיבה לוגית',
  },
  {
    id: 'S4', path: 'all', section: 'skills',
    text: 'כמה חזק החוש האסתטי / היצירתי שלך?',
    type: 'scale',
    min_label: 'לא מתעניינת בעיצוב ואסתטיקה',
    max_label: 'עין חזקה, תחושת עיצוב טבעית',
  },
  {
    id: 'S5', path: 'all', section: 'skills',
    text: 'כמה נוח לך להוביל ולנהל אנשים?',
    type: 'scale',
    min_label: 'מעדיפה לא לנהל, לתרום כמומחית',
    max_label: 'נולדתי להוביל אנשים',
  },

  // ===== ערכים =====
  {
    id: 'V1', path: 'all', section: 'values',
    text: 'בעוד 5 שנים, הצלחה כלכלית בשבילך נראית ככה...',
    type: 'single',
    options: [
      { value: 'stable_salary', label: 'שכר קבוע טוב שמאפשר חיים נוחים ויציבים' },
      { value: 'growing_salary',label: 'שכר שגדל ככל שאני מוכיחה את עצמי' },
      { value: 'own_business',  label: 'בעלת עסק — הפוטנציאל חשוב מהוודאות' },
      { value: 'not_money',     label: 'לא חשוב כמה — כל עוד אני עושה מה שאוהבת' },
    ]
  },
  {
    id: 'V2', path: 'all', section: 'values',
    text: 'מה חשוב לך יותר בעבודה?',
    type: 'scale',
    min_label: 'יציבות — לדעת שהעבודה תמיד תהיה שם',
    max_label: 'ריגוש — אתגר, חדש, גדילה מהירה',
  },
  {
    id: 'V3', path: 'all', section: 'values',
    text: 'מה מתאים לך יותר בקשר לשעות עבודה?',
    type: 'single',
    options: [
      { value: 'fixed_hours',   label: 'שעות קבועות — אני מפרידה בין עבודה לחיים' },
      { value: 'flex_hours',    label: 'גמישות — אני מסתדרת עם מה שצריך' },
      { value: 'all_in',        label: 'מוכנה להשקיע הכל אם האהבה שם' },
      { value: 'no_choice',     label: 'אין לי ברירה כרגע — צריכה להרוויח' },
    ]
  },
  {
    id: 'V4', path: 'all', section: 'values',
    text: 'ממה תרגישי שהצלחת בקריירה?',
    type: 'single',
    options: [
      { value: 'help_specific', label: 'אני עוזרת לאנשים ספציפיים' },
      { value: 'mass_impact',   label: 'המוצר שלי משמש מיליונים' },
      { value: 'expertise',     label: 'אני המומחית הכי טובה בתחומי' },
      { value: 'org_lead',      label: 'בניתי והובלתי ארגון מצליח' },
      { value: 'creative_rec',  label: 'קיבלתי הכרה יצירתית על עבודתי' },
    ]
  },
  {
    id: 'V5', path: 'all', section: 'values',
    text: 'כיצד את מתמודדת עם חוסר ודאות?',
    type: 'scale',
    min_label: 'צריכה תפקיד מוגדר ואחריויות ברורות',
    max_label: 'משגשגת כשאין תשובות ברורות',
  },

  // ===== עתיד =====
  {
    id: 'F1', path: 'all', section: 'future',
    text: 'כמה שנות לימוד נוספות את מוכנה להשקיע?',
    type: 'single',
    options: [
      { value: 'no_study',     label: 'אני רוצה להתחיל לעבוד עכשיו — ללא לימודים' },
      { value: 'short_course', label: 'עד שנתיים (קורס / דיפלומה)' },
      { value: 'degree',       label: 'תואר ראשון (3–4 שנים)' },
      { value: 'postgrad',     label: 'תואר שני ומעלה (5+ שנים)' },
    ]
  },
  {
    id: 'F2', path: 'all', section: 'future',
    text: 'איפה את רוצה להיות בעוד 10 שנים?',
    type: 'single',
    options: [
      { value: 'own_company',  label: 'מנכ"לית / בעלת חברה שלי' },
      { value: 'expert',       label: 'מומחית מוכרת בתחום מסוים' },
      { value: 'meaningful',   label: 'עושה עבודה משמעותית שמשנה חיים' },
      { value: 'stable_fam',   label: 'קריירה יציבה ומשפחה' },
      { value: 'creative_own', label: 'אמנית / יוצרת עם קהל שלי' },
      { value: 'senior_mgmt',  label: 'מנהלת בכירה בארגון גדול' },
    ]
  },
  {
    id: 'F3', path: 'all', section: 'future',
    text: 'אם יכולת לנסות כל דבר ללא פחד מכישלון — מה היית עושה?',
    type: 'text',
    placeholder: 'כתבי בחופשיות, ללא שיפוט...',
    optional: true,
  },
];

// ============================================================
// פונקציות עזר
// ============================================================

function getProfileQuestions() {
  return QUESTIONS.filter(q => q.path === 'profile');
}

function getPathQuestions(path) {
  return QUESTIONS.filter(q => q.path === path);
}

function getCoreQuestions() {
  return QUESTIONS.filter(q => q.path === 'all');
}

function buildQuestionList(selectedPath) {
  return [
    ...getProfileQuestions(),
    ...(selectedPath ? getPathQuestions(selectedPath) : []),
    ...getCoreQuestions(),
  ];
}

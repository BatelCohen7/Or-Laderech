# מדריך הגדרת אתר "אור לדרך"

## מה זה אור לדרך?

אור לדרך הוא פלטפורמה דיגיטלית מתקדמת להתחדשות עירונית, המחברת בין דיירים, יזמים, בעלי מקצוע ורשויות מקומיות.

## הגדרה צעד אחר צעד

### 1. התקנת תלויות

```bash
npm install
```

### 2. הגדרת משתני סביבה

1. צור קובץ `.env` בתיקיית השורש של הפרויקט
2. העתק את התוכן מקובץ `.env.example`
3. עדכן את הערכים לפי הצורך:

```env
# Application Environment
VITE_APP_ENV=development

# Google Maps API (Optional)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### 3. הפעלת האתר

```bash
npm run dev
```

## פיצ'רים זמינים

### דשבורד דיירים מתקדם
- ✅ סקירה כללית עם סטטיסטיקות
- ✅ ציר זמן הפרויקט האינטראקטיבי
- ✅ מערכת הצבעות מתקדמת
- ✅ מרכז תקשורת חכם
- ✅ ניהול מסמכים דיגיטלי
- ✅ מרכז תמיכה מתקדם עם AI
- ✅ מרכז התנגדויות
- ✅ מרכז ידע מקיף
- ✅ הגדרות מתקדמות
- ✅ פרופיל אישי

### תכונות נוספות
- ✅ מערכת אימות מלאה
- ✅ ניתוח זכויות תכנוניות
- ✅ חיפוש גלובלי
- ✅ נגישות מתקדמת
- ✅ עיצוב רספונסיבי
- ✅ ביצועים מעולים

## טכנולוגיות

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **State Management**: React Context
- **Routing**: React Router
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Build Tool**: Vite

## מבנה הפרויקט

```
src/
├── components/          # רכיבים משותפים
├── contexts/           # Context providers
├── hooks/              # Custom hooks
├── services/           # שירותים ומודלים
├── pages/              # דפי האפליקציה
└── utils/              # פונקציות עזר
```

## הרצה מקומית

```bash
# התקנת dependencies
npm install

# הרצה במצב פיתוח
npm run dev

# בנייה לפרודקשן
npm run build

# תצוגה מקדימה של הבנייה
npm run preview
```

## פריסה לפרודקשן

האתר מוכן לפריסה ב-Netlify. ניתן לפרוס את האתר ישירות מ-GitHub או להשתמש ב-Netlify CLI.

## תמיכה

לתמיכה טכנית או שאלות, פנה אלינו ב:
- אימייל: support@orladerech.co.il
- טלפון: 03-1234567

---

© 2025 אור לדרך - המרכז להתחדשות עירונית. כל הזכויות שמורות.
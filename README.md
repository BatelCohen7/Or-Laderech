# אור לדרך - המרכז להתחדשות עירונית

פלטפורמה מתקדמת להתחדשות עירונית המחברת בין דיירים, יזמים, בעלי מקצוע ורשויות מקומיות.

## הגדרת Supabase

### שלב 1: יצירת פרויקט Supabase

1. היכנס ל-[Supabase](https://supabase.com)
2. צור פרויקט חדש
3. בחר שם לפרויקט ואזור גיאוגרפי
4. המתן לסיום ההגדרה

### שלב 2: קבלת פרטי החיבור

1. בדשבורד של Supabase, עבור ל-Settings > API
2. העתק את הערכים הבאים:
   - **Project URL** (URL)
   - **anon public** (API Key)

### שלב 3: עדכון קובץ הסביבה

עדכן את הקובץ `.env` עם הפרטים שלך:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_APP_ENV=production
```

### שלב 4: הרצת המיגרציות

המיגרציות כבר מוכנות בתיקיית `supabase/migrations/`. 

1. בדשבורד של Supabase, עבור ל-SQL Editor
2. העתק את התוכן מהקובץ `supabase/migrations/20250625160701_shrill_glade.sql`
3. הרץ את השאילתה
4. העתק את התוכן מהקובץ `supabase/migrations/20250625160730_peaceful_summit.sql`
5. הרץ את השאילתה

### שלב 5: הפעלת האתר

```bash
npm run dev
```

האתר יעבוד כעת עם Supabase אמיתי!

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
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
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
├── lib/                # ספריות ועזרים
├── pages/              # דפי האפליקציה
└── types/              # הגדרות TypeScript
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

## תמיכה

לתמיכה טכנית או שאלות, פנה אלינו ב:
- אימייל: support@orbaderech.co.il
- טלפון: 03-1234567

---

© 2025 אור בדרך - המרכז להתחדשות עירונית. כל הזכויות שמורות.
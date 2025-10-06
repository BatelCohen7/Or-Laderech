# הוראות פריסה לפרודקשן - אור לדרך

## שלב 1: הגדרת Neon Database

### 1.1 יצירת חשבון Neon

1. היכנס ל-[neon.tech](https://neon.tech)
2. לחץ על "Sign Up" והירשם עם Google, GitHub או אימייל
3. אמת את האימייל שלך אם נדרש

### 1.2 יצירת פרויקט חדש

1. לחץ על "New Project"
2. בחר שם לפרויקט (למשל "or-laderech")
3. בחר אזור (מומלץ "EU-Central" - הכי קרוב לישראל)
4. לחץ "Create Project"

### 1.3 קבלת פרטי החיבור

1. בדשבורד של הפרויקט, תחת "Connection Details"
2. בחר "Nodejs" בתפריט השפות
3. העתק את מחרוזת החיבור המלאה (Connection string)

## שלב 2: פריסה ב-Netlify

### 2.1 יצירת חשבון Netlify

1. היכנס ל-[netlify.com](https://netlify.com)
2. לחץ על "Sign Up" והירשם עם Google, GitHub או אימייל

### 2.2 יצירת אתר חדש

1. לחץ על "Add new site" > "Import an existing project"
2. בחר את מאגר הקוד שלך או העלה את קבצי הפרויקט
3. הגדר את הגדרות הבנייה:
   - Build command: `npm run build`
   - Publish directory: `dist`

### 2.3 הגדרת משתני סביבה

1. לאחר יצירת האתר, לחץ על "Site settings" > "Environment variables"
2. הוסף את המשתנים הבאים:
   - `VITE_APP_ENV`: `production`
   - `VITE_NEON_DATABASE_URL`: מחרוזת החיבור שהעתקת מ-Neon
   - `NETLIFY_DATABASE_URL`: אותה מחרוזת חיבור (לשימוש ב-Netlify Functions)

### 2.4 הפעלת Netlify Functions

1. לחץ על "Site settings" > "Functions"
2. וודא שהנתיב לפונקציות מוגדר כ-`netlify/functions`

### 2.5 פריסה מחדש

1. לחץ על "Deploys" בתפריט העליון
2. לחץ על "Trigger deploy" > "Deploy site"

## שלב 3: בדיקת האתר

1. לאחר סיום הפריסה, לחץ על הקישור לאתר שלך
2. בדוק שהאתר נטען כראוי
3. נסה להתחבר עם משתמש המנהל (oravraham217@gmail.com)
4. בדוק שהחיבור למסד הנתונים עובד כראוי

## שלב 4: פתרון בעיות נפוצות

### שגיאת "Connection refused"
- בדוק שהעתקת נכון את מחרוזת החיבור
- וודא שאין חומת אש שחוסמת את החיבור

### שגיאת "Authentication failed"
- בדוק שהסיסמה במחרוזת החיבור נכונה
- נסה ליצור סיסמה חדשה ב-Neon

### שגיאת "Function not found"
- בדוק שהפונקציות נמצאות בנתיב הנכון (`netlify/functions`)
- בדוק שהפונקציות מקומפלות כראוי

### שגיאת "CORS"
- בדוק שה-headers ב-`netlify.toml` מוגדרים נכון
- וודא שהפונקציות מחזירות headers CORS נכונים

## שלב 5: תחזוקה שוטפת

### 5.1 גיבוי מסד הנתונים

1. היכנס לדשבורד של Neon
2. לחץ על "Branches" > "main"
3. לחץ על "Backups" ובצע גיבוי ידני

### 5.2 עדכון האתר

1. עדכן את הקוד במאגר שלך
2. Netlify יפרוס אוטומטית את האתר המעודכן

---

**לאחר ביצוע כל השלבים, האתר אמור לעבוד בפרודקשן ללא שגיאות! 🎉**
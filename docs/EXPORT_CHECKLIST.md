# רשימת בדיקה לייצוא פרויקט

## קבצים שיש לכלול בחבילה

### קבצי שורש
- [ ] `package.json` - תלויות ופקודות
- [ ] `package-lock.json` - נעילת גרסאות
- [ ] `vite.config.ts` - הגדרות Vite
- [ ] `tailwind.config.js` - הגדרות Tailwind
- [ ] `tsconfig.json` - הגדרות TypeScript
- [ ] `tsconfig.app.json` - הגדרות TypeScript לאפליקציה
- [ ] `tsconfig.node.json` - הגדרות TypeScript ל-Node
- [ ] `postcss.config.js` - הגדרות PostCSS
- [ ] `eslint.config.js` - הגדרות ESLint
- [ ] `index.html` - קובץ HTML ראשי
- [ ] `README.md` - תיעוד הפרויקט
- [ ] `netlify.toml` - הגדרות פריסה
- [ ] `.env.example` - דוגמה למשתני סביבה

### תיקיית src
- [ ] `src/main.tsx` - נקודת כניסה
- [ ] `src/App.tsx` - רכיב ראשי
- [ ] `src/index.css` - סגנונות גלובליים
- [ ] `src/vite-env.d.ts` - הגדרות TypeScript

### דפים (src/pages)
- [ ] `HomePage.tsx` - דף הבית
- [ ] `AboutPage.tsx` - דף אודות
- [ ] `ServicesPage.tsx` - דף שירותים
- [ ] `ProjectsPage.tsx` - דף פרויקטים
- [ ] `ContactPage.tsx` - דף יצירת קשר
- [ ] `LoginPage.tsx` - דף התחברות
- [ ] `DashboardPage.tsx` - דשבורד כללי
- [ ] `ResidentDashboard.tsx` - דשבורד דיירים
- [ ] `AdminDashboard.tsx` - דשבורד מנהל
- [ ] `TzfatProjectPage.tsx` - דף פרויקט צפת
- [ ] `ResidentLogin.tsx` - כניסת דיירים
- [ ] `ResidentRegistration.tsx` - הרשמת דיירים
- [ ] `ResidentRegistrationPage.tsx` - דף הרשמה
- [ ] `PropertyModel3DPage.tsx` - דף מודל תלת-ממדי
- [ ] `PlanningRightsPage.tsx` - דף זכויות תכנוניות

### רכיבים (src/components)
- [ ] `Header.tsx` - כותרת האתר
- [ ] `Footer.tsx` - תחתית האתר
- [ ] `ErrorBoundary.tsx` - טיפול בשגיאות
- [ ] `AccessibilityWidget.tsx` - רכיב נגישות
- [ ] `PersonalStory.tsx` - סיפור אישי
- [ ] `ProfessionalsSection.tsx` - קטע בעלי מקצוע
- [ ] `VisionStatement.tsx` - הצהרת חזון
- [ ] `TzfatCanaanProjectCard.tsx` - כרטיס פרויקט צפת
- [ ] `GlobalSearch.tsx` - חיפוש גלובלי
- [ ] `LanguageSwitcher.tsx` - החלפת שפה

### רכיבי UI (src/components/ui)
- [ ] `index.ts` - ייצוא רכיבים
- [ ] `Button.tsx` - כפתורים
- [ ] `Card.tsx` - כרטיסים
- [ ] `Input.tsx` - שדות קלט
- [ ] `Modal.tsx` - חלונות קופצים
- [ ] `Badge.tsx` - תגיות
- [ ] `LoadingSpinner.tsx` - ספינר טעינה

### רכיבי ניהול דיירים (src/components/ResidentManagement)
- [ ] `DashboardHeader.tsx` - כותרת דשבורד
- [ ] `DashboardSidebar.tsx` - תפריט צד
- [ ] `VotingSystem.tsx` - מערכת הצבעות
- [ ] `CommunicationCenter.tsx` - מרכז תקשורת
- [ ] `ProjectTimeline.tsx` - ציר זמן פרויקט
- [ ] `EnhancedSupportCenter.tsx` - מרכז תמיכה
- [ ] `ObjectionsCenter.tsx` - מרכז התנגדויות
- [ ] `KnowledgeCenter.tsx` - מרכז ידע
- [ ] `ResidentProfile.tsx` - פרופיל דייר
- [ ] `PropertyManagement3D.tsx` - ניהול מודלים תלת-ממדיים

### רכיבי מנהל (src/components/Admin*)
- [ ] `AdminHeader.tsx` - כותרת מנהל
- [ ] `AdminSidebar.tsx` - תפריט מנהל
- [ ] `AdminStats.tsx` - סטטיסטיקות מנהל
- [ ] `AdminProjectCard.tsx` - כרטיס פרויקט מנהל
- [ ] `AdminResidentTable.tsx` - טבלת דיירים
- [ ] `AdminDocumentList.tsx` - רשימת מסמכים
- [ ] `AdminVotingSystem.tsx` - מערכת הצבעות מנהל
- [ ] `AdminObjectionsList.tsx` - רשימת התנגדויות
- [ ] `AdminKnowledgeCenter.tsx` - מרכז ידע מנהל
- [ ] `AdminNotifications.tsx` - התראות מנהל

### רכיבי תלת-ממד (src/components/3D)
- [ ] `RealEstate3DViewer.tsx` - צפיה תלת-ממדית
- [ ] `GoogleMapsIntegration.tsx` - אינטגרציה עם Google Maps

### קונטקסטים (src/contexts)
- [ ] `AuthContext.tsx` - קונטקסט אימות
- [ ] `LanguageContext.tsx` - קונטקסט שפה

### שירותים (src/services)
- [ ] `api.ts` - שירותי API
- [ ] `importService.ts` - שירות ייבוא
- [ ] `residentService.ts` - שירות דיירים
- [ ] `residentRegistrationService.ts` - שירות הרשמת דיירים

### כלים (src/utils)
- [ ] `validation.ts` - אימות נתונים

### הוקים (src/hooks)
- [ ] `useProjects.ts` - הוק פרויקטים

### בינלאומיות (src/i18n)
- [ ] `index.ts` - הגדרות i18n
- [ ] `locales/he.json` - תרגום עברית
- [ ] `locales/en.json` - תרגום אנגלית
- [ ] `locales/ru.json` - תרגום רוסית

### קבצים ציבוריים (public)
- [ ] `robots.txt` - הוראות לרובוטים
- [ ] `sitemap.xml` - מפת האתר
- [ ] `og-image.jpg` - תמונה לשיתוף

### תיעוד
- [ ] `SETUP_GUIDE.md` - מדריך הגדרה
- [ ] `ADMIN_LOGIN_GUIDE.md` - מדריך כניסת מנהל
- [ ] `DEPLOY_INSTRUCTIONS.md` - הוראות פריסה
- [ ] `DEMO_SCRIPT_DETAILED.md` - תסריט הדגמה
- [ ] `INVESTOR_PRESENTATION.md` - מצגת משקיעים
- [ ] `project-development-summary.md` - סיכום פיתוח

## בדיקות לפני ייצוא

### בדיקות טכניות
- [ ] הפרויקט מתקמפל ללא שגיאות (`npm run build`)
- [ ] הפרויקט רץ במצב פיתוח (`npm run dev`)
- [ ] כל הדפים נטענים כראוי
- [ ] הניווט עובד בכל הדפים
- [ ] החיפוש הגלובלי עובד
- [ ] מערכת השפות עובדת

### בדיקות עיצוב
- [ ] האתר רספונסיבי בכל הגדלים
- [ ] הצבעים והפונטים עקביים
- [ ] האנימציות עובדות
- [ ] הנגישות פועלת כראוי
- [ ] כיוון הטקסט (RTL) עובד

### בדיקות תוכן
- [ ] כל הטקסטים בעברית
- [ ] פרטי הקשר מעודכנים
- [ ] התמונות נטענות
- [ ] הקישורים עובדים

## הערות חשובות

1. **גיבוי**: שמור עותק גיבוי לפני העברה
2. **בדיקה**: בדוק שהכל עובד אחרי ההעברה
3. **תיעוד**: קרא את כל קבצי התיעוד
4. **תמיכה**: שמור על קשר לתמיכה טכנית

---

✅ **הפרויקט מוכן להעברה!**
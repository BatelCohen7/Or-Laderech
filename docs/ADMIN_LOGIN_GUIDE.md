# מדריך כניסת מנהל - אור לדרך

## כניסה כמנהל דרך מודול כניסת דיירים

המערכת תומכת כעת בכניסת מנהל דרך מודול כניסת הדיירים, מה שמאפשר למנהל המערכת להתחבר ולנהל את המערכת מכל מקום.

### אפשרות 1: כניסה עם אימייל המנהל

1. לחץ על כפתור "כניסה" בתפריט הראשי
2. בחר באפשרות "התחברות עם אימייל"
3. הזן את אימייל המנהל: `oravraham217@gmail.com`
4. הזן את הסיסמה שלך
5. לחץ על "התחבר"

המערכת תזהה אוטומטית שזהו אימייל של מנהל ותנווט אותך לדשבורד הניהול.

### אפשרות 2: כניסה עם מספר תעודת זהות של מנהל

אם הגדרת מספר תעודת זהות למשתמש המנהל, ניתן להתחבר גם באמצעותו:

1. לחץ על כפתור "כניסה" בתפריט הראשי
2. השאר את האפשרות "התחברות עם ת.ז" מסומנת
3. הזן את מספר תעודת הזהות של המנהל
4. הזן את הסיסמה שלך
5. לחץ על "התחבר"

## הרשאות מנהל

כמנהל מערכת, יש לך גישה לכל חלקי המערכת, כולל:

- ניהול פרויקטים
- ניהול משתמשים
- ניהול דיירים
- ייבוא/ייצוא נתונים
- הגדרות מערכת

## איפוס משתמש מנהל

אם שכחת את הסיסמה או שיש בעיה עם חשבון המנהל, ניתן לאפס אותו:

1. היכנס לדשבורד הניהול (אם יש לך גישה)
2. לחץ על "משתמשים" בתפריט
3. לחץ על "איפוס מנהל"
4. הזן את האימייל: `oravraham217@gmail.com`
5. הזן סיסמה חדשה
6. לחץ "אפס משתמש מנהל"

## פתרון בעיות

### אם אינך מצליח להתחבר כמנהל

1. ודא שאתה משתמש באימייל הנכון: `oravraham217@gmail.com`
2. ודא שהסיסמה נכונה
3. בדוק שמשתמש המנהל קיים במערכת:
   - היכנס ל-Supabase Dashboard
   - בדוק ב-Authentication > Users שהמשתמש קיים
   - בדוק בטבלת `users` שיש רשומה עם `email = 'oravraham217@gmail.com'` ו-`role = 'admin'`

### אם אין לך גישה לדשבורד Supabase

ניתן להריץ את המיגרציה הבאה דרך SQL Editor:

```sql
-- Fix any missing admin users
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'oravraham217@gmail.com'
  ) AND NOT EXISTS (
    SELECT 1 FROM users WHERE email = 'oravraham217@gmail.com'
  ) THEN
    -- Insert the admin user into the users table
    INSERT INTO users (id, email, role, full_name)
    VALUES (
      (SELECT id FROM auth.users WHERE email = 'oravraham217@gmail.com'),
      'oravraham217@gmail.com',
      'admin',
      'אור אברהם'
    );
  END IF;
  
  -- Update existing admin users to ensure they have the correct role
  UPDATE users 
  SET role = 'admin' 
  WHERE email = 'oravraham217@gmail.com' AND role IS NULL;
END $$;
```

## אבטחה

שים לב: אימייל המנהל ומספר תעודת הזהות הם פרטים רגישים. אל תשתף אותם עם אנשים שאינם מורשים לנהל את המערכת.
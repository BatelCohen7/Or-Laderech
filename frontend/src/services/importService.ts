import Papa from 'papaparse';
import toast from 'react-hot-toast';

export interface ImportResult {
  total: number;
  added: number;
  updated: number;
  errors: string[];
}

export const importService = {
  /**
   * ייבוא דיירים מקובץ CSV - מצב דמו
   * @param file קובץ CSV
   * @returns תוצאות הייבוא
   */
  importResidentsFromCSV: async (file: File): Promise<ImportResult> => {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        // Create mock result
        const result: ImportResult = {
          total: Math.floor(Math.random() * 20) + 10, // 10-30 records
          added: Math.floor(Math.random() * 10) + 5,  // 5-15 added
          updated: Math.floor(Math.random() * 5) + 2, // 2-7 updated
          errors: []
        };
        
        // Add some random errors for realism
        if (Math.random() > 0.7) {
          result.errors.push('שגיאה בשורה 5: נתונים חסרים');
        }
        
        resolve(result);
      }, 1000);
    });
  },

  /**
   * ייצוא דיירים לקובץ CSV - מצב דמו
   * @returns קובץ CSV
   */
  exportResidentsToCSV: async (): Promise<string> => {
    try {
      // יצירת נתונים לדוגמה
      const mockResidents = [];
      for (let i = 1; i <= 20; i++) {
        mockResidents.push({
          'תת חלקה': `${i}`,
          'בניין': i <= 10 ? 'זלמן שזר 1' : 'השבעה 2',
          'שם מלא': `דייר לדוגמה ${i}`,
          'תעודת זהות': `${100000000 + i}`,
          'טלפון': `050-${1000000 + i}`,
          'אימייל': `resident${i}@example.com`,
          'סטטוס חתימה': i % 3 === 0 ? 'חתום' : i % 3 === 1 ? 'בתהליך' : 'טרם נוצר קשר',
          'עדכון אחרון': new Date().toISOString().split('T')[0],
          'הערות': i % 5 === 0 ? 'הערה לדוגמה' : '',
          'רשום במערכת': i % 4 === 0 ? 'כן' : 'לא'
        });
      }
      
      return Papa.unparse(mockResidents);
    } catch (error: any) {
      toast.error(`שגיאה בייצוא דיירים: ${error.message}`);
      return '';
    }
  }
};
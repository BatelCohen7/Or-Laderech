const fs = require('fs');
const path = require('path');

// הגדרות
const directoryToScan = path.join(__dirname, '../src'); // סריקה של תיקיית src
const fileExtensions = ['.js', '.jsx', '.ts', '.tsx'];
const keywords = ['supabase', 'nyon'];

// פונקציה ריקורסיבית לסריקת כל קבצי הקוד
function walkDirectory(dirPath, callback) {
  const files = fs.readdirSync(dirPath);
  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDirectory(fullPath, callback);
    } else {
      callback(fullPath);
    }
  });
}

// ניקוי קובץ מספא-בייס וניון
function cleanFile(filePath) {
  const ext = path.extname(filePath);
  if (!fileExtensions.includes(ext)) return;

  const original = fs.readFileSync(filePath, 'utf8').split('\n');
  const filtered = original.filter(line =>
    !keywords.some(word => line.toLowerCase().includes(word))
  );

  if (original.length !== filtered.length) {
    fs.writeFileSync(filePath, filtered.join('\n'), 'utf8');
    console.log(`✔ cleaned: ${filePath}`);
  }
}

// הפעלת הסקריפט
walkDirectory(directoryToScan, cleanFile);
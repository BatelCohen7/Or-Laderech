// Simple validation function for demo purposes
export const validateIsraeliId = (id: string): boolean => {
  // For demo purposes, accept any 9-digit number
  return id.length === 9 && /^\d+$/.test(id);
};

// Helper function to validate form fields
export const validateField = (name: string, value: string, compareValue?: string): string => {
  try {
    switch (name) {
      case 'full_name':
        return value.length < 2 ? 'שם מלא חייב להכיל לפחות 2 תווים' : '';
      
      case 'id_number':
      case 'idNumber':
        if (!value) return 'מספר תעודת זהות הוא שדה חובה';
        if (value.length !== 9) return 'מספר תעודת זהות חייב להכיל 9 ספרות בדיוק';
        if (!/^\d+$/.test(value)) return 'מספר תעודת זהות חייב להכיל ספרות בלבד';
        return '';
      
      case 'email':
        if (!value) return '';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? '' : 'כתובת אימייל לא תקינה';
      
      case 'phone':
        if (!value) return '';
        const phoneRegex = /^0\d{8,9}$/;
        return phoneRegex.test(value.replace(/[-\s]/g, '')) ? '' : 'מספר טלפון לא תקין';
      
      case 'password':
        // For demo purposes, accept any password
        return '';
      
      case 'confirmPassword':
        return value !== compareValue ? 'הסיסמאות אינן תואמות' : '';
      
      case 'building':
        return !value ? 'יש לבחור בניין' : '';
        
      case 'apartment_number':
      case 'apartmentNumber':
        // Optional field, but if provided should be valid
        if (value && !/^\d+$/.test(value)) return 'מספר דירה חייב להיות מספר';
        return '';
        
      case 'floor':
        // Optional field, but if provided should be valid
        if (value && !/^\d+$/.test(value)) return 'קומה חייבת להיות מספר';
        return '';
        
      default:
        return '';
    }
  } catch (error) {
    return 'שגיאת אימות';
  }
};

// Validate entire form data
export const validateFormData = (formData: Record<string, any>, requiredFields: string[]): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  // Validate required fields
  for (const field of requiredFields) {
    if (!formData[field]) {
      errors[field] = `שדה ${field} הוא שדה חובה`;
      continue;
    }
    
    // Validate field with specific validation
    const error = validateField(field, formData[field], 
      field === 'confirmPassword' ? formData.password : undefined);
    
    if (error) {
      errors[field] = error;
    }
  }
  
  return errors;
};

// Format validation errors for display
export const formatValidationErrors = (errors: Record<string, string>): string => {
  if (Object.keys(errors).length === 0) return '';
  
  return Object.values(errors).join(', ');
};
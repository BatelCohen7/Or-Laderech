export interface ResidentRegistrationData {
  full_name: string;
  id_number: string;
  email: string;
  phone: string;
  password: string;
  address?: string;
  apartment_number?: string;
  floor?: string;
}

export interface ResidentLoginData {
  email?: string;
  id_number?: string;
  password: string;
}

export interface ResidentResponse {
  id: string;
  full_name: string;
  email: string;
  status: string;
}

export const residentRegistrationService = {
  /**
   * רישום דייר חדש - מצב דמו
   */
  registerResident: async (data: ResidentRegistrationData): Promise<ResidentResponse> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        id: Date.now().toString(),
        full_name: data.full_name,
        email: data.email || `${data.id_number}@example.com`,
        status: 'waiting'
      };
    } catch (error: any) {
      console.error('Error registering resident:', error);
      throw new Error(error.message || 'שגיאה ברישום הדייר');
    }
  },

  /**
   * התחברות דייר - מצב דמו
   */
  loginResident: async (data: ResidentLoginData): Promise<ResidentResponse> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Special case for admin login
      const isAdminEmail = data.email?.includes('admin');
      const isAdminId = data.id_number === '123456789';
      
      if (isAdminEmail || isAdminId) {
        return {
          id: '1',
          full_name: 'מנהל מערכת',
          email: data.email || 'admin@example.com',
          status: 'approved'
        };
      }
      
      // For regular users
      return {
        id: Date.now().toString(),
        full_name: data.id_number ? 'דייר לדוגמה' : 'משתמש אימייל',
        email: data.email || `${data.id_number}@example.com`,
        status: 'waiting'
      };
    } catch (error: any) {
      console.error('Error logging in resident:', error);
      throw new Error(error.message || 'שגיאה בהתחברות');
    }
  },

  /**
   * קבלת כל הדיירים - מצב דמו
   */
  getAllResidents: async (): Promise<any[]> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return mock data
      return [
        {
          id: '1',
          full_name: 'ישראל ישראלי',
          id_number: '123456789',
          email: 'israel@example.com',
          phone: '050-1234567',
          address: 'רחוב זלמן שזר 1',
          apartment_number: '15',
          status: 'approved'
        },
        {
          id: '2',
          full_name: 'שרה כהן',
          id_number: '987654321',
          email: 'sara@example.com',
          phone: '052-7654321',
          address: 'רחוב זלמן שזר 3',
          apartment_number: '8',
          status: 'waiting'
        },
        {
          id: '3',
          full_name: 'יעקב לוי',
          id_number: '456789123',
          email: 'yaakov@example.com',
          phone: '053-9876543',
          address: 'רחוב השבעה 2',
          apartment_number: '7',
          status: 'approved'
        }
      ];
    } catch (error: any) {
      console.error('Error fetching residents:', error);
      throw new Error(error.message || 'שגיאה בקבלת רשימת הדיירים');
    }
  }
};
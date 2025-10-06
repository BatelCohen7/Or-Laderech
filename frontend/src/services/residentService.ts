export interface Resident {
  id?: string;
  full_name: string;
  id_number: string;
  phone?: string | null;
  email?: string | null;
  building?: string | null;
  apartment?: string | null;
  registered?: boolean;
  created_at?: string;
}

// מוק דאטה לדיירים
const mockResidents: Resident[] = [
  {
    id: '1',
    full_name: 'ישראל ישראלי',
    id_number: '123456789',
    phone: '050-1234567',
    email: 'israel@example.com',
    building: 'זלמן שזר 1',
    apartment: '15',
    registered: true
  },
  {
    id: '2',
    full_name: 'שרה כהן',
    id_number: '987654321',
    phone: '052-7654321',
    email: 'sara@example.com',
    building: 'זלמן שזר 3',
    apartment: '8',
    registered: false
  },
  {
    id: '3',
    full_name: 'משה לוי',
    id_number: '456789123',
    phone: '054-3456789',
    email: 'moshe@example.com',
    building: 'השבעה 2',
    apartment: '22',
    registered: false
  }
];

export const residentService = {
  /**
   * Get all residents
   */
  getAllResidents: async (): Promise<Resident[]> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockResidents;
    } catch (error: any) {
      console.error('Error fetching residents:', error);
      return [];
    }
  },

  /**
   * Get resident by ID number
   */
  getResidentByIdNumber: async (idNumber: string): Promise<Resident | null> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockResidents.find(r => r.id_number === idNumber) || null;
    } catch (error: any) {
      console.error('Error fetching resident by ID number:', error);
      return null;
    }
  },

  /**
   * Create new resident
   */
  createResident: async (resident: Resident): Promise<Resident | null> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create a mock resident with a generated ID
      const newResident = {
        ...resident,
        id: Date.now().toString(),
        registered: true,
        created_at: new Date().toISOString()
      };
      
      // Add to mock data
      mockResidents.push(newResident);
      
      return newResident;
    } catch (error: any) {
      console.error('Error creating resident:', error);
      throw error;
    }
  },

  /**
   * Update resident
   */
  updateResident: async (id: string, updates: Partial<Resident>): Promise<Resident | null> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Find the resident in mock data
      const residentIndex = mockResidents.findIndex(r => r.id === id);
      if (residentIndex === -1) return null;
      
      // Update the resident
      const updatedResident = {
        ...mockResidents[residentIndex],
        ...updates
      };
      
      // Replace in mock data
      mockResidents[residentIndex] = updatedResident;
      
      return updatedResident;
    } catch (error: any) {
      console.error('Error updating resident:', error);
      throw error;
    }
  }
};
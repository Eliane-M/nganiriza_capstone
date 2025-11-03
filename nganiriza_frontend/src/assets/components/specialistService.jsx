// src/api/specialistService.js

const API_BASE_URL = 'http://localhost:5000/api';

class SpecialistService {
  /**
   * Get all specialists
   * @returns {Promise<Array>} Array of specialist objects
   */
  async getAll() {
    try {
      const response = await fetch(`${API_BASE_URL}/specialists`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching specialists:', error);
      throw error;
    }
  }

  /**
   * Get a single specialist by ID
   * @param {string|number} id - Specialist ID
   * @returns {Promise<Object>} Specialist object
   */
  async getById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/specialists/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching specialist ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get specialists by specialty
   * @param {string} specialty - Specialty name
   * @returns {Promise<Array>} Array of specialist objects
   */
  async getBySpecialty(specialty) {
    try {
      const response = await fetch(`${API_BASE_URL}/specialists?specialty=${encodeURIComponent(specialty)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching specialists by specialty ${specialty}:`, error);
      throw error;
    }
  }

  /**
   * Search specialists by name or keyword
   * @param {string} query - Search query
   * @returns {Promise<Array>} Array of specialist objects
   */
  async search(query) {
    try {
      const response = await fetch(`${API_BASE_URL}/specialists/search?q=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error searching specialists with query "${query}":`, error);
      throw error;
    }
  }

  /**
   * Book a session with a specialist
   * @param {string|number} specialistId - Specialist ID
   * @param {Object} bookingData - Booking details (date, time, type, etc.)
   * @returns {Promise<Object>} Booking confirmation
   */
  async bookSession(specialistId, bookingData) {
    try {
      const response = await fetch(`${API_BASE_URL}/specialists/${specialistId}/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add auth token if needed
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error booking session with specialist ${specialistId}:`, error);
      throw error;
    }
  }

  /**
   * Get available time slots for a specialist
   * @param {string|number} specialistId - Specialist ID
   * @param {string} date - Date in YYYY-MM-DD format
   * @returns {Promise<Array>} Array of available time slots
   */
  async getAvailableSlots(specialistId, date) {
    try {
      const response = await fetch(`${API_BASE_URL}/specialists/${specialistId}/availability?date=${date}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching availability for specialist ${specialistId}:`, error);
      throw error;
    }
  }

  // MOCK DATA - Remove this in production when you have a real backend
  /**
   * Get mock specialists data (for development/testing)
   * @returns {Promise<Array>} Array of mock specialist objects
   */
  async getMockData() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return [
      {
        id: '1',
        name: 'Dr. Sarah Johnson',
        specialty: 'Gynecology',
        imageUrl: 'https://i.pravatar.cc/150?img=47',
        rating: 4.8,
        reviews: 124,
        experience: '12 years',
        location: 'Kigali, Rwanda',
        availability: 'Mon-Fri 9AM-5PM',
        languages: ['English', 'Kinyarwanda', 'French'],
        price: 50,
      },
      {
        id: '2',
        name: 'Dr. Marie Uwase',
        specialty: 'Reproductive Health',
        imageUrl: 'https://i.pravatar.cc/150?img=48',
        rating: 4.9,
        reviews: 89,
        experience: '8 years',
        location: 'Kigali, Rwanda',
        availability: 'Tue-Sat 10AM-6PM',
        languages: ['English', 'Kinyarwanda'],
        price: 45,
      },
      {
        id: '3',
        name: 'Dr. James Mutesa',
        specialty: 'Mental Health',
        imageUrl: 'https://i.pravatar.cc/150?img=12',
        rating: 4.7,
        reviews: 156,
        experience: '15 years',
        location: 'Kigali, Rwanda',
        availability: 'Mon-Thu 8AM-4PM',
        languages: ['English', 'Kinyarwanda', 'Swahili'],
        price: 55,
      },
      {
        id: '4',
        name: 'Dr. Grace Mukamana',
        specialty: 'Adolescent Medicine',
        imageUrl: 'https://i.pravatar.cc/150?img=45',
        rating: 4.9,
        reviews: 203,
        experience: '10 years',
        location: 'Kigali, Rwanda',
        availability: 'Mon-Fri 9AM-5PM',
        languages: ['English', 'Kinyarwanda'],
        price: 48,
      },
      {
        id: '5',
        name: 'Dr. Emmanuel Nkusi',
        specialty: 'Nutrition',
        imageUrl: 'https://i.pravatar.cc/150?img=33',
        rating: 4.6,
        reviews: 67,
        experience: '7 years',
        location: 'Kigali, Rwanda',
        availability: 'Wed-Sun 11AM-7PM',
        languages: ['English', 'Kinyarwanda', 'French'],
        price: 40,
      },
    ];
  }
}

// Export a single instance
export const specialistService = new SpecialistService();

// Also export the class if needed
export default SpecialistService;
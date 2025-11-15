import React, { useState } from 'react';
import axios from 'axios';
import BASE_URL from '../config';

const SpecialistOnboarding = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    specialty: '',
    license_number: '',
    years_of_experience: 0,
    bio: '',
    education: '',
    certifications: [],
    languages_spoken: [],
    availability: '',
    consultation_fee: 0,
    clinic_name: '',
    clinic_address: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    
    try {
      await axios.put(
        `${BASE_URL}/api/specialists/profile/update/`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/specialist/dashboard');
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  return (
    <div className="onboarding-container">
      {/* Multi-step form UI */}
    </div>
  );
};

export default SpecialistOnboarding;
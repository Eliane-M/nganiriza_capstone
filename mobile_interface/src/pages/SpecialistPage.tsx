import React, { useState } from 'react';
import { SpecialistCard } from '../components/SpecialistCard';
import { TextChatInterface } from '../components/TextChatInterface';
import { VideoCallInterface } from '../components/VideoCallInterface';
import { SearchIcon, FilterIcon } from 'lucide-react';
enum CommunicationMode {
  NONE,
  TEXT,
  VIDEO,
}
export function SpecialistPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [communicationMode, setCommunicationMode] = useState<CommunicationMode>(CommunicationMode.NONE);
  const [selectedSpecialist, setSelectedSpecialist] = useState<any>(null);
  // Mock specialists data
  const specialists = [{
    id: 'spec1',
    name: 'Dr. Claudine Uwera',
    specialty: 'Reproductive Health',
    imageUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    availability: 'Available today: 9 AM - 5 PM',
    rating: 4.8,
    isOnline: true
  }, {
    id: 'spec2',
    name: 'Dr. Jean Bosco',
    specialty: 'Sexual Health Counselor',
    imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    availability: 'Available today: 10 AM - 6 PM',
    rating: 4.6,
    isOnline: true
  }, {
    id: 'spec3',
    name: 'Nurse Marie Ange',
    specialty: 'Youth Health Specialist',
    imageUrl: 'https://randomuser.me/api/portraits/women/68.jpg',
    availability: 'Available tomorrow',
    rating: 4.7,
    isOnline: false
  }, {
    id: 'spec4',
    name: 'Dr. Emmanuel Kwizera',
    specialty: 'Reproductive Health',
    imageUrl: 'https://randomuser.me/api/portraits/men/75.jpg',
    availability: 'Available today: 1 PM - 8 PM',
    rating: 4.9,
    isOnline: true
  }];
  const specialties = ['All', 'Reproductive Health', 'Sexual Health Counselor', 'Youth Health Specialist'];
  const handleTextChat = (specialistId: string) => {
    const specialist = specialists.find(s => s.id === specialistId);
    setSelectedSpecialist(specialist);
    setCommunicationMode(CommunicationMode.TEXT);
  };
  const handleVideoCall = (specialistId: string) => {
    const specialist = specialists.find(s => s.id === specialistId);
    setSelectedSpecialist(specialist);
    setCommunicationMode(CommunicationMode.VIDEO);
  };
  const handleBackToList = () => {
    setCommunicationMode(CommunicationMode.NONE);
    setSelectedSpecialist(null);
  };
  const handleSwitchToTextChat = () => {
    setCommunicationMode(CommunicationMode.TEXT);
  };
  const filteredSpecialists = specialists.filter(specialist => {
    const matchesSearch = specialist.name.toLowerCase().includes(searchTerm.toLowerCase()) || specialist.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'All' || selectedSpecialty === null || specialist.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });
  // Render the appropriate interface based on communication mode
  if (communicationMode === CommunicationMode.TEXT && selectedSpecialist) {
    return <TextChatInterface specialist={selectedSpecialist} onBack={handleBackToList} />;
  }
  if (communicationMode === CommunicationMode.VIDEO && selectedSpecialist) {
    return <VideoCallInterface specialist={selectedSpecialist} onBack={handleBackToList} onSwitchToTextChat={handleSwitchToTextChat} />;
  }
  return <div className="min-h-screen bg-purple-50">
      <div className="bg-purple-600 text-white p-4">
        <h1 className="text-xl font-semibold">Healthcare Specialists</h1>
      </div>
      <div className="p-4">
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center border border-gray-300 rounded-lg p-2 mb-4">
            <SearchIcon size={20} className="text-gray-400 mr-2" />
            <input type="text" placeholder="Search specialists..." className="flex-1 outline-none text-sm" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <div className="flex overflow-x-auto pb-2 -mx-1">
            {specialties.map(specialty => <button key={specialty} onClick={() => setSelectedSpecialty(specialty === 'All' ? null : specialty)} className={`mx-1 px-3 py-1 rounded-full text-sm whitespace-nowrap ${specialty === 'All' && selectedSpecialty === null || selectedSpecialty === specialty ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                {specialty}
              </button>)}
          </div>
        </div>
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Available Specialists
        </h2>
        {filteredSpecialists.length > 0 ? filteredSpecialists.map(specialist => <SpecialistCard key={specialist.id} id={specialist.id} name={specialist.name} specialty={specialist.specialty} imageUrl={specialist.imageUrl} availability={specialist.availability} rating={specialist.rating} isOnline={specialist.isOnline} onTextChat={handleTextChat} onVideoCall={handleVideoCall} />) : <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <p className="text-gray-600">
              No specialists match your search criteria.
            </p>
          </div>}
      </div>
    </div>;
}
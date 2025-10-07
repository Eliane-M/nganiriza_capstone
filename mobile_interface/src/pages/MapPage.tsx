import React, { useEffect, useState } from 'react';
import { MapView } from '../components/MapView';
import { SearchIcon, MapPinIcon, FilterIcon } from 'lucide-react';
export function MapPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [userLocation, setUserLocation] = useState<[number, number] | undefined>(undefined);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  // Mock health facilities data
  const healthFacilities = [{
    id: 1,
    name: 'Youth Health Center',
    type: 'Youth Clinic',
    address: 'KG 123 St, Kigali',
    phone: '+250 78 123 4567',
    website: 'https://example.com',
    position: [-1.9437, 30.0594] as [number, number],
    services: ['Reproductive health counseling', 'STI testing and treatment', 'Contraceptive services', 'Youth-friendly services']
  }, {
    id: 2,
    name: 'Reproductive Health Clinic',
    type: 'Specialized Clinic',
    address: 'KG 456 St, Kigali',
    phone: '+250 78 987 6543',
    position: [-1.9507, 30.0626] as [number, number],
    services: ['Family planning', 'Prenatal care', 'Reproductive health education', 'Gynecological services']
  }, {
    id: 3,
    name: 'Community Health Center',
    type: 'Public Health Center',
    address: 'KG 789 St, Kigali',
    phone: '+250 78 567 8901',
    website: 'https://example.com',
    position: [-1.939, 30.065] as [number, number],
    services: ['General healthcare', 'Reproductive health services', 'HIV testing and counseling', 'Health education']
  }, {
    id: 4,
    name: 'Kigali Central Hospital',
    type: 'Hospital',
    address: 'KN 4 Ave, Kigali',
    phone: '+250 78 111 2222',
    website: 'https://example.com',
    position: [-1.945, 30.063] as [number, number],
    services: ['Comprehensive reproductive health services', 'Emergency contraception', 'Obstetrics and gynecology', 'Sexual health counseling']
  }];
  const filters = ['All', 'Youth Clinic', 'Specialized Clinic', 'Public Health Center', 'Hospital'];
  useEffect(() => {
    // Get user's location if they've granted permission before
    if (navigator.geolocation) {
      const storedPermission = localStorage.getItem('nganiriza_location_permission');
      if (storedPermission === 'granted') {
        getUserLocation();
      }
    }
  }, []);
  const getUserLocation = () => {
    if (navigator.geolocation) {
      setIsLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(position => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
        localStorage.setItem('nganiriza_location_permission', 'granted');
        setIsLoadingLocation(false);
      }, error => {
        console.error('Error getting location:', error);
        setIsLoadingLocation(false);
      });
    }
  };
  const filteredFacilities = healthFacilities.filter(facility => {
    const matchesSearch = facility.name.toLowerCase().includes(searchTerm.toLowerCase()) || facility.type.toLowerCase().includes(searchTerm.toLowerCase()) || facility.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = selectedFilter === 'All' || selectedFilter === null || facility.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });
  return <div className="flex flex-col h-screen bg-purple-50">
      <div className="bg-purple-600 text-white p-4">
        <h1 className="text-xl font-semibold">Find Health Services</h1>
      </div>
      <div className="p-4">
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="flex items-center border border-gray-300 rounded-lg p-2 mb-3">
            <SearchIcon size={20} className="text-gray-400 mr-2" />
            <input type="text" placeholder="Search health services..." className="flex-1 outline-none text-sm" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <div className="flex overflow-x-auto pb-2 -mx-1 mb-3">
            {filters.map(filter => <button key={filter} onClick={() => setSelectedFilter(filter === 'All' ? null : filter)} className={`mx-1 px-3 py-1 rounded-full text-sm whitespace-nowrap ${filter === 'All' && selectedFilter === null || selectedFilter === filter ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                {filter}
              </button>)}
          </div>
          <button onClick={getUserLocation} disabled={isLoadingLocation} className="w-full flex items-center justify-center bg-teal-100 text-teal-700 px-4 py-2 rounded-lg">
            {isLoadingLocation ? <>
                <div className="w-4 h-4 border-2 border-teal-700 border-t-transparent rounded-full animate-spin mr-2"></div>
                <span>Getting location...</span>
              </> : <>
                <MapPinIcon size={18} className="mr-2" />
                <span>
                  {userLocation ? 'Update my location' : 'Use my location'}
                </span>
              </>}
          </button>
        </div>
      </div>
      <div className="flex-1 relative">
        <MapView facilities={filteredFacilities} userLocation={userLocation} />
      </div>
    </div>;
}
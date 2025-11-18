import React, { useEffect, useState } from 'react';
import { MapView } from '../assets/components/MapView.tsx';
import { Search as SearchIcon, MapPin as MapPinIcon, Home, MessageCircle, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../assets/components/Navbar';
import '../assets/css/map/map_page.css';

export function MapPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [userLocation, setUserLocation] = useState(undefined);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: MessageCircle, label: "Chat", path: "/chat" },
    { icon: Users, label: "Specialists", path: "/specialists" },
    { icon: MapPinIcon, label: "Map", path: "/map", active: true }
  ];

  const healthFacilities = [
    { id: 1, name: 'Youth Health Center', type: 'Youth Clinic', address: 'KG 123 St, Kigali', phone: '+250 78 123 4567', website: 'https://example.com', position: [-1.9437, 30.0594], services: ['Reproductive health counseling', 'STI testing and treatment', 'Contraceptive services', 'Youth-friendly services'] },
    { id: 2, name: 'Reproductive Health Clinic', type: 'Specialized Clinic', address: 'KG 456 St, Kigali', phone: '+250 78 987 6543', position: [-1.9507, 30.0626], services: ['Family planning', 'Prenatal care', 'Reproductive health education', 'Gynecological services'] },
    { id: 3, name: 'Community Health Center', type: 'Public Health Center', address: 'KG 789 St, Kigali', phone: '+250 78 567 8901', website: 'https://example.com', position: [-1.939, 30.065], services: ['General healthcare', 'Reproductive health services', 'HIV testing and counseling', 'Health education'] },
    { id: 4, name: 'Kigali Central Hospital', type: 'Hospital', address: 'KN 4 Ave, Kigali', phone: '+250 78 111 2222', website: 'https://example.com', position: [-1.945, 30.063], services: ['Comprehensive reproductive health services', 'Emergency contraception', 'Obstetrics and gynecology', 'Sexual health counseling'] }
  ];

  const filters = ['All', 'Youth Clinic', 'Specialized Clinic', 'Public Health Center', 'Hospital'];

  useEffect(() => {
    if (navigator.geolocation && typeof window !== 'undefined' && window.localStorage) {
      const storedPermission = localStorage.getItem('nganiriza_location_permission');
      if (storedPermission === 'granted') getUserLocation();
    }
  }, []);

  const getUserLocation = () => {
    if (!navigator.geolocation) return;
    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('nganiriza_location_permission', 'granted');
        }
        setIsLoadingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        setIsLoadingLocation(false);
      }
    );
  };

  const filteredFacilities = healthFacilities.filter((facility) => {
    const s = searchTerm.toLowerCase();
    const matchesSearch =
      facility.name.toLowerCase().includes(s) ||
      facility.type.toLowerCase().includes(s) ||
      facility.services.some((service) => service.toLowerCase().includes(s));
    const matchesFilter =
      selectedFilter === 'All' || selectedFilter === null || facility.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="map-page">
      <Navbar />
      <div className="page-header"><h1>Find Health Services</h1></div>

      <div className="controls">
        <div className="panel">
          <div className="input-row" style={{ marginBottom: '0.75rem' }}>
            <SearchIcon size={20} style={{ color: '#9ca3af', marginRight: 8 }} />
            <input
              type="text"
              placeholder="Search health services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="pill-row" style={{ paddingBottom: 8, marginBottom: 12 }}>
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter === 'All' ? null : filter)}
                className={`pill ${(filter === 'All' && selectedFilter === null) || selectedFilter === filter ? 'active' : ''}`}
              >
                {filter}
              </button>
            ))}
          </div>

          <button className="get-location" onClick={getUserLocation} disabled={isLoadingLocation}>
            {isLoadingLocation ? (
              <>
                <div className="spinner" />
                <span>Getting location...</span>
              </>
            ) : (
              <>
                <MapPinIcon size={18} style={{ marginRight: 8 }} />
                <span>{userLocation ? 'Update my location' : 'Use my location'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="map-wrap">
        <MapView facilities={filteredFacilities} userLocation={userLocation} />
      </div>

      {/* Bottom Navigation Bar - Mobile Only */}
      <div className="bottom-nav">
        {navItems.map((item, i) => (
          <button
            key={i}
            onClick={() => navigate(item.path)}
            className={`nav-item ${item.active ? 'active' : ''}`}
          >
            <item.icon size={24} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
import React, { useEffect, useState, useContext, useRef } from 'react';
import PublicMapView from '../assets/components/PublicMapView';
import { Search as SearchIcon, MapPin as MapPinIcon, Home, MessageCircle, Users, User, BookOpen, Phone, Clock, Navigation, Filter, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../assets/components/Navbar';
import apiClient from '../utils/apiClient';
import { AuthContext } from '../assets/components/context/AuthContext';
import { LanguageContext } from '../contexts/AppContext';
import { useTranslation } from '../utils/translations';
import '../assets/css/map/map_page.css';

export function MapPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const { language } = useContext(LanguageContext);
  const { t } = useTranslation(language);
  const [searchTerm, setSearchTerm] = useState('');
  const [userLocation, setUserLocation] = useState(undefined);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [mapCenter, setMapCenter] = useState([-1.9441, 30.0619]); // Default to Kigali
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const filterDropdownRef = useRef(null);

  const navItems = [
    { icon: Home, label: t('nav.home'), path: "/" },
    { icon: MessageCircle, label: t('nav.chat'), path: "/chat" },
    { icon: Users, label: t('nav.specialists'), path: "/specialists" },
    { icon: MapPinIcon, label: t('nav.map'), path: "/map", active: true },
    { icon: BookOpen, label: t('nav.learn'), path: "/learn" },
    { icon: User, label: t('nav.profile'), path: "/profile" }
  ];

  const filters = [
    { key: 'all', label: t('map.filters.all') },
    { key: 'clinic', label: t('map.filters.clinic') },
    { key: 'hotline', label: t('map.filters.hotline') },
    { key: 'counselor', label: t('map.filters.counselor') },
    { key: 'NGO', label: t('map.filters.ngo') },
    { key: 'hospital', label: t('map.filters.hospital') },
    { key: 'youth clinic', label: t('map.filters.youthClinic') }
  ];

  useEffect(() => {
    loadClinics();
    if (navigator.geolocation && typeof window !== 'undefined' && window.localStorage) {
      const storedPermission = localStorage.getItem('nganiriza_location_permission');
      if (storedPermission === 'granted') getUserLocation();
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
        setShowFilterDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Center map on selected clinic or user location
    if (selectedClinic?.position) {
      setMapCenter(selectedClinic.position);
    } else if (userLocation) {
      setMapCenter(userLocation);
    } else if (clinics.length > 0 && clinics[0].position) {
      setMapCenter(clinics[0].position);
    }
  }, [selectedClinic, userLocation, clinics]);

  const loadClinics = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/admin/service-providers/public/');
      setClinics(response.data || []);
    } catch (error) {
      console.error('Failed to load clinics:', error);
      setClinics([]);
    } finally {
      setLoading(false);
    }
  };

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

  const handleClinicClick = (clinic) => {
    setSelectedClinic(clinic);
    if (clinic.position) {
      setMapCenter(clinic.position);
    }
  };

  const filteredClinics = clinics.filter((clinic) => {
    const s = searchTerm.toLowerCase();
    const matchesSearch =
      clinic.name?.toLowerCase().includes(s) ||
      clinic.type?.toLowerCase().includes(s);
    const matchesFilter =
      selectedFilter === null || selectedFilter === 'all' || clinic.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  // Filter clinics with GPS coordinates for map display
  const clinicsWithLocation = filteredClinics.filter(clinic => clinic.position);

  const handleFilterSelect = (filterKey) => {
    setSelectedFilter(filterKey === 'all' ? null : filterKey);
    setShowFilterDropdown(false);
  };

  return (
    <div className="map-page">
      <Navbar />
      <div className="map-page-layout">
        {/* Sidebar with clinic cards */}
        <div className="map-page-sidebar">
          <div className="sidebar-header">
            <div className="sidebar-search-row">
              <div className="sidebar-search">
                <SearchIcon size={20} />
                <input
                  type="text"
                  placeholder={t('map.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="filter-dropdown-wrapper" ref={filterDropdownRef}>
                <button
                  className="filter-dropdown-btn"
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  aria-label={t('map.filter') || 'Filter clinics'}
                >
                  <Filter size={18} />
                  <ChevronDown size={16} className={showFilterDropdown ? 'rotate' : ''} />
                </button>
                {showFilterDropdown && (
                  <div className="filter-dropdown-menu">
                    {filters.map((filter) => (
                      <button
                        key={filter.key}
                        onClick={() => handleFilterSelect(filter.key)}
                        className={`filter-dropdown-item ${(filter.key === 'all' && selectedFilter === null) || selectedFilter === filter.key ? 'active' : ''}`}
                      >
                        {filter.label}
                        {(filter.key === 'all' && selectedFilter === null) || selectedFilter === filter.key ? (
                          <span className="filter-check">✓</span>
                        ) : null}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button 
              className="get-location-btn" 
              onClick={getUserLocation} 
              disabled={isLoadingLocation}
            >
              {isLoadingLocation ? (
                <>
                  <div className="spinner" />
                  <span>{t('map.gettingLocation')}</span>
                </>
              ) : (
                <>
                  <MapPinIcon size={18} />
                  <span>{userLocation ? t('map.updateLocation') : t('map.useLocation')}</span>
                </>
              )}
            </button>
          </div>

          <div className="sidebar-content">
            {loading ? (
              <div className="sidebar-loading">{t('map.loadingClinics')}</div>
            ) : filteredClinics.length > 0 ? (
              <div className="clinic-cards">
                {filteredClinics.map((clinic) => (
                  <div
                    key={clinic.id}
                    className={`clinic-card ${selectedClinic?.id === clinic.id ? 'active' : ''}`}
                    onClick={() => handleClinicClick(clinic)}
                  >
                    <div className="clinic-card-header">
                      <h3 className="clinic-card-name">{clinic.name}</h3>
                      <span className="clinic-card-type">{clinic.type}</span>
                    </div>
                    
                    {clinic.open_hours && (
                      <div className="clinic-card-info">
                        <Clock size={14} />
                        <span>{clinic.open_hours}</span>
                      </div>
                    )}

                    {(clinic.sector || clinic.district || clinic.province) && (
                      <div className="clinic-card-info">
                        <MapPinIcon size={14} />
                        <span>
                          {[clinic.sector, clinic.district, clinic.province]
                            .filter(Boolean)
                            .join(', ')}
                        </span>
                      </div>
                    )}

                    {clinic.phone && (
                      <div className="clinic-card-info">
                        <Phone size={14} />
                        <span>{clinic.phone}</span>
                      </div>
                    )}

                    {clinic.position && (
                      <div className="clinic-card-actions">
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${clinic.position[0]},${clinic.position[1]}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="clinic-card-action-btn"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Navigation size={14} />
                          {t('map.directions')}
                        </a>
                        {clinic.phone && (
                          <a
                            href={`tel:${clinic.phone}`}
                            className="clinic-card-action-btn clinic-card-action-btn-primary"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Phone size={14} />
                            {t('map.call')}
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="sidebar-empty">
                <MapPinIcon size={48} />
                <p>{t('map.noClinics')}</p>
                <p className="sidebar-empty-hint">{t('map.tryAdjusting')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Map section */}
        <div className="map-page-map">
          {loading ? (
            <div className="map-loading">{t('common.loading')}</div>
          ) : (
            <PublicMapView 
              clinics={clinicsWithLocation} 
              userLocation={userLocation}
              selectedClinic={selectedClinic}
              mapCenter={mapCenter}
            />
          )}
        </div>
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

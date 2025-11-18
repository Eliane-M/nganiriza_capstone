import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { PhoneIcon, ExternalLinkIcon } from 'lucide-react';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
});

// Component to center map on user location
function MapCenter({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || 13);
    }
  }, [center, zoom, map]);
  return null;
}

const PublicMapView = ({ clinics, userLocation, selectedClinic, mapCenter: externalMapCenter }) => {
  const [internalSelectedClinic, setInternalSelectedClinic] = useState(null);
  const [mapCenter, setMapCenter] = useState(externalMapCenter || [-1.9441, 30.0619]); // Default to Kigali

  // Use external selectedClinic if provided, otherwise use internal state
  const activeSelectedClinic = selectedClinic !== undefined ? selectedClinic : internalSelectedClinic;

  useEffect(() => {
    // Update map center when external center changes
    if (externalMapCenter) {
      setMapCenter(externalMapCenter);
    } else if (userLocation) {
      setMapCenter(userLocation);
    } else if (clinics && clinics.length > 0 && clinics[0].position) {
      setMapCenter(clinics[0].position);
    }
  }, [externalMapCenter, userLocation, clinics]);

  // Filter clinics that have GPS coordinates
  const clinicsWithLocation = clinics?.filter(clinic => clinic.position) || [];

  return (
    <div className="public-map-container">
      <MapContainer
        center={mapCenter}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        className="public-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapCenter center={mapCenter} zoom={13} />

        {/* User location marker */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={new L.Icon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            })}
          >
            <Popup>Your location</Popup>
          </Marker>
        )}

        {/* Clinic markers */}
        {clinicsWithLocation.map((clinic) => {
          const isSelected = activeSelectedClinic?.id === clinic.id;
          return (
            <Marker
              key={clinic.id}
              position={clinic.position}
              icon={new L.Icon({
                iconUrl: isSelected 
                  ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png'
                  : 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
              })}
              eventHandlers={{
                click: () => {
                  if (selectedClinic === undefined) {
                    setInternalSelectedClinic(clinic);
                  }
                }
              }}
            >
              <Popup>
                <div className="clinic-popup">
                  <div className="font-semibold">{clinic.name}</div>
                  <div className="text-sm text-gray-600">{clinic.type}</div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Clinic details panel - only show if clinic is selected from map click (not from sidebar) */}
      {activeSelectedClinic && selectedClinic === undefined && (
        <div className="clinic-details-panel">
          <button
            onClick={() => setInternalSelectedClinic(null)}
            className="clinic-details-close"
            aria-label="Close"
          >
            ×
          </button>
          <h3 className="clinic-details-title">{activeSelectedClinic.name}</h3>
          <p className="clinic-details-type">{activeSelectedClinic.type}</p>
          
          {activeSelectedClinic.phone && (
            <div className="clinic-details-info">
              <strong>Phone:</strong> {activeSelectedClinic.phone}
            </div>
          )}
          
          {activeSelectedClinic.open_hours && (
            <div className="clinic-details-info">
              <strong>Hours:</strong> {activeSelectedClinic.open_hours}
            </div>
          )}
          
          {(activeSelectedClinic.sector || activeSelectedClinic.district || activeSelectedClinic.province) && (
            <div className="clinic-details-info">
              <strong>Location:</strong>{' '}
              {[activeSelectedClinic.sector, activeSelectedClinic.district, activeSelectedClinic.province]
                .filter(Boolean)
                .join(', ')}
            </div>
          )}

          <div className="clinic-details-actions">
            {activeSelectedClinic.phone && (
              <a
                href={`tel:${activeSelectedClinic.phone}`}
                className="clinic-action-btn"
              >
                <PhoneIcon size={14} />
                Call
              </a>
            )}
            {activeSelectedClinic.position && (
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${activeSelectedClinic.position[0]},${activeSelectedClinic.position[1]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="clinic-action-btn clinic-action-btn-primary"
              >
                <ExternalLinkIcon size={14} />
                Directions
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicMapView;


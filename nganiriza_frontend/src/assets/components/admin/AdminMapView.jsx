import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
});

// Component to handle map clicks
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => {
      onMapClick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

const AdminMapView = ({ clinics, onClinicClick, onMapClick, selectedPosition }) => {
  const [mapCenter, setMapCenter] = useState([-1.9441, 30.0619]); // Default to Kigali

  useEffect(() => {
    // Center map on first clinic or user location if available
    if (clinics && clinics.length > 0 && clinics[0].position) {
      setMapCenter(clinics[0].position);
    }
  }, [clinics]);

  const handleMapClick = (position) => {
    if (onMapClick) {
      onMapClick(position);
    }
  };

  return (
    <div className="admin-map-container">
      <MapContainer
        center={mapCenter}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        className="admin-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapClickHandler onMapClick={handleMapClick} />

        {/* Show existing clinics */}
        {clinics && clinics.map((clinic) => {
          if (!clinic.position) return null;
          return (
            <Marker
              key={clinic.id}
              position={clinic.position}
              icon={new L.Icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
              })}
              eventHandlers={{
                click: () => {
                  if (onClinicClick) {
                    onClinicClick(clinic);
                  }
                }
              }}
            >
              <Popup>
                <div>
                  <strong>{clinic.name}</strong>
                  <br />
                  <small>{clinic.type}</small>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Show selected position (when adding new clinic) */}
        {selectedPosition && (
          <Marker
            position={selectedPosition}
            icon={new L.Icon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            })}
          >
            <Popup>
              <div>
                <strong>New Clinic Location</strong>
                <br />
                <small>Click to add clinic details</small>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default AdminMapView;


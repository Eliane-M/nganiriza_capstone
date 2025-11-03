import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { PhoneIcon, ExternalLinkIcon } from 'lucide-react';
import L from 'leaflet';
// Fix for default marker icons in react-leaflet
// This is needed because the default icons reference assets that don't exist in our build
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
});
interface HealthFacility {
  id: number;
  name: string;
  type: string;
  address: string;
  phone?: string;
  website?: string;
  position: [number, number]; // [latitude, longitude]
  services: string[];
}
interface MapViewProps {
  facilities: HealthFacility[];
  userLocation?: [number, number];
}
export function MapView({
  facilities,
  userLocation
}: MapViewProps) {
  const [selectedFacility, setSelectedFacility] = useState<HealthFacility | null>(null);
  // Default center on Kigali if no user location
  const mapCenter = userLocation || [-1.9441, 30.0619];
  return <div className="h-full w-full flex flex-col">
      <div className="h-[70vh] z-0">
        <MapContainer center={mapCenter} zoom={13} style={{
        height: '100%',
        width: '100%'
      }}>
          <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {userLocation && <Marker position={userLocation} icon={new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        })}>
              <Popup>Your location</Popup>
            </Marker>}
          {facilities.map(facility => <Marker key={facility.id} position={facility.position} icon={new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        })} eventHandlers={{
          click: () => {
            setSelectedFacility(facility);
          }
        }}>
              <Popup>
                <div className="font-semibold">{facility.name}</div>
                <div className="text-sm text-gray-600">{facility.type}</div>
              </Popup>
            </Marker>)}
        </MapContainer>
      </div>
      {selectedFacility && <div className="bg-white shadow-md p-4 rounded-t-lg -mt-6 z-10 relative">
          <h3 className="text-lg font-semibold text-purple-700">
            {selectedFacility.name}
          </h3>
          <p className="text-sm text-gray-600">{selectedFacility.type}</p>
          <p className="text-sm mt-1">{selectedFacility.address}</p>
          <div className="mt-2">
            <h4 className="text-sm font-semibold">Services:</h4>
            <ul className="text-xs text-gray-600 mt-1">
              {selectedFacility.services.map((service, index) => <li key={index} className="mb-1">
                  • {service}
                </li>)}
            </ul>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedFacility.phone && <a href={`tel:${selectedFacility.phone}`} className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full flex items-center">
                <PhoneIcon size={14} className="mr-1" />
                Call
              </a>}
            {selectedFacility.website && <a href={selectedFacility.website} target="_blank" rel="noopener noreferrer" className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full flex items-center">
                <ExternalLinkIcon size={14} className="mr-1" />
                Website
              </a>}
            <a href={`https://www.google.com/maps/dir/?api=1&destination=${selectedFacility.position[0]},${selectedFacility.position[1]}`} target="_blank" rel="noopener noreferrer" className="text-sm bg-teal-100 text-teal-700 px-3 py-1 rounded-full flex items-center">
              Directions
            </a>
          </div>
        </div>}
    </div>;
}
import React, { useContext } from 'react';
import { ResourceCard } from '../components/ResourceCard';
import { MapPinIcon, SearchIcon } from 'lucide-react';
import { LanguageContext } from '../context/LanguageContext';
export function ResourcesPage() {
  const {
    language
  } = useContext(LanguageContext);
  const translations = {
    title: {
      en: 'Health Resources',
      fr: 'Ressources de Santé',
      rw: "Ibikoresho by'Ubuzima"
    },
    search: {
      en: 'Search resources near you',
      fr: 'Rechercher des ressources près de chez vous',
      rw: 'Gushaka ibikoresho hafi yawe'
    },
    nearby: {
      en: 'Nearby Services',
      fr: 'Services à Proximité',
      rw: 'Serivisi Ziri Hafi'
    }
  };
  // Mock data for health resources
  const resources = [{
    id: 1,
    title: 'Youth Health Center',
    description: 'Confidential services for young people including counseling, testing, and education.',
    address: 'KG 123 St, Kigali',
    phone: '+250 78 123 4567',
    website: 'https://example.com',
    distance: '1.2 km'
  }, {
    id: 2,
    title: 'Reproductive Health Clinic',
    description: 'Specialized healthcare for reproductive and sexual health needs.',
    address: 'KG 456 St, Kigali',
    phone: '+250 78 987 6543',
    distance: '3.5 km'
  }, {
    id: 3,
    title: 'Community Health Center',
    description: 'General healthcare services including SRH education and support.',
    address: 'KG 789 St, Kigali',
    phone: '+250 78 567 8901',
    website: 'https://example.com',
    distance: '5.0 km'
  }];
  return <div className="min-h-screen bg-purple-50">
      <div className="bg-purple-600 text-white p-4">
        <h1 className="text-xl font-semibold">
          {translations.title[language as keyof typeof translations.title]}
        </h1>
      </div>
      <div className="p-4">
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center border border-gray-300 rounded-lg p-2">
            <SearchIcon size={20} className="text-gray-400 mr-2" />
            <input type="text" placeholder={translations.search[language as keyof typeof translations.search]} className="flex-1 outline-none text-sm" />
          </div>
          <div className="flex items-center justify-center mt-4">
            <button className="flex items-center justify-center bg-teal-100 text-teal-700 px-4 py-2 rounded-lg">
              <MapPinIcon size={18} className="mr-2" />
              <span>Use my location</span>
            </button>
          </div>
        </div>
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          {translations.nearby[language as keyof typeof translations.nearby]}
        </h2>
        {resources.map(resource => <ResourceCard key={resource.id} title={resource.title} description={resource.description} address={resource.address} phone={resource.phone} website={resource.website} distance={resource.distance} />)}
      </div>
    </div>;
}
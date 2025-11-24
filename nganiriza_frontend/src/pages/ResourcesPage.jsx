import React, { useContext, useState } from 'react';
import { ResourceCard } from '../assets/components/ResourceCard.tsx';
import { MapPin as MapPinIcon, Search as SearchIcon } from 'lucide-react';
import { LanguageContext } from '../contexts/AppContext';
import { useTranslation } from '../utils/translations';
import Navbar from '../assets/components/Navbar';
import '../assets/css/resources/resources_page.scss';

export function ResourcesPage() {
  const { language } = useContext(LanguageContext);
  const { t } = useTranslation(language);

  const resources = [
    { id: 1, title: 'Youth Health Center', description: 'Confidential services for young people including counseling, testing, and education.', address: 'KG 123 St, Kigali', phone: '+250 78 123 4567', website: 'https://example.com', distance: '1.2 km' },
    { id: 2, title: 'Reproductive Health Clinic', description: 'Specialized healthcare for reproductive and sexual health needs.', address: 'KG 456 St, Kigali', phone: '+250 78 987 6543', distance: '3.5 km' },
    { id: 3, title: 'Community Health Center', description: 'General healthcare services including SRH education and support.', address: 'KG 789 St, Kigali', phone: '+250 78 567 8901', website: 'https://example.com', distance: '5.0 km' }
  ];

  const [query, setQuery] = useState('');

  const filtered = resources.filter(r => (r.title + r.description + r.address).toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="resources-page">
      <Navbar />
      <div className="page-header"><h1>{t('resources.title')}</h1></div>

      <div className="body">
        <div className="search-card">
          <div className="input-row">
            <SearchIcon size={20} style={{ color: '#9ca3af', marginRight: 8 }} />
            <input
              type="text"
              placeholder={t('resources.search')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 16 }}>
            <button className="use-location">
              <MapPinIcon size={18} style={{ marginRight: 8 }} />
              <span>{t('resources.useLocation')}</span>
            </button>
          </div>
        </div>

        <h2>{t('resources.nearby')}</h2>
        {filtered.map((resource) => (
          <ResourceCard
            key={resource.id}
            title={resource.title}
            description={resource.description}
            address={resource.address}
            phone={resource.phone}
            website={resource.website}
            distance={resource.distance}
          />
        ))}
      </div>
    </div>
  );
}
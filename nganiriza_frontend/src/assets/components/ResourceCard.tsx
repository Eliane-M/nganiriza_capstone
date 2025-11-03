import React from 'react';
import { ExternalLinkIcon } from 'lucide-react';
interface ResourceCardProps {
  title: string;
  description: string;
  address?: string;
  phone?: string;
  website?: string;
  distance?: string;
}
export function ResourceCard({
  title,
  description,
  address,
  phone,
  website,
  distance
}: ResourceCardProps) {
  return <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-purple-700">{title}</h3>
        {distance && <span className="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded">
            {distance} away
          </span>}
      </div>
      <p className="text-sm text-gray-600 mt-2">{description}</p>
      {address && <div className="mt-3 text-sm">
          <p className="text-gray-700">{address}</p>
        </div>}
      <div className="mt-4 flex flex-wrap gap-2">
        {phone && <a href={`tel:${phone}`} className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full flex items-center">
            Call
          </a>}
        {website && <a href={website} target="_blank" rel="noopener noreferrer" className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full flex items-center">
            Visit <ExternalLinkIcon size={14} className="ml-1" />
          </a>}
      </div>
    </div>;
}
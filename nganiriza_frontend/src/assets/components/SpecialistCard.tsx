import React from 'react';
import { PhoneIcon, MessageCircleIcon, VideoIcon, ClockIcon, StarIcon } from 'lucide-react';
interface SpecialistCardProps {
  id: string;
  name: string;
  specialty: string;
  imageUrl: string;
  availability: string;
  rating: number;
  isOnline: boolean;
  onTextChat: (id: string) => void;
  onVideoCall: (id: string) => void;
}
export function SpecialistCard({
  id,
  name,
  specialty,
  imageUrl,
  availability,
  rating,
  isOnline,
  onTextChat,
  onVideoCall
}: SpecialistCardProps) {
  return <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex items-start">
        <div className="relative">
          <img src={imageUrl} alt={name} className="w-16 h-16 rounded-full object-cover mr-4" />
          <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-purple-700">{name}</h3>
          <p className="text-sm text-gray-600">{specialty}</p>
          <div className="flex items-center mt-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => <StarIcon key={i} size={14} className={i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'} />)}
            </div>
            <span className="text-xs text-gray-500 ml-1">
              {rating.toFixed(1)}
            </span>
          </div>
          <div className="flex items-center mt-1 text-xs text-gray-500">
            <ClockIcon size={12} className="mr-1" />
            <span>{availability}</span>
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-between">
        <button onClick={() => onTextChat(id)} className="flex-1 mr-2 flex justify-center items-center bg-purple-100 text-purple-700 py-2 rounded-lg hover:bg-purple-200 transition">
          <MessageCircleIcon size={16} className="mr-1" />
          <span>Chat</span>
        </button>
        <button onClick={() => onVideoCall(id)} className="flex-1 flex justify-center items-center bg-teal-100 text-teal-700 py-2 rounded-lg hover:bg-teal-200 transition">
          <VideoIcon size={16} className="mr-1" />
          <span>Video</span>
        </button>
      </div>
    </div>;
}
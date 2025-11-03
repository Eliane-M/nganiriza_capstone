import React, { useEffect, useState } from 'react';
import { MicIcon, MicOffIcon, VideoIcon, VideoOffIcon, PhoneIcon, MessageCircleIcon, ArrowLeftIcon } from 'lucide-react';
interface VideoCallInterfaceProps {
  specialist: {
    id: string;
    name: string;
    specialty: string;
    imageUrl: string;
  };
  onBack: () => void;
  onSwitchToTextChat: () => void;
}
export function VideoCallInterface({
  specialist,
  onBack,
  onSwitchToTextChat
}: VideoCallInterfaceProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);
  useEffect(() => {
    // Simulate connecting to call
    const connectTimer = setTimeout(() => {
      setIsConnected(true);
    }, 2000);
    // Timer for call duration
    let timer: NodeJS.Timeout;
    if (isConnected) {
      timer = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      clearTimeout(connectTimer);
      if (timer) clearInterval(timer);
    };
  }, [isConnected]);
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  const handleEndCall = () => {
    onBack();
  };
  return <div className="flex flex-col h-full bg-gray-900">
      <div className="bg-gray-800 text-white p-4 flex items-center">
        <button onClick={onBack} className="mr-2">
          <ArrowLeftIcon size={20} />
        </button>
        <div className="flex items-center">
          <img src={specialist.imageUrl} alt={specialist.name} className="w-8 h-8 rounded-full object-cover mr-2" />
          <div>
            <h1 className="text-base font-semibold">{specialist.name}</h1>
            <p className="text-xs opacity-80">
              {isConnected ? `Connected - ${formatTime(elapsedTime)}` : 'Connecting...'}
            </p>
          </div>
        </div>
      </div>
      <div className="flex-1 relative">
        {/* Specialist video (large) */}
        <div className="absolute inset-0 flex items-center justify-center">
          {isConnected ? <img src={specialist.imageUrl} alt="Video feed" className="w-full h-full object-cover" /> : <div className="flex flex-col items-center justify-center text-white">
              <div className="w-16 h-16 border-4 border-t-transparent border-purple-500 rounded-full animate-spin mb-4"></div>
              <p>Connecting to specialist...</p>
            </div>}
        </div>
        {/* User video (small) */}
        {isConnected && isVideoOn && <div className="absolute bottom-4 right-4 w-32 h-48 rounded-lg overflow-hidden border-2 border-white shadow-lg">
            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
              <UserIcon size={48} className="text-gray-500" />
            </div>
          </div>}
      </div>
      <div className="bg-gray-800 p-4">
        <div className="flex justify-center space-x-4">
          <button onClick={() => setIsMicOn(!isMicOn)} className={`p-3 rounded-full ${isMicOn ? 'bg-gray-700' : 'bg-red-500'}`}>
            {isMicOn ? <MicIcon size={24} className="text-white" /> : <MicOffIcon size={24} className="text-white" />}
          </button>
          <button onClick={handleEndCall} className="p-3 rounded-full bg-red-600">
            <PhoneIcon size={24} className="text-white" />
          </button>
          <button onClick={() => setIsVideoOn(!isVideoOn)} className={`p-3 rounded-full ${isVideoOn ? 'bg-gray-700' : 'bg-red-500'}`}>
            {isVideoOn ? <VideoIcon size={24} className="text-white" /> : <VideoOffIcon size={24} className="text-white" />}
          </button>
          <button onClick={onSwitchToTextChat} className="p-3 rounded-full bg-gray-700">
            <MessageCircleIcon size={24} className="text-white" />
          </button>
        </div>
      </div>
    </div>;
}
// Helper component for user icon
function UserIcon({
  size,
  className
}: {
  size: number;
  className: string;
}) {
  return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>;
}
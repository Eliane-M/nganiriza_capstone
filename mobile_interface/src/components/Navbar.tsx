import React, { useContext } from 'react';
import { HomeIcon, MessageCircleIcon, BookOpenIcon, HeartIcon, MapPinIcon, UserIcon } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}
export function Navbar({
  currentPage,
  setCurrentPage
}: NavbarProps) {
  const {
    isAuthenticated,
    user
  } = useContext(AuthContext);
  const navItems = [{
    id: 'home',
    label: 'Home',
    icon: HomeIcon
  }, {
    id: 'chat',
    label: 'Chat',
    icon: MessageCircleIcon
  }, {
    id: 'specialists',
    label: 'Specialists',
    icon: UserIcon
  }, {
    id: 'map',
    label: 'Map',
    icon: MapPinIcon
  }, {
    id: 'resources',
    label: 'Resources',
    icon: HeartIcon
  }];
  return <div className="fixed bottom-0 w-full bg-white shadow-lg">
      <div className="flex justify-around items-center h-16">
        {navItems.map(item => {
        const Icon = item.icon;
        return <button key={item.id} onClick={() => setCurrentPage(item.id)} className={`flex flex-col items-center justify-center w-full h-full ${currentPage === item.id ? 'text-purple-600' : 'text-gray-500'}`}>
              <Icon size={24} className={currentPage === item.id ? 'text-purple-600' : 'text-gray-500'} />
              <span className="text-xs mt-1">{item.label}</span>
            </button>;
      })}
      </div>
    </div>;
}
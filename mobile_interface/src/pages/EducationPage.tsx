import React, { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { BookOpenIcon, ShieldIcon, HeartIcon, UsersIcon } from 'lucide-react';
export function EducationPage() {
  const {
    language
  } = useContext(LanguageContext);
  const translations = {
    title: {
      en: 'Learn About SRH',
      fr: 'Apprendre sur la SSR',
      rw: "Kwiga ku buzima bw'imyororokere"
    },
    topics: {
      en: 'Topics',
      fr: 'Sujets',
      rw: 'Ingingo'
    }
  };
  const topics = [{
    id: 'puberty',
    title: {
      en: 'Puberty & Body Changes',
      fr: 'Puberté et Changements Corporels',
      rw: "Ubugimbi n'Impinduka z'Umubiri"
    },
    icon: UsersIcon,
    color: 'bg-purple-100 text-purple-700 border-purple-200'
  }, {
    id: 'relationships',
    title: {
      en: 'Healthy Relationships',
      fr: 'Relations Saines',
      rw: 'Imibanire Myiza'
    },
    icon: HeartIcon,
    color: 'bg-pink-100 text-pink-700 border-pink-200'
  }, {
    id: 'contraception',
    title: {
      en: 'Contraception & Protection',
      fr: 'Contraception et Protection',
      rw: 'Uburyo bwo Kwirinda no Kwirinda'
    },
    icon: ShieldIcon,
    color: 'bg-blue-100 text-blue-700 border-blue-200'
  }, {
    id: 'sti',
    title: {
      en: 'STIs & Prevention',
      fr: 'IST et Prévention',
      rw: "Indwara z'Imibonano Mpuzabitsina n'Uburyo bwo Kuzirinda"
    },
    icon: BookOpenIcon,
    color: 'bg-teal-100 text-teal-700 border-teal-200'
  }];
  return <div className="min-h-screen bg-purple-50">
      <div className="bg-purple-600 text-white p-4">
        <h1 className="text-xl font-semibold">
          {translations.title[language as keyof typeof translations.title]}
        </h1>
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          {translations.topics[language as keyof typeof translations.topics]}
        </h2>
        <div className="grid gap-4">
          {topics.map(topic => {
          const Icon = topic.icon;
          return <div key={topic.id} className={`${topic.color} p-4 rounded-lg border shadow-sm`}>
                <div className="flex items-center">
                  <div className="rounded-full bg-white p-2 mr-3">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-medium">
                    {topic.title[language as keyof typeof topic.title]}
                  </h3>
                </div>
              </div>;
        })}
        </div>
        <div className="mt-6 bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold text-purple-700 mb-2">Did you know?</h3>
          <p className="text-sm text-gray-700">
            Regular conversations about sexual health help young people make
            informed decisions and develop healthy attitudes about their bodies
            and relationships.
          </p>
        </div>
      </div>
    </div>;
}
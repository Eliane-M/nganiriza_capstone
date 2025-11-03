import React, { useContext } from 'react';
import { LanguageContext } from '../assets/components/context/LanguageContext';
import { BookOpen as BookOpenIcon, Shield as ShieldIcon, Heart as HeartIcon, Users as UsersIcon } from 'lucide-react';
import '../assets/css/educationPage/education_page.scss';

export function EducationPage() {
  const { language } = useContext(LanguageContext);

  const translations = {
    title: { en: 'Learn About SRH', fr: 'Apprendre sur la SSR', rw: "Kwiga ku buzima bw'imyororokere" },
    topics: { en: 'Topics', fr: 'Sujets', rw: 'Ingingo' }
  };

  const topics = [
    { id: 'puberty', title: { en: 'Puberty & Body Changes', fr: 'Puberté et Changements Corporels', rw: "Ubugimbi n'Impinduka z'Umubiri" }, icon: UsersIcon, className: 'purple' },
    { id: 'relationships', title: { en: 'Healthy Relationships', fr: 'Relations Saines', rw: 'Imibanire Myiza' }, icon: HeartIcon, className: 'pink' },
    { id: 'contraception', title: { en: 'Contraception & Protection', fr: 'Contraception et Protection', rw: 'Uburyo bwo Kwirinda no Kwirinda' }, icon: ShieldIcon, className: 'blue' },
    { id: 'sti', title: { en: 'STIs & Prevention', fr: 'IST et Prévention', rw: "Indwara z'Imibonano Mpuzabitsina n'Uburyo bwo Kuzirinda" }, icon: BookOpenIcon, className: 'teal' }
  ];

  return (
    <div className="education_page">
      <div className="page-header"><h1>{translations.title[language]}</h1></div>
      <div className="topics-wrap">
        <h2>{translations.topics[language]}</h2>
        <div className="grid">
          {topics.map((topic) => {
            const Icon = topic.icon;
            return (
              <div key={topic.id} className={`topic-card ${topic.className}`}>
                <div className="icon-wrap"><Icon size={24} /></div>
                <h3 className="title">{topic.title[language]}</h3>
              </div>
            );
          })}
        </div>

        <div className="did-you-know">
          <h3>Did you know?</h3>
          <p>
            Regular conversations about sexual health help young people make informed decisions and
            develop healthy attitudes about their bodies and relationships.
          </p>
        </div>
      </div>
    </div>
  );
}
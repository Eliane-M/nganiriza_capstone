import React, { useContext } from 'react';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { LanguageContext } from '../context/LanguageContext';
import { AuthContext } from '../context/AuthContext';
import { MessageCircleIcon, BookOpenIcon, HeartIcon, ShieldIcon, UserIcon, MapPinIcon, LogInIcon, UserPlusIcon, LogOutIcon } from 'lucide-react';

interface HomePageProps {
  navigateTo: (page: string) => void;
}

export function HomePage({ navigateTo }: HomePageProps) {
  const { language = 'en' } = useContext(LanguageContext) || {};
  const { isAuthenticated, user, logout } = useContext(AuthContext) || {};

  const translations = {
    title: {
      en: 'Nganiriza',
      fr: 'Nganiriza',
      rw: 'Nganiriza'
    },
    subtitle: {
      en: 'Your trusted companion for sexual and reproductive health',
      fr: 'Votre compagnon de confiance pour la santé sexuelle et reproductive',
      rw: "Inshuti yawe y'icyizere ku bijyanye n'ubuzima bw'imyororokere"
    },
    intro: {
      en: 'Start your journey with confidence. Get answers, find support, and access resources—all in a safe, private space.',
      fr: 'Commencez votre parcours en toute confiance. Obtenez des réponses, trouvez du soutien et accédez aux ressources.',
      rw: 'Tangira urugendo rwawe ukizeye. Kubona ibisubizo, gushaka inkunga, no kubona ibikoresho.'
    },
    privacy: {
      en: 'Private & Confidential',
      fr: 'Privé et Confidentiel',
      rw: "Birihariye kandi n'Ibanga"
    },
    aiChat: {
      en: 'Chat with AI',
      fr: "Discuter avec l'IA",
      rw: 'Kuganira na AI'
    },
    aiChatDesc: {
      en: 'Get instant answers to your questions',
      fr: 'Obtenez des réponses instantanées',
      rw: 'Kubona ibisubizo byihuse'
    },
    specialists: {
      en: 'Talk to Specialists',
      fr: 'Parler aux Spécialistes',
      rw: "Kuvugana n'Inzobere"
    },
    specialistsDesc: {
      en: 'Connect with health professionals',
      fr: 'Connectez-vous avec des professionnels',
      rw: 'Guhuza nabazobere buzima'
    },
    map: {
      en: 'Find on Map',
      fr: 'Trouver sur la Carte',
      rw: 'Gushaka kuri Map'
    },
    mapDesc: {
      en: 'Locate nearby health services',
      fr: 'Localiser les services de santé',
      rw: 'Gushaka serivisi zubuzima'
    },
    learn: {
      en: 'Learn',
      fr: 'Apprendre',
      rw: 'Kwiga'
    },
    learnDesc: {
      en: 'Educational resources for teens',
      fr: 'Ressources éducatives pour les adolescents',
      rw: 'Ibikoresho byuburezi kurubyiruko'
    },
    resources: {
      en: 'Find Resources',
      fr: 'Trouver des Ressources',
      rw: 'Gushaka Ibikoresho'
    },
    resourcesDesc: {
      en: 'Support tailored for you',
      fr: 'Soutien adapté pour vous',
      rw: 'Inkunga yakozwe kuri wewe'
    },
    login: {
      en: 'Log In',
      fr: 'Se Connecter',
      rw: 'Kwinjira'
    },
    signup: {
      en: 'Sign Up',
      fr: "S'inscrire",
      rw: 'Kwiyandikisha'
    },
    logout: {
      en: 'Log Out',
      fr: 'Se Déconnecter',
      rw: 'Gusohoka'
    },
    welcome: {
      en: 'Welcome',
      fr: 'Bienvenue',
      rw: 'Murakaza neza'
    },
    getStarted: {
      en: 'Get Started',
      fr: 'Commencer',
      rw: 'Tangira'
    }
  };

  const features = [
    {
      id: 'chat',
      icon: MessageCircleIcon,
      title: translations.aiChat[language as keyof typeof translations.aiChat],
      description: translations.aiChatDesc[language as keyof typeof translations.aiChatDesc],
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      id: 'specialists',
      icon: UserIcon,
      title: translations.specialists[language as keyof typeof translations.specialists],
      description: translations.specialistsDesc[language as keyof typeof translations.specialistsDesc],
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      id: 'map',
      icon: MapPinIcon,
      title: translations.map[language as keyof typeof translations.map],
      description: translations.mapDesc[language as keyof typeof translations.mapDesc],
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      id: 'education',
      icon: BookOpenIcon,
      title: translations.learn[language as keyof typeof translations.learn],
      description: translations.learnDesc[language as keyof typeof translations.learnDesc],
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      id: 'resources',
      icon: HeartIcon,
      title: translations.resources[language as keyof typeof translations.resources],
      description: translations.resourcesDesc[language as keyof typeof translations.resourcesDesc],
      gradient: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-purple-700 mb-2">
              {translations.title[language as keyof typeof translations.title]}
            </h1>
            <div className="flex items-center gap-2 text-xs text-purple-600 bg-purple-50 px-3 py-1.5 rounded-full w-fit">
              <ShieldIcon size={14} strokeWidth={2.5} />
              <span className="font-semibold">
                {translations.privacy[language as keyof typeof translations.privacy]}
              </span>
            </div>
          </div>
          <LanguageSwitcher />
        </div>

        {/* Hero Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-3 leading-tight">
            {translations.subtitle[language as keyof typeof translations.subtitle]}
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            {translations.intro[language as keyof typeof translations.intro]}
          </p>
        </div>

        {/* Auth Buttons */}
        {!isAuthenticated ? (
          <div className="flex gap-3 mb-8">
            <button
              onClick={() => navigateTo('login')}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl text-white font-semibold shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-purple-300 transition-all active:scale-95"
            >
              <LogInIcon size={18} strokeWidth={2.5} />
              <span>{translations.login[language as keyof typeof translations.login]}</span>
            </button>
            <button
              onClick={() => navigateTo('signup')}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 bg-white border-2 border-purple-600 rounded-xl text-purple-600 font-semibold hover:bg-purple-50 transition-all active:scale-95 shadow-sm"
            >
              <UserPlusIcon size={18} strokeWidth={2.5} />
              <span>{translations.signup[language as keyof typeof translations.signup]}</span>
            </button>
          </div>
        ) : (
          <div className="mb-8 bg-white rounded-2xl p-4 shadow-md border border-purple-100">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-base font-bold text-gray-800">
                  {translations.welcome[language as keyof typeof translations.welcome]}, {user?.name}!
                </p>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-purple-600">
                  <ShieldIcon size={12} />
                  <span>{translations.privacy[language as keyof typeof translations.privacy]}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  logout();
                  navigateTo('home');
                }}
                className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-200 transition-all"
              >
                <LogOutIcon size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Feature Cards Grid */}
      <div className="px-5 pb-24">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          {translations.getStarted[language as keyof typeof translations.getStarted]}
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <button
                key={feature.id}
                onClick={() => navigateTo(feature.id)}
                className="bg-white p-5 rounded-2xl flex items-start border-2 border-purple-100 shadow-sm hover:shadow-lg hover:border-purple-300 transition-all active:scale-98 group"
              >
                <div className={`bg-gradient-to-br ${feature.gradient} p-3 rounded-xl mr-4 shadow-md group-hover:shadow-lg transition-all`}>
                  <Icon size={24} strokeWidth={2.5} className="text-white" />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="text-base font-bold text-gray-800 mb-1 group-hover:text-purple-700 transition-colors">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
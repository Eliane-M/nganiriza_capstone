// Centralized translations for English and Kinyarwanda

export const translations = {
  en: {
    // Navigation
    nav: {
      home: 'Home',
      chat: 'Chat',
      specialists: 'Specialists',
      map: 'Map',
      learn: 'Learn',
      profile: 'Profile',
    },
    
    // Home Page
    home: {
      heroTitle: "Your trusted companion for",
      heroTitleHighlight: "sexual and reproductive health",
      heroDescription: "Get your journey with confidence. Get answers, find support, and stay empowered in a safe, private space.",
      startChatting: "Start Chatting with AI",
      installApp: "Install App",
      features: {
        aiCompanion: {
          title: "AI Health Companion",
          desc: "Get instant, accurate answers about your body and health changes"
        },
        specialists: {
          title: "Expert Specialists",
          desc: "Connect with certified healthcare professionals who understand you"
        },
        map: {
          title: "Health Services Map",
          desc: "Find nearby clinics, pharmacies, and emergency services instantly"
        },
        education: {
          title: "Educational Resources",
          desc: "Learn about your body with age-appropriate, medically accurate content"
        }
      },
      ctaTitle: "Everything you need to feel confident and informed",
      ctaButton: "Get Started Today",
      footer: {
        title: "Nganiriza",
        description: "Your trusted companion for sexual and reproductive health",
        quickLinks: "Quick Links",
        resources: "Resources",
        legal: "Legal",
        educationalResources: "Educational Resources",
        findSpecialist: "Find a Specialist",
        healthServices: "Health Services",
        privacyPolicy: "Privacy Policy",
        termsOfService: "Terms of Service",
        helpCenter: "Help Center",
        copyright: "All rights reserved."
      }
    },

    // Chat Page
    chat: {
      placeholder: "Type a message...",
      typing: "AI is typing...",
      back: "Back",
      newChat: "New Chat",
      chatHistory: "Chat History",
      noConversations: "No conversations yet",
      online: "Online",
      aiCompanion: "AI Health Companion"
    },

    // Map Page
    map: {
      searchPlaceholder: "Search health services...",
      useLocation: "Use my location",
      updateLocation: "Update my location",
      gettingLocation: "Getting location...",
      loadingClinics: "Loading clinics...",
      noClinics: "No clinics found",
      tryAdjusting: "Try adjusting your search or filters",
      directions: "Directions",
      call: "Call",
      filters: {
        all: "All",
        clinic: "Clinic",
        hotline: "Hotline",
        counselor: "Counselor",
        ngo: "NGO",
        hospital: "Hospital",
        youthClinic: "Youth Clinic"
      }
    },

    // Resources Page
    resources: {
      title: "Health Resources",
      search: "Search resources near you",
      nearby: "Nearby Services",
      useLocation: "Use my location"
    },

    // Learn Page
    learn: {
      title: "Learn About Health",
      subtitle: "Educational articles about sexual and reproductive health",
      search: "Search articles...",
      allTopics: "All Topics",
      readMore: "Read More",
      minRead: "min read",
      noArticles: "No articles found",
      tags: {
        all: "All Topics",
        puberty: "Puberty",
        relationships: "Relationships",
        contraception: "Contraception",
        sti: "STIs",
        menstruation: "Menstruation"
      }
    },

    // Article Detail
    article: {
      back: "Back to Articles",
      readTime: "min read",
      loading: "Loading article...",
      error: "Error loading article"
    },

    // Specialists Page
    specialists: {
      title: "Find a Specialist",
      search: "Search specialists...",
      noSpecialists: "No specialists found",
      contact: "Contact",
      message: "Message",
      bookAppointment: "Book Appointment",
      specialties: "Specialties",
      experience: "Experience",
      rating: "Rating",
      contactNew: "Contact New Specialist",
      mySpecialists: "My Specialists",
      active: "Active",
      past: "Past",
      noContacted: "No contacted specialists yet",
      viewProfile: "View Profile",
      subject: "Subject",
      subjectPlaceholder: "Short summary",
      messagePlaceholder: "Introduce yourself and describe how they can help...",
      sendMessage: "Send message",
      preferredDate: "Preferred date",
      preferredTime: "Preferred time",
      notes: "Notes (optional)",
      notesPlaceholder: "Share any symptoms or preferences...",
      sendAppointmentRequest: "Send appointment request",
      backToSpecialists: "Back to Specialists",
      messages: "Messages",
      appointments: "Appointments",
      signInToRequest: "Please sign in to request an appointment.",
      selectDateAndTime: "Please select a date and time.",
      appointmentRequestSent: "Appointment request sent successfully.",
      unableToSubmitAppointment: "Unable to submit appointment request.",
      addSubjectAndMessage: "Please add a subject and message.",
      messageDelivered: "Message delivered to the specialist.",
      unableToSendMessage: "Unable to send your message."
    },

    // Profile Page
    profile: {
      title: "My Profile",
      edit: "Edit Profile",
      personalInfo: "Personal Information",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email",
      phone: "Phone",
      dateOfBirth: "Date of Birth",
      save: "Save Changes",
      cancel: "Cancel",
      accountInfo: "Account Information",
      notProvided: "Not provided"
    },

    // Auth Pages
    auth: {
      login: {
        title: "Welcome Back",
        subtitle: "Sign in to continue to Nganiriza",
        email: "Email",
        password: "Password",
        rememberMe: "Remember me",
        forgotPassword: "Forgot password?",
        signIn: "Sign In",
        noAccount: "Don't have an account?",
        signUp: "Sign Up",
        orContinueWith: "Or continue with"
      },
      signup: {
        title: "Create Account",
        subtitle: "Join Nganiriza to get started",
        firstName: "First Name",
        lastName: "Last Name",
        email: "Email",
        password: "Password",
        confirmPassword: "Confirm Password",
        createAccount: "Create Account",
        haveAccount: "Already have an account?",
        signIn: "Sign In",
        userType: "I am a:",
        user: "User",
        specialist: "Specialist"
      },
      resetPassword: {
        title: "Reset Password",
        subtitle: "Enter your email address and we'll send you a link to reset your password",
        email: "Email Address",
        sendLink: "Send Reset Link",
        backToLogin: "Back to Login"
      },
      verifyCode: {
        title: "Verify Your Email",
        subtitle: "We've sent a verification code to",
        enterCode: "Enter the 6-digit code",
        verify: "Verify",
        resend: "Resend Code",
        back: "Back"
      },
      setNewPassword: {
        title: "Set New Password",
        subtitle: "Enter your new password below",
        newPassword: "New Password",
        confirmPassword: "Confirm New Password",
        updatePassword: "Update Password",
        backToLogin: "Back to Login"
      },
      invalidLink: {
        title: "Invalid Link",
        subtitle: "This link has expired or is invalid. Please request a new one.",
        backToLogin: "Back to Login",
        message: "Please request a new password reset link to continue.",
        requestNew: "Request New Link"
      }
    },

    // Admin Pages
    admin: {
      dashboard: "Dashboard",
      home: "Home",
      map: "Map Management",
      learning: "Learning Resources",
      specialists: "Specialist Approval",
      users: "User Management",
      mapDescription: "Add and manage health clinics",
      learningDescription: "Create and edit educational articles",
      specialistsDescription: "Review and approve specialist profiles",
      usersDescription: "View and manage all users",
      managePlatform: "Manage your platform from here"
    },

    // Common
    common: {
      loading: "Loading...",
      error: "An error occurred",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      close: "Close",
      submit: "Submit",
      search: "Search",
      filter: "Filter",
      clear: "Clear",
      apply: "Apply",
      navigation: "Navigation",
      language: "Language",
      logOut: "Log Out",
      switchToLight: "Switch to Light Mode",
      switchToDark: "Switch to Dark Mode",
      retry: "Retry"
    }
  },

  rw: {
    // Navigation
    nav: {
      home: 'Utangira',
      chat: 'Vugana',
      specialists: 'Inyangamugayo',
      map: 'Ikarita',
      learn: 'Wige',
      profile: 'Umwirondoro',
    },
    
    // Home Page
    home: {
      heroTitle: "Umujyanama wawe wizewe ku",
      heroTitleHighlight: "ubuzima bw'imyororokere n'urubyaro",
      heroDescription: "Gira urugendo rwawe mu kwizera. Bona ibisubizo, shakisha ubwiyunge, kandi ube ufite imbaraga mu cyanya gisanzwe, gifite ubwigenge.",
      startChatting: "Tangira Kuvugana na AI",
      installApp: "Shyiramo Porogaramu",
      features: {
        aiCompanion: {
          title: "Umujyanama wa AI ku Buzima",
          desc: "Bona ibisubizo byihuse, by'ukuri ku mubiri wawe no ku mpinduka z'ubuzima"
        },
        specialists: {
          title: "Inyangamugayo z'Ubuhanga",
          desc: "Vugana n'abaganga bafite uburenganzira bakumva"
        },
        map: {
          title: "Ikarita y'Ubuzima",
          desc: "Shakisha amavuriro, amavuriro y'ubuvuzi, n'imirimo y'umutekano byihuse"
        },
        education: {
          title: "Inyigisho",
          desc: "Wige ku mubiri wawe ukoresheje inyigisho zihuje n'imyaka, z'ukuri mu buvuzi"
        }
      },
      ctaTitle: "Ibintu byose ukenera kugira kwizera no kumenya",
      ctaButton: "Tangira Uyu munsi",
      footer: {
        title: "Nganiriza",
        description: "Umujyanama wawe wizewe ku buzima bw'imyororokere n'urubyaro",
        quickLinks: "Ihuza vya Vuba",
        resources: "Inyigisho",
        legal: "Amategeko",
        educationalResources: "Inyigisho",
        findSpecialist: "Shakisha Inyangamugayo",
        healthServices: "Serivisi z'Ubuzima",
        privacyPolicy: "Politiki y'Ubwigenge",
        termsOfService: "Amabwiriza y'Uburyo",
        helpCenter: "Inzu y'Ubufasha",
        copyright: "Uburenganzira bwose burabitswe."
      }
    },

    // Chat Page
    chat: {
      placeholder: "Andika ubutumwa...",
      typing: "AI iri kwandika...",
      back: "Subira inyuma",
      newChat: "Inkuru Nshya",
      chatHistory: "Amateka y'Inkuru",
      noConversations: "Nta nkuru zigezeho",
      online: "Kuri interineti",
      aiCompanion: "Umujyanama wa AI ku Buzima"
    },

    // Map Page
    map: {
      searchPlaceholder: "Shakisha serivisi z'ubuzima...",
      useLocation: "Koresha aho ndi",
      updateLocation: "Gusubiramo aho ndi",
      gettingLocation: "Gushaka aho ndi...",
      loadingClinics: "Gusubiramo amavuriro...",
      noClinics: "Nta mavuriro abonetse",
      tryAdjusting: "Gerageza guhindura gushakisha cyangwa gukoresha amashusho",
      directions: "Inzira",
      call: "Hamagara",
      filters: {
        all: "Byose",
        clinic: "Kliniki",
        hotline: "Telefoni y'Ubufasha",
        counselor: "Umugenzuzi",
        ngo: "NGO",
        hospital: "Ibitaro",
        youthClinic: "Kliniki y'Abana"
      }
    },

    // Resources Page
    resources: {
      title: "Ibikoresho by'Ubuzima",
      search: "Shakisha ibikoresho hafi yawe",
      nearby: "Serivisi Ziri Hafi",
      useLocation: "Koresha aho ndi"
    },

    // Learn Page
    learn: {
      title: "Wige Ku Buzima",
      subtitle: "Ingingo zerekana ubuzima bw'imyororokere n'urubyaro",
      search: "Shakisha ingingo...",
      allTopics: "Ingingo Zose",
      readMore: "Soma Byinshi",
      minRead: "iminota",
      noArticles: "Nta ngingo zabonetse",
      tags: {
        all: "Ingingo Zose",
        puberty: "Ubugimbi",
        relationships: "Imibanire",
        contraception: "Kurinda",
        sti: "Indwara",
        menstruation: "Imihango"
      }
    },

    // Article Detail
    article: {
      back: "Subira ku Ngingo",
      readTime: "iminota",
      loading: "Gusubiramo ingingo...",
      error: "Ikosa mu gusubiramo ingingo"
    },

    // Specialists Page
    specialists: {
      title: "Shakisha Inyangamugayo",
      search: "Shakisha inyangamugayo...",
      noSpecialists: "Nta nyangamugayo zabonetse",
      contact: "Vugana",
      message: "Ubutumwa",
      bookAppointment: "Gena Igenamiterere",
      specialties: "Ubuhanga",
      experience: "Ubuhanga",
      rating: "Urwego",
      contactNew: "Vugana Inyangamugayo Nshya",
      mySpecialists: "Inyangamugayo Zanjye",
      active: "Zikora",
      past: "Zahise",
      noContacted: "Nta nyangamugayo wavuganyeho",
      viewProfile: "Reba Umwirondoro",
      subject: "Intego",
      subjectPlaceholder: "Incamake",
      messagePlaceholder: "Wiyivuze kandi uvuge uko bashobora gufasha...",
      sendMessage: "Ohereza ubutumwa",
      preferredDate: "Itariki y'ihitamo",
      preferredTime: "Igihe cy'ihitamo",
      notes: "Inyandiko (bihitamo)",
      notesPlaceholder: "Sangira ibimenyetso cyangwa ibyifuzo...",
      sendAppointmentRequest: "Ohereza icyifuzo cy'igenamiterere",
      backToSpecialists: "Subira ku Nyangamugayo",
      messages: "Ubutumwa",
      appointments: "Igenamiterere",
      signInToRequest: "Nyamuneka winjire kugirango usabe igenamiterere.",
      selectDateAndTime: "Nyamuneka hitamo itariki n'igihe.",
      appointmentRequestSent: "Icyifuzo cy'igenamiterere cyoherejwe neza.",
      unableToSubmitAppointment: "Ntushobora kohereza icyifuzo cy'igenamiterere.",
      addSubjectAndMessage: "Nyamuneka ongeremo intego n'ubutumwa.",
      messageDelivered: "Ubutumwa bwoherejwe ku nyangamugayo.",
      unableToSendMessage: "Ntushobora kohereza ubutumwa bwawe."
    },

    // Profile Page
    profile: {
      title: "Umwirondoro Wanjye",
      edit: "Guhindura Umwirondoro",
      personalInfo: "Amakuru y'Umuntu",
      firstName: "Izina Rya Mbere",
      lastName: "Izina Rya Nyuma",
      email: "Imeyili",
      phone: "Telefoni",
      dateOfBirth: "Itariki y'Amavuko",
      save: "Bika Amahinduka",
      cancel: "Kureka"
    },

    // Auth Pages
    auth: {
      login: {
        title: "Murakaza",
        subtitle: "Injira kugirango ukomeze kuri Nganiriza",
        email: "Ineyili",
        password: "Ijambo ry'ibanga",
        rememberMe: "Wibuke",
        forgotPassword: "Wibagiwe ijambo ry'ibanga?",
        signIn: "Injira",
        noAccount: "Nta konti ufite?",
        signUp: "Kwiyandikisha",
        orContinueWith: "Cyangwa ukomeze ukoresheje"
      },
      signup: {
        title: "Kurema Konti",
        subtitle: "Kwiyandikisha kuri Nganiriza kugirango utangire",
        firstName: "Izina Rya Mbere",
        lastName: "Izina Rya Nyuma",
        email: "Ineyili",
        password: "Ijambo ry'ibanga",
        confirmPassword: "Emeza Ijambo ry'Ibanga",
        createAccount: "Kurema Konti",
        haveAccount: "Ufite konti?",
        signIn: "Injira",
        userType: "Ndi:",
        user: "Umukoresha",
        specialist: "Inyangamugayo"
      },
      resetPassword: {
        title: "Gusubiramo Ijambo ry'Ibanga",
        subtitle: "Andika aderesi yawe ya imeyili kandi tuzakugenera ihuza ryo gusubiramo ijambo ry'ibanga",
        email: "Aderesi ya Ineyili",
        sendLink: "Ohereza Ihuza",
        backToLogin: "Subira ku Kwiyandikisha"
      },
      verifyCode: {
        title: "Emeza Ineyili Yawe",
        subtitle: "Twohereje kode yemeza kuri",
        enterCode: "Andika kode y'imibare 6",
        verify: "Emeza",
        resend: "Ohereza Kode Nanone",
        back: "Subira inyuma"
      },
      setNewPassword: {
        title: "Gushyiraho Ijambo ry'Ibanga Rishya",
        subtitle: "Andika ijambo ry'ibanga ryawe rishya hepfo",
        newPassword: "Ijambo ry'Ibanga Rishya",
        confirmPassword: "Emeza Ijambo ry'Ibanga Rishya",
        updatePassword: "Gusubiramo Ijambo ry'Ibanga",
        backToLogin: "Subira ku Kwiyandikisha"
      },
      invalidLink: {
        title: "Ihuza Ritemewe",
        subtitle: "Iyi huja yarangiye cyangwa ntiyemewe. Nyamuneka usabe ihuza rishya.",
        backToLogin: "Subira ku Kwiyandikisha",
        message: "Nyamuneka usabe ihuza rishya ryo gusubiramo ijambo ry'ibanga kugirango ukomeze.",
        requestNew: "Saba Ihuza Rishya"
      }
    },

    // Admin Pages
    admin: {
      dashboard: "Ikibaho",
      home: "Utangira",
      map: "Gucunga Ikarita",
      learning: "Inyigisho",
      specialists: "Kwemera Inyangamugayo",
      users: "Gucunga Abakoresha",
      mapDescription: "Ongeramo kandi ucinge amavuriro",
      learningDescription: "Kurema no guhindura ingingo zerekana",
      specialistsDescription: "Gusuzuma no kwemera umwirondoro w'inyangamugayo",
      usersDescription: "Gukura no gucunga abakoresha bose",
      managePlatform: "Cunga porogaramu yawe uva hano"
    },

    // Common
    common: {
      loading: "Gusubiramo...",
      error: "Ikosa byabaye",
      save: "Bika",
      cancel: "Kureka",
      delete: "Siba",
      edit: "Guhindura",
      close: "Funga",
      submit: "Ohereza",
      search: "Shakisha",
      filter: "Gushushanya",
      clear: "Gusukura",
      apply: "Gukoresha",
      navigation: "Inzira",
      language: "Ururimi",
      logOut: "Sohoka",
      switchToLight: "Guhindura ku Mwanya",
      switchToDark: "Guhindura ku Mwijima",
      retry: "Gerageza Nanone"
    }
  }
};

// Translation hook/utility
export const useTranslation = (language = 'en') => {
  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    
    return value || key;
  };
  
  return { t, language };
};


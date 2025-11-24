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
      managePlatform: "Manage your platform from here",
      // Map Management
      mapManagement: "Map Management",
      mapManagementDescription: "Add and manage health clinics and service providers",
      clickMapToAdd: "Click on the map to add a clinic",
      clickMapToSetLocation: "Click anywhere on the map to set the clinic location",
      searchClinics: "Search clinics...",
      editClinic: "Edit Clinic",
      addNewClinic: "Add New Clinic",
      location: "Location",
      clinicName: "Clinic Name",
      enterClinicName: "Enter clinic name",
      type: "Type",
      phoneNumber: "Phone Number",
      province: "Province",
      provinceExample: "e.g., Kigali City",
      district: "District",
      districtExample: "e.g., Gasabo",
      sector: "Sector",
      sectorExample: "e.g., Remera",
      openingHours: "Opening Hours",
      openingHoursExample: "e.g., Mon-Fri 9AM-5PM",
      verified: "Verified",
      update: "Update",
      create: "Create",
      clinic: "Clinic",
      selectLocation: "Please click on the map to select a location",
      clinicUpdated: "Clinic updated successfully",
      clinicAdded: "Clinic added successfully",
      failedToSaveClinic: "Failed to save clinic",
      confirmDeleteClinic: "Are you sure you want to delete this clinic?",
      clinicDeleted: "Clinic deleted successfully",
      failedToDeleteClinic: "Failed to delete clinic",
      loadingClinics: "Loading clinics...",
      noClinicsFound: "No clinics found",
      clickMapToAddFirst: "Click on the map to add your first clinic",
      failedToLoadClinics: "Failed to load clinics",
      // Learning Resources
      learningResources: "Learning Resources",
      learningResourcesDescription: "Create and manage educational articles",
      addArticle: "Add Article",
      editArticle: "Edit Article",
      createNewArticle: "Create New Article",
      title: "Title",
      enterArticleTitle: "Enter article title",
      language: "Language",
      content: "Content",
      tags: "Tags",
      typeTagAndPressEnter: "Type a tag and press Enter",
      add: "Add",
      quickAdd: "Quick add",
      published: "Published",
      articleUpdated: "Article updated successfully",
      articleCreated: "Article created successfully",
      failedToSaveArticle: "Failed to save article",
      titleRequired: "Title is required",
      contentRequired: "Content is required",
      confirmDeleteArticle: "Are you sure you want to delete this article?",
      articleDeleted: "Article deleted successfully",
      failedToDeleteArticle: "Failed to delete article",
      searchArticles: "Search articles...",
      loadingArticles: "Loading articles...",
      noArticlesFound: "No articles found",
      createFirstArticle: "Create Your First Article",
      failedToLoadArticles: "Failed to load articles",
      // Specialist Approval
      specialistApproval: "Specialist Approval",
      specialistApprovalDescription: "Review and approve specialist profiles",
      searchSpecialists: "Search specialists...",
      loadingPendingSpecialists: "Loading pending specialists...",
      noPendingSpecialists: "No pending specialists to review",
      viewDetails: "View Details",
      approve: "Approve",
      reject: "Reject",
      processing: "Processing...",
      confirmApproveSpecialist: "Are you sure you want to approve this specialist?",
      confirmRejectSpecialist: "Are you sure you want to reject this specialist?",
      specialistApproved: "Specialist approved successfully",
      specialistRejected: "Specialist rejected",
      failedToApproveSpecialist: "Failed to approve specialist",
      failedToRejectSpecialist: "Failed to reject specialist",
      specialistDetails: "Specialist Details",
      personalInformation: "Personal Information",
      name: "Name",
      email: "Email",
      specialty: "Specialty",
      licenseNumber: "License Number",
      notProvided: "Not provided",
      yearsOfExperience: "Years of Experience",
      consultationFee: "Consultation Fee",
      bio: "Bio",
      education: "Education",
      clinicInformation: "Clinic Information",
      address: "Address",
      languages: "Languages",
      certifications: "Certifications",
      failedToLoadSpecialists: "Failed to load pending specialists",
      failedToLoadSpecialistDetails: "Failed to load specialist details",
      // User Management
      userManagement: "User Management",
      userManagementDescription: "View and manage all users in the system",
      searchUsers: "Search users by name or email...",
      allRoles: "All Roles",
      admin: "Admin",
      specialist: "Specialist",
      user: "User",
      loadingUsers: "Loading users...",
      id: "ID",
      role: "Role",
      status: "Status",
      joined: "Joined",
      lastLogin: "Last Login",
      actions: "Actions",
      active: "Active",
      inactive: "Inactive",
      never: "Never",
      viewUserDetails: "View user details",
      previous: "Previous",
      next: "Next",
      page: "Page",
      of: "of",
      totalUsers: "total users",
      previousPage: "Previous page",
      nextPage: "Next page",
      noUsersFound: "No users found",
      userDetails: "User Details",
      username: "Username",
      fullName: "Full Name",
      isStaff: "Is Staff",
      isSuperuser: "Is Superuser",
      dateJoined: "Date Joined",
      failedToLoadUsers: "Failed to load users",
      failedToLoadUserDetails: "Failed to load user details"
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
      retry: "Retry",
      yes: "Yes",
      no: "No"
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
      managePlatform: "Cunga porogaramu yawe uva hano",
      // Map Management
      mapManagement: "Gucunga Ikarita",
      mapManagementDescription: "Ongeramo kandi ucinge amavuriro n'abagenera serivisi",
      clickMapToAdd: "Kanda ku karita kugirango wongere kliniki",
      clickMapToSetLocation: "Kanda aho ariho hose ku karita kugirango ushyireho ahantu h'ikliniki",
      searchClinics: "Shakisha amavuriro...",
      editClinic: "Guhindura Kliniki",
      addNewClinic: "Ongeramo Kliniki Nshya",
      location: "Ahantu",
      clinicName: "Izina ry'ikliniki",
      enterClinicName: "Andika izina ry'ikliniki",
      type: "Ubwoko",
      phoneNumber: "Numero ya Telefoni",
      province: "Intara",
      provinceExample: "Urugero, Umujyi wa Kigali",
      district: "Akarere",
      districtExample: "Urugero, Gasabo",
      sector: "Umurenge",
      sectorExample: "Urugero, Remera",
      openingHours: "Amasaha y'Umwanya",
      openingHoursExample: "Urugero, Ku wa Kane-Ku wa Gatanu 9AM-5PM",
      verified: "Byemejwe",
      update: "Gusubiramo",
      create: "Kurema",
      clinic: "Kliniki",
      selectLocation: "Nyamuneka kanda ku karita kugirango hitamo ahantu",
      clinicUpdated: "Kliniki yasubiramo neza",
      clinicAdded: "Kliniki yongeweho neza",
      failedToSaveClinic: "Ntushoboye kubika kliniki",
      confirmDeleteClinic: "Urazi neza ko ushaka gusiba iyi kliniki?",
      clinicDeleted: "Kliniki yasibwe neza",
      failedToDeleteClinic: "Ntushoboye gusiba kliniki",
      loadingClinics: "Gusubiramo amavuriro...",
      noClinicsFound: "Nta mavuriro abonetse",
      clickMapToAddFirst: "Kanda ku karita kugirango wongere kliniki yawe ya mbere",
      failedToLoadClinics: "Ntushoboye gusubiramo amavuriro",
      // Learning Resources
      learningResources: "Inyigisho",
      learningResourcesDescription: "Kurema no gucunga ingingo zerekana",
      addArticle: "Ongeramo Ingingo",
      editArticle: "Guhindura Ingingo",
      createNewArticle: "Kurema Ingingo Nshya",
      title: "Umutwe",
      enterArticleTitle: "Andika umutwe w'ingingo",
      language: "Ururimi",
      content: "Ibirimo",
      tags: "Icyitabo",
      typeTagAndPressEnter: "Andika icyitabo hanyuma ukanda Enter",
      add: "Ongeramo",
      quickAdd: "Ongeramo vuba",
      published: "Yasohoye",
      articleUpdated: "Ingingo yasubiramo neza",
      articleCreated: "Ingingo yaremwe neza",
      failedToSaveArticle: "Ntushoboye kubika ingingo",
      titleRequired: "Umutwe ukenewe",
      contentRequired: "Ibirimo byakenewe",
      confirmDeleteArticle: "Urazi neza ko ushaka gusiba iyi ngingo?",
      articleDeleted: "Ingingo yasibwe neza",
      failedToDeleteArticle: "Ntushoboye gusiba ingingo",
      searchArticles: "Shakisha ingingo...",
      loadingArticles: "Gusubiramo ingingo...",
      noArticlesFound: "Nta ngingo zabonetse",
      createFirstArticle: "Kurema Ingingo Yawe Ya Mbere",
      failedToLoadArticles: "Ntushoboye gusubiramo ingingo",
      // Specialist Approval
      specialistApproval: "Kwemera Inyangamugayo",
      specialistApprovalDescription: "Gusuzuma no kwemera umwirondoro w'inyangamugayo",
      searchSpecialists: "Shakisha inyangamugayo...",
      loadingPendingSpecialists: "Gusubiramo inyangamugayo zitegereje...",
      noPendingSpecialists: "Nta nyangamugayo zitegereje gusuzumwa",
      viewDetails: "Reba Ibisobanuro",
      approve: "Kwemera",
      reject: "Kwanga",
      processing: "Gukora...",
      confirmApproveSpecialist: "Urazi neza ko ushaka kwemera iyi nyangamugayo?",
      confirmRejectSpecialist: "Urazi neza ko ushaka kwanga iyi nyangamugayo?",
      specialistApproved: "Inyangamugayo yemewe neza",
      specialistRejected: "Inyangamugayo yanjiwe",
      failedToApproveSpecialist: "Ntushoboye kwemera inyangamugayo",
      failedToRejectSpecialist: "Ntushoboye kwanga inyangamugayo",
      specialistDetails: "Ibisobanuro by'Inyangamugayo",
      personalInformation: "Amakuru y'Umuntu",
      name: "Izina",
      email: "Ineyili",
      specialty: "Ubuhanga",
      licenseNumber: "Numero y'Uruhushya",
      notProvided: "Ntabwo byatanzwe",
      yearsOfExperience: "Imyaka y'Ubuhanga",
      consultationFee: "Amafaranga y'Ubwiyunge",
      bio: "Amakuru",
      education: "Uburezi",
      clinicInformation: "Amakuru y'ikliniki",
      address: "Aderesi",
      languages: "Indimi",
      certifications: "Icyemezo",
      failedToLoadSpecialists: "Ntushoboye gusubiramo inyangamugayo zitegereje",
      failedToLoadSpecialistDetails: "Ntushoboye gusubiramo ibisobanuro by'inyangamugayo",
      // User Management
      userManagement: "Gucunga Abakoresha",
      userManagementDescription: "Reba no gucunga abakoresha bose mu sisitemu",
      searchUsers: "Shakisha abakoresha ukoresheje izina cyangwa imeyili...",
      allRoles: "Inshingano Zose",
      admin: "Umuyobozi",
      specialist: "Inyangamugayo",
      user: "Umukoresha",
      loadingUsers: "Gusubiramo abakoresha...",
      id: "ID",
      role: "Inshingano",
      status: "Imiterere",
      joined: "Yinjiye",
      lastLogin: "Kwiyandikisha Kwanyuma",
      actions: "Ibyakozwe",
      active: "Ikora",
      inactive: "Ntibikora",
      never: "Ntibigeze",
      viewUserDetails: "Reba ibisobanuro by'umukoresha",
      previous: "Ibanze",
      next: "Ikurikira",
      page: "Ipaji",
      of: "ya",
      totalUsers: "abakoresha bose",
      previousPage: "Ipaji yabanze",
      nextPage: "Ipaji ikurikira",
      noUsersFound: "Nta bakoresha babonetse",
      userDetails: "Ibisobanuro by'Umukoresha",
      username: "Izina ry'Umukoresha",
      fullName: "Izina Ruzuye",
      isStaff: "Ni Umukozi",
      isSuperuser: "Ni Umuyobozi Mukuru",
      dateJoined: "Itariki y'Injira",
      failedToLoadUsers: "Ntushoboye gusubiramo abakoresha",
      failedToLoadUserDetails: "Ntushoboye gusubiramo ibisobanuro by'umukoresha"
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
      retry: "Gerageza Nanone",
      yes: "Yego",
      no: "Oya"
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


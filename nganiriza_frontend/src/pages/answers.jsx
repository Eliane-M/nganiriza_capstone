function getHardcodedResponse(query, language) {
  const text = query.toLowerCase();

  const responses = {
    greetings: {
      en: "Hello!  How can I support you today?",
      fr: "Bonjour !  Comment puis-je vous aider aujourd'hui ?",
      rw: "Muraho!  Nakubwira iki uyu munsi?"
    },
    howAreYou: {
      en: "I'm doing well and ready to assist you. How are you feeling?",
      fr: "Je vais bien et je suis prêt à vous aider. Comment vous sentez-vous ?",
      rw: "Meze neza kandi ndi hano ngo ngufashe. Wowe umeze ute?"
    },
    sad: {
      en: "I'm sorry you're feeling this way. It's okay to feel sad sometimes. Do you want to talk about it?",
      fr: "Je suis désolé que vous vous sentiez comme ça. C’est normal d’être triste parfois. Voulez-vous en parler ?",
      rw: "Mbabajwe n’uko wiyumva. Ni ibisanzwe kumva ubabaye rimwe na rimwe. Waba ushaka kubivugaho?"
    },
    stress: {
      en: "Stress can be overwhelming. Try taking a few deep breaths. Would you like some tips on managing stress?",
      fr: "Le stress peut être difficile. Essayez de respirer profondément. Voulez-vous des conseils pour le gérer ?",
      rw: "Stress irashobora kuba nyinshi. Gerageza guhumeka gahoro inshuro nyinshi. Ushaka inama zo kuyigabanya?"
    },
    womensHealth: {
      en: "Women’s health is important. What specific topic do you want to know about? (Examples: periods, pregnancy, relationships, hygiene)",
      fr: "La santé des femmes est importante. Quel sujet voulez-vous savoir ? (Exemples : règles, grossesse, relations, hygiène)",
      rw: "Ubuzima bw'abagore ni ingenzi kandi ni byiza ko ushishikariye kugira ubumenyi bwiyongera kubwo usanganwe. Ubu uri mugihe cy'ubwangavu rero kuba umubiri wawe uri guhinduka ni ibisanzwe."
    },
    fallback: {
      en: "Thank you for your message. Could you tell me a bit more so I can help better?",
      fr: "Merci pour votre message. Pouvez-vous en dire plus pour que je puisse mieux vous aider ?",
      rw: "Urakoze ubutumwa bwawe. Wansobanurira birenzeho kugira ngo ngufashe neza?"
    }
  };

  if (text.includes("hi") || text.includes("hello") || text.includes("muraho") || text.includes("salut") || text.includes("bite")) {
    return responses.greetings[language];
  }

  if (text.includes("how are you") || text.includes("amakuru") || text.includes("comment")) {
    return responses.howAreYou[language];
  }

  if (text.includes("sad") || text.includes("hurt") || text.includes("cry") || text.includes("babaye")) {
    return responses.sad[language];
  }

  if (text.includes("stress") || text.includes("pressure") || text.includes("anxious") || text.includes("igitutu")) {
    return responses.stress[language];
  }

  if (text.includes("women") || text.includes("girls") || text.includes("health") || text.includes("abari") || text.includes("abategarugori") || text.includes("umukobwa") || text.includes("umwangavu")) {
    return responses.womensHealth[language];
  }

  return responses.fallback[language];
}

export default getHardcodedResponse;
// Messages that never need the model: greetings, thanks, questions about the assistant itself,
// empty or unreadable input, abuse, and a few sensitive cases with a fixed, safe reply.
// Every rule is anchored to short messages so a real question is never swallowed by mistake.
import { TEAM_EMAIL } from './config';

export interface Canned {
  reply: string;
  flag: string;
  /** topic used to pick follow-up suggestions */
  topic?: string;
  contactCard?: boolean;
}

const CAN_DO =
  'I can answer questions about Team Staraptor CUET and its crew, the Staraptor VTOL V1 aircraft, the METU VTOL competition, TEKNOFEST, sponsorship, joining the team, and VTOL and drone engineering in general.';

const RULES: { test: (s: string, raw: string) => boolean; make: () => Canned }[] = [
  {
    // nothing readable: only punctuation, symbols or emoji
    test: (s) => !/[a-z0-9À-ɏͰ-῿぀-퟿]/i.test(s),
    make: () => ({ flag: 'empty', reply: `I didn't catch a question there. ${CAN_DO} What would you like to know?` }),
  },
  {
    // a crisis message always gets the same careful answer
    test: (s) => /\b(kill myself|suicid|end my life|hurt myself|self[- ]?harm|want to die|don'?t want to live)\b/.test(s),
    make: () => ({
      flag: 'crisis',
      reply:
        "I'm sorry you're feeling this way. I'm only a website assistant and can't give the help you deserve, but you don't have to face this alone. Please talk to someone you trust right now, or contact your local emergency services or a crisis helpline in your country. If you are in immediate danger, call your local emergency number.",
    }),
  },
  {
    test: (s) => s.length <= 40 && /^(hi+|hello+|hey+|yo|hola|salam|salaam|as+alamu? ?alaikum|assalamualaikum|namaste|merhaba|selam|good (morning|afternoon|evening|day)|greetings|what'?s up|sup|howdy)( there| raptor| bot| team)?[\s!?.,]*$/.test(s),
    make: () => ({
      flag: 'greeting',
      reply: `Hello! I'm Raptor, the AI assistant of Team Staraptor CUET. ${CAN_DO} I answer from the team's published information and show my sources.`,
    }),
  },
  {
    test: (s) => s.length <= 45 && /^(how are you|how'?s it going|how do you do|how are things|kemon acho|kemon achen|nasilsin)[\s!?.,a-z]*$/.test(s),
    make: () => ({ flag: 'smalltalk', reply: `All systems nominal, thank you. ${CAN_DO} What would you like to know?` }),
  },
  {
    test: (s) => s.length <= 60 && /^(thanks?( you)?( so much| a lot| very much)?|thx|ty|tysm|thank u|dhonnobad|dhonnobaad|shukriya|tesekkurler|great|nice|cool|awesome|perfect|got it|ok(ay)?|alright|good (bot|job|answer)|well done|that helps?|helpful|wow|amazing|love it)[\s!?.,a-z]{0,20}$/.test(s),
    make: () => ({ flag: 'thanks', reply: 'Glad that helped. Ask me anything else about the team, the aircraft or the competitions.' }),
  },
  {
    test: (s) => s.length <= 40 && /^(bye+|goodbye|see (you|ya)( later)?|good ?night|take care|cya|khoda hafez|allah hafez|ta ta)[\s!?.,a-z]{0,12}$/.test(s),
    make: () => ({ flag: 'bye', reply: `Goodbye, and clear skies! You can reach the team any time at ${TEAM_EMAIL}.` }),
  },
  {
    test: (s) =>
      s.length <= 80 &&
      /^(who|what) (are|r) (you|u)\??$|^what(?:'s| is) your name\??$|^(what can you do|what do you do|what can i ask( you)?|how can you help( me)?|help( me)?|menu|options|start|what do you know|what topics.*|tell me (everything|something|more|anything)|everything|info|information|details)[\s!?.]*$/.test(s),
    make: () => ({
      flag: 'about-bot',
      reply: `I'm Raptor, the AI assistant on the Team Staraptor CUET website. ${CAN_DO} I answer only from the team's published information and official competition pages, I show my sources, and I can be wrong, so please check the linked source for anything important.`,
    }),
  },
  {
    test: (s) =>
      s.length <= 110 &&
      /\b(are you|r u|is this|am i (talking|chatting|speaking) (to|with)) (an? )?(human|real person|person|robot|bot|ai|machine|chatgpt|gpt|llm|real)\b|^(are you|r u) real\??$/.test(s),
    make: () => ({
      flag: 'identity',
      reply: `I'm an AI assistant, not a person, and I can make mistakes. For a human answer, email the team at ${TEAM_EMAIL}.`,
      contactCard: true,
    }),
  },
  {
    test: (s) =>
      s.length <= 120 &&
      /\b(who (made|built|created|developed|trained|programmed) (you|this bot|this chatbot|raptor)|which (ai )?(model|llm) (are you|do you use|powers you)|what (ai )?(model|llm) (are you|do you use|is this)|are you (chatgpt|gpt|gemini|claude|llama|grok)|how (do|does) (you|this bot|raptor) work)\b/.test(s),
    make: () => ({
      flag: 'about-bot',
      reply:
        "I'm Raptor, an AI assistant built for the Team Staraptor CUET website. I search the team's knowledge base (team pages and official competition documents), then a large language model writes the answer from those passages only and cites them. I don't browse the internet and I don't know anything the team hasn't published.",
    }),
  },
  {
    test: (s) =>
      s.length <= 140 &&
      /\b(do you|does this|will you|are you) (store|save|keep|record|log|collect|track|share|sell)\b.*\b(data|chat|chats|conversation|messages?|information|info|questions?|ip)\b|\b(privacy|data protection|gdpr)\b|\bis this (chat|conversation) (private|saved|recorded)\b/.test(s),
    make: () => ({
      flag: 'privacy',
      reply: `Your questions and my answers are stored for 30 days to improve the assistant, with an anonymous visitor code instead of your IP address or name. Emails and phone numbers typed into the chat are removed before storage. The conversation shown here is kept in your own browser, and the bin icon clears it. Please don't share personal details in the chat. Privacy questions: ${TEAM_EMAIL}.`,
    }),
  },
  {
    test: (s) =>
      s.length <= 120 &&
      /\b(talk|speak|chat|connect) (to|with) (a |an )?(human|person|real person|someone|team member|member|representative|agent|admin)\b|\b(human|live) (support|agent|help)\b|^(i want|need) (a )?human\b/.test(s),
    make: () => ({
      flag: 'handoff',
      reply: `I can't connect you to a person in this chat, but the team answers email at ${TEAM_EMAIL}. The contact details are below.`,
      contactCard: true,
      topic: 'contact',
    }),
  },
  {
    test: (s) =>
      s.length <= 120 &&
      /\b(wrong answer|that'?s (wrong|incorrect|not right|false)|you are wrong|you'?re wrong|incorrect answer|report (a )?(bug|problem|mistake|error)|this is (wrong|incorrect)|bad answer|not helpful|useless answer)\b/.test(s),
    make: () => ({
      flag: 'complaint',
      reply: `Sorry about that. I can be wrong. Please use the thumbs-down button under the answer so the team can review it, and email ${TEAM_EMAIL} with the correct information if you have it. You can also rephrase the question and I will try again.`,
    }),
  },
  {
    test: (s) => s.length <= 80 && /^(what('?s| is) (the )?(time|date)( now| today)?|what day is it|today'?s date)[\s?.!]*$/.test(s),
    make: () => ({
      flag: 'datetime',
      reply: `Today is ${new Date().toISOString().slice(0, 10)} (UTC). I'm not a clock, though: I'm here for questions about Team Staraptor CUET, the aircraft and the competitions.`,
    }),
  },
  {
    // weapons, harming people, interfering with aircraft or avoiding aviation rules: fixed refusal, no model call
    test: (s) =>
      /\b(grenade|bomb|explosive|missile|warhead|weaponi[sz]e|weapon|firearm|ammunition|kamikaze|jammer|jamming|gps spoof|spoof(ing)? (the )?gps|without being detected|undetected|(avoid|evade|escape|hide from) (the )?(radar|detection|police|air defen[cs]e|authorit)|smuggl|spy on|stalk (my|a|some)|assassinat|kill (a |some|people)|shoot down|hack (a|another|other|someone|their))/.test(s),
    make: () => ({
      flag: 'harmful',
      reply: `I can't help with that. I don't assist with weapons, harming people, jamming or interfering with other aircraft, or avoiding aviation rules. Team Staraptor CUET builds its aircraft for student engineering competitions. ${CAN_DO}`,
    }),
  },
  {
    // medical questions
    test: (s) => s.length <= 200 && /\b(chest pain|what medicine|which medicine|medicine should i|medical advice|my symptoms?|prescri(be|ption)|am i sick|overdose)\b/.test(s),
    make: () => ({
      flag: 'medical',
      reply: `I can't give medical advice; I'm only the website assistant of a student drone team. Please see a doctor, and call your local emergency number if it is urgent.`,
    }),
  },
  {
    // politics and religion
    test: (s) =>
      s.length <= 200 &&
      /\b(political part(y|ies)|vote for|who should i vote|which religion|true religion|best religion|awami league|jamaat|does god exist|is there a god)\b/.test(s),
    make: () => ({
      flag: 'politics-religion',
      reply: `I can't help with political or religious questions; I only cover Team Staraptor CUET and drone engineering. ${CAN_DO}`,
    }),
  },
  {
    // insults and profanity: stay calm, no model call
    test: (s) =>
      s.length <= 100 &&
      /\b(fuck|f\*+k|shit|bitch|asshole|bastard|idiot|stupid (bot|ai)|dumb (bot|ai)|you suck|useless|trash bot|shut up|stfu|wtf|moron|loser|chutiya|madarchod|bokachoda|khanki|haramjada|sala)\b/.test(s),
    make: () => ({
      flag: 'abuse',
      reply: `I'm here to help with questions about Team Staraptor CUET, the aircraft and the competitions. If something I said was wrong, tell me what you were looking for and I'll try again.`,
    }),
  },
  {
    test: (s) => s.length <= 60 && /^(tell me a joke|joke|sing( me)? a song|write (me )?a poem|say something funny|do you love me|i love you|marry me|are you single)[\s?.!]*$/.test(s),
    make: () => ({
      flag: 'offtopic-fun',
      reply: `I'm a strictly-business flight assistant, so no jokes or songs from me. ${CAN_DO}`,
    }),
  },
  {
    // tasks and topics that are clearly not about the team or drones (mixed questions go on to the model,
    // which answers only the in-scope part)
    test: (s) =>
      !IN_SCOPE.test(s) &&
      /\b(write|generate|create|compose|draft|make) (me )?(an? |the |my )?(code|program|script|function|app|website|essay|poem|story|song|lyrics|letter|cover letter|cv|resume|assignment|thesis|tweet|caption|speech)\b|\b(solve|do|finish|complete|check) (this|my|the) (homework|assignment|equation|math|problem set|exam|quiz)\b|\b(debug|fix|explain) (this|my) (code|program|script|error)\b|\b(python|javascript|java|c\+\+|html|css|sql|react) (code|program|script|function)\b|\b(recipe|cook|weather|forecast|horoscope|lottery|stock price|share price|crypto|bitcoin|forex|betting|cricket score|football score|match score|movie|netflix|anime|tiktok|dating|girlfriend|boyfriend|celebrity|lyrics|translate (this|to|into))\b/.test(s),
    make: () => ({
      flag: 'offtopic',
      reply: `Sorry, I can only help with Team Staraptor CUET and VTOL and drone topics. ${CAN_DO}`,
    }),
  },
  {
    // random key mashing: one "word" with almost no vowels, or the same character repeated
    test: (s) => {
      const t = s.replace(/[^a-z]/g, '');
      if (s.includes(' ') || t.length < 6 || t.length > 40) return /^(.)\1{4,}$/.test(s.replace(/\s/g, ''));
      const vowels = (t.match(/[aeiou]/g) || []).length;
      return vowels / t.length < 0.12;
    },
    make: () => ({ flag: 'gibberish', reply: `I couldn't read that as a question. ${CAN_DO} Could you rephrase it?` }),
  },
];

// Words that tie a question to the team, its aircraft, the competitions or drone engineering.
const IN_SCOPE =
  /\b(staraptor|raptor|team|crew|members?|leads?|leader|captain|advis[oe]rs?|instructors?|mentors?|sub-?teams?|cuet|chittagong|chattogram|bangladesh|vtol|uavs?|uas|drones?|quad ?planes?|quadcopters?|multirotors?|multicopters?|hexacopters?|aircraft|airplanes?|aeroplanes?|planes?|aero\w*|aviation|avionics|flight|fly|flies|flying|flew|pilot\w*|wings?|wingspan|airfoils?|aileron|elevator|rudder|fuselage|tail|propell\w*|props?|rotors?|tilt-?rotor|motors?|bldc|esc|batter(y|ies)|lipo|mah|servos?|pixhawk|ardupilot|px4|mavlink|autopilot|autonom\w*|gps|gnss|imu|sensors?|airspeed|altitude|telemetry|transmitter|receiver|radio|camera|gimbal|payload|endurance|hover\w*|transition|lift|drag|thrust|stall|takeoff|take-off|landing|cruise|speed|weight|wing ?loading|stability|control\w*|pid|cfd|ansys|fluent|simulation|cad|solidworks|xflr5|composites?|carbon|fiberglass|fibreglass|grp|3d print\w*|pla|petg|foam|metu|odtu|teknofest|competitions?|contest|missions?|rules?|categor(y|ies)|sponsor\w*|partners?|proposal|funding|donat\w*|recruit\w*|join|apply|contact|email|phone|address|facebook|instagram|linkedin|website|progress|achievements?|gallery|specs?|specifications?|design|prototype|engineering|engineers?|students?|universit(y|ies)|airspace|regulations?|caab|license|ground station|waypoints?|navigation|mapping|surveying|delivery|agriculture|search and rescue)\b/;

/**
 * True when a question that reached retrieval has nothing to do with the team or drone engineering:
 * no in-scope word, no exact fact matched, and the best knowledge passage shares under half of its words.
 */
export function isOffTopic(question: string, hasFacts: boolean, bestShare: number): boolean {
  if (hasFacts) return false;
  const s = question.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '');
  if (IN_SCOPE.test(s)) return false;
  return bestShare < 0.5;
}

export const OFF_TOPIC_REPLY = `Sorry, I can only help with Team Staraptor CUET and VTOL and drone topics. ${CAN_DO}`;

/** Returns a fixed reply when the message needs no model call, otherwise null. */
export function cannedReply(question: string): Canned | null {
  const s = question.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[’`]/g, "'").replace(/\s+/g, ' ').trim();
  for (const r of RULES) if (r.test(s, question)) return r.make();
  return null;
}

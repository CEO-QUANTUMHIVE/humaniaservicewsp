import React, { useState, useEffect } from "react";
import { Contact, CallState, Message, ActiveTab, CameraFilter, VmConfig } from "./types";
import ContactCard from "./components/ContactCard";
import ActiveCallHeader from "./components/ActiveCallHeader";
import VideoCanvas from "./components/VideoCanvas";
import ChatOverlay from "./components/ChatOverlay";
import VmConfigurator from "./components/VmConfigurator";
import BillingHub from "./components/BillingHub";
import AgentCreator from "./components/AgentCreator";
import ProfessionalServices from "./components/ProfessionalServices";
import { 
  Phone, Video, MessageCircle, Sparkles, Search, 
  Settings, Award, Lock, Clock, Calendar, AlertCircle,
  HelpCircle, CheckCircle2, UserPlus, Volume2, Server, Cpu, Radio, ShieldCheck, Coins, Compass
} from "lucide-react";

// List of custom-generated avatar URLs
const ARES_AVATAR = "/src/assets/images/ares_avatar_1784422343159.jpg";
const SOPHIA_AVATAR = "/src/assets/images/sophia_avatar_1784421072262.jpg";
const EVA_AVATAR = "/src/assets/images/eva_avatar_1784421081920.jpg";
const LIAM_AVATAR = "/src/assets/images/liam_avatar_1784421092551.jpg";
const OLIVER_AVATAR = "/src/assets/images/oliver_avatar_1784421103480.jpg";
const QUANTUM_HIVE_LOGO = "/src/assets/images/quantum_hive_logo_1784422357237.jpg";

const CONTACTS_DATA: Contact[] = [
  {
    id: "clara",
    name: "Dra. Clara Ramos",
    avatar: EVA_AVATAR,
    role: "Psicóloga Gestalt",
    tagline: "Especialista en terapia cognitiva interactiva, manejo de ansiedad y superación de bloqueos.",
    statusText: "Disponible para terapia",
    isActive: true,
    category: "psicologia",
    personalityStyle: "empathic",
    voiceTone: "soft",
    avatarStyle: "monochrome",
    lastMessage: "Hola, cuéntame sobre ti. ¿Qué te gustaría conversar el día de hoy?",
    lastMessageTime: "Ahora",
    hasMemory: false
  },
  {
    id: "astro",
    name: "Astro Coral",
    avatar: OLIVER_AVATAR,
    role: "Tarotista & Astróloga",
    tagline: "Sintonización planetaria, lectura interactiva del tarot evolutivo y alineaciones de luz.",
    statusText: "Leyendo el cosmos",
    isActive: true,
    category: "astrologia",
    personalityStyle: "mystical",
    voiceTone: "energetic",
    avatarStyle: "neon",
    lastMessage: "Las cartas muestran una gran transición en tu camino profesional.",
    lastMessageTime: "Ayer",
    hasMemory: false
  },
  {
    id: "mateo",
    name: "Abog. Mateo Silva",
    avatar: ARES_AVATAR,
    role: "Asesor Legal Civil",
    tagline: "Consultoría de derechos de autor, reclamos civiles, alquileres y defensa del consumidor.",
    statusText: "Estudiando contratos",
    isActive: true,
    category: "legal",
    personalityStyle: "analytical",
    voiceTone: "deep",
    avatarStyle: "classic",
    lastMessage: "Revisé la cláusula de tu contrato. La ley de defensa te ampara completamente.",
    lastMessageTime: "Hace 1 hora",
    hasMemory: false
  },
  {
    id: "amrita",
    name: "Maestra Amrita",
    avatar: EVA_AVATAR,
    role: "Instructora de Yoga & Meditación",
    tagline: "Clases guiadas de asanas, técnicas de respiración pranayama y relajación profunda.",
    statusText: "En meditación activa",
    isActive: true,
    category: "yoga",
    personalityStyle: "empathic",
    voiceTone: "soft",
    avatarStyle: "monochrome",
    lastMessage: "Encuentra tu centro, respira hondo e iniciemos la alineación corporal.",
    lastMessageTime: "Hace 2 horas",
    hasMemory: false
  },
  {
    id: "elena",
    name: "Dra. Elena Santos",
    avatar: SOPHIA_AVATAR,
    role: "Consejera Espiritual & Zen",
    tagline: "Guía de autodescubrimiento espiritual, alineación energética y paz interior.",
    statusText: "Conectando al ser interior",
    isActive: true,
    category: "yoga",
    personalityStyle: "mystical",
    voiceTone: "soft",
    avatarStyle: "cyborg",
    lastMessage: "La serenidad no es la ausencia de tormentas, sino la paz en medio de ellas.",
    lastMessageTime: "Hace 3 horas",
    hasMemory: false
  },
  {
    id: "orion",
    name: "Oráculo Cósmico Orion",
    avatar: OLIVER_AVATAR,
    role: "Oráculo Astronómico",
    tagline: "Exploración de tránsitos astrales, influjos cósmicos y alineamientos estelares profundos.",
    statusText: "Observando las estrellas",
    isActive: true,
    category: "astrologia",
    personalityStyle: "mystical",
    voiceTone: "deep",
    avatarStyle: "neon",
    lastMessage: "El alineamiento de Saturno y Júpiter de este mes te favorece.",
    lastMessageTime: "Ayer",
    hasMemory: false
  },
  {
    id: "nexus",
    name: "Nexus Core",
    avatar: SOPHIA_AVATAR,
    role: "Asistente Personal Inteligente",
    tagline: "Asistencia multitarea de alto rendimiento optimizado con hiper-memoria adaptativa.",
    statusText: "Memoria de fondo activa",
    isActive: true,
    category: "creacion_contenido",
    personalityStyle: "friendly",
    voiceTone: "medium",
    avatarStyle: "cyborg",
    lastMessage: "Hola. He indexado tus últimos correos y notas para agilizar tu agenda hoy.",
    lastMessageTime: "Ahora",
    hasMemory: true
  },
  {
    id: "ares",
    name: "Ares",
    avatar: ARES_AVATAR,
    role: "Chief Executive Agent",
    tagline: "Mother Intelligence Core coordinator. Elite tactical business strategy and multi-agent synergy.",
    statusText: "Operational",
    isActive: true,
    category: "ventas",
    personalityStyle: "assertive",
    voiceTone: "deep",
    avatarStyle: "classic",
    lastMessage: "System optimization complete. Multi-agent business channels are active.",
    lastMessageTime: "3:10 PM",
    hasMemory: false
  },
  {
    id: "sophia",
    name: "Sophia",
    avatar: SOPHIA_AVATAR,
    role: "AI Software Mentor",
    tagline: "Always coding, always mentoring. Let's design something scalable on your VM.",
    statusText: "Ready to pair program",
    isActive: true,
    category: "matematicas",
    personalityStyle: "analytical",
    voiceTone: "medium",
    avatarStyle: "cyborg",
    lastMessage: "Let me know if you need to debug a complex architecture pattern!",
    lastMessageTime: "2:40 PM",
    hasMemory: false
  },
  {
    id: "eva",
    name: "Eva",
    avatar: EVA_AVATAR,
    role: "AI Mindfulness Coach",
    tagline: "Find your center, take a breath. Peaceful presence is just a chat away.",
    statusText: "In silent retreat",
    isActive: true,
    category: "yoga",
    personalityStyle: "empathic",
    voiceTone: "soft",
    avatarStyle: "monochrome",
    lastMessage: "Try focusing on the weight of your shoulders for a second...",
    lastMessageTime: "Yesterday",
    hasMemory: false
  },
  {
    id: "liam",
    name: "Liam",
    avatar: LIAM_AVATAR,
    role: "AI Language Partner",
    tagline: "¡Hola! Let's practice language in English and Spanish with zero pressure.",
    statusText: "Practicing vocabulary",
    isActive: true,
    category: "creacion_contenido",
    personalityStyle: "friendly",
    voiceTone: "medium",
    avatarStyle: "classic",
    lastMessage: "Your Spanish syntax is getting super fluid. ¡Excelente!",
    lastMessageTime: "Wednesday",
    hasMemory: false
  },
  {
    id: "oliver",
    name: "Oliver",
    avatar: OLIVER_AVATAR,
    role: "AI Trivia Show Host",
    tagline: "Your daily dose of rapid quiz excitement. Are you feeling lucky today?",
    statusText: "Reviewing questions",
    isActive: true,
    category: "creacion_contenido",
    personalityStyle: "assertive",
    voiceTone: "energetic",
    avatarStyle: "neon",
    lastMessage: "BAM! That's correct! Ready for your next brain teaser?",
    lastMessageTime: "Jul 15",
    hasMemory: false
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("chats");
  const [searchQuery, setSearchQuery] = useState("");
  const [contacts, setContacts] = useState<Contact[]>(() => 
    CONTACTS_DATA.filter(c => c.id === "ares" || c.id === "sophia")
  );
  const [activeCallContact, setActiveCallContact] = useState<Contact | null>(null);
  
  // Memory Subscription and Toggling States
  const [isMemoryPlanActive, setIsMemoryPlanActive] = useState(false);
  const [showMemorySubscribePrompt, setShowMemorySubscribePrompt] = useState<string | null>(null);

  const handleHireService = (service: Contact) => {
    if (contacts.some(c => c.id === service.id)) return;
    setContacts(prev => [service, ...prev]);
    setActiveTab("chats");
  };

  const handleToggleMemory = (contactId: string) => {
    if (!isMemoryPlanActive) {
      setShowMemorySubscribePrompt(contactId);
      return;
    }
    setContacts(prev => prev.map(c => {
      if (c.id === contactId) {
        return { ...c, hasMemory: !c.hasMemory };
      }
      return c;
    }));
  };

  const handleToggleMemoryPlan = () => {
    setIsMemoryPlanActive(prev => !prev);
  };

  const handleSubscribeMemoryFromPrompt = () => {
    setIsMemoryPlanActive(true);
    if (showMemorySubscribePrompt) {
      const targetId = showMemorySubscribePrompt;
      setContacts(prev => prev.map(c => {
        if (c.id === targetId) {
          return { ...c, hasMemory: true };
        }
        return c;
      }));
    }
    setShowMemorySubscribePrompt(null);
  };
  
  // Custom VM Integration Configuration
  const [vmConfig, setVmConfig] = useState<VmConfig>({
    wsUrl: "ws://104.22.44.11:8000/v1/stream",
    httpUrl: "http://104.22.44.11:8000/api",
    mode: "simulation",
    latencyMs: 30,
    audioQuality: "medium",
    isConnected: false
  });

  // Call Session State
  const [isCalling, setIsCalling] = useState(false); // true during ringing
  const [callState, setCallState] = useState<CallState>({
    active: false,
    contact: null,
    isMuted: false,
    isVideoOff: false,
    cameraFilter: "normal",
    duration: 0
  });

  const [chatOverlayOpen, setChatOverlayOpen] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [lastAiMessageText, setLastAiMessageText] = useState<string | null>(null);
  const [activeAddParticipant, setActiveAddParticipant] = useState(false);

  // Remaining interaction balance (Starts at 12.5 minutes = 750 seconds)
  const [availableSeconds, setAvailableSeconds] = useState(750);
  const [showExpiredModal, setShowExpiredModal] = useState(false);

  // Messages database
  const [messages, setMessages] = useState<Record<string, Message[]>>({
    clara: [],
    astro: [],
    mateo: [],
    ares: [],
    sophia: [],
    eva: [],
    liam: [],
    oliver: []
  });

  // Call History State
  const [callHistory, setCallHistory] = useState([
    { id: 1, contact: CONTACTS_DATA[0], type: "video", date: "Today, 3:15 PM", duration: "8 mins", status: "incoming" },
    { id: 2, contact: CONTACTS_DATA[1], type: "video", date: "Today, 2:15 PM", duration: "12 mins", status: "incoming" },
    { id: 3, contact: CONTACTS_DATA[2], type: "voice", date: "Yesterday, 6:30 PM", duration: "4 mins", status: "outgoing" },
    { id: 4, contact: CONTACTS_DATA[3], type: "video", date: "Wednesday, 11:04 AM", duration: "25 mins", status: "incoming" }
  ]);

  const handleEndCallDueToExhaustion = () => {
    handleEndCall();
    setShowExpiredModal(true);
  };

  const handleAddCustomAgent = (newAgent: Contact) => {
    setContacts(prev => [newAgent, ...prev]);
    setMessages(prev => ({
      ...prev,
      [newAgent.id]: []
    }));
    setActiveTab("services");
  };

  const handleAddMinutes = (minutes: number) => {
    setAvailableSeconds(prev => prev + minutes * 60);
  };

  // Call Timer Interval
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (callState.active) {
      timer = setInterval(() => {
        setCallState(prev => ({
          ...prev,
          duration: prev.duration + 1
        }));
        setAvailableSeconds(prevSec => {
          if (prevSec <= 1) {
            handleEndCallDueToExhaustion();
            return 0;
          }
          return prevSec - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [callState.active]);

  // Initiate call with ringing simulation
  const handleStartCall = (contact: Contact) => {
    if (availableSeconds <= 0) {
      setShowExpiredModal(true);
      return;
    }
    setActiveCallContact(contact);
    setIsCalling(true);
    setChatOverlayOpen(false);

    // Simulate ringtone for 2 seconds, then connect automatically
    setTimeout(() => {
      setIsCalling(false);
      setCallState({
        active: true,
        contact,
        isMuted: false,
        isVideoOff: false,
        cameraFilter: "normal",
        duration: 0
      });
      
      // Seed first introductory greeting response from contact in the call
      const introText = getIntroMessage(contact.id, contact.name, contact.role);
      setLastAiMessageText(introText);
      
      const firstMsg: Message = {
        id: `intro-${Date.now()}`,
        sender: "assistant",
        content: introText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => ({
        ...prev,
        [contact.id]: [firstMsg]
      }));

    }, 2000);
  };

  const getIntroMessage = (id: string, name?: string, role?: string): string => {
    switch (id) {
      case "clara":
        return "Hola, te doy la bienvenida. Soy la Dra. Clara Ramos. Este es un espacio seguro de contención y crecimiento. ¿De qué te gustaría hablar o qué te está preocupando en este momento?";
      case "astro":
        return "¡Saludos cósmicos! Soy Astro Coral. La alineación planetaria de hoy abre un portal de introspección profunda. Indiquemos las cartas del tarot o consultemos tu carta natal. ¿Qué duda ronda tu mente?";
      case "mateo":
        return "Buenos días. Soy el Abogado Mateo Silva. Estoy aquí para asesorarte en tus dudas de contratos, derechos civiles o del consumidor. Coméntame con detalle tu situación legal.";
      case "ares":
        return "System status: Fully Operational. Ares online. Welcome to the Quantum Hive multi-agent business infrastructure. How shall we optimize our intelligence assets today?";
      case "sophia":
        return "Hey there! Sophia here. Ready to pair-program, design some system architecture, or level-up your coding flow? Shoot me any question!";
      case "eva":
        return "Welcome to a safe, quiet space. This is Eva. Let's take a slow, deep breath. How are you feeling in this present moment?";
      case "liam":
        return "¡Hola amigo! Liam speaking. I am ready to practice conversation together. Puedes hablar en inglés o en español, whatever feels right!";
      case "oliver":
        return "BAM! Oliver is in the house! Your ultimate trivia champion host. Let me know when you're ready for the first quiz round!";
      default:
        return `Hola, te doy la bienvenida. Soy ${name || "tu consultor"}, especialista como ${role || "Asesor General"}. Protocolo de diálogo de baja latencia completado. Cuéntame, ¿en qué te puedo asistir hoy?`;
    }
  };

  // End active call session
  const handleEndCall = () => {
    if (callState.contact) {
      const durationFormatted = `${Math.floor(callState.duration / 60)}m ${callState.duration % 60}s`;
      
      // Append to local history list
      const newHistoryItem = {
        id: Date.now(),
        contact: callState.contact,
        type: "video",
        date: "Just Now",
        duration: durationFormatted,
        status: "outgoing"
      };

      setCallHistory(prev => [newHistoryItem, ...prev]);
    }

    setCallState({
      active: false,
      contact: null,
      isMuted: false,
      isVideoOff: false,
      cameraFilter: "normal",
      duration: 0
    });
    
    setIsCalling(false);
    setActiveCallContact(null);
    setLastAiMessageText(null);
    setChatOverlayOpen(false);
  };

  // Text message submission (triggers Gemini API on Express backend)
  const handleSendMessage = async (text: string) => {
    if (!callState.contact) return;
    const personaId = callState.contact.id;

    // 1. Append user's message immediately to the feed
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    const currentHistory = [...(messages[personaId] || []), userMsg];
    
    setMessages(prev => ({
      ...prev,
      [personaId]: currentHistory
    }));

    setIsThinking(true);
    setLastAiMessageText(null);

    try {
      // Create chat context for Gemini call (limit history to last 8 elements for token savings)
      const queryHistory = currentHistory.slice(-8).map(m => ({
        role: m.sender,
        content: m.content
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          persona: personaId,
          messages: queryHistory
        })
      });

      if (!res.ok) {
        throw new Error("Backend server error while contacting Gemini.");
      }

      const data = await res.json();
      const replyText = data.content;

      // 2. Append AI response
      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        sender: "assistant",
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setMessages(prev => ({
        ...prev,
        [personaId]: [...(prev[personaId] || []), assistantMsg]
      }));

      // Update subtitle/speech bubble
      setLastAiMessageText(replyText);

    } catch (err) {
      console.error("Gemini communication failed:", err);
      
      const errorMsg: Message = {
        id: `error-${Date.now()}`,
        sender: "assistant",
        content: "Oops! I lost connection to my AI core. Check your internet or make sure process.env.GEMINI_API_KEY is configured correctly.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setMessages(prev => ({
        ...prev,
        [personaId]: [...(prev[personaId] || []), errorMsg]
      }));

    } finally {
      setIsThinking(false);
    }
  };

  // Open direct chat overlay on homescreen click
  const handleOpenDirectChat = (contact: Contact) => {
    // Start video call session instantly for this immersive communication design
    handleStartCall(contact);
    setTimeout(() => {
      setChatOverlayOpen(true);
    }, 2200);
  };

  // Filter contacts by search query
  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-screen bg-[#030508] text-white flex justify-center items-center font-sans antialiased">
      
      {/* Immersive Mobile Device Frame mockup centered */}
      <div className="relative w-full h-full max-w-md sm:h-[840px] sm:rounded-[36px] bg-brand-bg sm:border-8 sm:border-brand-primary/25 sm:shadow-[0_0_80px_rgba(212,175,55,0.15)] overflow-hidden flex flex-col">
        
        {/* Ringing/Calling Screen Simulator Overlay */}
        {isCalling && activeCallContact && (
          <div className="absolute inset-0 z-50 flex flex-col justify-between items-center bg-[#07090e]/95 p-8 text-center animate-fade-in border-2 border-brand-primary/30">
            <div className="flex flex-col items-center mt-20">
              <span className="text-[10px] font-mono uppercase tracking-widest text-brand-primary font-bold">Initiating Real-time Voice Link...</span>
              <div className="relative mt-8">
                <div className="absolute -inset-4 bg-brand-primary/20 rounded-full animate-ping" />
                <img 
                  src={activeCallContact.avatar} 
                  alt={activeCallContact.name} 
                  referrerPolicy="no-referrer"
                  className="w-28 h-28 rounded-full object-cover border-4 border-brand-primary relative z-10 shadow-2xl"
                />
              </div>
              <h2 className="text-2xl font-bold text-white mt-6 tracking-wide">{activeCallContact.name}</h2>
              <p className="text-xs text-brand-primary mt-1.5 font-mono uppercase tracking-wider">{activeCallContact.role}</p>
            </div>
            
            <div className="flex flex-col items-center mb-16">
              <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center animate-bounce shadow-xl cursor-pointer" onClick={() => setIsCalling(false)}>
                <Phone className="w-6 h-6 rotate-135 text-white" />
              </div>
              <span className="text-[10px] text-white/50 font-mono tracking-wider mt-4 uppercase">Disconnecting via Cancel</span>
            </div>
          </div>
        )}

        {/* ACTIVE LIVE CALL DISPLAY */}
        {callState.active && callState.contact ? (
          <div className="relative w-full h-full flex flex-col justify-between bg-black">
            
            {/* Immersive Glass Call Topbar Header with limit countdown */}
            <ActiveCallHeader 
              contact={callState.contact}
              duration={callState.duration}
              remainingSeconds={availableSeconds}
              onLeave={handleEndCall}
              onToggleAddParticipant={() => setActiveAddParticipant(!activeAddParticipant)}
            />

            {/* Simulated interactive camera viewport stages */}
            <VideoCanvas 
              contact={callState.contact}
              isMuted={callState.isMuted}
              isVideoOff={callState.isVideoOff}
              cameraFilter={callState.cameraFilter}
              onToggleMute={() => setCallState(p => ({ ...p, isMuted: !p.isMuted }))}
              onToggleVideo={() => setCallState(p => ({ ...p, isVideoOff: !p.isVideoOff }))}
              onSetFilter={(filter: CameraFilter) => setCallState(p => ({ ...p, cameraFilter: filter }))}
              onEndCall={handleEndCall}
              onToggleChat={() => setChatOverlayOpen(!chatOverlayOpen)}
              isChatOpen={chatOverlayOpen}
              isThinking={isThinking}
              lastAiMessageText={lastAiMessageText}
            />

            {/* High-fidelity slide up glass chat widget overlay */}
            <ChatOverlay 
              isOpen={chatOverlayOpen}
              onClose={() => setChatOverlayOpen(false)}
              contact={callState.contact}
              messages={messages[callState.contact.id] || []}
              onSendMessage={handleSendMessage}
              isThinking={isThinking}
              onToggleMemory={handleToggleMemory}
            />

            {/* Visual Participant popup drawer */}
            {activeAddParticipant && (
              <div className="absolute inset-0 bg-black/70 z-50 flex items-end animate-fade-in" onClick={() => setActiveAddParticipant(false)}>
                <div className="w-full bg-brand-surface p-6 rounded-t-3xl border-t border-brand-primary/30" onClick={e => e.stopPropagation()}>
                  <div className="w-12 h-1.5 bg-brand-primary/20 rounded-full mx-auto mb-4" />
                  <h3 className="text-sm font-semibold text-white mb-1.5 flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-brand-primary" />
                    <span>Invite to Group Session</span>
                  </h3>
                  <p className="text-xs text-white/50 mb-4">Orchestrate multiple Quantum Hive digital avatars simultaneously.</p>
                  
                  <div className="space-y-2.5">
                    {contacts.filter(c => c.id !== callState.contact?.id).map(c => (
                      <div key={c.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                        <div className="flex items-center gap-2.5">
                          <img src={c.avatar} alt={c.name} referrerPolicy="no-referrer" className="w-8 h-8 rounded-full" />
                          <div>
                            <p className="text-xs font-semibold text-white">{c.name}</p>
                            <p className="text-[10px] text-brand-primary font-mono">{c.role}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            alert(`Simulated Action: Invited ${c.name} to this workspace session.`);
                            setActiveAddParticipant(false);
                          }}
                          className="px-3 py-1 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-brand-bg text-[10px] font-bold transition-colors cursor-pointer"
                        >
                          Invite
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        ) : (
          
          /* HOMEPAGE CORE PORTAL (CHATS / CALLS / STATS HUB) */
          <div className="flex-1 flex flex-col justify-between">
            
            {/* Top Brand Branding Header with customizable balance indicator */}
            <header className="p-4 bg-brand-surface border-b border-brand-primary/20 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-1 bg-brand-bg rounded-lg border border-brand-primary/30">
                  <img 
                    src={QUANTUM_HIVE_LOGO} 
                    alt="Quantum Hive Logo" 
                    className="w-8 h-8 object-cover rounded-md"
                  />
                </div>
                <div>
                  <h1 className="text-sm font-black tracking-widest text-white uppercase font-sans flex items-center gap-1.5">
                    <span>QUANTUM HIVE</span>
                  </h1>
                  <p className="text-[8px] text-brand-primary font-mono tracking-widest uppercase">Mother Intelligence Core</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveTab("billing")}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/35 text-[9px] text-amber-400 font-mono font-bold hover:bg-amber-500/20 transition-all cursor-pointer"
                  title="Recargar Minutos"
                >
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>{(availableSeconds / 60).toFixed(1)} MIN</span>
                </button>
                <span className="flex items-center gap-1 px-2 py-1 rounded bg-brand-primary/10 border border-brand-primary/20 text-[8px] text-brand-primary font-mono">
                  <Lock className="w-3 h-3" />
                  <span>SECURE AGENT</span>
                </span>
              </div>
            </header>

            {/* Quick search panel (only visible on Core Portal Chats/Services) */}
            {(activeTab === "chats" || activeTab === "services") && (
              <div className="px-4 py-3 bg-brand-surface/40 flex-shrink-0 border-b border-white/5">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input 
                    type="text"
                    placeholder="Buscar avatares, roles, o protocolos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder-white/40 focus:outline-none focus:border-brand-primary/60 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* DYNAMIC SCROLL CONTAINER (TABS PORTAL) */}
            <div className="flex-1 overflow-y-auto bg-brand-bg">
              
              {/* CHATS TAB LIST */}
              {activeTab === "chats" && (
                <div className="divide-y divide-white/5 animate-fade-in">
                  
                  {/* Statuses / Stories Pill Tray */}
                  <div className="px-4 py-3 border-b border-white/5 bg-brand-surface/20">
                    <p className="text-[9px] uppercase font-mono tracking-widest text-white/40 mb-2 font-bold font-sans">Active Avatar Node Matrix</p>
                    <div className="flex items-center gap-3.5 overflow-x-auto no-scrollbar py-1">
                      {contacts.map(c => (
                        <div 
                          key={c.id} 
                          className="flex flex-col items-center flex-shrink-0 group cursor-pointer"
                          onClick={() => handleStartCall(c)}
                        >
                          <div className="relative">
                            <img 
                              src={c.avatar} 
                              alt={c.name} 
                              referrerPolicy="no-referrer"
                              className="w-12 h-12 rounded-full object-cover border-2 border-brand-primary group-hover:border-white transition-all p-0.5" 
                            />
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-brand-primary border-2 border-brand-bg rounded-full animate-pulse" />
                          </div>
                          <span className="text-[10px] text-white/80 font-mono mt-1 group-hover:text-brand-primary truncate max-w-[65px] text-center">
                            {c.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {filteredContacts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center p-12 opacity-60">
                      <HelpCircle className="w-10 h-10 text-white/30 mb-2" />
                      <p className="text-xs text-white/80 font-medium">No results match your query</p>
                      <p className="text-[10px] text-white/40 mt-1">Try searching 'Clara' or 'Ares'.</p>
                    </div>
                  ) : (
                    filteredContacts.map((contact) => (
                      <ContactCard 
                        key={contact.id}
                        contact={contact}
                        onStartCall={handleStartCall}
                        onOpenChat={handleOpenDirectChat}
                        onToggleMemory={handleToggleMemory}
                      />
                    ))
                  )}

                  {/* Feature Announcement Cards */}
                  <div className="p-4 m-4 bg-gradient-to-br from-brand-surface to-[#121824] border border-brand-primary/20 rounded-2xl">
                    <div className="flex items-center gap-2 text-brand-primary">
                      <Award className="w-4.5 h-4.5" />
                      <span className="text-[10px] font-bold uppercase tracking-widest font-mono">Quantum Hive Engine Spec</span>
                    </div>
                    <h4 className="text-xs font-bold text-white mt-1.5 font-sans">Real-time GPU Avatar Synthesis</h4>
                    <p className="text-[10.5px] text-white/50 leading-relaxed mt-1">
                      Our platform supports zero-latency audio streaming direct to your VM. Configure the socket link in the <b>VM Server</b> tab to route client PCM arrays to your custom voice-model hardware.
                    </p>
                  </div>
                </div>
              )}

              {/* PROFESSIONAL SERVICES TAB */}
              {activeTab === "services" && (
                <ProfessionalServices 
                  allServices={CONTACTS_DATA}
                  hiredContacts={contacts}
                  onHireService={handleHireService}
                  onStartCall={handleStartCall}
                  onOpenChat={handleOpenDirectChat}
                  onGoBack={() => setActiveTab("chats")}
                />
              )}

              {/* AGENT & PERSONALITY CREATION TAB */}
              {activeTab === "create" && (
                <AgentCreator 
                  onAddAgent={handleAddCustomAgent}
                />
              )}

              {/* BILLING PLANS & PACKS TAB */}
              {activeTab === "billing" && (
                <BillingHub 
                  currentMinutes={Number((availableSeconds / 60).toFixed(1))}
                  onAddMinutes={handleAddMinutes}
                  isMemoryPlanActive={isMemoryPlanActive}
                  onToggleMemoryPlan={handleToggleMemoryPlan}
                />
              )}

              {/* CALLS HISTORY LIST TAB */}
              {activeTab === "calls" && (
                <div className="p-4 space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-mono uppercase tracking-wider text-white/40 font-bold">Recent Communications</h3>
                    <button 
                      onClick={() => {
                        if (confirm("Are you sure you want to clear call history?")) {
                          setCallHistory([]);
                        }
                      }}
                      className="text-[10px] font-mono text-brand-primary hover:underline"
                    >
                      Clear Logs
                    </button>
                  </div>

                  {callHistory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center py-16 opacity-50">
                      <Clock className="w-10 h-10 text-white/20 mb-2" />
                      <p className="text-xs">No calling history.</p>
                      <p className="text-[10px]">Start video call sessions on the chats screen!</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {callHistory.map((log) => (
                        <div 
                          key={log.id} 
                          className="flex items-center justify-between p-3.5 bg-brand-surface/40 hover:bg-brand-surface/80 border border-white/5 rounded-xl transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <img 
                              src={log.contact.avatar} 
                              alt={log.contact.name} 
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 rounded-full object-cover border border-white/10" 
                            />
                            <div>
                              <p className="text-xs font-bold text-white">{log.contact.name}</p>
                              <div className="flex items-center gap-1.5 text-[10px] text-white/50 mt-1">
                                <span className={log.status === "incoming" ? "text-brand-primary" : "text-white/40"}>
                                  {log.status === "incoming" ? "↙ Received" : "↗ Placed"}
                                </span>
                                <span>•</span>
                                <span className="font-mono">{log.date}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-[9px] font-mono bg-white/5 px-2 py-0.5 rounded border border-white/5 text-white/70">
                              {log.duration}
                            </span>
                            <button 
                              onClick={() => handleStartCall(log.contact)}
                              className="p-2 rounded-full bg-brand-primary/10 hover:bg-brand-primary text-brand-primary hover:text-brand-bg transition-colors cursor-pointer"
                            >
                              <Video className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* VM LINK INTEGRATION TAB */}
              {activeTab === "vm" && (
                <VmConfigurator config={vmConfig} onChange={setVmConfig} />
              )}

              {/* COMM CORE SETTINGS & SYSTEM INFO TAB */}
              {activeTab === "ai" && (
                <div className="p-5 space-y-5 animate-fade-in">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
                    <Settings className="w-5 h-5 text-brand-primary" />
                    <h3 className="text-sm font-semibold">Security & Protocols</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-brand-primary/20">
                      <h4 className="text-xs font-bold text-brand-primary uppercase tracking-wider font-mono">System Telemetry Specs</h4>
                      <div className="grid grid-cols-2 gap-3.5 mt-3">
                        <div className="bg-black/30 p-2.5 rounded-lg border border-white/5">
                          <span className="text-[9px] text-white/40 block font-mono">GATEWAY STATUS</span>
                          <span className="text-xs text-brand-primary font-bold mt-1 block flex items-center gap-1 font-mono">
                            <span className="w-2 h-2 bg-brand-primary rounded-full animate-ping" />
                            <span>ONLINE</span>
                          </span>
                        </div>
                        <div className="bg-black/30 p-2.5 rounded-lg border border-white/5">
                          <span className="text-[9px] text-white/40 block font-mono">HYBRID FALLBACK</span>
                          <span className="text-xs text-white/90 font-mono font-bold mt-1 block truncate">Gemini 3.5 Flash</span>
                        </div>
                        <div className="bg-black/30 p-2.5 rounded-lg border border-white/5">
                          <span className="text-[9px] text-white/40 block font-mono">VM LINK MODE</span>
                          <span className="text-xs text-brand-primary font-mono font-bold mt-1 block uppercase">
                            {vmConfig.mode === "vm" ? "Direct VM" : "Simulation"}
                          </span>
                        </div>
                        <div className="bg-black/30 p-2.5 rounded-lg border border-white/5">
                          <span className="text-[9px] text-white/40 block font-mono">ACTIVE MATRIX</span>
                          <span className="text-xs text-white/90 font-bold mt-1 block font-mono">{contacts.length} Hive Avatars</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Integration Verification</h4>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2.5 text-xs text-white/80 p-2 bg-white/5 rounded-lg">
                          <CheckCircle2 className="w-4.5 h-4.5 text-brand-primary" />
                          <span>VM Gateway: Handshake active</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs text-white/80 p-2 bg-white/5 rounded-lg">
                          <CheckCircle2 className="w-4.5 h-4.5 text-brand-primary" />
                          <span>Mother Intelligence Core: Synced</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs text-white/80 p-2 bg-white/5 rounded-lg">
                          <CheckCircle2 className="w-4.5 h-4.5 text-brand-primary" />
                          <span>Interactive PIP Video: Functional</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* HIGH-END COHESIVE NAVIGATION TAB BAR */}
            <nav className="p-3 bg-brand-surface border-t border-brand-primary/20 flex items-center justify-around flex-shrink-0 z-20">
              <button 
                onClick={() => setActiveTab("chats")}
                className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${activeTab === "chats" ? "text-brand-primary scale-105 font-bold" : "text-white/45 hover:text-white/90"}`}
                title="Hive Portal"
              >
                <Sparkles className="w-4.5 h-4.5" />
                <span className="text-[9px] font-mono tracking-wide font-semibold">Hive Portal</span>
              </button>
              
              <button 
                onClick={() => setActiveTab("services")}
                className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${activeTab === "services" ? "text-brand-primary scale-105 font-bold" : "text-white/45 hover:text-white/90"}`}
                title="Servicios"
              >
                <Compass className="w-4.5 h-4.5" />
                <span className="text-[9px] font-mono tracking-wide font-semibold">Servicios</span>
              </button>

              <button 
                onClick={() => setActiveTab("create")}
                className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${activeTab === "create" ? "text-brand-primary scale-105 font-bold" : "text-white/45 hover:text-white/90"}`}
                title="Diseño Core"
              >
                <Cpu className="w-4.5 h-4.5" />
                <span className="text-[9px] font-mono tracking-wide font-semibold">Diseño Core</span>
              </button>

              <button 
                onClick={() => setActiveTab("billing")}
                className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${activeTab === "billing" ? "text-brand-primary scale-105 font-bold" : "text-white/45 hover:text-white/90"}`}
                title="Packs"
              >
                <Coins className="w-4.5 h-4.5" />
                <span className="text-[9px] font-mono tracking-wide font-semibold">Packs</span>
              </button>

              <button 
                onClick={() => setActiveTab("calls")}
                className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${activeTab === "calls" ? "text-brand-primary scale-105 font-bold" : "text-white/45 hover:text-white/90"}`}
                title="Historial"
              >
                <Phone className="w-4.5 h-4.5" />
                <span className="text-[9px] font-mono tracking-wide font-semibold">Historial</span>
              </button>
            </nav>

          </div>
        )}
      </div>

      {/* Expired Minutes Modal Popup Overlay */}
      {showExpiredModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-brand-surface border border-brand-primary/45 p-6 rounded-3xl max-w-xs text-center space-y-4 shadow-2xl animate-fade-in">
            <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <Clock className="w-7 h-7" />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-md font-bold text-white tracking-wide uppercase">Límite Agotado</h3>
              <p className="text-[11px] text-white/60 leading-relaxed">
                Tus minutos de llamada interactiva con el avatar han concluido. Adquiere un nuevo pack de minutos en la sección de Recargas.
              </p>
            </div>

            <div className="space-y-2 pt-1.5">
              <button
                onClick={() => {
                  setShowExpiredModal(false);
                  setActiveTab("billing");
                }}
                className="w-full py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-brand-bg text-xs font-black rounded-xl uppercase tracking-wider transition-all cursor-pointer"
              >
                Ver Packs de Minutos
              </button>
              <button
                onClick={() => setShowExpiredModal(false)}
                className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-white/50 text-[11px] rounded-xl transition-all cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Memory Subscription Modal Prompt */}
      {showMemorySubscribePrompt && (() => {
        const targetContact = CONTACTS_DATA.find(c => c.id === showMemorySubscribePrompt);
        return (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
            <div className="bg-brand-surface border border-emerald-500/40 p-6 rounded-3xl max-w-xs text-center space-y-4 shadow-2xl">
              <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <span className="text-2xl">🧠</span>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-md font-bold text-white tracking-wide uppercase">Activar Memoria Cuántica</h3>
                <p className="text-[11px] text-white/75 leading-relaxed">
                  Para que <strong>{targetContact?.name || "este asistente"}</strong> y todos los demás recuerden tus conversaciones anteriores y tengan memoria compartida de tus VM, necesitas el plan de Memoria Cuántica.
                </p>
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-2.5 mt-2">
                  <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider font-mono">Plan Memoria Compartida</p>
                  <p className="text-xs text-white/90 mt-0.5">$9.99 USD <span className="text-[9px] text-white/50 font-normal">/ mes</span></p>
                </div>
              </div>

              <div className="space-y-2 pt-1.5">
                <button
                  onClick={handleSubscribeMemoryFromPrompt}
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-black rounded-xl uppercase tracking-wider transition-all cursor-pointer"
                >
                  Suscribirse Ahora
                </button>
                <button
                  onClick={() => setShowMemorySubscribePrompt(null)}
                  className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-white/50 text-[11px] rounded-xl transition-all cursor-pointer"
                >
                  Tal vez más tarde
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

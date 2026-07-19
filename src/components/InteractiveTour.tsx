import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, Compass, Languages, Clock, 
  ChevronRight, ChevronLeft, X, 
  ShieldCheck, Target, Info, Flame
} from "lucide-react";
import { LanguageType } from "../lib/translations";

interface TourStep {
  title: string;
  subtitle: string;
  description: string;
  tabKey?: "communication" | "brain" | "creative" | "performance";
  icon: React.ReactNode;
  highlightText: string;
}

interface InteractiveTourProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: "communication" | "brain" | "creative" | "performance") => void;
  language: LanguageType;
}

export default function InteractiveTour({ isOpen, onClose, onSelectTab, language }: InteractiveTourProps) {
  const [tourMode, setTourMode] = useState<"conceptual" | "immersive">("conceptual");
  const [currentStep, setCurrentStep] = useState(0);
  const [immersiveStep, setImmersiveStep] = useState(0);

  // Multilingual conceptual steps updated for the 4-tab model router interface
  const conceptualStepsByLang: Record<LanguageType, TourStep[]> = {
    es: [
      {
        title: "Bienvenido a Base QuantumHive v3.5",
        subtitle: "Arquitectura Corporativa e Inteligencia Multinube",
        description: "Quantum Hive es una plataforma multinube soberana. Conecta agentes de inteligencia de negocios mediante un enrutador nativo, permitiendo alternar entre modelos cuánticos como Spark y Bolt y utilizar tokens gratuitos o planes premium.",
        icon: <Sparkles className="w-10 h-10 text-brand-primary animate-pulse" />,
        highlightText: "Alimentado por servidores nativos de la Nube Quantum."
      },
      {
        title: "Núcleo de Comunicación (Voz y Chat)",
        subtitle: "🎙️ Canales Humanos de Latencia Cero",
        description: "Interactúa con avatares virtuales de negocios en tiempo real por voz o por chat interactivo con memoria. Transcribe audios al instante con el transcriptor de ultra precisión de Base QuantumHive.",
        tabKey: "communication",
        icon: <Sparkles className="w-10 h-10 text-blue-400" />,
        highlightText: "Simula videollamadas fluidas o configura el enlace del servidor virtual."
      },
      {
        title: "Cerebro y Datos (Grounding & Análisis)",
        subtitle: "🧠 Conexión con el Mundo Real",
        description: "Permite que tu avatar acceda a internet en tiempo real usando Google Search Grounding o Google Maps Grounding para encontrar lugares, o analiza fotos y documentos con el escáner de alta precisión de la Nube Quantum.",
        tabKey: "brain",
        icon: <Compass className="w-10 h-10 text-emerald-400" />,
        highlightText: "Fundamentación total de respuestas con fuentes en tiempo real."
      },
      {
        title: "Estudio Creativo (Multimedia)",
        subtitle: "🎨 Generación y Animación Premium",
        description: "Crea imágenes de alta definición 4K de tus avatares, edítalas con comandos de texto sencillos, o convierte tus fotos en video animado con el motor de generación de video de última generación Veo 3.",
        tabKey: "creative",
        icon: <Languages className="w-10 h-10 text-pink-400" />,
        highlightText: "Renderiza videos cinemáticos directamente en la infraestructura Quantum."
      },
      {
        title: "Rendimiento (Enrutador de Modelos)",
        subtitle: "⚡ Gestión de Infraestructura",
        description: "Optimiza la latencia y costos. Prueba el simulador de enrutamiento Spark, habla al instante con Bolt/Flash-Lite para respuestas ultra rápidas, y recarga packs de cómputo.",
        tabKey: "performance",
        icon: <Clock className="w-10 h-10 text-cyan-400" />,
        highlightText: "Monitorea el consumo de servidores locales en tiempo real."
      }
    ],
    en: [
      {
        title: "Welcome to QuantumHive Base v3.5",
        subtitle: "Corporate Architecture & Multi-Cloud Intelligence",
        description: "Quantum Hive is a sovereign multi-cloud platform. It routes business intelligence queries natively across specialized quantum models, offering local free tokens or premium enterprise packages.",
        icon: <Sparkles className="w-10 h-10 text-brand-primary animate-pulse" />,
        highlightText: "Powered by native high-availability Quantum Cloud servers."
      },
      {
        title: "Communication Core (Voice & Chat)",
        subtitle: "🎙️ Zero-Latency Human-Agent Channels",
        description: "Interact with virtual business avatars in real-time through high-fidelity voice or text chat with memory. Transcribe recordings instantly using the ultra-precise Quantum Speech-to-Text service.",
        tabKey: "communication",
        icon: <Sparkles className="w-10 h-10 text-blue-400" />,
        highlightText: "Simulate virtual video calls or customize the streaming link."
      },
      {
        title: "Brain & Data (Grounding & Analytics)",
        subtitle: "🧠 Connected Real-World Intelligence",
        description: "Allow your avatar to fetch real-time facts with Google Search and Maps Grounding, or analyze photos/documents using the advanced high-precision Quantum scanner.",
        tabKey: "brain",
        icon: <Compass className="w-10 h-10 text-emerald-400" />,
        highlightText: "Fully grounded answers with real-time web citations."
      },
      {
        title: "Creative Studio (Multimedia)",
        subtitle: "🎨 Premium Image & Video Generation",
        description: "Generate stunning 4K images of your avatars, edit them via plain text commands, or transform static photos into fluid video clips using the top-tier Veo 3 engine.",
        tabKey: "creative",
        icon: <Languages className="w-10 h-10 text-pink-400" />,
        highlightText: "Render high-definition cinematic videos hosted on our local GPU cluster."
      },
      {
        title: "Performance (Model Router)",
        subtitle: "⚡ Cost & Speed Optimization",
        description: "Control cost and speed dynamics. Try the interactive Spark dynamic routing simulator, chat with the low-latency Bolt model, and manage compute pack recharges.",
        tabKey: "performance",
        icon: <Clock className="w-10 h-10 text-cyan-400" />,
        highlightText: "Monitor local multi-node server loads in real time."
      }
    ],
    pt: [
      {
        title: "Bem-vindo ao QuantumHive Base v3.5",
        subtitle: "Arquitetura Corporativa e Inteligência Multi-Nuvem",
        description: "Quantum Hive é uma plataforma de nuvem múltipla soberana. Direcione consultas de IA de forma dinâmica através de modelos especializados, com saldo local de tokens gratuitos e planos corporativos.",
        icon: <Sparkles className="w-10 h-10 text-brand-primary animate-pulse" />,
        highlightText: "Hospedado em servidores de alta disponibilidade de Nuvem Quantum."
      },
      {
        title: "Núcleo de Comunicação (Voz e Chat)",
        subtitle: "🎙️ Canais de Zero Latência",
        description: "Converse com avatares virtuais de negócios em tempo real por voz ou chat de texto inteligente com memória. Transcreva gravações de áudio com alta precisão nativa.",
        tabKey: "communication",
        icon: <Sparkles className="w-10 h-10 text-blue-400" />,
        highlightText: "Simule chamadas de vídeo fluidas ou configure o link de streaming de voz."
      },
      {
        title: "Cérebro e Dados (Grounding e Análise)",
        subtitle: "🧠 Inteligência Conectada ao Mundo Real",
        description: "Permita que seu avatar busque fatos em tempo real com Google Search e Maps Grounding, ou analise fotos e documentos usando o scanner avançado da Nuvem Quantum.",
        tabKey: "brain",
        icon: <Compass className="w-10 h-10 text-emerald-400" />,
        highlightText: "Respostas fundamentadas com citações da web em tempo real."
      },
      {
        title: "Estúdio Criativo (Multimídia)",
        subtitle: "🎨 Geração e Animação de Alta Definição",
        description: "Gere imagens incríveis de 4K de seus avatares, edite-as por texto simples ou transforme fotos estáticas em clipes de vídeo dinâmicos com o motor de ponta Veo 3.",
        tabKey: "creative",
        icon: <Languages className="w-10 h-10 text-pink-400" />,
        highlightText: "Renderize vídeos cinematográficos diretamente na infraestrutura local."
      },
      {
        title: "Rendimento (Roteador de Modelos)",
        subtitle: "⚡ Otimização de Custo e Latência",
        description: "Otimize consumo e velocidade. Teste o simulador dinâmico Spark, interaja instantaneamente com o modelo Bolt para respostas ultrarrápidas, e compre pacotes de computação.",
        tabKey: "performance",
        icon: <Clock className="w-10 h-10 text-cyan-400" />,
        highlightText: "Monitore a carga dos servidores multi-norte em tempo real."
      }
    ]
  };

  // Multilingual immersive steps mapped exactly to the 4 main navigation tabs
  const immersiveStepsByLang = {
    es: [
      {
        title: "Prueba el Núcleo de Comunicación",
        instruction: "Dirígete a la pestaña de 'Comunicación' (icono de micrófono 🎙️) en la barra inferior. Aquí puedes iniciar chats persistentes, simular llamadas de voz, o subir grabaciones para transcribirlas.",
        tabKey: "communication" as const,
        actionHighlight: "Módulo 'Comunicación' en la barra inferior.",
        tip: "Haz clic en el icono del teléfono de un avatar para iniciar la videollamada interactiva."
      },
      {
        title: "Prueba el Grounding en Tiempo Real",
        instruction: "Cambia a la pestaña de 'Cerebro' (icono de cerebro 🧠) en la barra inferior. Escribe una consulta en el módulo de Búsqueda de Google o de Maps, o sube una imagen al escáner de documentos.",
        tabKey: "brain" as const,
        actionHighlight: "Módulo 'Cerebro' en la barra inferior.",
        tip: "La búsqueda de Google te proporcionará fuentes en vivo y enlaces clicables con fundamentación cuántica."
      },
      {
        title: "Genera Arte en el Estudio Creativo",
        instruction: "Toca el icono de paleta de arte 🎨 en la barra inferior para acceder al 'Estudio'. Prueba generar una foto en resolución 4K o animar una imagen subida en un video con Veo 3.",
        tabKey: "creative" as const,
        actionHighlight: "Módulo 'Estudio' en la barra de navegación inferior.",
        tip: "Puedes elegir entre resoluciones de 1K, 2K y 4K con opciones de relación de aspecto."
      },
      {
        title: "Optimiza la Latencia en Rendimiento",
        instruction: "Ve a la pestaña de 'Rendimiento' (icono de rayo ⚡). Prueba el simulador de enrutamiento Spark, chatea con Bolt para respuestas ultra veloces, y monitorea el estado de tus servidores multinube.",
        tabKey: "performance" as const,
        actionHighlight: "Módulo 'Rendimiento' en el menú inferior.",
        tip: "También encontrarás el panel de recarga de minutos de cómputo y el registro histórico de llamadas en esta sección."
      }
    ],
    en: [
      {
        title: "Test the Communication Core",
        instruction: "Head to the 'Communication' tab (microphone icon 🎙️) in the bottom bar. Here you can start persistent chats, simulate voice calls, or upload recordings to transcribe them.",
        tabKey: "communication" as const,
        actionHighlight: "'Communication' module in the bottom bar.",
        tip: "Click on an avatar's phone icon to initiate the interactive video call simulation."
      },
      {
        title: "Try Real-World Grounding",
        instruction: "Switch to the 'Brain' tab (brain icon 🧠) in the bottom bar. Enter a query in the Google Search or Google Maps modules, or drag a photo into the Document Scanner.",
        tabKey: "brain" as const,
        actionHighlight: "'Brain' module in the bottom bar.",
        tip: "Google Search provides live sources and clickable citation links backed by the Quantum Cloud."
      },
      {
        title: "Generate Art in the Creative Studio",
        instruction: "Tap the palette icon 🎨 in the bottom bar to access the 'Studio'. Try generating a custom 4K image or animating an uploaded picture into video with Veo 3.",
        tabKey: "creative" as const,
        actionHighlight: "'Studio' module in the bottom navigation bar.",
        tip: "Select from professional 1K, 2K, or 4K resolutions and configure custom aspect ratios."
      },
      {
        title: "Optimize Speed in Performance",
        instruction: "Go to the 'Performance' tab (lightning bolt icon ⚡). Test the Spark routing simulator, chat with the ultra-fast Bolt model, and monitor multi-cloud servers.",
        tabKey: "performance" as const,
        actionHighlight: "'Performance' module in the bottom menu.",
        tip: "You can also access compute pack recharges and active call history logs here."
      }
    ],
    pt: [
      {
        title: "Teste o Núcleo de Comunicação",
        instruction: "Vá para a guia de 'Comunicação' (ícone de microfone 🎙️) no menu inferior. Inicie conversas, simule chamadas de voz ou transcreva gravações de áudio.",
        tabKey: "communication" as const,
        actionHighlight: "Módulo de 'Comunicação' no menu inferior.",
        tip: "Clique no ícone de telefone para iniciar a chamada de vídeo de alta fidelidade."
      },
      {
        title: "Experimente o Grounding Conectado",
        instruction: "Mude para a guia de 'Cérebro' (ícone de cérebro 🧠). Faça pesquisas fundamentadas com o Google Search e Google Maps ou use o scanner de fotos.",
        tabKey: "brain" as const,
        actionHighlight: "Módulo de 'Cérebro' no menu inferior.",
        tip: "A pesquisa do Google fornece links e fontes clicáveis com comprovação em tempo real."
      },
      {
        title: "Gere Arte no Estúdio Criativo",
        instruction: "Toque no ícone de paleta de arte 🎨 para acessar o 'Estúdio'. Gere imagens 4K personalizadas ou anime fotos estáticas em clipes de vídeo com Veo 3.",
        tabKey: "creative" as const,
        actionHighlight: "Módulo de 'Estúdio' na barra de navegação inferior.",
        tip: "Defina resoluções profissionais de 1K, 2K ou 4K e escolha as dimensões."
      },
      {
        title: "Otimize Velocidades no Rendimento",
        instruction: "Vá para a guia de 'Rendimento' (ícone de raio ⚡). Teste o simulador de rotas Spark, converse com Bolt para latência instantânea e veja os servidores virtuais.",
        tabKey: "performance" as const,
        actionHighlight: "Módulo de 'Rendimento' no menu inferior.",
        tip: "Nesta seção você também gerencia recargas de pacotes de minutos e o histórico de chamadas."
      }
    ]
  };

  if (!isOpen) return null;

  const conceptualSteps = conceptualStepsByLang[language] || conceptualStepsByLang.es;
  const immersiveSteps = immersiveStepsByLang[language] || immersiveStepsByLang.es;

  const currentConceptual = conceptualSteps[currentStep];
  const currentImmersive = immersiveSteps[immersiveStep];

  const handleNextConceptual = () => {
    if (currentStep < conceptualSteps.length - 1) {
      const nextStepIndex = currentStep + 1;
      setCurrentStep(nextStepIndex);
      const nextStep = conceptualSteps[nextStepIndex];
      if (nextStep.tabKey) {
        onSelectTab(nextStep.tabKey);
      }
    } else {
      setTourMode("immersive");
      onSelectTab(immersiveSteps[0].tabKey);
    }
  };

  const handlePrevConceptual = () => {
    if (currentStep > 0) {
      const prevStepIndex = currentStep - 1;
      setCurrentStep(prevStepIndex);
      const prevStep = conceptualSteps[prevStepIndex];
      if (prevStep.tabKey) {
        onSelectTab(prevStep.tabKey);
      }
    }
  };

  const handleNextImmersive = () => {
    if (immersiveStep < immersiveSteps.length - 1) {
      const nextStepIndex = immersiveStep + 1;
      setImmersiveStep(nextStepIndex);
      const nextStep = immersiveSteps[nextStepIndex];
      if (nextStep.tabKey) {
        onSelectTab(nextStep.tabKey);
      }
    } else {
      handleFinish();
    }
  };

  const handlePrevImmersive = () => {
    if (immersiveStep > 0) {
      const prevStepIndex = immersiveStep - 1;
      setImmersiveStep(prevStepIndex);
      const prevStep = immersiveSteps[prevStepIndex];
      if (prevStep.tabKey) {
        onSelectTab(prevStep.tabKey);
      }
    } else {
      setTourMode("conceptual");
      setCurrentStep(conceptualSteps.length - 1);
    }
  };

  const handleFinish = () => {
    localStorage.setItem("quantum_tutorial_shown", "true");
    onClose();
    setCurrentStep(0);
    setImmersiveStep(0);
    setTourMode("conceptual");
  };

  const tSkip = language === "en" ? "SKIP" : language === "pt" ? "PULAR" : "SALTAR";
  const tBack = language === "en" ? "BACK" : language === "pt" ? "VOLTAR" : "ATRÁS";
  const tNext = language === "en" ? "NEXT" : language === "pt" ? "AVANÇAR" : "SIGUIENTE";
  const tTrain = language === "en" ? "TRAIN ➜" : language === "pt" ? "TREINAR ➜" : "ENTRENAR ➜";
  const tFinish = language === "en" ? "FINISH TOUR" : language === "pt" ? "CONCLUIR TOUR" : "FINALIZAR TOUR";
  const tGeneral = language === "en" ? "View General Explanation" : language === "pt" ? "Ver Explicação Geral" : "Ver Explicación General";
  const tGoSelf = language === "en" ? "Go to Self-Guided ➜" : language === "pt" ? "Ir para Auto-Guiado ➜" : "Ir a Autoguiado ➜";

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 bg-black/85 backdrop-blur-md z-[9999] flex flex-col items-center justify-center p-4"
        id="interactive-tour-overlay"
      >
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-[10px] sm:text-xs font-mono text-white/50 bg-black/40 px-4 py-2 rounded-full border border-white/5 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
            <span>NUBE CORPORATIVA: QUANTUM HIVE SOBERANA ACTIVE</span>
          </div>
          <span className="text-brand-primary uppercase">
            {language === "en" ? "IMMERSIVE TRAINING MODE" : language === "pt" ? "MODO TREINAMENTO IMERSIVO" : "MODO ENTRENAMIENTO INMERSIVO"}
          </span>
        </div>

        {tourMode === "conceptual" ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-md bg-[#0d1421] border border-brand-primary/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(212,175,55,0.25)] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="h-1.5 w-full bg-white/5 relative">
              <div 
                className="absolute top-0 left-0 h-full bg-brand-primary transition-all duration-300"
                style={{ width: `${((currentStep + 1) / conceptualSteps.length) * 100}%` }}
              />
            </div>

            <button 
              onClick={handleFinish}
              className="absolute top-4 right-4 px-2.5 py-1 bg-white/5 hover:bg-white/10 text-[10px] font-mono text-white/50 hover:text-white rounded-lg transition-all cursor-pointer flex items-center gap-1 border border-white/5"
            >
              <span>{tSkip}</span>
              <X className="w-3.5 h-3.5" />
            </button>

            <div className="p-6 space-y-5 flex-1">
              <div className="flex justify-center py-2">
                <div className="p-4 bg-black/40 rounded-full border border-brand-primary/20 shadow-inner">
                  {currentConceptual.icon}
                </div>
              </div>

              <div className="text-center space-y-1">
                <span className="text-[9px] font-mono font-bold tracking-widest text-brand-primary uppercase">
                  {language === "en" ? "Infrastructure Explanation" : language === "pt" ? "Explicação de Infraestrutura" : "Explicación de Infraestructura"} • {currentStep + 1} de {conceptualSteps.length}
                </span>
                <h3 className="text-base font-bold text-white tracking-wide">{currentConceptual.title}</h3>
                <p className="text-xs text-brand-primary/80 font-medium">{currentConceptual.subtitle}</p>
              </div>

              <p className="text-xs text-white/70 text-center leading-relaxed font-sans max-h-[120px] overflow-y-auto pr-1">
                {currentConceptual.description}
              </p>

              <div className="p-3.5 bg-brand-primary/5 border border-brand-primary/20 rounded-2xl flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-brand-primary mt-0.5 flex-shrink-0 animate-pulse" />
                <p className="text-[10px] text-white/80 leading-relaxed font-sans italic">
                  <strong>{language === "en" ? "Network Details:" : language === "pt" ? "Detalhes da Rede:" : "Detalle de Red:"}</strong> {currentConceptual.highlightText}
                </p>
              </div>
            </div>

            <div className="p-4 bg-black/30 border-t border-white/5 flex items-center justify-between gap-3">
              <button
                onClick={handlePrevConceptual}
                disabled={currentStep === 0}
                className="px-3.5 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white text-[11px] font-mono font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{tBack}</span>
              </button>

              <button
                onClick={() => {
                  setTourMode("immersive");
                  onSelectTab(immersiveSteps[0].tabKey);
                }}
                className="text-[9px] font-mono text-brand-primary hover:underline border border-brand-primary/20 bg-brand-primary/5 px-2 py-0.5 rounded-full"
              >
                {tGoSelf}
              </button>

              <button
                onClick={handleNextConceptual}
                className="px-4 py-2 bg-brand-primary text-brand-bg hover:bg-brand-primary-hover text-[11px] font-mono font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_15px_rgba(212,175,55,0.2)]"
              >
                <span>{currentStep === conceptualSteps.length - 1 ? tTrain : tNext}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-lg bg-[#0a111a] border-2 border-brand-primary/40 rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(212,175,55,0.3)] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="h-1.5 w-full bg-white/5 relative">
              <div 
                className="absolute top-0 left-0 h-full bg-emerald-400 transition-all duration-300"
                style={{ width: `${((immersiveStep + 1) / immersiveSteps.length) * 100}%` }}
              />
            </div>

            <button 
              onClick={handleFinish}
              className="absolute top-4 right-4 px-2.5 py-1 bg-white/5 hover:bg-white/10 text-[10px] font-mono text-white/50 hover:text-white rounded-lg transition-all cursor-pointer flex items-center gap-1 border border-white/5"
            >
              <span>{language === "en" ? "COMPLETED" : language === "pt" ? "CONCLUÍDO" : "COMPLETADO"}</span>
              <X className="w-3.5 h-3.5" />
            </button>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <div className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/35 text-[9px] text-emerald-400 font-mono font-bold animate-pulse">
                  {language === "en" ? "SELF-GUIDED CONSOLE" : language === "pt" ? "CONSOLE AUTOGUIADO" : "CONSOLA AUTOGUIADA"}
                </div>
                <span className="text-[9px] font-mono text-white/40">
                  {language === "en" ? "STEP" : language === "pt" ? "PASSO" : "PASO"} {immersiveStep + 1} de {immersiveSteps.length}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-brand-primary animate-bounce" />
                  <span>{currentImmersive.title}</span>
                </h3>
                <p className="text-xs text-white/90 leading-relaxed font-sans font-medium bg-black/40 p-3 rounded-2xl border border-white/5">
                  {currentImmersive.instruction}
                </p>
              </div>

              <div className="p-3 bg-[#111926] border border-white/5 rounded-2xl space-y-1">
                <div className="flex items-center gap-1.5 text-[9px] font-mono text-brand-primary font-bold uppercase">
                  <Info className="w-3.5 h-3.5" />
                  <span>{language === "en" ? "Interact Area on screen:" : language === "pt" ? "Área para interagir na tela:" : "Área a interactuar en la pantalla:"}</span>
                </div>
                <p className="text-[11px] text-white/75 font-sans italic pl-5">{currentImmersive.actionHighlight}</p>
              </div>

              <div className="p-3 bg-brand-primary/5 border border-brand-primary/20 rounded-2xl flex items-start gap-2.5">
                <Flame className="w-4 h-4 text-brand-primary mt-0.5 flex-shrink-0 animate-pulse" />
                <div className="space-y-0.5">
                  <span className="text-[9px] font-mono uppercase text-brand-primary font-bold block">
                    {language === "en" ? "Corporate Tip" : language === "pt" ? "Dica Corporativa" : "Tip de Elite"}
                  </span>
                  <p className="text-[10px] text-white/85 leading-relaxed font-sans">{currentImmersive.tip}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-black/50 border-t border-white/5 flex items-center justify-between gap-3">
              <button
                onClick={handlePrevImmersive}
                className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-[11px] font-mono font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{tBack}</span>
              </button>

              <button
                onClick={() => {
                  setTourMode("conceptual");
                  setCurrentStep(0);
                }}
                className="text-[9px] font-mono text-white/50 hover:underline"
              >
                {tGeneral}
              </button>

              <button
                onClick={handleNextImmersive}
                className="px-4 py-2 bg-emerald-500 text-black hover:bg-emerald-400 text-[11px] font-mono font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                <span>{immersiveStep === immersiveSteps.length - 1 ? tFinish : tNext}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
}

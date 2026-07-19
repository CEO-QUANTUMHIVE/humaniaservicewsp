import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, Compass, Languages, Calendar, Mail, BookOpen, Clock, 
  ChevronRight, ChevronLeft, X, Play, HelpCircle, GraduationCap, 
  ShieldCheck, ArrowRight, Monitor, Smartphone, CheckSquare, Target, Info, Flame
} from "lucide-react";

interface TourStep {
  title: string;
  subtitle: string;
  description: string;
  tabKey?: "chats" | "services" | "translate" | "calendar" | "gmail" | "classroom" | "billing";
  icon: React.ReactNode;
  highlightText: string;
}

interface InteractiveTourProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: any) => void;
}

export default function InteractiveTour({ isOpen, onClose, onSelectTab }: InteractiveTourProps) {
  const [tourMode, setTourMode] = useState<"conceptual" | "immersive">("conceptual");
  const [currentStep, setCurrentStep] = useState(0);
  const [immersiveStep, setImmersiveStep] = useState(0);

  // Conceptual steps with zero mention of Gemini. All aligned with Quantum Hive native infrastructure.
  const conceptualSteps: TourStep[] = [
    {
      title: "Bienvenido a Quantum Hive v3.5",
      subtitle: "Arquitectura Corporativa de Elite",
      description: "Quantum Hive es una plataforma multinube de alta fidelidad. Integra agentes inteligentes con su propio enrutador inteligente de modelos (compatible con GPT, Claude y Quantum Core) con balance local de tokens gratuitos para evitar dependencias externas.",
      icon: <Sparkles className="w-10 h-10 text-brand-primary animate-pulse" />,
      highlightText: "Infraestructura soberana y privada hospedada en la Nube Quantum."
    },
    {
      title: "Consola de Traducción & Matices",
      subtitle: "Modulo Lingüístico Soberano",
      description: "Desarrollado para el análisis de contratos y comunicaciones internacionales. Cuenta con análisis del Experto en Idiomas, desgloses sintácticos y síntesis de voz nativa sin salir de la intranet.",
      tabKey: "translate",
      icon: <Languages className="w-10 h-10 text-pink-400" />,
      highlightText: "Prueba el modo 'Aprender' para ver los desgloses gramaticales automáticos."
    },
    {
      title: "Portal de Agentes & Chats",
      subtitle: "Interacción Multimodal de Alta Carga",
      description: "Inicia chats interactivos o videollamadas con nuestros avatares pre-configurados (Ares, Sophia, Liam, Eva u Oliver) alojados en servidores de respuesta ultra-rápida Quantum Hive.",
      tabKey: "chats",
      icon: <Sparkles className="w-10 h-10 text-blue-400" />,
      highlightText: "Haz clic en el icono del teléfono de un agente para simular una videollamada HD."
    },
    {
      title: "Generador de Contratos Inteligentes",
      subtitle: "Diseño Legal & Firma Digital",
      description: "Contrata nuevos roles de IA personalizados para tu empresa o redacta contratos comerciales con validez simulada en PDF descargable al instante.",
      tabKey: "services",
      icon: <Compass className="w-10 h-10 text-emerald-400" />,
      highlightText: "Estructurado con cláusulas de confidencialidad y propiedad de Quantum Hive."
    },
    {
      title: "Servidores & Tiempo Virtual",
      subtitle: "Monitoreo en Tiempo Real",
      description: "Controla el encendido, apagado y reinicio de servidores virtuales privados y administra tus bolsas de minutos/tokens empresariales desde el panel central de facturación.",
      tabKey: "billing",
      icon: <Clock className="w-10 h-10 text-cyan-400" />,
      highlightText: "Tu base de datos corporativa y agentes se sincronizan en caliente en Base Quantum."
    }
  ];

  // Immersive guided tasks
  const immersiveSteps = [
    {
      title: "Abre el Traductor Inteligente",
      instruction: "Haz clic en el botón 'Traductor' en la barra inferior para activar la consola de traducción.",
      tabKey: "translate",
      actionHighlight: "Botón de Traductor en la barra de navegación inferior.",
      tip: "Usa el selector para alternar entre los modos Estándar, Aprender y Formal."
    },
    {
      title: "Expande la Visión de Pantalla",
      instruction: "Toca el botón con forma de Monitor en la esquina superior derecha para activar el modo de Pantalla Completa. Esto expandirá la consola para facilitar el trabajo cómodo en computadoras de escritorio.",
      actionHighlight: "Botón de Monitor en la esquina superior derecha del teléfono.",
      tip: "Puedes volver a hacer clic en él para contraer la vista de nuevo."
    },
    {
      title: "Genera un Contrato Comercial",
      instruction: "Cambia a la pestaña 'Servicios' (el compás en la barra inferior) y prueba escribir una propuesta de contrato corporativo.",
      tabKey: "services",
      actionHighlight: "Pestaña 'Servicios' en el menú de navegación inferior.",
      tip: "El motor redactará cláusulas con la firma de Quantum Hive de forma automática."
    },
    {
      title: "Administra las Máquinas Virtuales",
      instruction: "Dirígete a la sección 'Packs' (icono de monedas en la barra inferior) para ver el estado de carga y red de las bases de datos Quantum.",
      tabKey: "billing",
      actionHighlight: "Menú 'Packs' en el menú de navegación inferior.",
      tip: "Prueba apagar o reiniciar un nodo del servidor multinube para ver cómo reacciona el sistema."
    }
  ];

  if (!isOpen) return null;

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
      // Transition to immersive tour directly
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
    // Reset counters
    setCurrentStep(0);
    setImmersiveStep(0);
    setTourMode("conceptual");
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 bg-black/85 backdrop-blur-md z-[9999] flex flex-col items-center justify-center p-4"
        id="interactive-tour-overlay"
      >
        {/* TOP STATUS BAR OVERLAY TO ENCOURAGE IMMERSIVE */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-white/50 bg-black/40 px-4 py-2 rounded-full border border-white/5 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
            <span>NUBE CORPORATIVA: QUANTUM HIVE SOBERANA ACTIVE</span>
          </div>
          <span className="text-brand-primary">MODO ENTRENAMIENTO INMERSIVO</span>
        </div>

        {tourMode === "conceptual" ? (
          /* CONCEPTUAL STEP CARD */
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-md bg-brand-surface border border-brand-primary/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(212,175,55,0.25)] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Header Progress Bar */}
            <div className="h-1.5 w-full bg-white/5 relative">
              <div 
                className="absolute top-0 left-0 h-full bg-brand-primary transition-all duration-300"
                style={{ width: `${((currentStep + 1) / conceptualSteps.length) * 100}%` }}
              />
            </div>

            {/* Skip / Close Button */}
            <button 
              onClick={handleFinish}
              className="absolute top-4 right-4 px-2.5 py-1 bg-white/5 hover:bg-white/10 text-[10px] font-mono text-white/50 hover:text-white rounded-lg transition-all cursor-pointer flex items-center gap-1 border border-white/5"
              title="Cerrar"
            >
              <span>SALTAR</span>
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Content Area */}
            <div className="p-6 space-y-5 flex-1">
              {/* Step Icon */}
              <div className="flex justify-center py-2">
                <div className="p-4 bg-black/40 rounded-full border border-brand-primary/20 shadow-inner">
                  {currentConceptual.icon}
                </div>
              </div>

              {/* Step Titles */}
              <div className="text-center space-y-1">
                <span className="text-[9px] font-mono font-bold tracking-widest text-brand-primary uppercase">
                  Explicación de Infraestructura • {currentStep + 1} de {conceptualSteps.length}
                </span>
                <h3 className="text-base font-bold text-white tracking-wide">{currentConceptual.title}</h3>
                <p className="text-xs text-brand-primary/80 font-medium">{currentConceptual.subtitle}</p>
              </div>

              {/* Step Description */}
              <p className="text-xs text-white/70 text-center leading-relaxed font-sans max-h-[120px] overflow-y-auto pr-1">
                {currentConceptual.description}
              </p>

              {/* Active Highlight Alert Box */}
              <div className="p-3.5 bg-brand-primary/5 border border-brand-primary/20 rounded-2xl flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-brand-primary mt-0.5 flex-shrink-0 animate-pulse" />
                <p className="text-[10px] text-white/80 leading-relaxed font-sans italic">
                  <strong>Detalle de Red:</strong> {currentConceptual.highlightText}
                </p>
              </div>
            </div>

            {/* Action Footer */}
            <div className="p-4 bg-black/30 border-t border-white/5 flex items-center justify-between gap-3">
              <button
                onClick={handlePrevConceptual}
                disabled={currentStep === 0}
                className="px-3.5 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white text-[11px] font-mono font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>ATRÁS</span>
              </button>

              {/* Mode Swapper inside dots */}
              <button
                onClick={() => {
                  setTourMode("immersive");
                  onSelectTab(immersiveSteps[0].tabKey);
                }}
                className="text-[9px] font-mono text-brand-primary hover:underline border border-brand-primary/20 bg-brand-primary/5 px-2 py-0.5 rounded-full"
              >
                Ir a Autoguiado ➜
              </button>

              <button
                onClick={handleNextConceptual}
                className="px-4 py-2 bg-brand-primary text-brand-bg hover:bg-brand-primary-hover text-[11px] font-mono font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_15px_rgba(212,175,55,0.2)]"
              >
                <span>{currentStep === conceptualSteps.length - 1 ? "ENTRENAR ➜" : "SIGUIENTE"}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ) : (
          /* IMMERSIVE INTERACTIVE STEP DIALOG */
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-lg bg-[#0a111a] border-2 border-brand-primary/40 rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(212,175,55,0.3)] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Header Progress Bar */}
            <div className="h-1.5 w-full bg-white/5 relative">
              <div 
                className="absolute top-0 left-0 h-full bg-emerald-400 transition-all duration-300"
                style={{ width: `${((immersiveStep + 1) / immersiveSteps.length) * 100}%` }}
              />
            </div>

            {/* Skip / Close Button */}
            <button 
              onClick={handleFinish}
              className="absolute top-4 right-4 px-2.5 py-1 bg-white/5 hover:bg-white/10 text-[10px] font-mono text-white/50 hover:text-white rounded-lg transition-all cursor-pointer flex items-center gap-1 border border-white/5"
            >
              <span>COMPLETADO</span>
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Content Area */}
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <div className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/35 text-[9px] text-emerald-400 font-mono font-bold animate-pulse">
                  CONSOLA AUTOGUIADA
                </div>
                <span className="text-[9px] font-mono text-white/40">PASO {immersiveStep + 1} de {immersiveSteps.length}</span>
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

              {/* Action Highlight Box */}
              <div className="p-3 bg-[#111926] border border-white/5 rounded-2xl space-y-1">
                <div className="flex items-center gap-1.5 text-[9px] font-mono text-brand-primary font-bold uppercase">
                  <Info className="w-3.5 h-3.5" />
                  <span>Área a interactuar en la pantalla:</span>
                </div>
                <p className="text-[11px] text-white/75 font-sans italic pl-5">{currentImmersive.actionHighlight}</p>
              </div>

              {/* Tips */}
              <div className="p-3 bg-brand-primary/5 border border-brand-primary/20 rounded-2xl flex items-start gap-2.5">
                <Flame className="w-4 h-4 text-brand-primary mt-0.5 flex-shrink-0 animate-pulse" />
                <div className="space-y-0.5">
                  <span className="text-[9px] font-mono uppercase text-brand-primary font-bold block">Tip Corporativo</span>
                  <p className="text-[10px] text-white/85 leading-relaxed font-sans">{currentImmersive.tip}</p>
                </div>
              </div>
            </div>

            {/* Immersive Action Footer */}
            <div className="p-4 bg-black/50 border-t border-white/5 flex items-center justify-between gap-3">
              <button
                onClick={handlePrevImmersive}
                className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-[11px] font-mono font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>VOLVER</span>
              </button>

              <button
                onClick={() => {
                  setTourMode("conceptual");
                  setCurrentStep(0);
                }}
                className="text-[9px] font-mono text-white/50 hover:underline"
              >
                Ver Explicación General
              </button>

              <button
                onClick={handleNextImmersive}
                className="px-4 py-2 bg-emerald-500 text-black hover:bg-emerald-400 text-[11px] font-mono font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                <span>{immersiveStep === immersiveSteps.length - 1 ? "FINALIZAR TOUR" : "ENTENDIDO ➜"}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
}

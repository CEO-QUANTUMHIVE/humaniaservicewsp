import React, { useState } from "react";
import { 
  Cpu, Zap, Coins, Server, RefreshCw, Loader2, AlertCircle, Phone, Clock, ArrowRight, ShieldCheck, CheckSquare, MessageSquare, Terminal
} from "lucide-react";
import { LanguageType } from "../lib/translations";
import BillingHub from "./BillingHub";

interface RendimientoRouterProps {
  language: LanguageType;
  currentMinutes: number;
  onAddMinutes: (amount: number) => void;
  isMemoryPlanActive: boolean;
  onToggleMemoryPlan: () => void;
  callHistory: any[];
}

export default function RendimientoRouter({
  language,
  currentMinutes,
  onAddMinutes,
  isMemoryPlanActive,
  onToggleMemoryPlan,
  callHistory
}: RendimientoRouterProps) {
  const [subTab, setSubTab] = useState<"router" | "bolt" | "servers" | "billing" | "history">("router");

  // Router States
  const [routerPrompt, setRouterPrompt] = useState("");
  const [chosenModel, setChosenModel] = useState<string | null>(null);
  const [routerResponse, setRouterResponse] = useState<string | null>(null);
  const [isRouting, setIsRouting] = useState(false);
  const [routingSteps, setRoutingSteps] = useState<string[]>([]);
  const [measuredLatency, setMeasuredLatency] = useState<number | null>(null);

  // Bolt Chat States
  const [boltPrompt, setBoltPrompt] = useState("");
  const [boltMessages, setBoltMessages] = useState<Array<{ sender: "user" | "bolt"; text: string; latency?: number }>>([
    { sender: "bolt", text: "Core Bolt activo. Escribe cualquier pregunta corta para experimentar latencia de milisegundos de forma gratuita." }
  ]);
  const [isBoltThinking, setIsBoltThinking] = useState(false);

  // Server States
  const [servers, setServers] = useState([
    { id: "node-us", name: "Node Quantum US-West", status: "ONLINE", load: "34%", region: "Oregon, US SOBERANA" },
    { id: "node-sa", name: "Node Quantum SA-East", status: "ONLINE", load: "12%", region: "São Paulo, BR SOBERANA" },
    { id: "node-eu", name: "Node Quantum EU-Central", status: "STANDBY", load: "0%", region: "Frankfurt, DE BACKUP" }
  ]);
  const [serverLogs, setServerLogs] = useState<Record<string, string[]>>({});
  const [rebootingNode, setRebootingNode] = useState<string | null>(null);

  // Helper to simulate sleeps
  const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

  // Spark Intelligent Model Router Logic
  const handleRoutePrompt = async () => {
    if (!routerPrompt.trim()) return;
    setIsRouting(true);
    setRouterResponse(null);
    setRoutingSteps([]);
    setMeasuredLatency(null);

    const text = routerPrompt.toLowerCase();
    let model = "gemini-3.5-flash"; // Spark default
    let speed = "MEDIUM SPEED";
    let cost = "1 TOKEN";

    if (text.length < 12 || text.includes("hola") || text.includes("hello") || text.includes("que tal")) {
      model = "gemini-3.1-flash-lite"; // Bolt
      speed = "ULTRA FAST LATENCY";
      cost = "FREE TIER";
    } else if (text.includes("codigo") || text.includes("code") || text.includes("math") || text.includes("analiza") || text.includes("complejo") || text.includes("excel")) {
      model = "gemini-3.1-pro-preview"; // Mother Core
      speed = "HIGH REASONING CORE";
      cost = "2 TOKENS";
    }

    setChosenModel(model);

    const steps = [
      `[ROUTER] Analizando semántica de: "${routerPrompt.substring(0, 30)}..."`,
      `[ROUTER] Detectando nivel de razonamiento...`,
      `[ROUTER] Seleccionado Core Nube: ${model === "gemini-3.1-flash-lite" ? "⚡ BOLT" : model === "gemini-3.1-pro-preview" ? "🧠 MOTHER INTEL" : "✨ SPARK"} (${speed})`,
      `[ROUTER] Despachando consulta a servidores Quantum Hive locales...`
    ];

    try {
      for (const step of steps) {
        setRoutingSteps(prev => [...prev, step]);
        await sleep(600);
      }

      const startTime = Date.now();
      const res = await fetch("/api/spark-route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: routerPrompt, selectedModel: model })
      });
      const data = await res.json();
      const latency = Date.now() - startTime;

      if (data.error) throw new Error(data.error);

      setRouterResponse(data.text);
      setMeasuredLatency(latency);
    } catch (err: any) {
      console.error(err);
      setRouterResponse(`Error en el enrutamiento inteligente: ${err.message}`);
    } finally {
      setIsRouting(false);
    }
  };

  // Bolt Chat (Zero-Latency) Chat Handler
  const handleSendToBolt = async () => {
    if (!boltPrompt.trim() || isBoltThinking) return;
    const userText = boltPrompt;
    setBoltPrompt("");
    setBoltMessages(prev => [...prev, { sender: "user", text: userText }]);
    setIsBoltThinking(true);

    try {
      const startTime = Date.now();
      const res = await fetch("/api/spark-route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userText, selectedModel: "gemini-3.1-flash-lite" })
      });
      const data = await res.json();
      const latency = Date.now() - startTime;

      if (data.error) throw new Error(data.error);

      setBoltMessages(prev => [...prev, { sender: "bolt", text: data.text, latency }]);
    } catch (err: any) {
      console.error(err);
      setBoltMessages(prev => [...prev, { sender: "bolt", text: `Fallo de conexión ultra rápida: ${err.message}` }]);
    } finally {
      setIsBoltThinking(false);
    }
  };

  // Reboot server nodes simulation
  const handleRebootNode = async (nodeId: string) => {
    setRebootingNode(nodeId);
    setServerLogs(prev => ({
      ...prev,
      [nodeId]: ["[SYS] Iniciando secuencia de reinicio de nodo...", "[SYS] Matando procesos cuánticos activos..."]
    }));

    await sleep(1000);
    setServerLogs(prev => ({
      ...prev,
      [nodeId]: [...(prev[nodeId] || []), "[SYS] Desconectando pasarelas de red multinube...", "[SYS] Sincronizando registros ledger con Base QuantumHive..."]
    }));

    await sleep(1200);
    setServerLogs(prev => ({
      ...prev,
      [nodeId]: [...(prev[nodeId] || []), "[SYS] Arrancando kernel Quantum v3.5...", "[SYS] Autenticando protocolo criptográfico seguro...", "[SYS] Nodo operativo exitosamente en 280ms."]
    }));

    // Update load and status
    setServers(prev => prev.map(s => s.id === nodeId ? { ...s, load: "2%", status: "ONLINE" } : s));
    setRebootingNode(null);
  };

  return (
    <div className="flex flex-col h-full bg-brand-bg text-white" id="rendimiento-router-wrapper">
      {/* Sub tabs inside performance */}
      <div className="flex border-b border-white/5 bg-[#0a1017] p-1 sticky top-0 z-10 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setSubTab("router")}
          className={`px-3 py-2 text-center text-[10px] sm:text-xs font-mono font-bold tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 flex-shrink-0 ${
            subTab === "router" ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/20" : "text-white/50 hover:text-white"
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>ROUTER SPARK</span>
        </button>
        <button
          onClick={() => setSubTab("bolt")}
          className={`px-3 py-2 text-center text-[10px] sm:text-xs font-mono font-bold tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 flex-shrink-0 ${
            subTab === "bolt" ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/20" : "text-white/50 hover:text-white"
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>CORE BOLT</span>
        </button>
        <button
          onClick={() => setSubTab("servers")}
          className={`px-3 py-2 text-center text-[10px] sm:text-xs font-mono font-bold tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 flex-shrink-0 ${
            subTab === "servers" ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/20" : "text-white/50 hover:text-white"
          }`}
        >
          <Server className="w-3.5 h-3.5" />
          <span>SERVIDORES</span>
        </button>
        <button
          onClick={() => setSubTab("billing")}
          className={`px-3 py-2 text-center text-[10px] sm:text-xs font-mono font-bold tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 flex-shrink-0 ${
            subTab === "billing" ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/20" : "text-white/50 hover:text-white"
          }`}
        >
          <Coins className="w-3.5 h-3.5" />
          <span>SALDO</span>
        </button>
        <button
          onClick={() => setSubTab("history")}
          className={`px-3 py-2 text-center text-[10px] sm:text-xs font-mono font-bold tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 flex-shrink-0 ${
            subTab === "history" ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/20" : "text-white/50 hover:text-white"
          }`}
        >
          <Phone className="w-3.5 h-3.5" />
          <span>HISTORIAL</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">

        {/* SUBTAB 1: INTUITIVE SPARK MODEL ROUTER */}
        {subTab === "router" && (
          <div className="space-y-4 animate-fade-in text-left">
            <div className="p-4 bg-gradient-to-br from-[#121c2c] to-[#0a111a] rounded-3xl border border-brand-primary/20 space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <h3 className="text-sm font-bold text-white tracking-wide font-mono">Enrutador Inteligente Spark v3.5</h3>
              </div>
              <p className="text-xs text-white/70 leading-relaxed">
                Nuestra arquitectura multinube redirige automáticamente las consultas al modelo óptimo para ahorrar tokens y acelerar respuestas:
              </p>
              <div className="pt-2 grid grid-cols-3 gap-1.5 text-[9px] font-mono text-white/60">
                <div className="bg-black/40 p-1.5 rounded border border-white/5">
                  <span className="text-emerald-400 font-bold block">⚡ BOLT (Flash-Lite)</span>
                  <span>Consultas cortas • Costo Cero</span>
                </div>
                <div className="bg-black/40 p-1.5 rounded border border-white/5">
                  <span className="text-brand-primary font-bold block">✨ SPARK (Flash)</span>
                  <span>Predeterminado • Balanceado</span>
                </div>
                <div className="bg-black/40 p-1.5 rounded border border-white/5">
                  <span className="text-pink-400 font-bold block">🧠 MOTHER CORE (Pro)</span>
                  <span>Lógica extrema • 2 tokens</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-brand-surface rounded-3xl border border-white/5 space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={routerPrompt}
                  onChange={e => setRouterPrompt(e.target.value)}
                  placeholder="Pon a prueba al ruteador (ej: Hola, o analiza este código de Excel...)..."
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 font-sans focus:outline-none focus:border-brand-primary"
                  onKeyDown={e => e.key === "Enter" && handleRoutePrompt()}
                />
                <button
                  onClick={handleRoutePrompt}
                  disabled={isRouting || !routerPrompt.trim()}
                  className="px-4 py-2 bg-brand-primary text-brand-bg hover:bg-brand-primary-hover disabled:opacity-40 rounded-xl font-bold font-mono text-xs cursor-pointer transition-all flex items-center gap-1"
                >
                  {isRouting ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>PROBAR</span>}
                </button>
              </div>

              {/* Steps Animation */}
              {isRouting && (
                <div className="bg-black/50 p-4 rounded-2xl border border-white/5 space-y-2">
                  <span className="text-[9px] font-mono text-brand-primary block uppercase animate-pulse">PROCESO DE RUTA INTELIGENTE ACTIVO</span>
                  <div className="space-y-1">
                    {routingSteps.map((s, i) => (
                      <div key={i} className="text-[10px] font-mono text-white/80 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-ping" />
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Result Area */}
              {routerResponse && (
                <div className="bg-black/35 p-3.5 rounded-2xl border border-white/5 space-y-3">
                  <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                    <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase">
                      MODELO UTILIZADO: {chosenModel === "gemini-3.1-flash-lite" ? "⚡ BOLT" : chosenModel === "gemini-3.1-pro-preview" ? "🧠 MOTHER CORE" : "✨ SPARK"}
                    </span>
                    <span className="text-[9px] text-white/40 font-mono">
                      LATENCIA: {measuredLatency ? `${measuredLatency} ms` : "Calculando..."}
                    </span>
                  </div>
                  <p className="text-xs text-white/90 leading-relaxed font-sans font-medium whitespace-pre-wrap">
                    {routerResponse}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SUBTAB 2: BOLT LOW LATENCY CHAT */}
        {subTab === "bolt" && (
          <div className="space-y-4 animate-fade-in flex flex-col h-[400px] text-left">
            <div className="p-3 bg-brand-surface rounded-2xl border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4.5 h-4.5 text-emerald-400 animate-pulse" />
                <span className="text-xs font-bold font-mono tracking-wider">TERMINAL DE BAJA LATENCIA BOLT</span>
              </div>
              <span className="text-[8px] font-mono px-2 py-0.5 rounded bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">FREE TIER ACTIVE</span>
            </div>

            {/* Chat history messages */}
            <div className="flex-1 bg-black/40 border border-white/5 rounded-2xl p-3 overflow-y-auto space-y-3 font-sans text-xs">
              {boltMessages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                  <div className={`p-2.5 rounded-2xl max-w-[85%] leading-relaxed ${
                    msg.sender === "user" ? "bg-brand-primary text-brand-bg font-bold rounded-tr-none" : "bg-white/5 text-white/95 border border-white/5 rounded-tl-none"
                  }`}>
                    {msg.text}
                  </div>
                  {msg.latency && (
                    <span className="text-[8px] font-mono text-white/40 mt-1 pl-1">
                      Latencia de procesamiento: <strong className="text-emerald-400">{msg.latency}ms</strong>
                    </span>
                  )}
                </div>
              ))}
              {isBoltThinking && (
                <div className="flex items-center gap-1.5 text-white/45 pl-1">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span className="text-[10px] font-mono">Pensamiento Bolt instantáneo...</span>
                </div>
              )}
            </div>

            {/* Input row */}
            <div className="flex gap-2">
              <input
                type="text"
                value={boltPrompt}
                onChange={e => setBoltPrompt(e.target.value)}
                placeholder="Haz una pregunta rápida..."
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-brand-primary font-sans"
                onKeyDown={e => e.key === "Enter" && handleSendToBolt()}
              />
              <button
                onClick={handleSendToBolt}
                disabled={isBoltThinking || !boltPrompt.trim()}
                className="px-4 py-2 bg-emerald-500 text-black hover:bg-emerald-400 disabled:opacity-40 rounded-xl font-bold font-mono text-xs cursor-pointer transition-all"
              >
                ENVIAR
              </button>
            </div>
          </div>
        )}

        {/* SUBTAB 3: MULTICLOUD SOVEREIGN SERVERS */}
        {subTab === "servers" && (
          <div className="space-y-4 animate-fade-in text-left">
            <div className="p-4 bg-gradient-to-br from-[#121c2c] to-[#0a111a] rounded-3xl border border-brand-primary/20 space-y-1">
              <h3 className="text-sm font-bold text-white tracking-wide font-mono">Infraestructura Soberana Quantum Hive</h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Nodos multinube distribuidos para asegurar redundancia, tolerancia a fallas masivas y procesamiento cifrado.
              </p>
            </div>

            <div className="space-y-3">
              {servers.map((srv) => (
                <div key={srv.id} className="p-4 bg-brand-surface border border-white/5 rounded-3xl space-y-3 shadow-inner">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold font-mono text-white flex items-center gap-2">
                        <Server className="w-4 h-4 text-brand-primary" />
                        <span>{srv.name}</span>
                      </h4>
                      <p className="text-[10px] text-white/40 font-sans">{srv.region}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                        {srv.status}
                      </span>
                      <p className="text-[10px] text-brand-primary font-mono mt-1">Carga: {srv.load}</p>
                    </div>
                  </div>

                  {/* Terminal log panel for node */}
                  {serverLogs[srv.id] && (
                    <div className="bg-black/60 p-2.5 rounded-xl border border-white/5 font-mono text-[9px] text-white/60 space-y-0.5 max-h-24 overflow-y-auto">
                      {serverLogs[srv.id].map((log, idx) => (
                        <div key={idx} className="flex items-start gap-1">
                          <span className="text-brand-primary select-none">&gt;</span>
                          <span>{log}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => handleRebootNode(srv.id)}
                      disabled={rebootingNode === srv.id}
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 disabled:opacity-40 rounded-xl text-[10px] font-mono font-bold text-white flex items-center gap-1.5 cursor-pointer border border-white/5 transition-all"
                    >
                      <RefreshCw className={`w-3 h-3 ${rebootingNode === srv.id ? "animate-spin text-brand-primary" : ""}`} />
                      <span>{rebootingNode === srv.id ? "REINICIANDO..." : "REINICIAR NODO"}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBTAB 4: COMPUTATION PACKS (BILLINGHUB) */}
        {subTab === "billing" && (
          <div className="animate-fade-in text-left">
            <BillingHub 
              currentMinutes={currentMinutes}
              onAddMinutes={onAddMinutes}
              isMemoryPlanActive={isMemoryPlanActive}
              onToggleMemoryPlan={onToggleMemoryPlan}
            />
          </div>
        )}

        {/* SUBTAB 5: RECENT COMMUNICATIONS LOG (HISTORY) */}
        {subTab === "history" && (
          <div className="space-y-4 animate-fade-in text-left font-sans">
            <div className="p-4 bg-brand-surface rounded-3xl border border-white/5 space-y-3 shadow-inner">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-xs font-bold font-mono text-white tracking-wider">REGISTRO DE COMUNICACIONES</span>
                <span className="text-[9px] text-white/40 font-mono">ÚLTIMAS 24 HORAS</span>
              </div>

              <div className="divide-y divide-white/5">
                {callHistory.map((call) => (
                  <div key={call.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={call.contact.avatar} 
                        alt={call.contact.name} 
                        className="w-9 h-9 rounded-full border border-white/10" 
                      />
                      <div>
                        <h4 className="text-xs font-bold text-white leading-tight">{call.contact.name}</h4>
                        <p className="text-[10px] text-white/50">{call.contact.role}</p>
                      </div>
                    </div>

                    <div className="text-right text-[10px] font-mono">
                      <span className={call.status === "incoming" ? "text-brand-primary font-bold" : "text-emerald-400 font-bold"}>
                        {call.status === "incoming" ? "ENTRANTE" : "SALIENTE"}
                      </span>
                      <p className="text-[9px] text-white/40 mt-0.5">{call.date} • {call.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

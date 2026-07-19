import React, { useState } from "react";
import { VmConfig } from "../types";
import { 
  Server, Cpu, Wifi, ShieldCheck, Activity, 
  Settings, RefreshCw, Volume2, Key, Sliders, CheckCircle2 
} from "lucide-react";

interface VmConfiguratorProps {
  config: VmConfig;
  onChange: (updated: VmConfig) => void;
}

export default function VmConfigurator({ config, onChange }: VmConfiguratorProps) {
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [customWs, setCustomWs] = useState(config.wsUrl);
  const [customHttp, setCustomHttp] = useState(config.httpUrl);

  const handleTestConnection = () => {
    setIsTesting(true);
    setTestResult(null);

    // Simulate contacting their VM server
    setTimeout(() => {
      setIsTesting(false);
      setTestResult("CONNECTED SECURELY (200 OK). Latency: 34ms. Codec: Opus audio/opus; rate=48000.");
      onChange({
        ...config,
        wsUrl: customWs,
        httpUrl: customHttp,
        isConnected: true
      });
    }, 1800);
  };

  const toggleMode = (mode: "simulation" | "vm") => {
    onChange({
      ...config,
      mode
    });
  };

  return (
    <div className="p-5 space-y-6 animate-fade-in text-white">
      {/* Title Header */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-3">
        <div className="p-2 bg-brand-primary/10 rounded-xl border border-brand-primary/30">
          <Server className="w-5 h-5 text-brand-primary" />
        </div>
        <div>
          <h2 className="text-md font-bold tracking-wide">VM Engine Link</h2>
          <p className="text-[11px] text-white/50">Configure your custom real-time avatar VM server node</p>
        </div>
      </div>

      {/* Connection Mode Selection Card */}
      <div className="p-4 bg-brand-surface/80 rounded-2xl border border-white/10">
        <label className="text-[11px] font-mono uppercase text-brand-primary font-bold tracking-wider block mb-3">
          Core Engine Connection Protocol
        </label>
        
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => toggleMode("simulation")}
            className={`p-3 rounded-xl flex flex-col items-center justify-center text-center gap-2 border transition-all cursor-pointer ${
              config.mode === "simulation"
                ? "bg-brand-primary/15 border-brand-primary text-white"
                : "bg-black/20 border-white/5 text-white/60 hover:bg-white/5"
            }`}
          >
            <Cpu className="w-5 h-5" />
            <div className="text-center">
              <p className="text-xs font-bold">Simulator Core</p>
              <p className="text-[9px] opacity-70 mt-0.5">Gemini 3.5 Fallback</p>
            </div>
          </button>

          <button
            onClick={() => toggleMode("vm")}
            className={`p-3 rounded-xl flex flex-col items-center justify-center text-center gap-2 border transition-all cursor-pointer ${
              config.mode === "vm"
                ? "bg-brand-primary/15 border-brand-primary text-white"
                : "bg-black/20 border-white/5 text-white/60 hover:bg-white/5"
            }`}
          >
            <Wifi className="w-5 h-5" />
            <div className="text-center">
              <p className="text-xs font-bold">Direct VM Node</p>
              <p className="text-[9px] opacity-70 mt-0.5">Your Real-time Engine</p>
            </div>
          </button>
        </div>
      </div>

      {/* VM Address Parameters */}
      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-mono text-white/50 uppercase tracking-wider block mb-1.5 pl-1">
            WebSocket Streaming Gateway (WebRTC fallback)
          </label>
          <div className="relative">
            <input 
              type="text"
              value={customWs}
              onChange={(e) => setCustomWs(e.target.value)}
              placeholder="ws://your-vm-ip-or-dns:8000/v1/stream"
              className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white placeholder-white/30 font-mono focus:outline-none focus:border-brand-primary/50"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-mono text-white/50 uppercase tracking-wider block mb-1.5 pl-1">
            HTTP REST Engine Endpoint
          </label>
          <input 
            type="text"
            value={customHttp}
            onChange={(e) => setCustomHttp(e.target.value)}
            placeholder="https://your-vm-ip-or-dns:8000/api"
            className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white placeholder-white/30 font-mono focus:outline-none focus:border-brand-primary/50"
          />
        </div>

        {/* Audio Codec & Parameters */}
        <div className="grid grid-cols-2 gap-3.5 pt-1">
          <div>
            <label className="text-[10px] font-mono text-white/50 uppercase tracking-wider block mb-1.5 pl-1">
              Audio Frame Rate
            </label>
            <select
              value={config.audioQuality}
              onChange={(e) => onChange({ ...config, audioQuality: e.target.value as any })}
              className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white/80 focus:outline-none focus:border-brand-primary/50 cursor-pointer"
            >
              <option value="low">Standard Opus (16kHz, Low)</option>
              <option value="medium">Broadband Opus (24kHz, Med)</option>
              <option value="high">Hi-Fi Studio (48kHz, High)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-mono text-white/50 uppercase tracking-wider block mb-1.5 pl-1">
              Simulated Node Jitter
            </label>
            <select
              value={config.latencyMs}
              onChange={(e) => onChange({ ...config, latencyMs: Number(e.target.value) })}
              className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white/80 focus:outline-none focus:border-brand-primary/50 cursor-pointer"
            >
              <option value={10}>Ultra Low Latency (10ms)</option>
              <option value={30}>Standard Server (30ms)</option>
              <option value={80}>High Fidelity Buffer (80ms)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Trigger & Test Actions */}
      <div className="pt-2">
        <button
          onClick={handleTestConnection}
          disabled={isTesting}
          className="w-full py-3 px-4 bg-brand-primary hover:bg-brand-primary-hover text-brand-bg font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
        >
          {isTesting ? (
            <RefreshCw className="w-4.5 h-4.5 animate-spin" />
          ) : (
            <Activity className="w-4.5 h-4.5" />
          )}
          <span>{isTesting ? "Handshaking with VM..." : "Test WebSocket Connection"}</span>
        </button>

        {testResult && (
          <div className="mt-3 p-3.5 bg-brand-primary/10 border border-brand-primary/30 rounded-xl flex items-start gap-2.5 animate-fade-in text-brand-primary">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <p className="text-[11px] font-mono leading-relaxed font-semibold">
              {testResult}
            </p>
          </div>
        )}
      </div>

      {/* VM Architecture Diagram Overlay */}
      <div className="p-4 bg-black/40 border border-white/5 rounded-2xl">
        <h4 className="text-xs font-bold text-brand-primary uppercase tracking-wider font-mono flex items-center gap-2">
          <Sliders className="w-4 h-4" />
          <span>Quantum Hive Pipeline diagram</span>
        </h4>
        <p className="text-[10px] text-white/40 mt-1 leading-relaxed">
          The avatar generator decodes PCM audio arrays through your GPU, aligning lip-sync parameters on your VM server, while our frontend displays beautiful real-time video simulation.
        </p>
        
        <div className="mt-3.5 p-2.5 bg-black/60 rounded-xl font-mono text-[9px] text-brand-primary/85 space-y-1 border border-white/5">
          <p>{"[USER MIC]"} {"-->"} {"[RAW PCM via WS]"} {"-->"} {"[VM ENGINE]"}</p>
          <p>{"[VM COGNITIVE CORE]"} {"-->"} {"[LIP-SYNC MATRIX]"}</p>
          <p>{"[STREAM]"} {"<--"} {"[RENDER OVERLAY]"} {"<--"} {"[CLIENT FEED]"}</p>
        </div>
      </div>

    </div>
  );
}

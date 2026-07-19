import React, { useState } from "react";
import { 
  Compass, Search, MapPin, FileText, Upload, Calendar, Mail, GraduationCap, 
  Sparkles, ExternalLink, ShieldCheck, CheckCircle2, ChevronRight, Loader2, AlertCircle
} from "lucide-react";
import { LanguageType } from "../lib/translations";
import CalendarHub from "./CalendarHub";
import GmailHub from "./GmailHub";
import ClassroomHub from "./ClassroomHub";

interface CerebroDatosProps {
  language: LanguageType;
  user: any;
  accessToken: string | null;
  contacts: any[];
  onGoogleLogin: () => void;
}

export default function CerebroDatos({ language, user, accessToken, contacts, onGoogleLogin }: CerebroDatosProps) {
  const [subTab, setSubTab] = useState<"grounding" | "scanner" | "workspace">("grounding");

  // Grounding states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResponse, setSearchResponse] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  const [mapsQuery, setMapsQuery] = useState("");
  const [mapsResponse, setMapsResponse] = useState<any>(null);
  const [isMapsSearching, setIsMapsSearching] = useState(false);

  // Scanner states
  const [scanFile, setScanFile] = useState<File | null>(null);
  const [scanFilePreview, setScanFilePreview] = useState<string | null>(null);
  const [scanPrompt, setScanPrompt] = useState("");
  const [scanResponse, setScanResponse] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);

  // Workspace sub-tab select
  const [workspaceService, setWorkspaceService] = useState<"calendar" | "gmail" | "classroom">("calendar");

  // Handle Search Grounding API call
  const handleSearchGrounding = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setSearchResponse(null);
    try {
      const res = await fetch("/api/grounding-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });
      const data = await res.json();
      setSearchResponse(data);
    } catch (err) {
      console.error(err);
      setSearchResponse({ error: "Fallo en la comunicación con la Nube Quantum." });
    } finally {
      setIsSearching(false);
    }
  };

  // Handle Maps Grounding API call
  const handleMapsGrounding = async () => {
    if (!mapsQuery.trim()) return;
    setIsMapsSearching(true);
    setMapsResponse(null);
    try {
      const res = await fetch("/api/grounding-maps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: mapsQuery }),
      });
      const data = await res.json();
      setMapsResponse(data);
    } catch (err) {
      console.error(err);
      setMapsResponse({ error: "Fallo en el geolocalizador cuántico multinube." });
    } finally {
      setIsMapsSearching(false);
    }
  };

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        // Strip out the data:image/...;base64, prefix
        const cleanBase64 = base64String.split(",")[1];
        resolve(cleanBase64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle Scan Document API call
  const handleScanDocument = async () => {
    if (!scanFile) return;
    setIsScanning(true);
    setScanResponse(null);
    try {
      const base64Data = await fileToBase64(scanFile);
      const res = await fetch("/api/analyze-doc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBuffer: base64Data,
          mimeType: scanFile.type || "image/jpeg",
          prompt: scanPrompt || "Analiza detalladamente este documento y extrae puntos clave."
        }),
      });
      const data = await res.json();
      setScanResponse(data);
    } catch (err) {
      console.error(err);
      setScanResponse({ error: "No se pudo conectar al analizador cognitivo de QuantumHive." });
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScanFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScanFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-full bg-brand-bg text-white" id="cerebro-datos-wrapper">
      {/* Tab bar inside Brain Module */}
      <div className="flex border-b border-white/5 bg-[#0a1017] p-1 sticky top-0 z-10">
        <button
          onClick={() => setSubTab("grounding")}
          className={`flex-1 py-2.5 text-center text-xs font-mono font-bold tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            subTab === "grounding" 
              ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/20" 
              : "text-white/50 hover:text-white/80 hover:bg-white/5"
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>{language === "en" ? "GROUNDING" : language === "pt" ? "FUNDAMENTAÇÃO" : "GROUNDING"}</span>
        </button>
        <button
          onClick={() => setSubTab("scanner")}
          className={`flex-1 py-2.5 text-center text-xs font-mono font-bold tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            subTab === "scanner" 
              ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/20" 
              : "text-white/50 hover:text-white/80 hover:bg-white/5"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{language === "en" ? "SCANNER" : language === "pt" ? "SCANNER" : "ESCÁNER"}</span>
        </button>
        <button
          onClick={() => setSubTab("workspace")}
          className={`flex-1 py-2.5 text-center text-xs font-mono font-bold tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            subTab === "workspace" 
              ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/20" 
              : "text-white/50 hover:text-white/80 hover:bg-white/5"
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>{language === "en" ? "WORKSPACE" : language === "pt" ? "CONECTORES" : "WORKSPACE"}</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        
        {/* SUBTAB 1: GROUNDING (REAL TIME INFORMATION) */}
        {subTab === "grounding" && (
          <div className="space-y-5 animate-fade-in">
            {/* Header Description */}
            <div className="p-4 bg-gradient-to-br from-[#121c2c] to-[#0a111a] rounded-3xl border border-brand-primary/20 space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-sm font-bold text-white tracking-wide font-mono">
                  {language === "en" ? "Sovereign Web Grounding" : language === "pt" ? "Conexão Real de Grounding" : "Soberanía de Datos & Grounding"}
                </h3>
              </div>
              <p className="text-xs text-white/70 leading-relaxed">
                {language === "en" 
                  ? "Connect your avatar directly to the real world. Verify statistics, map routes, and live query details safely."
                  : language === "pt"
                    ? "Conecte seu avatar com dados reais da web. Verifique dados em tempo real, busque rotas e valide respostas."
                    : "Conecta tu avatar con datos reales de la web en tiempo real. Consulta precios, noticias vigentes o indicaciones espaciales de forma nativa."}
              </p>
            </div>

            {/* Google Search Grounding Section */}
            <div className="p-4 bg-brand-surface rounded-3xl border border-white/5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <div className="flex items-center gap-2">
                  <Search className="w-4.5 h-4.5 text-brand-primary" />
                  <span className="text-xs font-bold font-mono text-white tracking-wider">GOOGLE SEARCH GROUNDING</span>
                </div>
                <span className="text-[9px] font-mono text-brand-primary tracking-widest bg-brand-primary/10 px-2 py-0.5 rounded">REAL TIME FACT-CHECK</span>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={
                    language === "en" 
                      ? "Query (e.g. Current gold price, latest space flight...)" 
                      : language === "pt"
                        ? "Consulta (ex. preço do ouro hoje, notícias do espaço...)"
                        : "Consulta (ej: Precio del dólar hoy, noticias de tecnología...)"
                  }
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 font-sans focus:outline-none focus:border-brand-primary"
                  onKeyDown={e => e.key === "Enter" && handleSearchGrounding()}
                />
                <button
                  onClick={handleSearchGrounding}
                  disabled={isSearching || !searchQuery.trim()}
                  className="px-4 py-2 bg-brand-primary text-brand-bg hover:bg-brand-primary-hover disabled:opacity-40 rounded-xl font-bold font-mono text-xs cursor-pointer transition-all flex items-center gap-1"
                >
                  {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>{language === "en" ? "SEARCH" : language === "pt" ? "BUSCAR" : "BUSCAR"}</span>}
                </button>
              </div>

              {/* Response Area */}
              {searchResponse && (
                <div className="bg-black/35 p-3.5 rounded-2xl border border-white/5 space-y-3">
                  <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                    <span className="text-[10px] font-mono text-brand-primary">QUANTUM GROUNDED CONSOLE</span>
                    <span className="text-[9px] text-white/40 font-mono">100% CREDIBILITY</span>
                  </div>
                  {searchResponse.error ? (
                    <div className="flex items-center gap-2 text-rose-400 text-xs font-mono">
                      <AlertCircle className="w-4 h-4" />
                      <span>{searchResponse.error}</span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-xs text-white/90 leading-relaxed font-sans font-medium whitespace-pre-wrap">
                        {searchResponse.answer}
                      </p>
                      {searchResponse.metadata && searchResponse.metadata.searchQueries && (
                        <div className="pt-2 border-t border-white/5 space-y-1.5">
                          <span className="text-[9px] font-mono text-white/40 uppercase block">Citas y Enlaces de Fuentes:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {searchResponse.metadata.searchQueries.map((q: string, i: number) => (
                              <span key={i} className="text-[9px] font-mono bg-white/5 px-2 py-1 rounded text-brand-primary border border-white/5 flex items-center gap-1">
                                <ExternalLink className="w-3 h-3" />
                                <span>{q}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Google Maps Grounding Section */}
            <div className="p-4 bg-brand-surface rounded-3xl border border-white/5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4.5 h-4.5 text-brand-primary" />
                  <span className="text-xs font-bold font-mono text-white tracking-wider">GOOGLE MAPS GROUNDING</span>
                </div>
                <span className="text-[9px] font-mono text-brand-primary tracking-widest bg-brand-primary/10 px-2 py-0.5 rounded">GEOLOCATION LAYER</span>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={mapsQuery}
                  onChange={e => setMapsQuery(e.target.value)}
                  placeholder={
                    language === "en" 
                      ? "Search places (e.g. Coffee shops in Rome, directions...)" 
                      : language === "pt"
                        ? "Buscar locais (ex. Cafés em São Paulo, rotas...)"
                        : "Buscar lugares (ej: Cafés en Buenos Aires, rutas...)"
                  }
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 font-sans focus:outline-none focus:border-brand-primary"
                  onKeyDown={e => e.key === "Enter" && handleMapsGrounding()}
                />
                <button
                  onClick={handleMapsGrounding}
                  disabled={isMapsSearching || !mapsQuery.trim()}
                  className="px-4 py-2 bg-brand-primary text-brand-bg hover:bg-brand-primary-hover disabled:opacity-40 rounded-xl font-bold font-mono text-xs cursor-pointer transition-all flex items-center gap-1"
                >
                  {isMapsSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>{language === "en" ? "FIND" : language === "pt" ? "LOCALIZAR" : "UBICAR"}</span>}
                </button>
              </div>

              {/* Maps Response Area */}
              {mapsResponse && (
                <div className="bg-black/35 p-3.5 rounded-2xl border border-white/5 space-y-3">
                  <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                    <span className="text-[10px] font-mono text-brand-primary">MAPS ENGINE DATA</span>
                    <span className="text-[9px] text-white/40 font-mono">SOVEREIGN ROUTING</span>
                  </div>
                  {mapsResponse.error ? (
                    <div className="flex items-center gap-2 text-rose-400 text-xs font-mono">
                      <AlertCircle className="w-4 h-4" />
                      <span>{mapsResponse.error}</span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-xs text-white/90 leading-relaxed font-sans font-medium whitespace-pre-wrap">
                        {mapsResponse.answer}
                      </p>
                      {mapsResponse.places && mapsResponse.places.length > 0 && (
                        <div className="pt-2 border-t border-white/5 space-y-1.5">
                          <span className="text-[9px] font-mono text-white/40 uppercase block">Puntos de Geolocalización Encontrados:</span>
                          <div className="space-y-1">
                            {mapsResponse.places.map((place: any, i: number) => (
                              <div key={i} className="text-[10px] font-sans bg-white/5 p-2 rounded border border-white/5 flex items-center justify-between">
                                <span className="font-bold text-white/90">{place.name || "Punto de interés"}</span>
                                <span className="text-brand-primary text-[9px] font-mono">{place.location || "Coordenadas Nativas"}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* SUBTAB 2: DOCUMENT COGNITIVE SCANNER */}
        {subTab === "scanner" && (
          <div className="space-y-5 animate-fade-in">
            <div className="p-4 bg-gradient-to-br from-[#121c2c] to-[#0a111a] rounded-3xl border border-brand-primary/20 space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                <h3 className="text-sm font-bold text-white tracking-wide font-mono">
                  {language === "en" ? "Document Cognitive Scanner" : language === "pt" ? "Scanner de Documentos" : "Escáner Cognitivo de Documentos"}
                </h3>
              </div>
              <p className="text-xs text-white/70 leading-relaxed">
                {language === "en"
                  ? "Upload high-res invoices, legal charts, or system PDFs. Extract metrics, translate structures, or formulate insights immediately."
                  : language === "pt"
                    ? "Faça upload de contratos, faturas, gráficos ou PDFs. Traduza estruturas, extraia dados e formate insights de negócios."
                    : "Sube imágenes, PDF de contratos, facturas, diagramas o textos manuscritos. Extrae información estructurada o formula diagnósticos mediante redes neuronales locales."}
              </p>
            </div>

            <div className="p-4 bg-brand-surface rounded-3xl border border-white/5 space-y-4">
              <label className="border-2 border-dashed border-white/10 hover:border-brand-primary/50 transition-all rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer relative overflow-hidden group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                
                {scanFilePreview ? (
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10">
                    <img src={scanFilePreview} alt="Scan preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-all">
                      <Upload className="w-6 h-6 text-brand-primary" />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="p-3 bg-white/5 rounded-full text-brand-primary group-hover:scale-110 transition-all">
                      <Upload className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold font-mono text-white text-center">
                      {language === "en" ? "DRAG & DROP OR CHOOSE IMAGE" : language === "pt" ? "ARRASTE OU ESCOLHA A IMAGEM" : "ARRUSTRE O COLOQUE UNA IMAGEN"}
                    </span>
                    <span className="text-[10px] text-white/40">Soporta PNG, JPG, WEBP de alta resolución.</span>
                  </>
                )}
              </label>

              {scanFile && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-[11px] font-mono text-white/50 bg-black/30 px-3 py-1.5 rounded-lg border border-white/5">
                    <span>{scanFile.name}</span>
                    <span>{(scanFile.size / 1024).toFixed(1)} KB</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-white/50 block">PROMPT / INSTRUCCIÓN DE ANÁLISIS</label>
                    <textarea
                      value={scanPrompt}
                      onChange={e => setScanPrompt(e.target.value)}
                      placeholder={
                        language === "en" 
                          ? "What should we extract or translate from this file?..." 
                          : language === "pt"
                            ? "O que devemos analisar ou extrair deste arquivo?..."
                            : "Escribe la instrucción (ej: Traduce esta factura, extrae montos y fechas...)..."
                      }
                      className="w-full h-20 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 font-sans focus:outline-none focus:border-brand-primary"
                    />
                  </div>

                  <button
                    onClick={handleScanDocument}
                    disabled={isScanning}
                    className="w-full py-2.5 bg-brand-primary text-brand-bg hover:bg-brand-primary-hover disabled:opacity-40 rounded-xl font-bold font-mono text-xs cursor-pointer transition-all flex items-center justify-center gap-1.5"
                  >
                    {isScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>{language === "en" ? "ANALYZE DOCUMENT" : language === "pt" ? "ANALISAR DOCUMENTO" : "ANALIZAR DOCUMENTO"}</span>}
                  </button>
                </div>
              )}

              {/* Document Analyzer Result */}
              {scanResponse && (
                <div className="bg-black/35 p-3.5 rounded-2xl border border-white/5 space-y-2">
                  <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                    <span className="text-[10px] font-mono text-brand-primary uppercase">Quantum Scanner Output</span>
                    <span className="text-[9px] text-emerald-400 font-mono flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                      <span>ANALYSIS COMPLETED</span>
                    </span>
                  </div>
                  {scanResponse.error ? (
                    <div className="flex items-center gap-2 text-rose-400 text-xs font-mono">
                      <AlertCircle className="w-4 h-4" />
                      <span>{scanResponse.error}</span>
                    </div>
                  ) : (
                    <div className="text-xs text-white/90 leading-relaxed font-sans whitespace-pre-wrap text-left">
                      {scanResponse.answer}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* SUBTAB 3: GOOGLE WORKSPACE CONNECTOR HUB */}
        {subTab === "workspace" && (
          <div className="space-y-5 animate-fade-in text-left">
            {/* Connected account banner */}
            <div className="p-4 bg-gradient-to-r from-brand-primary/10 to-brand-surface border border-brand-primary/20 rounded-3xl flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[9px] font-mono font-bold text-brand-primary uppercase tracking-widest block">GOOGLE ENTERPRISE SUITE</span>
                <p className="text-xs text-white font-sans font-bold">
                  {user ? `${language === "en" ? "Connected as" : language === "pt" ? "Conectado como" : "Conectado como"}: ${user.displayName}` : (language === "en" ? "Connect Google Account" : language === "pt" ? "Conectar conta Google" : "Conectar Cuenta Google")}
                </p>
                <p className="text-[10px] text-white/50 leading-relaxed">
                  {language === "en" 
                    ? "Enable access to Calendar, Gmail inbox, and Google Classroom natively." 
                    : language === "pt"
                      ? "Acesse calendários, e-mails e salas de aula de forma nativa e integrada."
                      : "Sincroniza agendas, bandejas de correos y cursos de forma nativa desde la intranet."}
                </p>
              </div>

              {!user && (
                <button
                  onClick={onGoogleLogin}
                  className="px-3 py-1.5 bg-white text-gray-800 hover:bg-gray-100 rounded-xl text-[10px] font-mono font-bold tracking-wider cursor-pointer border border-gray-300 transition-all flex items-center gap-1"
                >
                  <span>CONNECT</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Google Workspace Navigation pills */}
            <div className="flex border-b border-white/5 p-1 bg-black/25 rounded-2xl">
              <button
                onClick={() => setWorkspaceService("calendar")}
                className={`flex-1 py-1.5 text-center text-[10px] font-mono font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  workspaceService === "calendar" ? "bg-white/10 text-white border border-white/10" : "text-white/40 hover:text-white/80"
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{language === "en" ? "Calendar" : language === "pt" ? "Agenda" : "Calendario"}</span>
              </button>
              <button
                onClick={() => setWorkspaceService("gmail")}
                className={`flex-1 py-1.5 text-center text-[10px] font-mono font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  workspaceService === "gmail" ? "bg-white/10 text-white border border-white/10" : "text-white/40 hover:text-white/80"
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>GMAIL</span>
              </button>
              <button
                onClick={() => setWorkspaceService("classroom")}
                className={`flex-1 py-1.5 text-center text-[10px] font-mono font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  workspaceService === "classroom" ? "bg-white/10 text-white border border-white/10" : "text-white/40 hover:text-white/80"
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>CLASSROOM</span>
              </button>
            </div>

            {/* Sub content render */}
            <div className="bg-brand-surface rounded-3xl border border-white/5 overflow-hidden">
              {workspaceService === "calendar" && (
                <CalendarHub 
                  user={user}
                  accessToken={accessToken}
                  contacts={contacts}
                  onGoogleLogin={onGoogleLogin}
                />
              )}
              {workspaceService === "gmail" && (
                <GmailHub 
                  user={user}
                  accessToken={accessToken}
                  contacts={contacts}
                  onGoogleLogin={onGoogleLogin}
                />
              )}
              {workspaceService === "classroom" && (
                <ClassroomHub 
                  user={user}
                  accessToken={accessToken}
                  onGoogleLogin={onGoogleLogin}
                />
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

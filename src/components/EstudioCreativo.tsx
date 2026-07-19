import React, { useState, useEffect } from "react";
import { 
  Palette, Image, Video, Cpu, Upload, Download, Sparkles, Loader2, AlertCircle, RefreshCw, Flame, Play, Clock, Check, Music, Pause, Volume2
} from "lucide-react";
import { LanguageType } from "../lib/translations";

interface EstudioCreativoProps {
  language: LanguageType;
}

export default function EstudioCreativo({ language }: EstudioCreativoProps) {
  const [creativeSubTab, setCreativeSubTab] = useState<"generate" | "edit" | "video" | "music">("generate");

  // State for music generator
  const [musicPrompt, setMusicPrompt] = useState("");
  const [musicDuration, setMusicDuration] = useState<"clip" | "full">("clip");
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | null>(null);
  const [generatedLyrics, setGeneratedLyrics] = useState<string | null>(null);
  const [isGeneratingMusic, setIsGeneratingMusic] = useState(false);
  const [musicLogs, setMusicLogs] = useState<string[]>([]);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  // State for image generator
  const [imagePrompt, setImagePrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [imageSize, setImageSize] = useState("1K");
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageLogs, setImageLogs] = useState<string[]>([]);

  // State for image editor
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editFilePreview, setEditFilePreview] = useState<string | null>(null);
  const [editPrompt, setEditPrompt] = useState("");
  const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);
  const [isEditingImage, setIsEditingImage] = useState(false);

  // State for video animator (Veo 3)
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoFilePreview, setVideoFilePreview] = useState<string | null>(null);
  const [videoPrompt, setVideoPrompt] = useState("");
  const [videoOperationName, setVideoOperationName] = useState<string | null>(null);
  const [isVideoGenerating, setIsVideoGenerating] = useState(false);
  const [videoProgressLogs, setVideoProgressLogs] = useState<string[]>([]);
  const [finalVideoUrl, setFinalVideoUrl] = useState<string | null>(null);

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        const cleanBase64 = base64String.split(",")[1];
        resolve(cleanBase64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Helper to add mock delay in steps for premium loading experience
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  // Handle image generation
  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) return;
    setIsGeneratingImage(true);
    setGeneratedImageUrl(null);
    setImageLogs([]);

    const steps = [
      language === "en" ? "Waking up Quantum GPU nodes..." : "Iniciando nodos de GPU Quantum...",
      language === "en" ? "Compiling neural model weights..." : "Compilando pesos neuronales para retrato...",
      language === "en" ? "Generating initial latent noise (1K/2K/4K scaling)..." : "Generando ruido latente inicial...",
      language === "en" ? "De-noising steps & refining structural geometry..." : "Refinando geometría estructural y texturas...",
      language === "en" ? "Final high-fidelity 4K rasterization..." : "Rasterización final en alta definición..."
    ];

    try {
      // Simulate real-time progress logging
      for (const step of steps) {
        setImageLogs(prev => [...prev, step]);
        await sleep(1500);
      }

      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: imagePrompt,
          aspectRatio,
          imageSize
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setGeneratedImageUrl(data.imageUrl);
      setImageLogs(prev => [...prev, language === "en" ? "Image generated successfully." : "Imagen generada exitosamente."]);
    } catch (err: any) {
      console.error(err);
      setImageLogs(prev => [...prev, `ERROR: ${err.message || "Fallo en el procesador"}`]);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Handle image upload for edit
  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image editing
  const handleEditImage = async () => {
    if (!editFile || !editPrompt.trim()) return;
    setIsEditingImage(true);
    setEditedImageUrl(null);

    try {
      const base64Data = await fileToBase64(editFile);
      const res = await fetch("/api/edit-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: editPrompt,
          imageBase64: base64Data,
          mimeType: editFile.type || "image/png"
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setEditedImageUrl(data.imageUrl);
    } catch (err: any) {
      console.error(err);
      alert(`Error al editar la imagen: ${err.message}`);
    } finally {
      setIsEditingImage(false);
    }
  };

  // Handle video upload
  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle video generation
  const handleGenerateVideo = async () => {
    if (!videoPrompt.trim()) return;
    setIsVideoGenerating(true);
    setFinalVideoUrl(null);
    setVideoProgressLogs([]);

    const log = (msg: string) => setVideoProgressLogs(prev => [...prev, msg]);

    try {
      log(language === "en" ? "Encoding reference picture bytes..." : "Codificando imagen de referencia...");
      let base64Data = "";
      let mimeType = "";
      if (videoFile) {
        base64Data = await fileToBase64(videoFile);
        mimeType = videoFile.type;
      } else if (generatedImageUrl) {
        // Automatically reuse the generated image if available
        base64Data = generatedImageUrl.split(",")[1];
        mimeType = "image/png";
        log(language === "en" ? "Reusing previously generated avatar image..." : "Reutilizando avatar generado previamente...");
      }

      log(language === "en" ? "Dispatching video job to Veo 3 cluster..." : "Despachando tarea multimedia al clúster Veo 3...");
      const res = await fetch("/api/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: videoPrompt,
          imageBase64: base64Data || undefined,
          mimeType: mimeType || undefined,
          aspectRatio: "16:9",
          resolution: "720p"
        })
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const opName = data.operationName;
      setVideoOperationName(opName);
      log(`${language === "en" ? "Operation active:" : "Operación de video activa:"} ${opName}`);

      // Start Polling Loop
      let completed = false;
      let attempts = 0;
      const maxAttempts = 30; // 2 minutes max

      while (!completed && attempts < maxAttempts) {
        attempts++;
        log(`${language === "en" ? "Rendering frames..." : "Generando fotogramas animados..."} (${attempts * 4}%)`);
        await sleep(4000);

        const pollRes = await fetch("/api/video-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ operationName: opName })
        });
        const pollData = await pollRes.json();

        if (pollData.error) {
          throw new Error(pollData.error);
        }

        if (pollData.done) {
          completed = true;
          log(language === "en" ? "Video synthesis complete. Compiling streams..." : "Síntesis de video finalizada. Enlazando flujos...");
          setFinalVideoUrl(`/api/video-download?operationName=${encodeURIComponent(opName)}`);
          break;
        }
      }

      if (!completed) {
        throw new Error(language === "en" ? "Timeout waiting for video compilation." : "Tiempo de espera agotado en la renderización.");
      }

    } catch (err: any) {
      console.error(err);
      log(`ERROR: ${err.message || "Fallo en Veo 3"}`);
    } finally {
      setIsVideoGenerating(false);
    }
  };

  // Handle music generation via Lyria
  const handleGenerateMusic = async () => {
    if (!musicPrompt.trim()) return;
    setIsGeneratingMusic(true);
    setGeneratedAudioUrl(null);
    setGeneratedLyrics(null);
    setMusicLogs([]);
    setIsPlayingMusic(false);

    const steps = [
      language === "en" ? "Contacting Lyria audio synthesis node..." : "Contactando nodo de síntesis de audio Lyria...",
      language === "en" ? "Compiling melody structures and key alignments..." : "Compilando estructuras melódicas y acordes...",
      language === "en" ? "Sovereign instrumentation synthesis (Lyria Pro engines)..." : "Síntesis de instrumentación y timbres soberanos...",
      language === "en" ? "Refining vocaloid frequencies and lyrical pacing..." : "Refinando armonías vocales y métrica de letra...",
      language === "en" ? "Streaming finalized WAV container stems..." : "Compilando archivo WAV final de alta fidelidad..."
    ];

    try {
      for (const step of steps) {
        setMusicLogs(prev => [...prev, step]);
        await sleep(1500);
      }

      const res = await fetch("/api/generate-music", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: musicPrompt,
          duration: musicDuration
        })
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // Decode base64 audio into a playable Blob URL
      const binary = atob(data.audioBase64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: data.mimeType || "audio/wav" });
      const audioUrl = URL.createObjectURL(blob);

      setGeneratedAudioUrl(audioUrl);
      setGeneratedLyrics(data.lyrics || null);
      setMusicLogs(prev => [...prev, language === "en" ? "Music synthesized successfully." : "Música sintetizada exitosamente."]);
    } catch (err: any) {
      console.error(err);
      setMusicLogs(prev => [...prev, `ERROR: ${err.message || "Fallo en la síntesis musical"}`]);
    } finally {
      setIsGeneratingMusic(false);
    }
  };

  // Quick action: use generated image for editing or video animation
  const useGeneratedForEdit = () => {
    if (generatedImageUrl) {
      setEditFilePreview(generatedImageUrl);
      // Create a dummy file from base64
      fetch(generatedImageUrl)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], "generated-avatar.png", { type: "image/png" });
          setEditFile(file);
          setCreativeSubTab("edit");
        });
    }
  };

  const useGeneratedForVideo = () => {
    if (generatedImageUrl) {
      setVideoFilePreview(generatedImageUrl);
      fetch(generatedImageUrl)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], "generated-avatar.png", { type: "image/png" });
          setVideoFile(file);
          setCreativeSubTab("video");
        });
    }
  };

  return (
    <div className="flex flex-col h-full bg-brand-bg text-white" id="estudio-creativo-wrapper">
      {/* Studio Tab bar */}
      <div className="flex border-b border-white/5 bg-[#0a1017] p-1 sticky top-0 z-10 overflow-x-auto no-scrollbar flex-shrink-0">
        <button
          onClick={() => setCreativeSubTab("generate")}
          className={`flex-1 min-w-[85px] py-2.5 text-center text-xs font-mono font-bold tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            creativeSubTab === "generate" 
              ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/20" 
              : "text-white/50 hover:text-white/80 hover:bg-white/5"
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>{language === "en" ? "GENERATE" : language === "pt" ? "GERAR" : "GENERAR"}</span>
        </button>
        <button
          onClick={() => setCreativeSubTab("edit")}
          className={`flex-1 min-w-[85px] py-2.5 text-center text-xs font-mono font-bold tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            creativeSubTab === "edit" 
              ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/20" 
              : "text-white/50 hover:text-white/80 hover:bg-white/5"
          }`}
        >
          <Image className="w-4 h-4" />
          <span>{language === "en" ? "EDIT" : language === "pt" ? "EDITAR" : "EDITAR"}</span>
        </button>
        <button
          onClick={() => setCreativeSubTab("video")}
          className={`flex-1 min-w-[105px] py-2.5 text-center text-xs font-mono font-bold tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            creativeSubTab === "video" 
              ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/20" 
              : "text-white/50 hover:text-white/80 hover:bg-white/5"
          }`}
        >
          <Video className="w-4 h-4" />
          <span>VEO 3 VIDEO</span>
        </button>
        <button
          onClick={() => setCreativeSubTab("music")}
          className={`flex-1 min-w-[95px] py-2.5 text-center text-xs font-mono font-bold tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            creativeSubTab === "music" 
              ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/20" 
              : "text-white/50 hover:text-white/80 hover:bg-white/5"
          }`}
        >
          <Music className="w-4 h-4" />
          <span>{language === "en" ? "LYRIA AUDIO" : language === "pt" ? "MÚSICA" : "MÚSICA LYRIA"}</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">

        {/* 1. GENERATE HIGH QUALITY AVATARS (GEMINI 3 PRO IMAGE) */}
        {creativeSubTab === "generate" && (
          <div className="space-y-4 animate-fade-in text-left">
            <div className="p-4 bg-gradient-to-br from-[#1d152b] to-[#0a0712] rounded-3xl border border-pink-500/20 space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4.5 h-4.5 text-pink-400 animate-spin" />
                <h3 className="text-sm font-bold text-white tracking-wide font-mono">
                  {language === "en" ? "Sovereign 4K Avatar Studio" : language === "pt" ? "Estúdio de Avatares 4K" : "Estudio de Avatares 4K Premium"}
                </h3>
              </div>
              <p className="text-xs text-white/70 leading-relaxed">
                {language === "en"
                  ? "Render professional corporate avatars or specialized assistants in high resolution with local GPU cores."
                  : language === "pt"
                    ? "Renderize retratos corporativos de alta definição para seus avatares usando nosso motor gráfico."
                    : "Modela y renderiza retratos corporativos de alta definición para tus avatares o roles especializados con nuestro motor gráfico."}
              </p>
            </div>

            <div className="p-4 bg-brand-surface rounded-3xl border border-white/5 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-white/50 block">PROMPT CREATIVO DE DISEÑO</label>
                <textarea
                  value={imagePrompt}
                  onChange={e => setImagePrompt(e.target.value)}
                  placeholder={
                    language === "en" 
                      ? "Describe your professional avatar (e.g., Elegant lawyer, digital terminal style, sharp lighting, neon blue suit...)" 
                      : language === "pt"
                        ? "Descreva seu avatar (ex. Engenheiro futurista, fundo tecnológico, detalhes realistas...)"
                        : "Describe el avatar (ej: Abogada corporativa elegante, retrato de frente con fondo tecnológico, traje azul marino, iluminación cinemática...)"
                  }
                  className="w-full h-20 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 font-sans focus:outline-none focus:border-brand-primary"
                />
              </div>

              {/* Advanced configs */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-white/50 block">RELACIÓN DE ASPECTO</label>
                  <select
                    value={aspectRatio}
                    onChange={e => setAspectRatio(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="1:1">1:1 Square</option>
                    <option value="16:9">16:9 Landscape</option>
                    <option value="9:16">9:16 Portrait</option>
                    <option value="4:3">4:3 Standard</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-white/50 block">RESOLUCIÓN NATIVA</label>
                  <select
                    value={imageSize}
                    onChange={e => setImageSize(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="1K">1K Ultra SD</option>
                    <option value="2K">2K Quad HD</option>
                    <option value="4K">4K Extreme UHD</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleGenerateImage}
                disabled={isGeneratingImage || !imagePrompt.trim()}
                className="w-full py-2.5 bg-gradient-to-r from-pink-500 to-brand-primary text-black font-bold font-mono text-xs cursor-pointer hover:opacity-90 disabled:opacity-40 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(219,39,119,0.2)]"
              >
                {isGeneratingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>{language === "en" ? "GENERATE AVATAR" : language === "pt" ? "GERAR PORTRAITO" : "RENDERIZAR AVATAR"}</span>}
              </button>
            </div>

            {/* Display progress logs */}
            {isGeneratingImage && (
              <div className="bg-black/40 p-4 rounded-2xl border border-pink-500/10 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono text-pink-400">
                  <span>QUANTUM RENDER PIPELINE</span>
                  <span className="animate-pulse">ACTIVE ENGINE</span>
                </div>
                <div className="space-y-1">
                  {imageLogs.map((log, i) => (
                    <div key={i} className="text-[10px] font-mono text-white/70 flex items-center gap-1.5">
                      <span className="text-pink-500">➜</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rendered image container */}
            {generatedImageUrl && (
              <div className="bg-brand-surface p-4 rounded-3xl border border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-brand-primary">GENERATED OUTPOST PORTRAIT</span>
                  <span className="text-[9px] font-mono text-white/30">{imageSize} ({aspectRatio})</span>
                </div>
                
                <div className="relative rounded-2xl overflow-hidden border border-white/10 group aspect-square flex items-center justify-center bg-black/50">
                  <img src={generatedImageUrl} alt="Generated avatar" className="max-w-full max-h-full object-contain" />
                  
                  <div className="absolute top-2 right-2 flex gap-1.5">
                    <a
                      href={generatedImageUrl}
                      download="quantum-avatar.png"
                      className="p-2 bg-black/60 hover:bg-black/80 rounded-lg text-white border border-white/10 transition-all cursor-pointer"
                      title="Download image"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Quick actions row */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={useGeneratedForEdit}
                    className="py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-mono text-[10px] font-bold cursor-pointer transition-all flex items-center justify-center gap-1.5"
                  >
                    <Image className="w-3.5 h-3.5" />
                    <span>{language === "en" ? "USE IN EDITOR" : language === "pt" ? "USAR NO EDITOR" : "EDITAR IMAGEN"}</span>
                  </button>
                  <button
                    onClick={useGeneratedForVideo}
                    className="py-2 bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary border border-brand-primary/20 rounded-xl font-mono text-[10px] font-bold cursor-pointer transition-all flex items-center justify-center gap-1.5"
                  >
                    <Video className="w-3.5 h-3.5 animate-pulse" />
                    <span>{language === "en" ? "ANIMATE WITH VEO" : language === "pt" ? "ANIMAR COM VEO" : "ANIMAR VIDEO VEO"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. RAPID IMAGE EDITING (GEMINI 3.1 FLASH IMAGE) */}
        {creativeSubTab === "edit" && (
          <div className="space-y-4 animate-fade-in text-left">
            <div className="p-4 bg-gradient-to-br from-[#151c24] to-[#0a0f14] rounded-3xl border border-white/5 space-y-1">
              <h3 className="text-sm font-bold text-white tracking-wide font-mono">
                {language === "en" ? "Sovereign Image Editor" : language === "pt" ? "Editor de Fotos IA" : "Edición Rápida con IA"}
              </h3>
              <p className="text-xs text-white/70 leading-relaxed">
                {language === "en"
                  ? "Describe modifications directly via text. Our smart editing agent changes suits, backgrounds, and facial aesthetics."
                  : language === "pt"
                    ? "Descreva as alterações em texto simples. Mude roupas, óculos ou planos de fundo instantaneamente."
                    : "Sube un retrato o usa tu diseño, escribe los cambios que deseas y la red re-diseñará la imagen conservando el rostro."}
              </p>
            </div>

            <div className="p-4 bg-brand-surface rounded-3xl border border-white/5 space-y-4">
              <label className="border-2 border-dashed border-white/10 hover:border-brand-primary/50 transition-all rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer relative overflow-hidden group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleEditFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                
                {editFilePreview ? (
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10">
                    <img src={editFilePreview} alt="Base edit preview" className="w-full h-full object-cover" />
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
                      {language === "en" ? "CHOOSE PORTRAIT TO EDIT" : language === "pt" ? "ESCOLHA O RETRATO BASE" : "SUBE O ELIGE UN RETRATO"}
                    </span>
                  </>
                )}
              </label>

              {editFilePreview && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-white/50 block">INSTRUCCIÓN DE EDICIÓN</label>
                    <textarea
                      value={editPrompt}
                      onChange={e => setEditPrompt(e.target.value)}
                      placeholder={
                        language === "en" 
                          ? "What changes? (e.g. Add futuristic glowing cyber glasses, change background to a dark server rack...)" 
                          : language === "pt"
                            ? "O que quer mudar? (ex: Colocar terno neon verde, mudar plano de fundo...)"
                            : "Instrucciones de cambio (ej: Agrega lentes de realidad virtual brillantes, cambia su fondo por un centro de datos cuántico...)"
                      }
                      className="w-full h-20 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 font-sans focus:outline-none focus:border-brand-primary"
                    />
                  </div>

                  <button
                    onClick={handleEditImage}
                    disabled={isEditingImage || !editPrompt.trim()}
                    className="w-full py-2.5 bg-brand-primary text-brand-bg hover:bg-brand-primary-hover disabled:opacity-40 rounded-xl font-bold font-mono text-xs cursor-pointer transition-all flex items-center justify-center gap-1.5"
                  >
                    {isEditingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>{language === "en" ? "APPLY MODIFICATIONS" : language === "pt" ? "EDITAR COM IA" : "APLICAR MODIFICACIONES"}</span>}
                  </button>
                </div>
              )}

              {/* Display edited result */}
              {editedImageUrl && (
                <div className="bg-black/35 p-3.5 rounded-2xl border border-white/5 space-y-3">
                  <span className="text-[10px] font-mono text-brand-primary uppercase block">RESULTADO EDITADO CON IA</span>
                  <div className="relative aspect-square rounded-xl overflow-hidden border border-white/10 flex items-center justify-center bg-black/50">
                    <img src={editedImageUrl} alt="Edited result" className="max-w-full max-h-full object-contain" />
                    <a
                      href={editedImageUrl}
                      download="quantum-edited.png"
                      className="absolute top-2 right-2 p-2 bg-black/60 hover:bg-black/80 rounded-lg text-white border border-white/10 transition-all"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. VEO 3 VIDEO ANIMATOR */}
        {creativeSubTab === "video" && (
          <div className="space-y-4 animate-fade-in text-left">
            <div className="p-4 bg-gradient-to-br from-[#0c1f19] to-[#040a08] rounded-3xl border border-emerald-500/20 space-y-1">
              <div className="flex items-center gap-2">
                <Video className="w-4.5 h-4.5 text-emerald-400 animate-bounce" />
                <h3 className="text-sm font-bold text-white tracking-wide font-mono">
                  {language === "en" ? "Veo 3 Fluid Video Synthesis" : language === "pt" ? "Animação Veo 3" : "Síntesis de Video Veo 3"}
                </h3>
              </div>
              <p className="text-xs text-white/70 leading-relaxed">
                {language === "en"
                  ? "Transform your generated avatar into a fluid motion video clip. Perfect for dynamic presentation simulation."
                  : language === "pt"
                    ? "Transforme fotos estáticas em clipes de vídeo fluídos com o poderoso motor generativo Veo 3."
                    : "Transforma fotos estáticas de tus avatares en clips de video con física realista y animaciones de labios guiadas."}
              </p>
            </div>

            <div className="p-4 bg-brand-surface rounded-3xl border border-white/5 space-y-4">
              <label className="border-2 border-dashed border-white/10 hover:border-brand-primary/50 transition-all rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer relative overflow-hidden group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleVideoFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                
                {videoFilePreview ? (
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10">
                    <img src={videoFilePreview} alt="Base video preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-all">
                      <Upload className="w-6 h-6 text-brand-primary" />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="p-3 bg-white/5 rounded-full text-emerald-400 group-hover:scale-110 transition-all">
                      <Video className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold font-mono text-white text-center">
                      {language === "en" ? "UPLOAD IMAGE FOR ANIMATION" : language === "pt" ? "ENVIE FOTO PARA ANIMAR" : "SUBE IMAGEN PARA ANIMAR"}
                    </span>
                    <span className="text-[10px] text-white/40">O utiliza la imagen generada en el Tab 1.</span>
                  </>
                )}
              </label>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-white/50 block">PROMPT / COMPORTAMIENTO DE ANIMACIÓN</label>
                <textarea
                  value={videoPrompt}
                  onChange={e => setVideoPrompt(e.target.value)}
                  placeholder={
                    language === "en" 
                      ? "Describe the video motion (e.g. The lawyer speaks smoothly, camera slightly moves right, warm background shadows...)" 
                      : language === "pt"
                        ? "Descreva o movimento do vídeo (ex: O avatar fala suavemente, câmera se move para a direita...)"
                        : "Describe el movimiento (ej: El avatar habla con fluidez frente a la cámara, parpadea con expresión amable, sutil paneo hacia la derecha...)"
                  }
                  className="w-full h-20 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 font-sans focus:outline-none focus:border-brand-primary"
                />
              </div>

              <button
                onClick={handleGenerateVideo}
                disabled={isVideoGenerating || !videoPrompt.trim()}
                className="w-full py-2.5 bg-emerald-500 text-black font-bold font-mono text-xs cursor-pointer hover:bg-emerald-400 disabled:opacity-40 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
              >
                {isVideoGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>{language === "en" ? "GENERATE VIDEO VEO 3" : language === "pt" ? "GERAR VÍDEO VEO" : "SINTETIZAR VIDEO VEO 3"}</span>}
              </button>
            </div>

            {/* Video generator progress logs */}
            {isVideoGenerating && (
              <div className="bg-black/40 p-4 rounded-2xl border border-emerald-500/15 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono text-emerald-400">
                  <span>VEO 3 PIPELINE LOGS</span>
                  <span className="animate-pulse">RENDERING SHADERS</span>
                </div>
                <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                  {videoProgressLogs.map((log, i) => (
                    <div key={i} className="text-[10px] font-mono text-white/80 flex items-center gap-1.5">
                      <span className="text-emerald-500">➜</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rendered Video Result */}
            {finalVideoUrl && (
              <div className="bg-brand-surface p-4 rounded-3xl border border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-brand-primary uppercase">Veo 3 Output Stream</span>
                  <span className="text-[9px] font-mono text-white/30">16:9 H.264 MP4</span>
                </div>

                <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black shadow-inner">
                  <video 
                    src={finalVideoUrl} 
                    controls 
                    className="w-full h-full object-cover"
                    poster={videoFilePreview || undefined}
                    playsInline
                  />
                </div>

                <a
                  href={finalVideoUrl}
                  download="quantum-avatar-video.mp4"
                  className="w-full py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/25 rounded-xl font-mono text-[10px] font-bold cursor-pointer transition-all flex items-center justify-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>{language === "en" ? "DOWNLOAD VIDEO MP4" : language === "pt" ? "BAIXAR VÍDEO" : "DESCARGAR VIDEO MP4"}</span>
                </a>
              </div>
            )}
          </div>
        )}

        {/* 4. LYRIA MUSIC GENERATOR PANEL */}
        {creativeSubTab === "music" && (
          <div className="space-y-4 animate-fade-in text-left">
            <div className="p-4 bg-gradient-to-br from-[#101424] to-[#04060c] rounded-3xl border border-indigo-500/20 space-y-1">
              <div className="flex items-center gap-2">
                <Music className="w-4.5 h-4.5 text-indigo-400 animate-pulse" />
                <h3 className="text-sm font-bold text-white tracking-wide font-mono">
                  {language === "en" ? "Lyria Neural Music Synthesis" : language === "pt" ? "Sintetizador Musical Lyria" : "Síntesis Musical Soberana Lyria"}
                </h3>
              </div>
              <p className="text-xs text-white/70 leading-relaxed">
                {language === "en"
                  ? "Generate audio tracks and background scores using Google's modern Lyria model ecosystem."
                  : language === "pt"
                    ? "Gere trilhas sonoras e efeitos musicais personalizados com o modelo generativo Lyria da Google."
                    : "Genera pistas de audio e instrumentales de alta fidelidad utilizando el ecosistema de modelos de música Lyria de Google."}
              </p>
            </div>

            <div className="p-4 bg-brand-surface rounded-3xl border border-white/5 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-white/50 block">PROMPT CREATIVO DE COMPOSICIÓN</label>
                <textarea
                  value={musicPrompt}
                  onChange={e => setMusicPrompt(e.target.value)}
                  placeholder={
                    language === "en" 
                      ? "Describe the music (e.g. Energetic synthwave track for driving, upbeat tempo, neon city feel, 80s drums...)" 
                      : language === "pt"
                        ? "Descreva a trilha musical (ex: Synthwave retrô, batidas eletrônicas relaxantes...)"
                        : "Describe la composición (ej: Pista de lo-fi jazz relajante con sutil saxofón de fondo, beats de estudio perfectos para concentrarse...)"
                  }
                  className="w-full h-20 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 font-sans focus:outline-none focus:border-brand-primary"
                />
              </div>

              {/* Advanced configs */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-white/50 block">FORMATO Y DURACIÓN DEL ARCHIVO</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMusicDuration("clip")}
                    className={`py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border ${
                      musicDuration === "clip"
                        ? "bg-brand-primary/10 text-brand-primary border-brand-primary"
                        : "bg-black/30 text-white/40 border-white/5 hover:text-white/60"
                    }`}
                  >
                    Short Clip (30s max)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMusicDuration("full")}
                    className={`py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border ${
                      musicDuration === "full"
                        ? "bg-brand-primary/10 text-brand-primary border-brand-primary"
                        : "bg-black/30 text-white/40 border-white/5 hover:text-white/60"
                    }`}
                  >
                    Full Track
                  </button>
                </div>
              </div>

              <div className="p-3 bg-white/5 rounded-2xl border border-white/5 flex gap-2 items-start">
                <AlertCircle className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                <p className="text-[10px] text-white/60 leading-relaxed">
                  {language === "en"
                    ? "Note: Lyria models require a paid key. Ensure GEMINI_API_KEY is configured in your AI Studio Secrets panel."
                    : language === "pt"
                      ? "Nota: Modelos Lyria exigem uma chave de API paga configurada no painel de Secrets do AI Studio."
                      : "Nota: Los modelos Lyria requieren una clave API configurada en el panel de Secrets de AI Studio."}
                </p>
              </div>

              <button
                onClick={handleGenerateMusic}
                disabled={isGeneratingMusic || !musicPrompt.trim()}
                className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold font-mono text-xs cursor-pointer hover:opacity-90 disabled:opacity-40 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(99,102,241,0.25)]"
              >
                {isGeneratingMusic ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>{language === "en" ? "SYNTHESIZE LYRIA MUSIC" : language === "pt" ? "SINTETIZAR MÚSICA" : "SINTETIZAR MÚSICA LYRIA"}</span>}
              </button>
            </div>

            {/* Progress logs */}
            {isGeneratingMusic && (
              <div className="bg-black/40 p-4 rounded-2xl border border-indigo-500/10 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono text-indigo-400">
                  <span>LYRIA ACOUSTIC PIPELINE</span>
                  <span className="animate-pulse">STREAMING SYNTHS</span>
                </div>
                <div className="space-y-1">
                  {musicLogs.map((log, i) => (
                    <div key={i} className="text-[10px] font-mono text-white/70 flex items-center gap-1.5">
                      <span className="text-indigo-500">➜</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Playable result */}
            {generatedAudioUrl && (
              <div className="bg-brand-surface p-4 rounded-3xl border border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-brand-primary uppercase">LYRIA COGNITIVE AUDIO PLAYER</span>
                  <span className="text-[9px] font-mono text-white/30">{musicDuration === "full" ? "Full Master" : "30s Clip"} (WAV)</span>
                </div>

                {/* Custom-styled Audio Player Dashboard */}
                <div className="bg-black/50 p-4 rounded-2xl border border-white/10 flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => {
                        const audio = document.getElementById("lyria-audio-element") as HTMLAudioElement;
                        if (audio) {
                          if (isPlayingMusic) {
                            audio.pause();
                            setIsPlayingMusic(false);
                          } else {
                            audio.play();
                            setIsPlayingMusic(true);
                          }
                        }
                      }}
                      className="w-12 h-12 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-brand-bg flex items-center justify-center transition-all shadow-lg cursor-pointer transform hover:scale-105 shrink-0"
                    >
                      {isPlayingMusic ? <Pause className="w-5 h-5 fill-brand-bg" /> : <Play className="w-5 h-5 fill-brand-bg ml-1" />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white truncate">{musicPrompt}</p>
                      <p className="text-[9px] text-white/50 font-mono">Quantum Hive Generative Waveform</p>
                    </div>

                    <Volume2 className="w-5 h-5 text-white/50 shrink-0 hidden sm:block" />
                  </div>

                  {/* Hidden native audio tag */}
                  <audio
                    id="lyria-audio-element"
                    src={generatedAudioUrl}
                    className="hidden"
                    onPlay={() => setIsPlayingMusic(true)}
                    onPause={() => setIsPlayingMusic(false)}
                    onEnded={() => setIsPlayingMusic(false)}
                  />

                  {/* Simulated wave equalizer bars when playing */}
                  <div className="h-8 flex items-end justify-between gap-1 px-2 py-1 bg-black/40 rounded-xl overflow-hidden">
                    {Array.from({ length: 28 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-1 rounded-t-full bg-gradient-to-t from-indigo-500 to-cyan-400 transition-all duration-300 ${
                          isPlayingMusic ? "animate-bounce" : "h-1"
                        }`}
                        style={{
                          height: isPlayingMusic ? `${Math.floor(Math.random() * 24) + 4}px` : "3px",
                          animationDelay: `${i * 75}ms`,
                          animationDuration: "1200ms"
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Display lyrics or generation summary if exists */}
                {generatedLyrics && (
                  <div className="bg-black/30 p-4 rounded-2xl border border-white/5 space-y-2">
                    <span className="text-[10px] font-mono text-white/40 block">GENERATED LYRICS / COMPOSITION META</span>
                    <p className="text-xs text-white/80 leading-relaxed font-mono whitespace-pre-line text-left bg-black/20 p-3 rounded-xl max-h-40 overflow-y-auto">
                      {generatedLyrics}
                    </p>
                  </div>
                )}

                <a
                  href={generatedAudioUrl}
                  download="quantum-hive-lyria.wav"
                  className="w-full py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/25 rounded-xl font-mono text-[10px] font-bold cursor-pointer transition-all flex items-center justify-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>DOWNLOAD SOUND WAV</span>
                </a>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

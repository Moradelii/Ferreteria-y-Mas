import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { useApp } from '../lib/store';
import { 
  ArrowRight,
  BookOpen,
  TreePine,
  Truck,
  Ruler,
  Shield,
  Lock,
  Play,
  Pause,
  Volume2,
  VolumeX
} from 'lucide-react';

export const Hero: React.FC = () => {
  const { setActiveNavTab } = useApp();
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  // Scroll Parallax calculations
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.08]);

  // Synchronize video playback state
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => {
          setIsPlaying(false);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  const toggleVideoPlayback = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  const toggleAudio = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleScrollToNext = () => {
    const el = document.getElementById('cotizador') || document.getElementById('catalogo');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollBy({ top: 500, behavior: 'smooth' });
    }
  };

  const renderPillars = (isMobile = false) => (
    <div className={`w-full ${isMobile ? 'bg-slate-900/95 border-slate-800' : 'bg-slate-950/80 border-slate-800/90'} border rounded-2xl backdrop-blur-md p-5 sm:p-6 lg:p-7 shadow-2xl`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
        
        {/* Pillar 1: MADERA CURADA Y TRATADA */}
        <div className="flex items-start gap-3.5">
          <div className="shrink-0 text-amber-500 mt-0.5">
            <TreePine className="w-8 h-8 stroke-[1.75]" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wide">
              MADERA CURADA Y TRATADA
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Garantía contra curvaturas y termitas.
            </p>
          </div>
        </div>

        {/* Pillar 2: DESPACHO RÁPIDO EN LA CEIBA */}
        <div className="flex items-start gap-3.5">
          <div className="shrink-0 text-amber-500 mt-0.5">
            <Truck className="w-8 h-8 stroke-[1.75]" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wide">
              DESPACHO RÁPIDO EN LA CEIBA
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Recibe tu pedido sin filas ni esperas.
            </p>
          </div>
        </div>

        {/* Pillar 3: CORTE A LA MEDIDA */}
        <div className="flex items-start gap-3.5">
          <div className="shrink-0 text-amber-500 mt-0.5">
            <Ruler className="w-8 h-8 stroke-[1.75]" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wide">
              CORTE A LA MEDIDA
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Servicio de corte y cepillado según tu proyecto.
            </p>
          </div>
        </div>

        {/* Pillar 4: PAGO SEGURO EN LÍNEA */}
        <div className="flex items-start gap-3.5">
          <div className="shrink-0 text-amber-500 mt-0.5">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <Shield className="w-8 h-8 stroke-[1.75]" />
              <Lock className="w-3.5 h-3.5 absolute inset-0 m-auto text-amber-500 stroke-[2.2]" />
            </div>
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wide">
              PAGO SEGURO EN LÍNEA
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Múltiples opciones de pago digital.
            </p>
          </div>
        </div>

      </div>
    </div>
  );

  return (
    <>
      <section 
        ref={heroRef}
        id="hero-section"
        className="relative bg-slate-950 text-white overflow-hidden border-b border-slate-800 selection:bg-amber-400 selection:text-slate-950 min-h-[460px] sm:min-h-[540px] md:min-h-[660px] lg:min-h-[760px] flex flex-col justify-between"
      >
        {/* 1. CINEMATIC BACKGROUND: HIGH-DEFINITION SAWMILL VIDEO + LUMBER STACKS */}
        <motion.div 
          style={prefersReducedMotion ? {} : { y: bgY, scale: bgScale }}
          className="absolute inset-0 z-0 will-change-transform overflow-hidden"
        >
          {/* Fallback & base photography */}
          <img
            src="/hero-lumber.jpg"
            alt="Madera dimensional apilada en aserrío de La Ceiba"
            className="absolute inset-0 w-full h-full object-cover object-right lg:object-center brightness-[0.92] contrast-[1.06]"
            loading="eager"
            fetchPriority="high"
          />

          {/* Live sawmill video in high clarity */}
          <video
            ref={videoRef}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="absolute inset-0 w-full h-full object-cover brightness-[0.95] contrast-[1.08] opacity-90 pointer-events-none"
          >
            <source src="/videos/hero-sawmill-hd.mp4" type="video/mp4" />
            <source src="/videos/wood-sawing.mp4" type="video/mp4" />
          </video>

          {/* Soft lateral shadow to maintain sharp text contrast without darkening the rest of the video */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/40 to-transparent sm:w-2/3 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/30 pointer-events-none" />
        </motion.div>

        {/* Discrete video playback controls in top-right */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            onClick={toggleVideoPlayback}
            aria-label={isPlaying ? 'Pausar video' : 'Reproducir video'}
            className="px-2.5 py-1 rounded-full bg-slate-950/75 hover:bg-slate-900 border border-slate-700/80 text-slate-200 text-xs flex items-center gap-1.5 backdrop-blur-md transition-all cursor-pointer shadow-md"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3 h-3 text-amber-400" />
                <span className="hidden sm:inline text-[11px]">Pausa</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 text-emerald-400" />
                <span className="hidden sm:inline text-[11px]">Video</span>
              </>
            )}
          </button>
          
          <button
            onClick={toggleAudio}
            aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
            className="p-1.5 rounded-full bg-slate-950/75 hover:bg-slate-900 border border-slate-700/80 text-slate-200 text-xs backdrop-blur-md transition-all cursor-pointer shadow-md"
            title={isMuted ? 'Activar sonido' : 'Silenciar'}
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            )}
          </button>
        </div>

        {/* 2. HERO MAIN CONTENT: MORE COMPACT TEXT SIZE & HIGH CONTRAST */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-14 sm:pt-16 lg:pt-20 pb-8 flex-1 flex flex-col justify-between">
          
          {/* Left-Aligned Headline Block */}
          <div className="max-w-xl mb-8 sm:mb-12">
            
            {/* Eyebrow: MADERA DE ALTA CALIDAD */}
            <span className="text-amber-400 font-bold text-[11px] sm:text-xs uppercase tracking-[0.2em] block mb-2 drop-shadow-sm">
              MADERA DE ALTA CALIDAD
            </span>

            {/* Headline: Lista para tu obra. (Más compacto) */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.04] mb-3 sm:mb-4 drop-shadow-md">
              Lista para <br />
              tu obra.
            </h1>

            {/* Description Paragraph */}
            <p className="text-slate-100 text-xs sm:text-sm md:text-base font-normal leading-relaxed max-w-lg mb-6 drop-shadow-sm">
              Madera curada, tratada y cortada a la medida. <br className="hidden sm:inline" />
              Despacho rápido en La Ceiba y zonas aledañas.
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Primary: COTIZAR Y PEDIR EN LÍNEA */}
              <button
                id="hero-cta-quote"
                onClick={() => {
                  setActiveNavTab('cotizador');
                  const el = document.getElementById('cotizador');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
              >
                <span>COTIZAR Y PEDIR EN LÍNEA</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Secondary: VER CATÁLOGO */}
              <button
                id="hero-cta-catalog"
                onClick={() => {
                  setActiveNavTab('catalogo');
                  const el = document.getElementById('catalogo');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-black/60 hover:bg-black/80 border border-slate-500/80 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 backdrop-blur-xs cursor-pointer transition-all active:scale-[0.98]"
              >
                <span>VER CATÁLOGO</span>
                <BookOpen className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 3. FOUR PILLARS CARD CONTAINER: VISIBLE ON DESKTOP/TABLET INSIDE HERO */}
          <div className="hidden md:block w-full">
            {renderPillars(false)}

            {/* Scroll Indicator */}
            <div className="mt-6 flex flex-col items-center justify-center text-center">
              <button
                onClick={handleScrollToNext}
                className="group flex flex-col items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <div className="w-5 h-7 rounded-full border-2 border-slate-400 group-hover:border-amber-400 flex justify-center pt-1 transition-colors">
                  <div className="w-1 h-1.5 rounded-full bg-slate-400 group-hover:bg-amber-400 animate-bounce transition-colors" />
                </div>
                <span className="text-[10px] font-semibold tracking-[0.2em] uppercase">
                  ↓ DESLIZA PARA DESCUBRIR
                </span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 4. FOUR PILLARS CONTAINER OUTSIDE HERO FOR SMARTPHONES */}
      <section 
        id="hero-pillars-mobile"
        aria-label="Garantías y servicios de madera"
        className="md:hidden bg-slate-950 border-b border-slate-800/80 px-4 py-6"
      >
        <div className="max-w-7xl mx-auto">
          {renderPillars(true)}
          
          <div className="mt-4 flex flex-col items-center justify-center text-center">
            <button
              onClick={handleScrollToNext}
              className="group flex flex-col items-center gap-1 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
            >
              <span className="text-[10px] font-semibold tracking-[0.2em] uppercase">
                ↓ CONTINUAR AL COTIZADOR
              </span>
            </button>
          </div>
        </div>
      </section>
    </>
  );
};



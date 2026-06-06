import React, { useState, useEffect } from 'react';
import { Language, ContentType, Platform, Tone } from '../types';
import { translations } from '../translations';
import { Sparkles, RefreshCw, Layers, Sliders, Play, AlertCircle, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface CreatePanelProps {
  lang: Language;
  onGenerate: (data: {
    type: ContentType;
    platform: Platform;
    tone: Tone;
    targetAudience: string;
    prompt: string;
    extraDetails: string;
  }) => void;
  loading: boolean;
}

export function CreatePanel({ lang, onGenerate, loading }: CreatePanelProps) {
  const t = translations[lang];

  // Selected state
  const [contentType, setContentType] = useState<ContentType>('script');
  const [platform, setPlatform] = useState<Platform>('instagram');
  const [tone, setTone] = useState<Tone>('bold');
  const [targetAudience, setTargetAudience] = useState<string>('entrepreneurs');
  const [prompt, setPrompt] = useState<string>('');
  const [extraDetails, setExtraDetails] = useState<string>('');

  // Built-in Prompt Recipes matching selected Language and Type
  const recipes: Record<Language, Record<ContentType, string[]>> = {
    pt: {
      script: [
        "3 Erros graves que estão travando o seu crescimento orgânico.",
        "A verdade secreta que os gurus de marketing nunca te contaram.",
        "Como faturar seus primeiros R$ 5.000 trabalhando de casa."
      ],
      caption: [
        "Como economizar 10 horas semanais usando automação simples.",
        "Meu veredito brutal sobre a nova atualização do algoritmo.",
        "Antes de comprar qualquer ferramenta de design, leia isso!"
      ],
      storytelling: [
        "A história real de como quebrei financeiramente aos 22 anos e dei a volta por cima.",
        "O dia em que decidi demitir meu pior cliente e faturei o dobro.",
        "De um quarto desorganizado a gerenciar uma agência de marketing."
      ],
      ideas: [
        "Temas virais de conteúdo técnico voltados para desenvolvedores web.",
        "Ideias criativas de posts de engajamento para uma clínica de estética.",
        "Ideias táticas de Reels focadas em vender mentorias individuais."
      ],
      carousel: [
        "O passo a passo definitivo para dominar anúncios pagos hoje.",
        "4 Pilares fundamentais de uma landing page com alta conversão.",
        "Guia completo de atalhos indispensáveis do VS Code."
      ]
    },
    en: {
      script: [
        "3 Critical mistakes that are tanking your organic video reach.",
        "The secret truths that top business gurus will never tell you.",
        "How to land your first high-paying remote freelance client."
      ],
      caption: [
        "How to shave 10 hours off your heavy weekly work routines.",
        "My brutal honest take on the latest social algorithm changes.",
        "Read this crucial checklist before buying any masterclass!"
      ],
      storytelling: [
        "The true story of rebuilding my financial life from absolute scratch.",
        "The defining day I canceled my worst client and instantly doubled sales.",
        "From a crowded college dorm to running a successful SaaS agency."
      ],
      ideas: [
        "Viral ideas on technical product management for software makers.",
        "Creative editorial topics for an organic skincare aesthetic clinic.",
        "High-value video hooks targeting digital masterclass conversions."
      ],
      carousel: [
        "The ultimate step-by-step master guide to paid ads.",
        "4 Pillars of creating a sales page that converts at 15%.",
        "The ultimate guide to essential, time-saving coding shortcuts."
      ]
    },
    es: {
      script: [
        "3 Errores críticos que están frenando tu alcance en videos.",
        "La verdad incómoda que los gurús de ventas nunca te dirán.",
        "Cómo generar tus primeros $1,000 extra trabajando en remoto."
      ],
      caption: [
        "Cómo ahorrar 10 horas de trabajo repetitivo con automatización.",
        "Mi opinión honesta sobre los cambios salvajes del algoritmo.",
        "¡Lee esto antes de gastar miles en cursos de baja calidad!"
      ],
      storytelling: [
        "La historia de cómo quebré mi primer negocio a los 23 años.",
        "El día clave en que decidí rechazar a un cliente tóxico.",
        "De no tener idea de ventas a liderar un equipo creativo."
      ],
      ideas: [
        "Temas de tendencia sobre inteligencia artificial para profesionales.",
        "Propuestas editoriales para una marca de fitness personalizada.",
        "Ideas de carruseles de valor para coaches y asesores de vida."
      ],
      carousel: [
        "El paso a paso definitivo para lanzar campañas de anuncios.",
        "Los 4 pilares esenciales de un perfil que vende automáticamente.",
        "Guía exprés de mejores extensiones para simplificar el diseño web."
      ]
    }
  };

  // Helper helper to auto-select recipe
  const applyRecipe = (text: string) => {
    setPrompt(text);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onGenerate({
      type: contentType,
      platform,
      tone,
      targetAudience,
      prompt,
      extraDetails
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl backdrop-blur-md"
      id="content-generator-card-wrapper"
    >
      <div className="mb-6 flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-400">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white tracking-wide">{t.metaHeading}</h3>
            <p className="text-xs text-slate-400">Dê vida às suas redes com inteligência artificial.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-6" id="creation-strategy-form">
        {/* Content Type Input Toggle */}
        <div>
          <label className="mb-3 block text-sm font-semibold text-slate-300 tracking-wide">
            {t.formType}
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {(Object.keys(t.types) as ContentType[]).map((type) => (
              <button
                type="button"
                key={type}
                onClick={() => setContentType(type)}
                className={`flex flex-col items-center justify-center rounded-xl border p-3 text-center transition-all duration-200 cursor-pointer ${
                  contentType === type
                    ? 'border-indigo-500 bg-indigo-600/15 text-indigo-300 shadow-md shadow-indigo-600/10 scale-[1.02]'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
                id={`btn-contentType-${type}`}
              >
                <span className="text-sm font-medium whitespace-normal leading-tight">
                  {t.types[type].split(' ')[0]}
                </span>
                <span className="text-[11px] font-medium leading-tight mt-1 text-slate-400">
                  {t.types[type].replace(/^[^\s]+\s/, '')}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Social Platform Option */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              {t.formPlatform}
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as Platform)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              id="select-target-platform"
            >
              {(Object.keys(t.platforms) as Platform[]).map((plat) => (
                <option key={plat} value={plat} className="bg-slate-950">
                  {t.platforms[plat]}
                </option>
              ))}
            </select>
          </div>

          {/* Tone select option */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              {t.formTone}
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as Tone)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              id="select-voice-tone"
            >
              {(Object.keys(t.tones) as Tone[]).map((voice) => (
                <option key={voice} value={voice} className="bg-slate-950">
                  {t.tones[voice]}
                </option>
              ))}
            </select>
          </div>

          {/* Demographics Audience Option */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              {t.formTarget}
            </label>
            <select
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              id="select-target-audience"
            >
              {Object.entries(t.audiences).map(([key, name]) => (
                <option key={key} value={key} className="bg-slate-950">
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Preset Prompt Recipes */}
        <div>
          <span className="mb-2 block text-xs font-semibold text-slate-400 tracking-wider uppercase">
            🚀 {lang === 'pt' ? 'Ideias de Início Rápido' : lang === 'es' ? 'Ideas Rápidas' : 'Quick Start Recipes'}
          </span>
          <div className="flex flex-wrap gap-2">
            {recipes[lang]?.[contentType]?.map((recipeText, index) => (
              <button
                type="button"
                key={index}
                onClick={() => applyRecipe(recipeText)}
                className="rounded-lg bg-indigo-500/5 hover:bg-indigo-500/12 border border-slate-800 hover:border-indigo-500/40 px-3 py-1.5 text-left text-xs text-indigo-300 hover:text-white transition-all cursor-pointer leading-tight truncate max-w-full md:max-w-xs"
                title={recipeText}
                id={`recipe-btn-${contentType}-${index}`}
              >
                {recipeText}
              </button>
            ))}
          </div>
        </div>

        {/* Text Input Prompt */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-300 flex items-center justify-between">
            <span>{t.formPrompt}</span>
            <span className="text-xs text-slate-500 font-mono">
              {prompt.length}/500 {lang === 'pt' ? 'caracteres' : lang === 'es' ? 'caracteres' : 'characters'}
            </span>
          </label>
          <textarea
            id="text-prompt-textarea"
            maxLength={500}
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={t.formPromptPlaceholder}
            className="w-full rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-200 placeholder-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Extra directives */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-300">
            {t.formExtra}
          </label>
          <textarea
            id="extra-directives-textarea"
            rows={2}
            value={extraDetails}
            onChange={(e) => setExtraDetails(e.target.value)}
            placeholder={t.formExtraPlaceholder}
            className="w-full rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-200 placeholder-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Trigger Button */}
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className={`w-full flex items-center justify-center gap-3 rounded-xl py-4 px-6 font-bold text-white transition-all duration-300 cursor-pointer ${
            loading || !prompt.trim()
              ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-indigo-600/20 active:scale-[0.99] border border-indigo-500/25'
          }`}
          id="trigger-generation-button"
        >
          {loading ? (
            <>
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span>{t.generating}</span>
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5 text-indigo-200 animate-pulse" />
              <span>{t.generateBtn}</span>
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}

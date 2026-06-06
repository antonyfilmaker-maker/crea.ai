/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { translations } from './translations';
import { Language, GeneratedContentItem, ContentType, Platform, Tone } from './types';
import { StatsGrid } from './components/StatsGrid';
import { CreatePanel } from './components/CreatePanel';
import { HistoryList } from './components/HistoryList';
import { SocialSimulator } from './components/SocialSimulator';
import { FormattedOutput } from './components/FormattedOutput';
import { SmartEditor } from './components/SmartEditor';
import { 
  Sparkles, 
  Layers, 
  History, 
  Heart, 
  Sliders, 
  Globe, 
  Smartphone, 
  Menu, 
  X, 
  Eye, 
  Copy, 
  Check, 
  AlertCircle,
  HelpCircle,
  Info,
  Youtube,
  Instagram,
  Linkedin,
  Clock,
  Trash2,
  FileEdit,
  BarChart2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const LOCAL_STORAGE_KEY = 'midiaexpress_ai_creations';

export default function App() {
  const [lang, setLang] = useState<Language>('pt');
  const [activeTab, setActiveTab] = useState<'create' | 'editor' | 'history' | 'favorites' | 'about'>('create');
  const [items, setItems] = useState<GeneratedContentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePreviewItem, setActivePreviewItem] = useState<GeneratedContentItem | null>(null);
  const [latestGenerated, setLatestGenerated] = useState<GeneratedContentItem | null>(null);
  const [mobileCreatorTab, setMobileCreatorTab] = useState<'form' | 'result'>('form');
  const [showStats, setShowStats] = useState(false);

  // Load creations from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      } else {
        // Hydrate with high-converting initial examples to guide the user on first load
        const initialCreations: GeneratedContentItem[] = [
          {
            id: 'init-1',
            title: 'Roteiro Minimalista',
            type: 'script',
            platform: 'instagram',
            tone: 'bold',
            language: 'pt',
            prompt: 'Dicas de design minimalista para marcas de luxo',
            output: `🎬 ROTEIRO DE REELS / SHORTS: "A Essência do Silêncio"

[00:00 - 00:05 | O GANCHO]
🎥 CONTEXTO VISUAL: Close em câmera lenta deslizando sobre a textura de um relógio de titânio acetinado ou tecido de linho belga puro. Trilha sonora atmosférica, minimalista e profunda inicia ao fundo.
🎙️ LOCUÇÃO (Tom calmo, seguro, pausado):
"O verdadeiro luxo nunca grita. Ele sussurra."

[00:05 - 00:20 | O CONTEÚDO]
🎥 CONTEXTO VISUAL: Transição para cortes rápidos e milimétricos demonstrando muito contraste e tipografia elegante e fina centralizada.
🎙️ LOCUÇÃO:
"No design de marcas de alto padrão, cada pixel deve disputar espaço com o silêncio. Existem três pilares para carimbar sofisticação:
Primeiro: Espaço negativo abundante. Se seu design precisa estar cheio de elementos para se provar, ele ainda não está maduro.
Segundo: Cores inspiradas em matérias-primas naturais—cinzas quentes, argila, minerais.
E terceiro: Tipografia intencional."

[00:20 - 00:30 | APELO À AÇÃO]
🎥 CONTEXTO VISUAL: Lettering na tela com brilho sutil. CTA limpa na parte inferior.
🎙️ LOCUÇÃO:
"Remova até sobrar apenas a essência. Salve este vídeo para sua próxima curadoria criativa."`,
            createdAt: new Date().toISOString(),
            isFavorite: true
          },
          {
            id: 'init-2',
            title: 'Copywriter de Elite',
            type: 'caption',
            platform: 'linkedin',
            tone: 'professional',
            language: 'pt',
            prompt: 'Como economizar 10 horas semanais usando automação simples',
            output: `O ativo mais escasso de 2026 não é o capital. É a atenção focada.

Se você ainda passa mais de 2 horas por dia repetindo tarefas manuais de planilha, você não está sendo produtivo — está apenas ocupado.

Com apenas três gatilhos simples integrados à sua rotina, conseguimos economizar em média 10 horas semanais por membro na equipe:

1. Centralização dinâmica de fluxos de ideias.
2. Automação de postagens multicanais.
3. Inteligência estruturada para refinamento de briefings.

A tecnologia não substitui o senso crítico do especialista; ela apenas limpa o ruído operacional para você trabalhar no que realmente importa.

Como você tem orquestrado suas automações criativas para sobrar tempo estratégico? Me conte abaixo nos comentários. 👇

#ProdutividadeInteligente #SaaS #GestaoDeTempo #Automatizar #TrabalhoInovador`,
            createdAt: new Date().toISOString(),
            isFavorite: false
          }
        ];
        setItems(initialCreations);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialCreations));
      }
    } catch (e) {
      console.error('Falha ao restaurar do localStorage', e);
    }
  }, []);

  // Update localStorage when items list edits
  const saveItemsList = (updated: GeneratedContentItem[]) => {
    setItems(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Falha ao salvar no localStorage', e);
    }
  };

  // Call server-side API proxy to generate high quality social posts
  const handleGenerateContent = async (formData: {
    type: ContentType;
    platform: Platform;
    tone: Tone;
    targetAudience: string;
    prompt: string;
    extraDetails: string;
  }) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: formData.type,
          platform: formData.platform,
          tone: formData.tone,
          language: lang,
          targetAudience: formData.targetAudience,
          extraDetails: formData.extraDetails,
          prompt: formData.prompt
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erro de rede no servidor (Status ${response.status})`);
      }

      const data = await response.json();
      
      if (!data.result) {
        throw new Error('A resposta gerada pela IA veio vazia ou inválida.');
      }

      // Compose the newly generated creation
      const newItem: GeneratedContentItem = {
        id: 'creation-' + Date.now(),
        title: formData.prompt.substring(0, 30) + (formData.prompt.length > 30 ? '...' : ''),
        type: formData.type,
        platform: formData.platform,
        tone: formData.tone,
        language: lang,
        prompt: formData.prompt,
        output: data.result,
        createdAt: new Date().toISOString(),
        isFavorite: false
      };

      const updated = [newItem, ...items];
      saveItemsList(updated);
      setLatestGenerated(newItem);
      setMobileCreatorTab('result');
      setActivePreviewItem(newItem); // Auto opens simulator
    } catch (err: any) {
      console.error('Error during generation:', err);
      setErrorMsg(err.message || 'Ocorreu um problema ao conectar com o serviço da IA Gemini.');
    } finally {
      setLoading(false);
    }
  };

  // Save manually written script in Smart Editor to local history
  const handleSaveManualScript = (title: string, output: string) => {
    const newItem: GeneratedContentItem = {
      id: 'manual-' + Date.now(),
      title: title || 'Roteiro Manual',
      type: 'script',
      platform: 'instagram',
      tone: 'bold',
      language: lang,
      prompt: title || 'Roteiro Customizado',
      output: output,
      createdAt: new Date().toISOString(),
      isFavorite: false
    };
    const updated = [newItem, ...items];
    saveItemsList(updated);
  };

  // Toggle favorite bookmark state
  const handleToggleFavorite = (id: string) => {
    const updated = items.map(item => {
      if (item.id === id) {
        return { ...item, isFavorite: !item.isFavorite };
      }
      return item;
    });
    saveItemsList(updated);
  };

  // Remove content creation from history
  const handleDeleteItem = (id: string) => {
    const updated = items.filter(item => item.id !== id);
    saveItemsList(updated);
    if (activePreviewItem?.id === id) {
      setActivePreviewItem(null);
    }
    if (latestGenerated?.id === id) {
      setLatestGenerated(null);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const currentTranslations = translations[lang];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-slate-200 font-sans flex flex-col md:flex-row overflow-x-hidden antialiased">
      
      {/* BACKGROUND DECORATIVE GLOW */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-indigo-600/10 to-violet-700/5 rounded-full pointer-events-none blur-[140px]" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-gradient-to-br from-fuchsia-600/5 to-cyan-500/5 rounded-full pointer-events-none blur-[120px]" />

      {/* MOBILE HEADER RESPONSIVE TOGGLE BAR */}
      <header className="md:hidden flex items-center justify-between p-4 bg-[#0D0D0D] border-b border-slate-800 z-30 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-600/20">
            <Sparkles className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white font-mono">CREA.AI</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Language Switcher Quick Dropdown */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs">
            <Globe className="h-3 ml-0.5 mr-1 text-slate-400" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Language)}
              className="bg-transparent font-medium text-slate-300 focus:outline-none cursor-pointer text-xs"
            >
              <option value="pt">PT</option>
              <option value="en">EN</option>
              <option value="es">ES</option>
            </select>
          </div>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 border border-slate-800 hover:border-slate-700 bg-slate-900/80 rounded-xl"
            id="mobile-menu-trigger"
          >
            {mobileMenuOpen ? <X className="h-5 w-5 text-white" /> : <Menu className="h-5 w-5 text-white" />}
          </button>
        </div>
      </header>

      {/* MOBILE BACKDROP OVERLAY */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity" 
        />
      )}

      {/* SIDEBAR NAVIGATION: STATIC ON DESKTOP, MODAL/DRAWER ON MOBILE */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-[#0D0D0D] border-r border-slate-800/80 flex flex-col transform transition-transform duration-300 ease-in-out
        md:relative md:transform-none md:z-auto
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `} id="app-sidebar-element">
        
        {/* Sidebar Header Title - Desktop */}
        <div className="p-6 border-b border-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-wider text-white font-mono">CREA.AI</h1>
              <span className="text-[9px] font-mono tracking-widest text-slate-500 block uppercase">MídiaExpress</span>
            </div>
          </div>
          {/* Close Menu for Mobile Drawer */}
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden p-1.5 text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Global Multi-language Selection Grid */}
        <div className="p-4 border-b border-slate-950/40">
          <label className="text-[10px] tracking-wider uppercase text-slate-500 font-bold block mb-2 px-1">
            {lang === 'pt' ? 'Idioma do Sistema' : lang === 'es' ? 'Idioma del Sistema' : 'System Language'}
          </label>
          <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {(['pt', 'en', 'es'] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => {
                  setLang(l);
                  setMobileMenuOpen(false);
                }}
                className={`py-1 px-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  lang === l
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
                id={`btn-lang-selector-${l}`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Primary Page Selection Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-3 mb-3">
            {lang === 'pt' ? 'FÁBRICA CRIATIVA' : lang === 'es' ? 'FÁBRICA CREATIVA' : 'CREATIVE STUDIO'}
          </div>

          <button
            onClick={() => {
              setActiveTab('create');
              setActivePreviewItem(null);
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all text-sm font-semibold cursor-pointer ${
              activeTab === 'create'
                ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>{currentTranslations.createTab}</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('editor');
              setActivePreviewItem(null);
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all text-sm font-semibold cursor-pointer ${
              activeTab === 'editor'
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/20 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
            id="sidebar-tab-editor-trigger"
          >
            <FileEdit className="h-4 w-4 text-amber-400" />
            <span>{currentTranslations.editorTab}</span>
            <span className="ml-auto rounded bg-amber-500/15 border border-amber-500/20 px-1.5 py-0.5 text-[8px] text-amber-400 font-bold uppercase tracking-wider font-mono">
              Novo
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('history');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all text-sm font-semibold cursor-pointer ${
              activeTab === 'history'
                ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <History className="h-4 w-4" />
            <span>{currentTranslations.historyTab}</span>
            <span className="ml-auto rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-400 font-mono">
              {items.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('favorites');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all text-sm font-semibold cursor-pointer ${
              activeTab === 'favorites'
                ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <Heart className="h-4 w-4" />
            <span>{currentTranslations.favoritesTab}</span>
            <span className="ml-auto rounded-full bg-rose-500/10 px-2 py-0.5 text-xs text-rose-400 font-mono">
              {items.filter(i => i.isFavorite).length}
            </span>
          </button>

          <div className="pt-6 text-[10px] uppercase tracking-widest text-slate-500 font-bold px-3 mb-2">
            {lang === 'pt' ? 'MÍDIAEXPRESS' : lang === 'es' ? 'MÍDIAEXPRESS' : 'MIDIAEXPRESS'}
          </div>

          <button
            onClick={() => {
              setActiveTab('about');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all text-sm font-semibold cursor-pointer ${
              activeTab === 'about'
                ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <HelpCircle className="h-4 w-4" />
            <span>{lang === 'pt' ? 'Guia de Instruções' : lang === 'es' ? 'Manual de IA' : 'AI Handbook'}</span>
          </button>
        </nav>

        {/* User Account / Engine Info in Sidebar Footer */}
        <div className="p-4 border-t border-slate-950/80 bg-slate-950/40">
          <div className="relative overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900/50 p-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/30">
                <span className="text-[10px] font-bold text-indigo-400">GEM</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">MídiaExpress AI</p>
                <span className="inline-block px-1.5 py-0.5 bg-green-500/10 text-green-400 text-[8px] font-bold rounded border border-green-500/25 uppercase tracking-wider">
                  Gemini API Ativo
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN APPLICATION workspace AREA */}
      <main className="flex-1 flex flex-col min-w-0" id="main-application-panel-wrapper">
        
        {/* HEADER BAR FOR APP */}
        <header className="hidden md:flex h-20 border-b border-slate-800/80 items-center justify-between px-8 bg-[#0D0D0D]/30 backdrop-blur-sm z-10">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">
                {currentTranslations.title}
              </h2>
              <p className="text-xs text-slate-400">
                {currentTranslations.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-green-500/5 text-green-400 border border-green-500/15 px-3 py-1.5 rounded-full text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              <span className="font-semibold tracking-wider text-[10px] font-mono">GEMINI 3.5 FLASH ENGAGED</span>
            </div>

            {/* Language switcher select */}
            <div className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-xl shadow-inner text-xs">
              <Globe className="h-3.5 w-3.5 text-indigo-400" />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as Language)}
                className="bg-transparent font-semibold text-slate-200 outline-none border-none cursor-pointer focus:ring-0"
              >
                <option value="pt" className="bg-slate-950">Português (BR)</option>
                <option value="en" className="bg-slate-950">English (US)</option>
                <option value="es" className="bg-slate-950">Español (ES)</option>
              </select>
            </div>
          </div>
        </header>

        {/* WORKSPACE AREA SCROLLABLE */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6" id="workspace-scrollable-container">
          
          {/* Real-time backend API configuration errors */}
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200 flex items-start gap-3"
              id="global-system-error-banner"
            >
              <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h5 className="font-bold text-white mb-1">
                  {lang === 'pt' ? 'Falha na Geração' : lang === 'es' ? 'Error de Generación' : 'Generation Failed'}
                </h5>
                <p className="leading-relaxed text-xs">{errorMsg}</p>
                <p className="mt-2 text-[10px] text-red-400">
                  {lang === 'pt' 
                    ? 'Verifique se você inseriu a chave API nos Secrets do AI Studio para habilitar requests diretos.' 
                    : lang === 'es'
                    ? 'Verifica tu clave GEMINI_API_KEY en la pestaña Secrets.'
                    : 'Check your GEMINI_API_KEY credentials configured inside the tool secrets panel.'}
                </p>
              </div>
            </motion.div>
          )}

          {/* ACTIVE TAB ROUTER CONTAINER */}
          <div>
            {activeTab === 'create' && (
              <div className="space-y-6">
                
                {/* Clean Segmented Tab Bar Exclusively for Mobile/Tablet to declutter the viewport */}
                <div className="lg:hidden flex p-1 bg-slate-950 border border-slate-800 rounded-xl max-w-sm mx-auto shadow-inner">
                  <button
                    onClick={() => setMobileCreatorTab('form')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      mobileCreatorTab === 'form'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Sliders className="h-3.5 w-3.5 shrink-0" />
                    <span>{lang === 'pt' ? 'Configurar Post' : lang === 'es' ? 'Configuración' : 'Briefing Form'}</span>
                  </button>
                  <button
                    onClick={() => setMobileCreatorTab('result')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer relative ${
                      mobileCreatorTab === 'result'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Sparkles className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                    <span>{lang === 'pt' ? 'Texto Gerado' : lang === 'es' ? 'Resultado IA' : 'AI Output'}</span>
                    {latestGenerated && mobileCreatorTab !== 'result' && (
                      <span className="absolute -top-1 -right-1 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                      </span>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Generation Parameters Left panel */}
                  <div className={`lg:col-span-7 space-y-6 ${mobileCreatorTab === 'form' ? 'block' : 'hidden lg:block'}`}>
                    <CreatePanel 
                      lang={lang} 
                      onGenerate={handleGenerateContent} 
                      loading={loading} 
                    />
                  </div>

                  {/* Live Real-time Showcase of the Generated Copy */}
                  <div className={`lg:col-span-5 space-y-6 ${mobileCreatorTab === 'result' ? 'block' : 'hidden lg:block'}`}>
                    {latestGenerated ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="rounded-2xl border border-indigo-500/30 bg-[#0E0E12] p-6 shadow-xl relative overflow-hidden"
                        id="latest-generated-block-showcase"
                      >
                        {/* Premium decoration label */}
                        <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-widest font-mono">
                          LATEST COPIED
                        </div>

                        <div className="flex items-center gap-2 mb-4">
                          <Sparkles className="h-5 w-5 text-indigo-400" />
                          <h4 className="text-sm font-bold text-white uppercase tracking-wider">{lang === 'pt' ? 'Mídia Criada' : lang === 'es' ? 'Creación completada' : 'Creation result'}</h4>
                        </div>

                        <div className="mb-4">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-900/80 inline-block font-mono">
                            {lang === 'pt' ? 'Assunto:' : lang === 'es' ? 'Tema:' : 'Subject:'} <span className="text-indigo-400">"{latestGenerated.prompt}"</span>
                          </p>
                          <FormattedOutput text={latestGenerated.output} />
                        </div>

                        <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                          <button
                            onClick={() => setActivePreviewItem(latestGenerated)}
                            className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-slate-900 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all border border-indigo-500/30 cursor-pointer"
                          >
                            <Smartphone className="h-4 w-4" />
                            <span>{lang === 'pt' ? 'Vizualizar no Celular Simulado' : lang === 'es' ? 'Ver en Celular Simulado' : 'Preview Social Mock'}</span>
                          </button>

                          <button
                            onClick={() => handleCopyText(latestGenerated.id, latestGenerated.output)}
                            className={`flex items-center justify-center gap-2 font-bold py-2.5 px-6 rounded-xl text-xs transition-all cursor-pointer ${
                              copiedId === latestGenerated.id
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                                : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                            }`}
                          >
                            {copiedId === latestGenerated.id ? (
                              <>
                                <Check className="h-4 w-4" />
                                <span>{translations[lang].copied}</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-4 w-4" />
                                <span>{translations[lang].copyBtn}</span>
                              </>
                            )}
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-8 text-center min-h-[400px] flex flex-col items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-500 mb-4 border border-slate-700/50">
                          <Sliders className="h-6 w-6 animate-pulse" />
                        </div>
                        <h4 className="text-base font-bold text-white mb-2">
                          {lang === 'pt' ? 'Aguardando sua Ideia' : lang === 'es' ? 'Esperando tu Idea' : 'Awaiting Your Input'}
                        </h4>
                        <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                          {lang === 'pt' 
                            ? 'Escolha as diretrizes, insira o assunto do seu post ao lado e clique em salvar para que a Inteligência Artificial formule o texto estratégico perfeito.'
                            : lang === 'es'
                            ? 'Ingresa el tema y configura los tonos de voz para que la Inteligencia Artificial empiece a componer.'
                            : 'Configure options, insert your social post brief and generate utilizing Google Gemini API power.'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'editor' && (
              <SmartEditor 
                lang={lang} 
                onSaveToHistory={handleSaveManualScript}
              />
            )}

            {activeTab === 'history' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/65 pb-3">
                  <div>
                    <h3 className="text-lg font-bold text-white">{currentTranslations.historyTab}</h3>
                    <p className="text-xs text-slate-400">
                      {lang === 'pt' ? 'Histórico completo de conteúdos formulados pela IA' : lang === 'es' ? 'Historial de publicaciones' : 'Master history log'}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowStats(!showStats)}
                    className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#0F0F13] hover:bg-slate-900 text-slate-300 border border-slate-800 rounded-lg text-xs font-bold transition-all cursor-pointer"
                  >
                    <BarChart2 className="h-3.5 w-3.5 text-indigo-400" />
                    <span>{showStats ? (lang === 'pt' ? 'Esconder Estatísticas' : 'Hide Stats') : (lang === 'pt' ? 'Ver Estatísticas da IA 📊' : 'View AI Stats 📊')}</span>
                  </button>
                </div>

                {showStats && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4"
                  >
                    <StatsGrid items={items} lang={lang} />
                  </motion.div>
                )}

                <HistoryList 
                  items={items} 
                  lang={lang} 
                  onToggleFavorite={handleToggleFavorite} 
                  onDelete={handleDeleteItem} 
                  onSelectPreview={setActivePreviewItem} 
                  favoriteOnly={false}
                />
              </div>
            )}

            {activeTab === 'favorites' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/65 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white">{currentTranslations.favoritesTab}</h3>
                    <p className="text-xs text-slate-400">
                      {lang === 'pt' ? 'Seus rascunhos favoritos salvos para rápido acesso' : 'Your bookmarked creative scripts'}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowStats(!showStats)}
                    className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#0F0F13] hover:bg-slate-900 text-slate-300 border border-slate-800 rounded-lg text-xs font-bold transition-all cursor-pointer"
                  >
                    <BarChart2 className="h-3.5 w-3.5 text-indigo-400" />
                    <span>{showStats ? (lang === 'pt' ? 'Esconder Estatísticas' : 'Hide Stats') : (lang === 'pt' ? 'Ver Estatísticas da IA 📊' : 'View AI Stats 📊')}</span>
                  </button>
                </div>

                {showStats && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4"
                  >
                    <StatsGrid items={items} lang={lang} />
                  </motion.div>
                )}

                <HistoryList 
                  items={items} 
                  lang={lang} 
                  onToggleFavorite={handleToggleFavorite} 
                  onDelete={handleDeleteItem} 
                  onSelectPreview={setActivePreviewItem} 
                  favoriteOnly={true}
                />
              </div>
            )}

            {activeTab === 'about' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 md:p-8 max-w-3xl mx-auto space-y-6"
                id="handbook-guide-tab"
              >
                <div className="border-b border-slate-800 pb-4">
                  <h3 className="text-2xl font-black text-white">
                    {lang === 'pt' ? 'Guia de Engenharia de Prompt e Funcionalidades' : lang === 'es' ? 'Guía del Creador de Contenido' : 'Social Engine Handbook'}
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">Como extrair o máximo do MídiaExpress AI com o Gemini.</p>
                </div>

                <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
                  <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
                    <h5 className="font-bold text-white flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                      {lang === 'pt' ? '🎬 Roteiros de Reels / TikTok' : lang === 'es' ? '🎬 Guiones de Reels / TikTok' : '🎬 Visual Video Scripts'}
                    </h5>
                    <p className="text-xs text-slate-400">
                      {lang === 'pt' 
                        ? 'Gera blocos organizados especificando sugestão de cena, dicas visuais de câmera em colchetes e a locução exata para você apenas ler ou dublar sem gaguejar. Perfeito para prender atenção nos primeiros 3 segundos.'
                        : lang === 'es'
                        ? 'Crea bloques de video organizados que indican sugerencias visuales, ideas de cámara y textos directos listos para narrar.'
                        : 'Returns perfectly formatted script with structural scenes [VISUAL CAMERA CUE] and speech prompts to minimize raw editing.'}
                    </p>
                  </div>

                  <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
                    <h5 className="font-bold text-white flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                      {lang === 'pt' ? '✍️ Legendas Altamente Conversivas' : lang === 'es' ? '✍️ Leyendas Persuasivas' : '✍️ High-Conversion Copy'}
                    </h5>
                    <p className="text-xs text-slate-400">
                      {lang === 'pt'
                        ? 'Formulado usando a estrutura clássica de marketing focado na conversão direta: Gancho de atenção no início, espaçamento amigável de respiração para leitura, emojis estratégicos pontuais e Chamada para Ação clara (CTA).'
                        : lang === 'es'
                        ? 'Genera copias con fuerte gancho inicial, separación por párrafos limpia para lectura fácil, emojis y un llamado a la acción al final.'
                        : 'Designed with proven structures starting with heavy emotional hooks, readable spacings, and high-converting CTAs.'}
                    </p>
                  </div>

                  <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
                    <h5 className="font-bold text-white flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                      {lang === 'pt' ? '📖 Storytelling Profundo' : lang === 'es' ? '📖 Narrativa Emocional' : '📖 Storytelling Arc'}
                    </h5>
                    <p className="text-xs text-slate-400">
                      {lang === 'pt'
                        ? 'Cria narrativas engajadoras baseadas em metodologias como a Jornada do Herói ou modelo de dor e solução extrema PAS (Problema, Agitação, Solução). Perfeito para elevar o valor percebido do seu produto.'
                        : lang === 'es'
                        ? 'Utiliza marcos narrativos de alto impacto para enganchar o conectar con el lector rápidamente y generar confianza.'
                        : 'Applies deep narrative rules like Hero Journey or Problem-Agitation-Solution (PAS) to connect with potential clients.'}
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-6 flex flex-col s:flex-row items-center justify-between text-xs text-slate-500">
                  <span>MídiaExpress IA App • Version 1.2.0</span>
                  <span className="flex items-center gap-1.5 text-indigo-400 mt-2 sm:mt-0 font-medium font-mono">
                    <Info className="h-4 w-4" /> Powered by Gemini 3.5 Flash
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      {/* DETAILED INTERACTIVE SOCIAL POST SIMULATOR OVERLAY */}
      <AnimatePresence>
        {activePreviewItem && (
          <SocialSimulator 
            item={activePreviewItem} 
            onClose={() => setActivePreviewItem(null)} 
            lang={lang} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

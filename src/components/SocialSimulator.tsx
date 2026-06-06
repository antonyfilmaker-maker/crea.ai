import { useState } from 'react';
import { GeneratedContentItem, Language } from '../types';
import { 
  X, Heart, MessageCircle, Send, Bookmark, Share2, Award, 
  User, Check, Sparkles, Copy, Smartphone, ThumbsUp, Repeat, BarChart2 
} from 'lucide-react';
import { motion } from 'motion/react';

interface SocialSimulatorProps {
  item: GeneratedContentItem | null;
  onClose: () => void;
  lang: Language;
}

export function SocialSimulator({ item, onClose, lang }: SocialSimulatorProps) {
  const [copied, setCopied] = useState(false);

  if (!item) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(item.output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Profile presets by platform
  const getProfileName = () => {
    switch (item.platform) {
      case 'instagram':
        return 'criativosocial.ai';
      case 'linkedin':
        return 'Criador Social AI (Oficial)';
      case 'tiktok':
        return 'criador_social_ia';
      case 'youtube':
        return 'Canal Criador Social';
      case 'twitter':
        return 'CriadorSocialAI';
      default:
        return 'CriadorSocial';
    }
  };

  const getProfileTitle = () => {
    if (item.platform === 'linkedin') {
      return 'Especialista em Growth & Inteligência Artificial de Negócios • Palestrante • Top Voice';
    }
    return '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md" id="social-simulator-overlay">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden"
        id="social-simulator-modal"
      >
        {/* Left/Main column - Editor and controls */}
        <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-indigo-400" />
                <h4 className="text-lg font-bold text-white">
                  {lang === 'pt' ? 'Prévia de Publicação' : lang === 'es' ? 'Previsualización de Publicación' : 'Live Social Post Mockup'}
                </h4>
              </div>
              <span className="text-xs uppercase bg-indigo-500/10 px-2 py-0.5 rounded-md font-semibold text-indigo-300">
                {item.platform}
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-4 font-sans leading-relaxed">
              {lang === 'pt' 
                ? 'Esta é uma simulação de como o seu texto gerado pela Inteligência Artificial se integrará visualmente nas redes móveis.' 
                : lang === 'es'
                ? 'Esta es una simulación interactiva de cómo se verá tu publicación una vez copiada en redes sociales.'
                : 'This is a visual preview simulation showing how your post will look on social media platforms.'}
            </p>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{lang === 'pt' ? 'Diretriz' : lang === 'es' ? 'Instrucción' : 'Prompt'}</span>
                <p className="text-sm font-medium text-slate-200 mt-1 italic">
                  "{item.prompt}"
                </p>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{lang === 'pt' ? 'Filtro Aplicado' : lang === 'es' ? 'Filtro' : 'Filters'}</span>
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded-md">
                    Tom: {item.tone}
                  </span>
                  <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded-md">
                    Língua: {item.language.toUpperCase()}
                  </span>
                  <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded-md">
                    Tipo: {item.type}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800/50">
            <button
              onClick={handleCopy}
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-sm font-bold cursor-pointer transition-all ${
                copied 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/10'
              }`}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>{lang === 'pt' ? 'Copiado para Área de Transferência!' : lang === 'es' ? '¡Copiado con Éxito!' : 'Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>{lang === 'pt' ? 'Copiar Texto Final' : lang === 'es' ? 'Copiar Contenido' : 'Copy Social Script'}</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm rounded-xl transition-all cursor-pointer"
            >
              {lang === 'pt' ? 'Fechar' : lang === 'es' ? 'Cerrar' : 'Close'}
            </button>
          </div>
        </div>

        {/* Right column: The beautiful phone preview */}
        <div className="p-6 bg-slate-950/60 flex items-center justify-center min-h-[460px] md:w-[380px]" id="simulated-phone-column">
          {/* Main phone body */}
          <div className="w-[310px] aspect-[9/19] rounded-[44px] border-[8px] border-slate-800 bg-black shadow-2xl relative overflow-hidden flex flex-col pt-6 pb-4">
            
            {/* Phone Ear Piece / camera notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-800 rounded-full z-20 flex items-center justify-end px-4 gap-1.5">
              <span className="w-1.5 h-1.5 bg-black rounded-full" />
              <span className="w-1 h-1 bg-indigo-500/40 rounded-full" />
            </div>

            {/* Dynamic Status bar simulated */}
            <div className="px-5 pb-2 text-[10px] font-mono text-slate-400 flex justify-between select-none z-10 w-full">
              <span>9:41</span>
              <div className="flex items-center gap-1">
                <span>5G</span>
                <span>📶</span>
                <span>🔋 88%</span>
              </div>
            </div>

            {/* Real device mockup screen */}
            <div className="flex-1 overflow-y-auto px-3 py-2 text-white text-xs select-none custom-scrollbar bg-zinc-950">
              
              {/* PLATFORM: INSTAGRAM MOCKUP */}
              {item.platform === 'instagram' && (
                <div className="space-y-3 font-sans">
                  {/* Inst Header */}
                  <div className="flex items-center justify-between border-b border-neutral-900 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full p-[1.5px] bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600">
                        <div className="w-full h-full rounded-full bg-black flex items-center justify-center p-0.5 border border-black">
                          <User className="h-4 w-4 text-slate-400" />
                        </div>
                      </div>
                      <div>
                        <p className="font-bold text-[11px] text-white flex items-center gap-1">
                          {getProfileName()}
                          <span className="inline-block w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center text-[7px] text-white font-serif">✓</span>
                        </p>
                        <p className="text-[9px] text-slate-400">Sponsored • Sao Paulo, Brazil</p>
                      </div>
                    </div>
                    <span className="text-white text-lg font-bold">...</span>
                  </div>

                  {/* Inst Image placeholder */}
                  <div className="aspect-square w-full rounded-md bg-gradient-to-br from-indigo-950 to-slate-900 border border-neutral-900 flex flex-col items-center justify-center p-4 text-center text-[10px] relative">
                    <Sparkles className="h-6 w-6 text-pink-500 mb-2 animate-bounce" />
                    <p className="font-bold uppercase tracking-wider text-neutral-300">
                      {item.type === 'script' ? '🎬 Vídeo / Reels' : item.type === 'caption' ? '📸 Post Feed' : '📖 Storytelling'}
                    </p>
                    <p className="text-[9px] text-neutral-500 mt-1 italic px-3 truncate max-w-full">
                      {item.prompt}
                    </p>
                  </div>

                  {/* Inst Action Buttons */}
                  <div className="flex items-center justify-between py-1 text-white text-base">
                    <div className="flex items-center gap-3">
                      <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
                      <MessageCircle className="h-4 w-4" />
                      <Send className="h-4 w-4" />
                    </div>
                    <Bookmark className="h-4 w-4" />
                  </div>

                  {/* Inst description */}
                  <div className="space-y-1">
                    <p className="font-bold text-[11px]">8.240 likes</p>
                    <p className="text-[10px] leading-relaxed break-words whitespace-pre-line text-neutral-200">
                      <span className="font-bold text-white mr-1.5">{getProfileName()}</span>
                      {item.output}
                    </p>
                  </div>
                </div>
              )}

              {/* PLATFORM: LINKEDIN MOCKUP */}
              {item.platform === 'linkedin' && (
                <div className="space-y-3 font-sans text-neutral-300 text-[10px]">
                  {/* LinkedIn company row */}
                  <div className="flex items-start gap-2 border-b border-neutral-900 pb-2">
                    <div className="w-8 h-8 rounded-md bg-indigo-950 flex items-center justify-center border border-indigo-500/20">
                      <Award className="h-5 w-5 text-indigo-400" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-[11px] flex items-center gap-1">
                        {getProfileName()}
                        <span className="text-[9px] text-blue-400">• 1st</span>
                      </p>
                      <p className="text-[8px] text-neutral-400 leading-tight">
                        {getProfileTitle()}
                      </p>
                      <p className="text-[8px] text-neutral-500">1h • Public</p>
                    </div>
                  </div>

                  {/* LinkedIn post content text */}
                  <div className="whitespace-pre-line leading-relaxed text-slate-100">
                    {item.output}
                  </div>

                  {/* Action counter mock */}
                  <div className="flex justify-between text-[8px] text-neutral-500 border-t border-b border-neutral-900 py-1.5">
                    <span className="flex items-center gap-1 text-blue-400">
                      👍❤️ 422 likes
                    </span>
                    <span>32 comments • 12 reposts</span>
                  </div>

                  {/* LinkedIn action buttons bar */}
                  <div className="grid grid-cols-4 text-center text-neutral-500 pt-1 text-[9px] font-semibold">
                    <span className="flex items-center justify-center gap-1 hover:text-white py-1">
                      <ThumbsUp className="h-3 w-3" /> Like
                    </span>
                    <span className="flex items-center justify-center gap-1 hover:text-white py-1">
                      <MessageCircle className="h-3 w-3" /> Comment
                    </span>
                    <span className="flex items-center justify-center gap-1 hover:text-white py-1">
                      <Repeat className="h-3 w-3" /> Repost
                    </span>
                    <span className="flex items-center justify-center gap-1 hover:text-white py-1">
                      <Send className="h-3 w-3" /> Send
                    </span>
                  </div>
                </div>
              )}

              {/* PLATFORM: TIKTOK / VIDEO MOCKUP */}
              {(item.platform === 'tiktok' || item.platform === 'youtube') && (
                <div className="relative h-full flex flex-col justify-between font-sans">
                  
                  {/* Top content source buttons */}
                  <div className="flex justify-center gap-3 text-[11px] font-bold text-slate-400 py-1 border-b border-neutral-900/60">
                    <span>Following</span>
                    <span className="text-white border-b-2 border-white pb-1">For You</span>
                  </div>

                  <div className="flex-1 py-10 flex flex-col justify-end relative">
                    {/* Floating right interactive bar */}
                    <div className="absolute right-0 bottom-16 flex flex-col items-center gap-4 text-center z-10 text-white">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-indigo-500 flex items-center justify-center p-0.5">
                          <User className="h-4 w-4" />
                        </div>
                        <span className="text-[8px] mt-1 font-semibold">9.1k</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <Heart className="h-6 w-6 text-rose-500 fill-rose-500" />
                        <span className="text-[8px] mt-1 font-semibold">82.3k</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <MessageCircle className="h-6 w-6" />
                        <span className="text-[8px] mt-1 font-semibold">4,124</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <Share2 className="h-6 w-6 text-white" />
                        <span className="text-[8px] mt-1 font-semibold">Share</span>
                      </div>
                    </div>

                    {/* Bottom screen description box */}
                    <div className="pr-12 text-slate-100 text-[10px] space-y-2">
                      <p className="font-bold text-white">@{getProfileName()}</p>
                      <div className="line-clamp-6 bg-slate-900/80 backdrop-blur-md p-2.5 rounded-lg border border-slate-800">
                        <p className="whitespace-pre-line leading-relaxed text-[9px]">
                          {item.output}
                        </p>
                      </div>
                      <p className="text-[8px] text-slate-400 truncate flex items-center gap-1">
                        <span>🎵</span>
                        <span>Original Audio - @{getProfileName()}</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* PLATFORM: TWITTER / X MOCKUP */}
              {item.platform === 'twitter' && (
                <div className="space-y-3 font-sans text-neutral-300">
                  {/* User credentials */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center p-1.5 border border-neutral-900">
                        <User className="h-4 w-4 text-slate-400" />
                      </div>
                      <div>
                        <p className="font-bold text-white text-[11px] leading-tight flex items-center gap-1">
                          {getProfileName()}
                          <span className="text-blue-400 text-[9px]">Verified ✓</span>
                        </p>
                        <p className="text-[9px] text-neutral-500">@{getProfileName()}</p>
                      </div>
                    </div>
                    <span className="bg-white text-black text-[9px] font-bold px-2 py-0.5 rounded-full">Follow</span>
                  </div>

                  {/* Tweet content text */}
                  <div className="text-[11px] leading-relaxed text-slate-100 whitespace-pre-line">
                    {item.output}
                  </div>

                  <p className="text-[8px] text-neutral-500 pb-2 border-b border-neutral-900">
                    10:14 AM • Jun 6, 2026 • <span className="font-bold text-white">12.5K</span> Views
                  </p>

                  {/* Actions row */}
                  <div className="grid grid-cols-4 text-neutral-500 py-1 text-center border-b border-neutral-900">
                    <span className="flex items-center justify-center gap-1 hover:text-white">
                      💬 42
                    </span>
                    <span className="flex items-center justify-center gap-1 text-green-500">
                      🔁 118
                    </span>
                    <span className="flex items-center justify-center gap-1 text-rose-500">
                      ❤️ 2,425
                    </span>
                    <span className="flex items-center justify-center gap-1 text-slate-500">
                      📊 Bookmark
                    </span>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

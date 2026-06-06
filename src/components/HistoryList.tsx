import { useState } from 'react';
import { GeneratedContentItem, Language } from '../types';
import { translations } from '../translations';
import { 
  Search, Trash2, Bookmark, BookmarkCheck, Copy, Check, Eye, Clock, 
  Instagram, Linkedin, Youtube, Twitter, Film, FileText, Share2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FormattedOutput } from './FormattedOutput';

interface HistoryListProps {
  items: GeneratedContentItem[];
  lang: Language;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onSelectPreview: (item: GeneratedContentItem) => void;
  favoriteOnly?: boolean;
}

export function HistoryList({ 
  items, 
  lang, 
  onToggleFavorite, 
  onDelete, 
  onSelectPreview,
  favoriteOnly = false 
}: HistoryListProps) {
  const t = translations[lang];
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter items matching search bar and optional Favorites-Only restraint
  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.prompt.toLowerCase().includes(search.toLowerCase()) ||
      item.output.toLowerCase().includes(search.toLowerCase()) ||
      item.platform.toLowerCase().includes(search.toLowerCase()) ||
      item.type.toLowerCase().includes(search.toLowerCase());
    
    if (favoriteOnly) {
      return matchesSearch && item.isFavorite;
    }
    return matchesSearch;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Helper helper to dynamically get platform icons
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="h-4 w-4 text-pink-500" />;
      case 'tiktok':
        return <Film className="h-4 w-4 text-cyan-400" />; // Represents short videos/viral
      case 'linkedin':
        return <Linkedin className="h-4 w-4 text-blue-500" />;
      case 'youtube':
        return <Youtube className="h-4 w-4 text-red-500" />;
      case 'twitter':
        return <Twitter className="h-4 w-4 text-slate-400" />;
      default:
        return <Share2 className="h-4 w-4 text-indigo-400" />;
    }
  };

  // Format creation calendar time
  const formatTime = (timeStr: string) => {
    try {
      const date = new Date(timeStr);
      return date.toLocaleTimeString(lang === 'pt' ? 'pt-BR' : lang === 'es' ? 'es-ES' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit'
      }) + ' - ' + date.toLocaleDateString(lang === 'pt' ? 'pt-BR' : lang === 'es' ? 'es-ES' : 'en-US', {
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return timeStr;
    }
  };

  return (
    <div className="space-y-4" id="history-container-block">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Clock className="h-5 w-5 text-indigo-400" />
          <span>{favoriteOnly ? t.favoritesTab : t.historyTitle}</span>
          <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-xs text-indigo-300 font-mono">
            {filteredItems.length}
          </span>
        </h3>

        {/* Global Search Filtering */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
            id="search-input-field"
          />
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {filteredItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/10 p-12 text-center"
            id="empty-history-helper"
          >
            <Bookmark className="mx-auto h-8 w-8 text-slate-600 mb-3" />
            <p className="text-sm font-medium text-slate-400 max-w-md mx-auto leading-relaxed">
              {t.noHistory}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="group relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/30 hover:bg-slate-900/50 p-5 transition-all backdrop-blur-sm"
                id={`history-item-container-${item.id}`}
              >
                {/* Visual Top Bar Indicators */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/60 pb-3 mb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex items-center gap-1.5 rounded-lg bg-slate-900/90 border border-slate-800 px-2.5 py-1 text-xs font-semibold text-white">
                      {getPlatformIcon(item.platform)}
                      <span className="capitalize">{item.platform}</span>
                    </span>
                    <span className="rounded-lg bg-indigo-500/10 border border-indigo-500/10 px-2.5 py-1 text-xs font-medium text-indigo-300">
                      {t.types[item.type]?.split(' ').slice(1).join(' ') || item.type}
                    </span>
                    <span className="rounded-lg bg-emerald-500/10 px-2 py-0.5 text-[11px] font-mono text-emerald-400 capitalize">
                      {t.tones[item.tone]?.replace(/^[^a-zA-Z]+/, '') || item.tone}
                    </span>
                  </div>

                  <span className="text-xs text-slate-500 font-mono">
                    {formatTime(item.createdAt)}
                  </span>
                </div>

                {/* Prompt Label Block */}
                <div className="mb-3">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest leading-none mb-1">
                    {lang === 'pt' ? 'Briefing' : lang === 'es' ? 'Briefing' : 'Briefing'}
                  </p>
                  <p className="text-sm font-medium text-slate-200 line-clamp-2 md:line-clamp-none">
                    "{item.prompt}"
                  </p>
                </div>

                {/* Generated Content Body Preview */}
                <div className="mb-4">
                  <FormattedOutput text={item.output} />
                </div>

                {/* Action Controls Toolbar */}
                <div className="flex items-center justify-between border-t border-slate-800/40 pt-3">
                  <button
                    onClick={() => onSelectPreview(item)}
                    className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer py-1 px-2.5 bg-indigo-500/10 hover:bg-indigo-500/15 rounded-lg transition-all"
                    id={`btn-live-preview-${item.id}`}
                  >
                    <Eye className="h-4 w-4" />
                    <span>{lang === 'pt' ? 'Simulador Digital (Visualizar)' : lang === 'es' ? 'Simulador Digital' : 'Simulator (Social Mock)'}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {/* Copy operation */}
                    <button
                      onClick={() => handleCopy(item.id, item.output)}
                      className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer transition-all ${
                        copiedId === item.id
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                      id={`btn-copy-${item.id}`}
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          <span>{t.copied}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>{t.copyBtn}</span>
                        </>
                      )}
                    </button>

                    {/* Bookmark Toggle */}
                    <button
                      onClick={() => onToggleFavorite(item.id)}
                      className={`rounded-lg p-1.5 cursor-pointer border transition-all ${
                        item.isFavorite
                          ? 'bg-rose-500/15 border-rose-500/25 text-rose-400'
                          : 'bg-slate-800/80 hover:bg-slate-700 border-slate-800 text-slate-400 hover:text-rose-400'
                      }`}
                      title={t.favoriteBtn}
                      id={`btn-fav-toggle-${item.id}`}
                    >
                      {item.isFavorite ? (
                        <BookmarkCheck className="h-4 w-4" />
                      ) : (
                        <Bookmark className="h-4 w-4" />
                      )}
                    </button>

                    {/* Delete operation */}
                    <button
                      onClick={() => onDelete(item.id)}
                      className="rounded-lg bg-slate-800/80 hover:bg-red-500/15 border border-slate-800 hover:border-red-500/25 p-1.5 text-slate-400 hover:text-red-400 transition-all cursor-pointer"
                      title={t.deleteBtn}
                      id={`btn-delete-${item.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

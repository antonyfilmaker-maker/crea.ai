import React, { useState } from 'react';
import { Eye, Copy, Check, Palette, FileText, AlertCircle } from 'lucide-react';

interface FormattedOutputProps {
  text: string;
}

export function FormattedOutput({ text }: FormattedOutputProps) {
  const [viewMode, setViewMode] = useState<'multicolor' | 'raw'>('multicolor');
  const [copied, setCopied] = useState(false);

  // Parse lines to detect which are acting directions vs. spoken dialogue vs. hashtags vs overhead
  const parseLines = (rawText: string) => {
    if (!rawText) return [];

    const lines = rawText.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      
      if (!trimmed) {
        return { id: idx, type: 'empty', content: line };
      }

      // 1. Scene settings / Acting instructions check
      // Typically enclosed in square brackets [Visual: ...] or starts with indicators
      const hasBrackets = trimmed.startsWith('[') && trimmed.includes(']');
      const containsVisualIndicators = 
        trimmed.toUpperCase().includes('CENA') ||
        trimmed.toUpperCase().includes('CONTEXTO VISUAL') ||
        trimmed.toUpperCase().includes('VISUAL CUE') ||
        trimmed.toUpperCase().includes('ESCENA') ||
        trimmed.toUpperCase().includes('[SFX') ||
        trimmed.toUpperCase().includes('AUDIO:') ||
        trimmed.toUpperCase().includes('TRILHA');

      if (hasBrackets || containsVisualIndicators) {
        return {
          id: idx,
          type: 'acting', // Amber / Orange
          content: line,
          tag: trimmed.toUpperCase().includes('SFX') ? '🔊 EFEITO SONORO (SFX)' : '🎬 CENA / DIREÇÃO DE ATUAÇÃO'
        };
      }

      // 2. Direct speech / Voiceover check
      // Starts with quotation marks, 🎙️, or labels like LOCUÇÃO, FALAS, FALA
      const startsWithQuote = trimmed.startsWith('"') || trimmed.endsWith('"');
      const containsVoiceIndicators = 
        trimmed.startsWith('🎙️') ||
        trimmed.toUpperCase().startsWith('LOCUÇÃO') ||
        trimmed.toUpperCase().startsWith('FALA') ||
        trimmed.toUpperCase().startsWith('VOICEOVER') ||
        trimmed.toUpperCase().startsWith('NARRADOR');

      if (startsWithQuote || containsVoiceIndicators) {
        return {
          id: idx,
          type: 'speech', // Vibrant Emerald / Green
          content: line,
          tag: '🎙️ FALA / LOCUÇÃO EXATA'
        };
      }

      // 3. Caption / Marketing caption or copywriting body header check
      const containsCaptionIndicators = 
        trimmed.toUpperCase().startsWith('LEGENDA') || 
        trimmed.toUpperCase().startsWith('CAPTION') ||
        trimmed.toUpperCase().startsWith('COPY:');

      if (containsCaptionIndicators) {
        return {
          id: idx,
          type: 'captionHeader', // Sky Cyan
          content: line,
          tag: '✍️ LEGENDA DO POST'
        };
      }

      // 4. Hashtags block helper
      if (trimmed.startsWith('#') || (trimmed.includes('#') && trimmed.split('#').length > 2)) {
        return {
          id: idx,
          type: 'hashtag', // Indigo / Purple
          content: line,
          tag: '🏷️ HASHTAGS DA REDE'
        };
      }

      // 5. Titles (# Heading etc.)
      if (trimmed.startsWith('#') || trimmed.startsWith('**') && trimmed.endsWith('**') && trimmed.length < 50) {
        return {
          id: idx,
          type: 'title', // White glowing banner
          content: line
        };
      }

      // Standard text line
      return {
        id: idx,
        type: 'standard',
        content: line
      };
    });
  };

  const formattedLines = parseLines(text);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full space-y-3" id="formatted-output-composer">
      {/* Visual Navigation controls */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setViewMode('multicolor')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'multicolor'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Palette className="h-3.5 w-3.5" />
            <span>Formatado (Cores)</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('raw')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'raw'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Texto Puro</span>
          </button>
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            copied 
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
          }`}
          id="btn-formatted-copy"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 animate-pulse" />
              <span>Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copiar</span>
            </>
          )}
        </button>
      </div>

      {/* Styled Legend Legend Map */}
      {viewMode === 'multicolor' && (
        <div className="flex flex-wrap gap-2 p-2 bg-slate-950/40 rounded-xl border border-slate-900 text-[10px] font-mono text-slate-400">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-amber-500/20 border border-amber-500/40"></span>
            <span>Atuação / Cenas (Âmbar)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-emerald-500/20 border border-emerald-500/40"></span>
            <span>Falas exatas (Verde)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-indigo-500/20 border border-indigo-500/40"></span>
            <span>Hashtags (Roxo)</span>
          </div>
        </div>
      )}

      {/* Main output view body */}
      <div className="flex-1 overflow-y-auto max-h-[500px] bg-slate-950/70 p-4 rounded-xl border border-slate-900 custom-scrollbar select-text text-sm">
        {viewMode === 'raw' ? (
          <pre className="whitespace-pre-wrap font-sans text-slate-300 leading-relaxed break-words">
            {text}
          </pre>
        ) : (
          <div className="space-y-2">
            {formattedLines.map((lineObj) => {
              const { id, type, content, tag } = lineObj;

              if (type === 'empty') {
                return <div key={id} className="h-2"></div>;
              }

              if (type === 'acting') {
                return (
                  <div key={id} className="my-2 p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-200">
                    {tag && <span className="block text-[9px] font-bold tracking-wider text-amber-500 uppercase mb-1">{tag}</span>}
                    <span className="font-mono text-xs leading-relaxed italic">{content}</span>
                  </div>
                );
              }

              if (type === 'speech') {
                return (
                  <div key={id} className="my-2 p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-100">
                    {tag && <span className="block text-[9px] font-bold tracking-wider text-emerald-500 uppercase mb-1">{tag}</span>}
                    <span className="font-sans font-medium text-[13px] leading-relaxed">{content}</span>
                  </div>
                );
              }

              if (type === 'captionHeader') {
                return (
                  <div key={id} className="my-2 p-3 rounded-xl border border-cyan-500/20 bg-cyan-500/5 text-cyan-200">
                    {tag && <span className="block text-[9px] font-bold tracking-wider text-cyan-400 uppercase mb-1">{tag}</span>}
                    <span className="font-sans font-semibold text-sm">{content}</span>
                  </div>
                );
              }

              if (type === 'hashtag') {
                return (
                  <div key={id} className="my-1.5 p-2 rounded-xl border border-indigo-500/10 bg-indigo-500/5 text-indigo-300">
                    {tag && <span className="block text-[9px] font-bold tracking-wider text-indigo-400 uppercase mb-1">{tag}</span>}
                    <span className="font-mono text-xs">{content}</span>
                  </div>
                );
              }

              if (type === 'title') {
                return (
                  <h4 key={id} className="text-white font-bold text-base tracking-tight border-b border-slate-900 pb-1.5 mt-4 mb-2 text-indigo-400 font-mono">
                    {content}
                  </h4>
                );
              }

              // Standard content
              return (
                <p key={id} className="text-slate-300 leading-relaxed py-0.5">
                  {content}
                </p>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

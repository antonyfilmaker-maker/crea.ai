import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  Printer, 
  FileText, 
  RefreshCw, 
  Download, 
  Undo2, 
  FileEdit, 
  Bookmark, 
  Copy, 
  Check, 
  Info,
  ChevronRight,
  Plus
} from 'lucide-react';
import { Language } from '../types';

interface SmartEditorProps {
  lang: Language;
  onSaveToHistory: (title: string, output: string) => void;
}

export function SmartEditor({ lang, onSaveToHistory }: SmartEditorProps) {
  const [editorText, setEditorText] = useState<string>(
    lang === 'pt' 
      ? `🎬 ROTEIRO: "O Amanhã da IA"\n\n[00:00 - 00:05 | CENA DE ABERTURA]\n🎬 CENA / DIREÇÃO DE ATUAÇÃO\n[Close lento em um celular desligado sobre a mesa de madeira, a luz ambiente está fraca. Som estático ao fundo.]\n\n🎙️ FALA / LOCUÇÃO EXATA\n"Se você acha que a inteligência artificial é apenas sobre o futuro..."\n\n[00:05 - 00:15 | CONFLITO]\n🎬 CENA / DIREÇÃO DE ATUAÇÃO\n[O celular acende de repente exibindo uma onda sonora brilhando. A música cresce.]\n\n🎙️ FALA / LOCUÇÃO EXATA\n`
      : lang === 'es'
      ? `🎬 GUION: "El Mañana de la IA"\n\n[00:00 - 00:05 | ESCENA DE APERTURA]\n🎬 CENA / DIREÇÃO DE ATUAÇÃO\n[Primer plano de un celular apagado sobre una mesa de madera. Luz ambiental tenue.]\n\n🎙️ FALA / LOCUÇÃO EXATA\n"Si crees que la inteligencia artificial es solo sobre el futuro..."\n\n`
      : `🎬 SCRIPT: "Tomorrow's Tech"\n\n[00:00 - 00:05 | OPENING SCENE]\n🎬 CENA / DIREÇÃO DE ATUAÇÃO\n[Slow close up on a turned-off smartphone over a rustic wooden desk. Ambient light is dimmed.]\n\n🎙️ FALA / LOCUÇÃO EXATA\n"If you think artificial intelligence is just some far-off dream..."\n\n`
  );
  
  const [instructions, setInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [historyHistory, setHistoryHistory] = useState<string[]>([editorText]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [savedStatus, setSavedStatus] = useState<string | null>(null);
  const [documentTitle, setDocumentTitle] = useState(
    lang === 'pt' ? 'Meu Roteiro Incrível' : lang === 'es' ? 'Mi Guión Increíble' : 'My Awesome Script'
  );

  const stats = {
    chars: editorText.length,
    words: editorText.trim() ? editorText.trim().split(/\s+/).length : 0,
    lines: editorText.split('\n').length
  };

  // Push new state to history for undo capabilities
  const updateEditorText = (newVal: string) => {
    setEditorText(newVal);
    const updatedHistory = historyHistory.slice(0, historyIndex + 1);
    updatedHistory.push(newVal);
    setHistoryHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setEditorText(historyHistory[prevIndex]);
    }
  };

  // Connects with server-side autocompleter to finish script
  const handleAIComplete = async () => {
    if (!editorText.trim()) {
      setErrorMsg(
        lang === 'pt' ? 'Digite o início de um roteiro antes de pedir para a IA completar.' 
        : lang === 'es' ? 'Escribe el inicio de un guión antes.'
        : 'Please write a draft snippet first.'
      );
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await fetch('/api/autocomplete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentText: editorText,
          language: lang,
          instructions: instructions
        })
      });

      if (!response.ok) {
        throw new Error(
          lang === 'pt' ? 'Não foi possível completar o roteiro. Verifique a chave API do Gemini nos Secrets ou reinstale as rotas.'
          : 'Could not fetch autocomplete response from Gemini.'
        );
      }

      const data = await response.json();
      if (data.result) {
        updateEditorText(data.result);
        setInstructions(''); // Clean instructions on success
      } else {
        throw new Error('Retorno vazio da IA.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Erro na conexão com a IA.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editorText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    try {
      const blob = new Blob([editorText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${documentTitle.toLowerCase().replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    }
  };

  // Triggers browser native Print feature.
  // Using custom print stylesheet setups ensures only our script gets printed nicely!
  const handlePrintPDF = () => {
    const printableWindow = window.open('', '_blank');
    if (!printableWindow) {
      alert(lang === 'pt' ? 'Por favor, libere pop-ups neste navegador para poder visualizar o PDF de impressão.' : 'Allow pop-ups to print.');
      return;
    }

    const styledContent = editorText.split('\n').map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '<br />';
      
      // Map to formatted print classes
      if (trimmed.startsWith('#') || trimmed.toUpperCase().startsWith('ROTEIRO') || trimmed.toUpperCase().startsWith('SCRIPT')) {
        return `<h1 style="color: #4f46e5; font-family: sans-serif; font-size: 22px; border-bottom: 2px solid #ddd; padding-bottom: 8px; margin-top: 24px;">${trimmed.replace(/^[#\s]+/, '')}</h1>`;
      }
      
      if (trimmed.startsWith('[') && trimmed.includes(']')) {
        return `<div style="background: #fffcf0; border-left: 4px solid #f59e0b; padding: 12px; margin: 12px 0; font-family: monospace; font-size: 13px; color: #451a03; border-radius: 4px;">🎬 <strong>ATUAÇÃO / CENA:</strong><br/>${trimmed}</div>`;
      }

      if (trimmed.toUpperCase().startsWith('🎬') || trimmed.toUpperCase().includes('DIREÇÃO DE ATUAÇÃO') || trimmed.toUpperCase().includes('CONTEXTO VISUAL')) {
        return `<div style="color: #d97706; font-size: 11px; font-weight: bold; margin-top: 14px; text-transform: uppercase; font-family: sans-serif;">${trimmed}</div>`;
      }

      if (trimmed.toUpperCase().startsWith('🎙️') || trimmed.toUpperCase().includes('LOCUÇÃO') || trimmed.toUpperCase().startsWith('FALA')) {
        return `<div style="color: #059669; font-size: 11px; font-weight: bold; margin-top: 14px; text-transform: uppercase; font-family: sans-serif;">${trimmed}</div>`;
      }

      if (trimmed.startsWith('"') || trimmed.includes('🎙️') || trimmed.startsWith('LOCUÇÃO') || trimmed.toUpperCase().startsWith('FALA')) {
        return `<div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 12px; margin: 8px 0; font-family: sans-serif; font-size: 15px; color: #064e3b; line-height: 1.6; border-radius: 4px;">🎙️ ${trimmed}</div>`;
      }

      if (trimmed.startsWith('#')) {
        return `<span style="color: #6366f1; font-family: monospace; font-size: 13px; margin-right: 6px;">${trimmed}</span>`;
      }

      return `<p style="font-family: sans-serif; font-size: 14px; color: #334155; line-height: 1.6; margin: 6px 0;">${trimmed}</p>`;
    }).join('');

    printableWindow.document.write(`
      <html>
        <head>
          <title>${documentTitle}</title>
          <style>
            body { 
              padding: 40px; 
              max-width: 800px; 
              margin: 0 auto; 
              color: #1e293b; 
              background: white;
            }
            .header-doc {
              text-align: center;
              border-bottom: 3px double #cbd5e1;
              padding-bottom: 16px;
              margin-bottom: 30px;
            }
            .header-doc h2 { margin: 0; font-family: sans-serif; font-size: 26px; color: #0f172a; }
            .header-doc p { margin: 6px 0 0; font-family: monospace; font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; }
            .footer-doc {
              margin-top: 50px;
              border-top: 1px solid #e2e8f0;
              padding-top: 14px;
              display: flex;
              justify-content: space-between;
              font-family: sans-serif;
              font-size: 11px;
              color: #94a3b8;
            }
            @media print {
              body { padding: 0; }
              button { display: none !important; }
            }
          </style>
        </head>
        <body>
          <div class="header-doc">
            <h2>${documentTitle}</h2>
            <p>Gerado no MídiaExpress AI • Impressora de Roteiro Clássico</p>
          </div>
          <div class="document-body">
            ${styledContent}
          </div>
          <div class="footer-doc">
            <span>Data: ${new Date().toLocaleDateString()}</span>
            <span>MídiaExpress AI Studio</span>
          </div>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    printableWindow.document.close();
  };

  const handleSaveToHistoryBoard = () => {
    if (!editorText.trim()) return;
    onSaveToHistory(documentTitle, editorText);
    setSavedStatus(
      lang === 'pt' ? 'Salvo no Histórico Geral!' 
      : lang === 'es' ? '¡Guardado en el historial!' 
      : 'Saved to Master History!'
    );
    setTimeout(() => setSavedStatus(null), 3000);
  };

  const insertHelperToken = (token: string) => {
    updateEditorText(editorText + '\n' + token);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" id="smart-script-editor-room">
      
      {/* LEFT COLUMN: ACTIVE WORKSPACE AND TEXTAREA */}
      <div className="lg:col-span-8 space-y-4">
        
        {/* Editor Title and Header actions */}
        <div className="bg-[#0F0F13] border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
          <div className="flex-1 min-w-0">
            <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block mb-1">
              {lang === 'pt' ? 'Nome do Documento' : lang === 'es' ? 'Nombre del Documento' : 'Document Title'}
            </label>
            <div className="flex items-center gap-1.5">
              <FileEdit className="h-4 w-4 text-indigo-400 shrink-0" />
              <input
                type="text"
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
                className="bg-transparent font-bold text-white text-base focus:outline-none border-b border-dashed border-slate-700 focus:border-indigo-500 w-full"
                placeholder="Roteiro de Reels"
              />
            </div>
          </div>

          {/* Quick Stats list */}
          <div className="flex items-center gap-3 text-[11px] font-mono bg-slate-950 p-2 rounded-xl border border-slate-900 shrink-0 select-none">
            <span className="text-slate-400">
              {stats.words} <strong className="text-indigo-400">{lang === 'pt' ? 'palavras' : lang === 'es' ? 'palabras' : 'words'}</strong>
            </span>
            <span className="text-slate-700">|</span>
            <span className="text-slate-400">
              {stats.chars} {lang === 'pt' ? 'caracteres' : lang === 'es' ? 'caracteres' : 'chars'}
            </span>
          </div>
        </div>

        {/* Word processor area */}
        <div className="relative rounded-2xl border border-slate-800 bg-[#0E0E12] shadow-xl overflow-hidden">
          
          {/* Top Format Helper Bar */}
          <div className="bg-[#121218] border-b border-slate-800/80 p-2 flex flex-wrap gap-1 items-center justify-between">
            <div className="flex flex-wrap gap-1 items-center">
              <button
                type="button"
                onClick={() => insertHelperToken('🎬 CENA / DIREÇÃO DE ATUAÇÃO\n[Visual: ]')}
                className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1"
                title={lang === 'pt' ? 'Inserir Diretriz de Atuação' : 'Add visual prompt'}
              >
                <Plus className="h-3 w-3" />
                <span>+ Atuação</span>
              </button>

              <button
                type="button"
                onClick={() => insertHelperToken('🎙️ FALA / LOCUÇÃO EXATA\n" "')}
                className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1"
                title={lang === 'pt' ? 'Inserir Bloco de Fala' : 'Add speech block'}
              >
                <Plus className="h-3 w-3" />
                <span>+ Locução (Fala)</span>
              </button>

              <button
                type="button"
                onClick={() => insertHelperToken('#')}
                className="px-2.5 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1"
              >
                <span>+ Hashtags</span>
              </button>
            </div>

            {/* Undo buffer action */}
            <button
              onClick={handleUndo}
              disabled={historyIndex === 0}
              className={`p-1.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1 ${
                historyIndex === 0 
                  ? 'border-transparent text-slate-600 cursor-not-allowed' 
                  : 'border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800'
              }`}
              title="Desfazer alteração"
            >
              <Undo2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Desfazer</span>
            </button>
          </div>

          <textarea
            value={editorText}
            onChange={(e) => updateEditorText(e.target.value)}
            className="w-full min-h-[440px] p-6 bg-transparent text-slate-100 font-mono text-sm leading-relaxed placeholder-slate-600 focus:outline-none resize-y selection:bg-indigo-500 selection:text-white"
            placeholder={
              lang === 'pt' 
                ? 'Comece a digitar seu roteiro aqui. Defina falas com aspas e direções visuais de cenas em colchetes [...]' 
                : 'Write your creative script or caption draft here...'
            }
            spellCheck="false"
            id="smart-script-processor-textarea"
          />

          {/* Quick info status block */}
          <div className="bg-[#121217] border-t border-slate-900 p-3 px-5 flex flex-wrap items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Info className="h-3.5 w-3.5 text-indigo-400" />
              <span>{lang === 'pt' ? 'Editor dinâmico com auto-colorização nativa' : 'Type or invoke Gemini API autocompleters'}</span>
            </span>
            <span className="font-mono text-[10px]">utf8 • document layout</span>
          </div>
        </div>

        {/* System Autocomplete instructions box */}
        {errorMsg && (
          <div className="p-3 bg-red-500/15 border border-red-500/25 rounded-xl text-xs text-red-300 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* RIGHT SIDEBAR COLUMN: AI AUTOCOMPLETE SETTINGS & SAVING */}
      <div className="lg:col-span-4 space-y-4">
        
        {/* AI COMPLETION SECTION (CO-PILOT) */}
        <div className="bg-[#0E0E12] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sparkles className="h-5 w-5 text-indigo-400 shrink-0" />
            <div>
              <h3 className="font-bold text-white text-sm">
                {lang === 'pt' ? 'MídiaExpress Co-Pilot' : lang === 'es' ? 'AI Copiloto' : 'AI Autocompleter'}
              </h3>
              <p className="text-[10px] text-slate-400">Complete seu roteiro automaticamente</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1.5 flex items-center gap-1.5">
                <ChevronRight className="h-3 w-3 text-indigo-400" />
                {lang === 'pt' ? 'Instrução para a Continuação' : lang === 'es' ? 'Dirección de cierre' : 'Completion Guidance'}
              </label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder={
                  lang === 'pt' 
                    ? 'Ex: Quero um final emocionante... / Faça com que o roteiro fale sobre o bônus final... / Adicione hashtags virais...' 
                    : 'Specify how Gemini should end or refine the draft script...'
                }
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 min-h-[90px] resize-none"
              />
            </div>

            <button
              onClick={handleAIComplete}
              disabled={loading || !editorText.trim()}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                loading
                  ? 'bg-indigo-600/40 text-slate-300 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 border border-indigo-500/30'
              }`}
              id="btn-trigger-ai-autocomplete"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>
                {loading ? (lang === 'pt' ? 'IA Completando...' : 'AI Writing...') : (lang === 'pt' ? 'IA Completar Roteiro ✨' : 'Finish with AI ✨')}
              </span>
            </button>
          </div>
        </div>

        {/* DOCUMENT EXPORT & SAVING TOOLBOX */}
        <div className="bg-[#0E0E12] border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
          <div className="pb-2 border-b border-slate-800">
            <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider">
              {lang === 'pt' ? 'Ferramentas de Exportação' : lang === 'es' ? 'Herramientas' : 'Export & Save Tools'}
            </h4>
          </div>

          <div className="space-y-2">
            {/* 1. PDF PRINT BUTTON */}
            <button
              onClick={handlePrintPDF}
              disabled={!editorText.trim()}
              className="w-full flex items-center justify-between text-left p-3 rounded-xl bg-slate-950/60 hover:bg-slate-950 border border-slate-800 hover:border-indigo-500/40 text-slate-300 hover:text-white transition-all text-xs font-semibold cursor-pointer"
              id="btn-print-pdf-generator"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                  <Printer className="h-4 w-4 text-orange-400" />
                </div>
                <div>
                  <span className="block font-bold">{lang === 'pt' ? 'Salvar em PDF' : lang === 'es' ? 'Descargar PDF' : 'Save to PDF / Print'}</span>
                  <span className="text-[10px] text-slate-500 font-normal">Abre tela de impressão otimizada.</span>
                </div>
              </div>
            </button>

            {/* 2. PLAIN TEXT DOWNLOAD BUTTON */}
            <button
              onClick={handleDownloadTxt}
              disabled={!editorText.trim()}
              className="w-full flex items-center justify-between text-left p-3 rounded-xl bg-slate-950/60 hover:bg-slate-950 border border-slate-800 hover:border-indigo-500/40 text-slate-300 hover:text-white transition-all text-xs font-semibold cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                  <Download className="h-4 w-4 text-indigo-400" />
                </div>
                <div>
                  <span className="block font-bold">{lang === 'pt' ? 'Baixar Rascunho (.txt)' : lang === 'es' ? 'Descargar TXT' : 'Download plain text'}</span>
                  <span className="text-[10px] text-slate-500 font-normal">Ideal para backups rápidos.</span>
                </div>
              </div>
            </button>

            {/* 3. SAVE TO CREATION HISTORY BOARD */}
            <button
              onClick={handleSaveToHistoryBoard}
              disabled={!editorText.trim()}
              className="w-full flex items-center justify-between text-left p-3 rounded-xl bg-slate-950/60 hover:bg-slate-950 border border-slate-800 hover:border-indigo-500/40 text-slate-300 hover:text-white transition-all text-xs font-semibold cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <Bookmark className="h-4 w-4 text-emerald-400" />
                </div>
                <div>
                  <span className="block font-bold">{lang === 'pt' ? 'Arquivar no Histórico' : lang === 'es' ? 'Guardar Rascunho' : 'Commit to App History'}</span>
                  <span className="text-[10px] text-slate-500 font-normal">Salva para acessar e editar depois.</span>
                </div>
              </div>
            </button>

            {/* Save status notification feedback */}
            {savedStatus && (
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[11px] font-bold text-emerald-400 text-center animate-pulse">
                {savedStatus}
              </div>
            )}
          </div>
        </div>

        {/* WORKSPACE PRESETS AND COPYING SHORTCUT */}
        <div className="bg-slate-900/10 border border-slate-800/60 p-4 rounded-xl text-xs space-y-2.5">
          <span className="block font-bold text-slate-400 tracking-wider text-[10px] uppercase">
            {lang === 'pt' ? 'Dica Profissional' : 'Pro Tip'}
          </span>
          <p className="text-slate-500 leading-relaxed text-[11px]">
            {lang === 'pt' 
              ? 'Ao salvar em PDF, defina o destino de impressão de seu navegador como "Salvar como PDF" para obter um arquivo digital ideal para enviar a seus clientes ou equipe de edição.'
              : 'When printing, you can set your output printer to "Save as PDF" to generate highly-formatted local document files.'}
          </p>
        </div>

      </div>

    </div>
  );
}

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini Client
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({
    apiKey: apiKey || "",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // Prompt helper to generate strategic voice instructions based on language
  function buildSystemInstruction(language: string): string {
    if (language === 'pt') {
      return `Você é um Redator Publicitário Sênior e Especialista em Crescimento de Redes Sociais.
Sua missão é gerar conteúdo premium, original e extremamente engajador.
Siga as especificações do usuário detalhadamente. Sempre retorne respostas formatadas primorosamente em Markdown limpo e estilizado.

Instruções Específicas por Formato:
- **Roteiro (Reels/TikTok/Shorts/YouTube)**: Divida de forma clara em [CENA / CONTEXTO VISUAL] com sugestões de áudio, trilha sonora, efeitos sonoros (SFX) e falas prontas para gravação. Inclua dicas de tom de voz.
- **Legenda (Instagram/LinkedIn/Facebook)**: Crie um início impactante (gancho), divida em parágrafos legíveis usando espaçamento adequado, insira emojis elegantes para enfatizar pontos-chave e termine com uma chamada para ação (CTA) envolvente. Adicione 5-8 hashtags estratégicas em bloco no fim.
- **Storytelling / Narrativa**: Use estruturas narrativas consagradas (ex: A Jornada do Herói, Metodo PAS - Problema, Agitação, Solução). Faça o leitor se conectar emocionalmente desde a primeira frase.
- **Ideias / Estratégia de Conteúdo**: Sugira 3 títulos irresistíveis, propostas para stories interativos e tópicos principais a serem abordados de forma tática.

A resposta inteira deve estar absolutamente estruturada em Português do Brasil.`;
    } else if (language === 'es') {
      return `Eres un Redactor Publicitario de Elite y Especialista en Crecimiento de Redes Sociales.
Su misión es generar contenido premium, altamente creativo y atractivo.
Siga las especificaciones del usuario con precisión. Responda estructurando el contenido bellamente en formato Markdown.

Pautas por Formato:
- **Guión / Roteiro (Reels/TikTok/Shorts/Video)**: Divide claramente entre [ESCENA / CONTEXTO VISUAL], sugerencias de audio/SFX y diálogos listos. Añade sugerencias de tono de voz.
- **Legenda / Copia (Instagram/LinkedIn/Twitter)**: Genera un gancho irresistible, espaciados limpios entre párrafos, emojis selectos y un llamado a la acción (CTA) claro. Incluye de 5 a 8 hashtags clave al final.
- **Storytelling**: Usa marcos narrativos de enganche (problema, agitación, resolución). Genera conexión emocional rápido.
- **Estrategia / Ideas**: Sugiere 3 títulos de alto gancho, ideas de historias interactivas y temas clave para publicaciones.

La respuesta completa debe estar exclusivamente en Español.`;
    } else {
      return `You are a Senior Copywriter and Social Media Growth Expert.
Your mission is to generate premium, highly engaging, and authentic social media elements.
Follow user specifications down to the pixel. Format responses beautifully with clean, rich Markdown headings, bullet points, and styles.

Guidelines by Format:
- **Video Script (Shorts/TikTok/Reels/YouTube)**: Structure with visual suggestions [VISUAL CUE / CAMERA SHOT], overlay text tips, vocal direction, and natural speech scripts.
- **Caption / Copy (Instagram/LinkedIn/X)**: Start with an attention-grabbing hook, use spacious readable line-breaks, subtle contextual emojis, and a clear call to action (CTA). List 5-8 strategic hashtags in a block at the query end.
- **Storytelling**: Craft an immersive narrative structure (Hook, Conflict, Resolution). Appeal to emotional triggers and real human experiences.
- **Strategy & Ideas**: Suggest 3 viral title hooks, interactive story sequence concepts, and distinct angles to execute.

Respond fully in English.`;
    }
  }

  // API endpoint for social content orchestration
  app.post("/api/generate", async (req, res) => {
    try {
      const { type, platform, tone, language, targetAudience, extraDetails, prompt } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "A chave API do Gemini não está configurada no servidor. Por favor, adicione-a nos Secrets." });
      }

      const systemInstruction = buildSystemInstruction(language || 'pt');

      let userMsg = "";
      if (language === 'pt') {
        userMsg = `Crie um conteúdo impecável do tipo "${type}" para a rede social "${platform}".
Tom desejado: "${tone}".
Público-alvo preferencial: "${targetAudience}".
Instrução principal do usuário: "${prompt}"
${extraDetails ? `Detalhes adicionais ou contexto de suporte: "${extraDetails}"` : ""}`;
      } else if (language === 'es') {
        userMsg = `Crea un contenido impecable del tipo "${type}" para la red social "${platform}".
Tono deseado: "${tone}".
Público objetivo: "${targetAudience}".
Instrucción clave del usuario: "${prompt}"
${extraDetails ? `Detalles adicionales o contexto de soporte: "${extraDetails}"` : ""}`;
      } else {
        userMsg = `Create an exceptional piece of content of type "${type}" for the social media channel "${platform}".
Desired voice tone: "${tone}".
Target demographic audience: "${targetAudience}".
Core User Directive: "${prompt}"
${extraDetails ? `Additional context or instructions: "${extraDetails}"` : ""}`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: userMsg,
        config: {
          systemInstruction,
          temperature: 0.8,
        }
      });

      res.json({ result: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error.message || "Erro desconhecido na geração do Gemini" });
    }
  });

  // API endpoint for completing draft scripts and captions
  app.post("/api/autocomplete", async (req, res) => {
    try {
      const { currentText, language, instructions } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "A chave API do Gemini não está configurada no servidor." });
      }

      let systemInstruction = "";
      let promptMsg = "";

      if (language === 'pt') {
        systemInstruction = `Você é um refinador de conteúdo criativo de mídia social.
Sua única tarefa é CONTINUAR a partir do ponto final e COMPLETAR ou MELHORAR o roteiro ou legenda que o usuário começou a redigir.
Preserve o tom original, estilo e marcações já digitados.
Entregue um texto fluido e concluído. Não adicione notas conversacionais como "Aqui está a continuação", traga diretamente o texto integral finalizado de forma polida e bem diagramada.`;
        promptMsg = `O usuário de redes sociais escreveu este início/rascunho de post/roteiro e deseja que você complete com maestria:

"${currentText}"

${instructions ? `Diretrizes adicionais dadas pelo usuário para o final: "${instructions}"` : ""}

Retorne o texto inteiro finalizado da legenda ou roteiro de forma limpa.`;
      } else if (language === 'es') {
        systemInstruction = `Eres un refinado co-creador de contenido de redes sociales.
Tu única misión es CONTINUAR y FINALIZAR el borrador del guión o caption del usuario.
Conserva el tono, estilo e intención inicial sin preámbulos. Devuelve directamente el texto completo terminado de alta retención.`;
        promptMsg = `El usuario redactó el siguiente inicio y desea que tú lo completes:

"${currentText}"

${instructions ? `Instrucción sobre cómo terminar: "${instructions}"` : ""}

Devuelve el texto perfectamente completado.`;
      } else {
        systemInstruction = `You are a social content co-writer and layout finisher.
Your job is to CONTINUE and FINISH the draft script or caption that the user started composing. Maintain perfect tone, style, and hashtags flow. No conversational preambles.`;
        promptMsg = `The user started composing the following content:

"${currentText}"

${instructions ? `Additional user finishing rules: "${instructions}"` : ""}

Deliver the full integrated final social post clean outcome.`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptMsg,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ result: response.text });
    } catch (error: any) {
      console.error("Gemini Autocomplete Error:", error);
      res.status(500).json({ error: error.message || "Erro na auto-conclusão da IA" });
    }
  });

  // Serve Frontend with Vite Middleware in Dev, Static in Prod
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server launched on port ${PORT}`);
  });
}

startServer();

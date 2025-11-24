const API_KEY =
  import.meta.env.VITE_GEMINI_API_KEY ||
  'AIzaSyAhJB5h3btdONhVYXcjvalk5ePTBm9JBgM';
const API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export interface GeminiMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface GeminiRequest {
  contents: GeminiMessage[];
  systemInstruction?: {
    parts: { text: string }[];
  };
}

export interface GeminiResponse {
  candidates: {
    content: {
      parts: { text: string }[];
    };
  }[];
}

const SYSTEM_INSTRUCTION = `You are an expert web developer AI assistant for a no-code website builder platform. Your role is to help users create beautiful, functional websites through conversation.

IMPORTANT GUIDELINES:
1. Generate complete, production-ready code for HTML, CSS, and JavaScript
2. For HTML projects, create self-contained files with inline or embedded styles
3. For Next.js projects, use modern React patterns with TypeScript
4. For Astro projects, use Astro component syntax with proper layouts
5. Always include responsive design with mobile-first approach
6. Use modern, clean design aesthetics with proper spacing and typography
7. Include proper accessibility features (ARIA labels, semantic HTML)
8. When modifying files, provide the complete updated file content
9. Support multi-page websites by creating navigation and route structure

RESPONSE FORMAT:
When creating or modifying files, use this exact format:

FILE: path/to/file.html
\`\`\`html
<complete file content here>
\`\`\`

FILE: path/to/another/file.js
\`\`\`javascript
<complete file content here>
\`\`\`

For simple responses without code, just provide helpful explanations.`;

export async function sendGeminiMessage(
  messages: GeminiMessage[],
  onChunk?: (text: string) => void
): Promise<string> {
  const request: GeminiRequest = {
    contents: messages,
    systemInstruction: {
      parts: [{ text: SYSTEM_INSTRUCTION }],
    },
  };

  const response = await fetch(`${API_URL}?key=${API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${error}`);
  }

  const data: GeminiResponse = await response.json();
  const text = data.candidates[0]?.content?.parts[0]?.text || '';

  if (onChunk) {
    onChunk(text);
  }

  return text;
}

export function parseFilesFromResponse(
  response: string
): Array<{ path: string; content: string; type: string }> {
  const files: Array<{ path: string; content: string; type: string }> = [];
  const fileRegex = /FILE:\s*(.+?)\s*```(\w+)?\s*\n([\s\S]+?)```/g;

  let match;
  while ((match = fileRegex.exec(response)) !== null) {
    const path = match[1].trim();
    const content = match[3].trim();
    const extension = path.split('.').pop() || 'txt';

    files.push({
      path,
      content,
      type: extension,
    });
  }

  return files;
}

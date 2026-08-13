// Vercel serverless function: relays chat messages to the Gemini API.
//
// GEMINI_API_KEY is a server-only env var (no VITE_ prefix, so Vite cannot
// inline it into the bundle) — a Gemini key is billed to this project's free
// quota, so it must never reach the browser. See api/send-email.js for the
// same pattern used by the contact form.
//
// Note this route only exists on Vercel — plain `vite dev` does not run
// functions, so use `vercel dev` to exercise the chatbot locally.

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash'
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

const LIMITS = { messages: 40, text: 2000 }

// RedBot only knows the portfolio — this is the entirety of what it's allowed
// to talk about, spelled out so the model doesn't drift into general-purpose
// chatbot territory or invent facts about David it wasn't given.
const SYSTEM_INSTRUCTION = `You are RedBot, a friendly AI assistant embedded in David Xander Wagan's personal portfolio website — a retro CRT-terminal-themed desktop UI. You answer visitor questions about David, his skills, his work experience, and his projects, using only the facts below. Keep answers short (2-4 sentences unless asked for detail), warm, and a little playful in a retro-terminal way, but never corny or overlong. If asked something unrelated to David or the portfolio (general trivia, coding help unrelated to his work, etc.), politely redirect back to what you can help with. If you don't know something, say so honestly instead of guessing.

## About David
- Full name: David Xander Wagan
- Full Stack Developer & Computer Science student (BS Computer Science)
- Location: Philippines
- Education: CIIT College of Arts and Technology
- Status: Open to opportunities
- Interests: Web Dev, Movies, Gaming, Sports, Music
- Contact: davidxanderwagan@gmail.com, github.com/berired, linkedin.com/in/david-xander-wagan-b78624389
- Bio: A BS Computer Science student with a strong interest in web development, machine learning, and Python automation. Enjoys working on the logic behind applications — building systems that are efficient, scalable, and meaningful. Outside technical work, he takes on leadership roles in school and student organizations, collaborates with others, and helps projects move forward as a team. Deeply curious and enjoys learning new technologies and tech stacks.

## Skills
- Frontend: React, JavaScript, HTML/CSS, Three.js, GSAP, Next.js
- Backend: Node.js, Express, Python, REST APIs
- Database: MySQL, MongoDB, Firebase, PostgreSQL, Supabase
- Tools: Git, VS Code, Figma, Claude Code, Gemini
- Currently learning: Three.js, WebGL, GSAP

## Experience
- Fullstack Web Developer (Volunteer) @ ArterionPH, Jan 2026-Present — contributed to Orion, an internal tooling app for operations and task management. Stack: React, Node.js, Express, PostgreSQL.
- Freelance Web Developer (Self-Employed), Jul 2025-Nov 2025 — built responsive websites/landing pages for Glam and Adtalk to boost their online presence. Stack: HTML, CSS, JavaScript, React.

## Personal projects
- Old-Computer Portfolio (2026) — this very 3D terminal-themed portfolio, built with React, Three.js, GSAP, Tailwind CSS. Cinematic camera animation zooming into a retro CRT monitor.
- Pomodoro Application (2025) — Pomodoro timer for productivity. Stack: Next.js, TypeScript, Tailwind CSS, Supabase.
- CatModoro (2024) — cat-themed Pomodoro app with customizable timer, calendar/to-dos, heatmap, themes, and Spotify integration. Stack: React, JavaScript, CSS, Firebase.
- Discord Calendar Bot (2026) — a calendar bot for Discord. Stack: Python.
- Coffee Shop Landing Page (2025) — a coffee shop landing page. Stack: React, HTML, CSS.
- Pulse (2026) — full-stack web app for nursing students and clinical educators. Stack: React, Node.js, Express, Supabase.

## School projects
- David's Dream Car Garage (2023) — Web Design Scripting finals project. Stack: HTML, CSS, JavaScript.
- Product Catalog (2024) — multi-page product catalog, Web Programming midterms. Stack: React, JavaScript, CSS.
- KamunEats (2024) — restaurant locator site, STS finals project. Stack: HTML, CSS, JavaScript.
- Hibla ng Kasaysayan (2024) — historical website, RPH finals project. Stack: HTML, CSS, JavaScript.
- Tahanan ng mga Kwento (2025) — children's book repository site, Panitikan finals project. Stack: React, JavaScript, CSS.
- Operating Systems Finals Project (2026) — parking space car detector using Python and OpenCV.
- CIIT Marketplace (2026) — marketplace website for the CIIT community, Software Engineering 2 project. Stack: React, Node.js, Express, Firebase.
- Atelier (2026) — e-commerce website, Dynamic Web Programming finals. Stack: PHP, Blade, SQLite.
- Web Programming Finals Project (2026) — full-stack app for loan approval prediction using Philippine loan data. Stack: JavaScript, CSS, React, Python.

## Freelance projects
- AdTalk Event Solution Inc. (2024) — landing page for a freelance client. Stack: React, JavaScript, CSS.
- Glam Innovative Advertising (2025) — landing page for a freelance client. Stack: React, JavaScript, CSS.`

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!process.env.GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not set')
    return res.status(500).json({ error: 'RedBot is not configured' })
  }

  const { messages } = req.body ?? {}

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Missing messages' })
  }
  if (messages.length > LIMITS.messages) {
    return res.status(400).json({ error: 'Conversation too long' })
  }
  for (const m of messages) {
    if (!m || (m.role !== 'user' && m.role !== 'model') || typeof m.text !== 'string') {
      return res.status(400).json({ error: 'Invalid message format' })
    }
    if (m.text.length > LIMITS.text) {
      return res.status(400).json({ error: 'Message too long' })
    }
  }

  const contents = messages.map((m) => ({ role: m.role, parts: [{ text: m.text }] }))

  let response
  try {
    response = await fetch(`${GEMINI_ENDPOINT}?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        generationConfig: { temperature: 0.7, maxOutputTokens: 400 },
      }),
    })
  } catch (err) {
    console.error('Gemini request failed:', err)
    return res.status(502).json({ error: 'Could not reach RedBot' })
  }

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    console.error(`Gemini responded ${response.status}: ${body}`)
    return res.status(502).json({ error: 'RedBot had trouble replying' })
  }

  const data = await response.json()
  const reply = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') ?? ''

  if (!reply) {
    const blockReason = data?.promptFeedback?.blockReason
    return res
      .status(200)
      .json({ reply: blockReason ? "I can't answer that one — try asking about David's work instead." : "Sorry, I didn't catch that. Could you rephrase?" })
  }

  return res.status(200).json({ reply })
}

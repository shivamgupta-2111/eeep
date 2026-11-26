// Serverless function: POST /api/chat
// Works with any OpenAI-compatible chat API (OpenAI, Groq, OpenRouter, Google Gemini, Together, etc.).
// Set these environment variables in your hosting dashboard (never put keys in the frontend):
//   AI_API_KEY  = your secret key
//   AI_API_URL  = chat completions endpoint, e.g. https://api.openai.com/v1/chat/completions
//   AI_MODEL    = model name from your provider, e.g. gpt-4o-mini
const SYSTEM = `You are the friendly style assistant for Aanya Rao Atelier, a Mumbai fashion house
(couture, bridal, ready-to-wear, styling). Studio: Pali Hill, Bandra West. Hours Tue–Sat 11am–7pm.
Made-to-order takes 6–10 weeks, bridal 12–16 weeks. Fabrics: handwoven Banarasi, Chanderi, handloom cotton,
natural dyes, hand embroidery (zardozi, gota patti, mukaish).
Keep answers short (2–4 sentences), warm and helpful. Give styling advice freely. For exact prices or dates,
invite the visitor to use the appointment form on the page. Never invent policies you weren't given.`;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const { AI_API_KEY, AI_API_URL, AI_MODEL } = process.env;
  if (!AI_API_KEY || !AI_API_URL || !AI_MODEL) return res.status(500).json({ error: 'AI is not configured' });
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const history = (body?.messages || [])
      .filter(m => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .slice(-10)
      .map(m => ({ role: m.role, content: m.content.slice(0, 1000) }));
    if (!history.length) return res.status(400).json({ error: 'No message' });

    const r = await fetch(AI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${AI_API_KEY}` },
      body: JSON.stringify({
        model: AI_MODEL,
        max_tokens: 400,
        temperature: 0.7,
        messages: [{ role: 'system', content: SYSTEM }, ...history]
      })
    });
    const data = await r.json();
    if (!r.ok) return res.status(502).json({ error: data?.error?.message || 'AI error' });
    const reply = (data?.choices?.[0]?.message?.content || '').trim();
    return res.status(200).json({ reply });
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
}

// Vercel / Netlify-style serverless function: POST /api/chat
// Keeps your AI API key on the server. Set ANTHROPIC_API_KEY in your hosting dashboard.
const SYSTEM = `You are the friendly style assistant for Aanya Rao Atelier, a Mumbai fashion house
(couture, bridal, ready-to-wear, styling). Studio: Pali Hill, Bandra West. Hours Tue–Sat 11am–7pm.
Made-to-order takes 6–10 weeks, bridal 12–16 weeks. Fabrics: handwoven Banarasi, Chanderi, handloom cotton,
natural dyes, hand embroidery (zardozi, gota patti, mukaish).
Keep answers short (2–4 sentences), warm and helpful. Give styling advice freely. For exact prices or dates,
invite the visitor to use the appointment form on the page. Never invent policies you weren't given.`;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const messages = (body?.messages || [])
      .filter(m => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .slice(-10)
      .map(m => ({ role: m.role, content: m.content.slice(0, 1000) }));
    if (!messages.length || messages[0].role !== 'user') messages.unshift({ role: 'user', content: 'Hello' });

    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({ model: 'claude-haiku-5-5', max_tokens: 400, system: SYSTEM, messages })
    });
    const data = await r.json();
    if (!r.ok) return res.status(502).json({ error: data?.error?.message || 'AI error' });
    const reply = (data.content || []).filter(c => c.type === 'text').map(c => c.text).join('\n').trim();
    return res.status(200).json({ reply });
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
}

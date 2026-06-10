export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') { res.status(405).end(); return; }

  const SUPA_URL = process.env.SUPABASE_URL;
  const SUPA_KEY = process.env.SUPABASE_ANON_KEY;
  const AI_KEY   = process.env.ANTHROPIC_API_KEY;

  const r = await fetch(`${SUPA_URL}/rest/v1/notes?order=created_at.desc`, {
    headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` },
  });
  const notes = await r.json();

  if (!notes.length) {
    return res.status(200).json({ text: 'Nenhuma nota para resumir.' });
  }

  const notesText = notes.map((n, i) =>
    `${i + 1}. [${n.autor || 'Anônimo'}] ${n.title} — ${n.summary} (tags: ${(n.tags || []).join(', ')})`
  ).join('\n');

  const aiRes = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': AI_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 600,
      messages: [{
        role: 'user',
        content: `Com base nas notas abaixo, gere um resumo executivo em português. Agrupe por tema e autor, destaque padrões e aponte os próximos passos mais relevantes. Seja direto e objetivo.\n\nNotas:\n${notesText}`,
      }],
    }),
  });

  const aiData = await aiRes.json();
  const text = aiData.content.map(i => i.text || '').join('');
  return res.status(200).json({ text });
}

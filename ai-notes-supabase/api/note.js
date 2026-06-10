export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const SUPA_URL    = process.env.SUPABASE_URL;
  const SUPA_KEY    = process.env.SUPABASE_ANON_KEY;
  const SUPA_SECRET = process.env.SUPABASE_SECRET_KEY;
  const AI_KEY      = process.env.ANTHROPIC_API_KEY;

  // Leitura usa a publishable key, escrita usa a secret key
  const readHeaders = {
    'Content-Type': 'application/json',
    'apikey': SUPA_KEY,
    'Authorization': `Bearer ${SUPA_KEY}`,
  };

  const writeHeaders = {
    'Content-Type': 'application/json',
    'apikey': SUPA_SECRET,
    'Authorization': `Bearer ${SUPA_SECRET}`,
  };

  // GET — lista todas as notas
  if (req.method === 'GET') {
    const r = await fetch(`${SUPA_URL}/rest/v1/notes?order=created_at.desc`, { headers: readHeaders });
    const data = await r.json();
    return res.status(200).json(data);
  }

  // POST — cria nota via IA
  if (req.method === 'POST') {
    const { text, autor } = req.body;
    if (!text) return res.status(400).json({ error: 'text obrigatório' });

    const aiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': AI_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        messages: [{
          role: 'user',
          content: `Analise o conteúdo abaixo e retorne SOMENTE um JSON válido, sem markdown, sem texto fora do JSON:
{"title":"título curto (máx 8 palavras)","summary":"resumo em 1-2 frases claras","tags":["tag1","tag2","tag3"],"color":"escolha uma: blue|teal|amber|coral|purple|pink|green conforme o contexto"}

Conteúdo: ${text}`,
        }],
      }),
    });

    const aiData = await aiRes.json();
    const raw = aiData.content.map(i => i.text || '').join('');
    const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());

    const dbRes = await fetch(`${SUPA_URL}/rest/v1/notes`, {
      method: 'POST',
      headers: { ...writeHeaders, 'Prefer': 'return=representation' },
      body: JSON.stringify({
        title:    parsed.title   || 'Nota',
        summary:  parsed.summary || text,
        tags:     Array.isArray(parsed.tags) ? parsed.tags.slice(0, 4) : [],
        color:    parsed.color   || 'blue',
        original: text,
        autor:    autor          || 'Anônimo',
      }),
    });

    const saved = await dbRes.json();
    return res.status(200).json(saved[0]);
  }

  // DELETE — remove nota por id
  if (req.method === 'DELETE') {
    const { id } = req.query;
    await fetch(`${SUPA_URL}/rest/v1/notes?id=eq.${id}`, {
      method: 'DELETE',
      headers: writeHeaders,
    });
    return res.status(200).json({ deleted: true });
  }

  res.status(405).end();
}

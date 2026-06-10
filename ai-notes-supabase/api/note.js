export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const SUPA_URL    = process.env.SUPABASE_URL;
  const SUPA_KEY    = process.env.SUPABASE_ANON_KEY;
  const SUPA_SECRET = process.env.SUPABASE_SECRET_KEY;

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

  if (req.method === 'GET') {
    const r = await fetch(`${SUPA_URL}/rest/v1/notes?order=created_at.desc`, { headers: readHeaders });
    const data = await r.json();
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const { title, content, tags, color, autor } = req.body;
    if (!title || !content) return res.status(400).json({ error: 'title e content obrigatórios' });

    const dbRes = await fetch(`${SUPA_URL}/rest/v1/notes`, {
      method: 'POST',
      headers: { ...writeHeaders, 'Prefer': 'return=representation' },
      body: JSON.stringify({
        title:    title.trim(),
        summary:  content.trim(),
        tags:     Array.isArray(tags) ? tags.slice(0, 4) : [],
        color:    color || 'blue',
        original: content.trim(),
        autor:    autor || 'Anônimo',
      }),
    });

    const saved = await dbRes.json();
    return res.status(200).json(saved[0]);
  }

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
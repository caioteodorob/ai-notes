# AI Notes v2

Notas com IA, banco central no Supabase. Qualquer pessoa com o link vê as mesmas notas em tempo real.

## Variáveis de ambiente (configurar na Vercel)

| Nome | Onde pegar |
|------|------------|
| `ANTHROPIC_API_KEY` | console.anthropic.com → API Keys |
| `SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `SUPABASE_ANON_KEY` | Supabase → Settings → API Keys → Publishable key |
| `SUPABASE_SECRET_KEY` | Supabase → Settings → API Keys → Secret key |

## Deploy

### 1. Suba no GitHub

```bash
git add .
git commit -m "update"
git push
```

### 2. Configure o Supabase

Execute o `supabase-setup.sql` no SQL Editor do Supabase.

### 3. Deploy na Vercel

1. Acesse vercel.com → Add New Project → conecte o repositório
2. Adicione as 4 variáveis de ambiente acima
3. Clique em Deploy

## Estrutura

```
ai-notes-v2/
├── api/
│   ├── note.js       # CRUD de notas
│   └── report.js     # Relatório executivo
├── public/
│   └── index.html    # Frontend
├── supabase-setup.sql
└── vercel.json
```

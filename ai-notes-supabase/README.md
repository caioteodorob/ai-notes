# AI Notes — compartilhado

Notas com IA, banco central no Supabase. Qualquer pessoa com o link vê as mesmas notas em tempo real.

## Funcionalidades

- IA organiza cada nota com título, resumo, tags e cor
- Campo de autor — cada nota mostra quem enviou
- Atualização automática a cada 5 segundos para todos os usuários
- Botão "Resumir" gera relatório executivo agrupado por autor e tema
- Dark mode automático

## Estrutura

```
ai-notes-supabase/
├── api/
│   ├── note.js          # CRUD de notas (GET, POST, DELETE)
│   └── report.js        # Relatório executivo via IA
├── public/
│   └── index.html       # Frontend completo
├── supabase-setup.sql   # Cria a tabela no Supabase
├── vercel.json          # Config de deploy
└── .gitignore
```

## Deploy

### 1. Suba no GitHub

```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/ai-notes-supabase.git
git push -u origin main
```

### 2. Configure o Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Vá em **SQL Editor** e execute o conteúdo de `supabase-setup.sql`
3. Copie os valores em **Settings → API**:
   - `Project URL` → `SUPABASE_URL`
   - `anon public` → `SUPABASE_ANON_KEY`

### 3. Deploy na Vercel

1. Acesse [vercel.com](https://vercel.com) → **Add New Project**
2. Conecte o repositório do GitHub
3. Adicione as variáveis de ambiente em **Settings → Environment Variables**:

| Nome | Valor |
|------|-------|
| `ANTHROPIC_API_KEY` | `sk-ant-...` |
| `SUPABASE_URL` | `https://xxxx.supabase.co` |
| `SUPABASE_ANON_KEY` | `eyJ...` |

4. Clique em **Deploy**

A URL gerada pela Vercel é o link para compartilhar com todos.

## Como usar

- Acesse o link da Vercel
- Digite seu nome no campo "Seu nome"
- Cole ou escreva a informação e pressione `Ctrl+Enter`
- Todos que tiverem o link verão a nota em até 5 segundos

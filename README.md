# De Dignis Insanis Opera — Site do RPG (Vite + React)

## Rodar local
```bash
npm install
npm run dev
```

## Trocar o fundo da página
O fundo principal está em:
- `src/assets/background.png` (hoje é sua “imagem 2”)

Se quiser trocar, substitua esse arquivo (mesmo nome) ou ajuste o import em `src/pages/*.jsx`.

## Cards dos personagens (você controla o fundo)
As imagens dos cards estão em:
- `public/cards/*`

Por padrão, vai com SVGs de placeholder.
Você pode substituir cada um por **JPG/PNG**, mantendo o mesmo nome:
- `public/cards/therina.jpg` (ou .png)
- `...`

Depois ajuste `src/data/characters.js` para apontar para o arquivo certo.

## Crônicas
Edite `src/data/chronicles.js`.

## Página do Mestre (com senha)
A página `/characters/mestre` pede senha.

- Padrão: `mestre`
- Para mudar no Render, crie a env var:
  - `VITE_MASTER_PASS=suaSenhaAqui`

## Deploy no Render (Static Site)
1. New → **Static Site**
2. Build Command: `npm install && npm run build`
3. Publish Directory: `dist`
4. (Opcional) Environment: `VITE_MASTER_PASS=...`

> Obs: usamos `HashRouter` pra funcionar sem configuração extra de rewrite.

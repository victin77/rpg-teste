# The Dignis Insanis Opera — Site (estático)

Este é um site estático (HTML/CSS/JS) feito para ficar **igual ao banner** que você aprovou, com:
- capa em tela cheia (Full HD-friendly)
- tipografia elegante (Cinzel + Inter)
- menu (hamburger) com links internos
- efeito leve de grão + vinheta
- parallax bem sutil no fundo

## Como rodar localmente
Basta abrir o arquivo `index.html` no navegador.

Se quiser rodar com servidor (recomendado):
```bash
# Opção 1 (Python)
python -m http.server 5173

# Opção 2 (Node)
npx serve .
```
Depois acesse http://localhost:5173

## Como colocar no ar (Render, Netlify, Vercel)
Como é estático, você pode:
- **Netlify/Vercel**: arrastar a pasta inteira
- **Render**: criar um *Static Site* e apontar para esta pasta.

## Personalizar links
No `index.html`, troque os `href="#"` do Instagram/Discord e os cards de personagens pelos links reais.

## Trocar imagens dos personagens
As imagens de fundo dos cards ficam em `assets/chars/`.

Arquivos atuais (placeholders):
- therina.svg
- topazio.svg
- kimiona.svg
- shay.svg
- lucio.svg
- shinno.svg
- mestre.svg

Para trocar:
1) Coloque a imagem do personagem na pasta `assets/chars/` (pode ser `.png` ou `.jpg`)
2) Renomeie para o mesmo nome (ex: `therina.png`)
3) No `index.html`, altere o caminho do card, por exemplo:
   `--card-bg: url('assets/chars/therina.png');`

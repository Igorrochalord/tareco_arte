# Tareco Mariola — site de comissões

Landing page em React + Vite (framer-motion). Arte furry digital com alma de terror.

## Rodar

```bash
npm install
npm start        # http://localhost:5173
npm run build    # gera dist/ para publicar
```

## Onde editar

- `public/config.json` — preços, prazos, status, textos do "Sobre", galeria, @ do Telegram/X.
  Lido em tempo de execução: publicado o site, basta trocar este arquivo, sem rebuild.
- `public/assets/art` e `public/assets/bg` — imagens.
- `src/i18n.js` — textos da interface em PT/EN.

## Painel da artista

Abra `/#admin`: preencha prazos (em dias), preços e status, veja a prévia na hora
(só naquele navegador) e clique em **config.json ↓**. Substitua o `config.json` do site por esse arquivo.

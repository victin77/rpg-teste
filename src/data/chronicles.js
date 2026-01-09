export const CHRONICLES = [
  {
    id: 'sessao-01',
    title: 'Crônica 01 — O primeiro brinde',
    subtitle: 'A taverna lotada, um convite perigoso.',
    content: `
Aqui vai o resumo completo da sessão 01.

- Quem apareceu
- O que aconteceu
- Ganchos pra próxima sessão

(Depois você substitui esse texto pelo que o Mestre mandar.)
`.trim()
  },
  {
    id: 'sessao-02',
    title: 'Crônica 02 — Sussurros no corredor',
    subtitle: 'Um símbolo antigo e uma porta que não deveria abrir.',
    content: `
Resumo completo da sessão 02.
`.trim()
  }
];

export const getChronicle = (id) => CHRONICLES.find(c => c.id === id);

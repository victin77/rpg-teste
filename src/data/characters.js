export const CHARACTERS = [
  {
    slug: 'therina',
    name: 'Therina',
    subtitle: 'Ficha • História • Itens',
    // Você vai trocar isso pela imagem real do card.
    cardBg: '/cards/therina.svg',
    blurb: 'Uma anã de cabelo longo e presença marcante.'
  },
  {
    slug: 'topazio',
    name: 'Topázio',
    subtitle: 'Ficha • História • Itens',
    cardBg: '/cards/topazio.svg',
    blurb: 'Energia vibrante, decisões rápidas.'
  },
  {
    slug: 'kimiona',
    name: 'Kimiona',
    subtitle: 'Ficha • História • Itens',
    cardBg: '/cards/kimiona.svg',
    blurb: 'Mistério e estratégia em cada passo.'
  },
  {
    slug: 'shay',
    name: 'Shay',
    subtitle: 'Ficha • História • Itens',
    cardBg: '/cards/shay.svg',
    blurb: 'Coragem sem pedir permissão.'
  },
  {
    slug: 'shinno',
    name: 'Shinno',
    subtitle: 'Ficha • História • Itens',
    cardBg: '/cards/shinno.svg',
    blurb: 'Silêncio, foco, impacto.'
  },
  {
    slug: 'lucio',
    name: 'Lúcio',
    subtitle: 'Ficha • História • Itens',
    cardBg: '/cards/lucio.svg',
    blurb: 'Uma chama que não apaga.'
  },
  {
    slug: 'mestre',
    name: 'Mestre',
    subtitle: 'Acesso restrito',
    cardBg: '/cards/mestre.svg',
    blurb: 'Segredos da mesa. Senha necessária.'
  }
];

export const getCharacter = (slug) => CHARACTERS.find(c => c.slug === slug);

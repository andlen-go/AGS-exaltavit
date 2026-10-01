export type ProductVariant = {
  id: string
  label: string
}

export type Product = {
  id: string
  name: string
  pricePhp: number
  description: string
  /** Prefer separate color + size selects when both are present */
  colors?: ProductVariant[]
  sizes?: ProductVariant[]
  variants: ProductVariant[]
  preorderEnabled: boolean
  featured?: boolean
  imageSrc?: string
  imageAlt?: string
}

export type SponsorOpportunity = {
  id: string
  title: string
  summary: string
}

/** Named partner/sponsor entry. Set sample: true for demo placeholders. */
export type NamedSponsor = {
  name: string
  note?: string
  /** Logo under public/ (square works best) — individuals fall back to an initials badge */
  logoSrc?: string
  /** Short feature write-up shown in Acknowledgments */
  blurb?: string
  /** Fictitious demo entry — replace with a confirmed partner */
  sample?: boolean
}

export type RepertoireItem = {
  title: string
  composer?: string
  highlight?: boolean
  /** Draft program blurb — content placeholder, not official AGS notes */
  blurb?: string
}

export type VoiceRole = 'singer' | 'conductor' | 'accompanist' | 'production'

export type VoiceSection = 'soprano' | 'alto' | 'tenor' | 'bass'

export type Voice = {
  slug: string
  name: string
  role: VoiceRole
  /** SATB section for singers; omit for leadership/production */
  section?: VoiceSection
  roleLabel?: string
  bio?: string
  portraitSrc?: string
  portraitAlt?: string
  /** Fictitious demo name — replace with confirmed roster */
  sample?: boolean
}

export type PreviewVideo = {
  id: string
  title: string
  url: string
  posterSrc?: string
  primary?: boolean
  pastPerformance?: boolean
}

export type MediaSlot = {
  src?: string
  alt: string
  label: string
  credit?: string
}

export type EventConfig = {
  title: string
  subtitle: string
  organizer: string
  dateIso: string
  dateLabel: string
  timezone: string
  venue: string
  venueCity: string
  timeLabel: string | null
  facebookUrl: string
  organizerEmail: string
  siteUrl: string
  mapUrl: string
  privacyContact: string
  surplusCopy: string
  pickupCopy: string
  orderDeadlineCopy: string
  sizeChartReady: boolean
  dedication: {
    title: string
    lead: string
    body: string
  }
  patronageLead: string
  patronageValuePoints: string[]
  suggestedAmountsPhp: number[]
  /** Confirmed RSVPs tallied by the organizer from the inbox — update as confirmations arrive. */
  rsvpTally: {
    guests: number
    confirmations: number
    updatedLabel: string
  }
  gcash: {
    accountName: string
    accountNumber: string
    qrImagePath: string
  }
  budget: {
    goalPhp: number | null
    raisedPhp: number | null
    note: string
    updatedAt?: string
  }
  products: Product[]
  sponsorOpportunities: SponsorOpportunity[]
  /** @deprecated Prefer majorPartners / organizationSponsors / individualSponsors */
  thankYouList: { name: string; note?: string }[]
  /** Fictitious major partners shown at page top — replace in config when confirmed */
  majorPartners: NamedSponsor[]
  organizationSponsors: NamedSponsor[]
  individualSponsors: NamedSponsor[]
  voicesIntro: string
  voicesSampleNote: string
  voices: Voice[]
  repertoireIntro: string
  repertoire: RepertoireItem[]
  previewVideos: PreviewVideo[]
  media: {
    hero: MediaSlot
    ensemble: MediaSlot
    patroness: MediaSlot
  }
}

const envSiteUrl = import.meta.env.VITE_SITE_URL?.trim() ?? ''

/** Demo-only sample singers — replace with confirmed names before publishing as final. */
const sampleSopranos: Voice[] = [
  { slug: 'mira-santos', name: 'Mira Santos', role: 'singer', section: 'soprano', sample: true },
  { slug: 'elena-cruz', name: 'Elena Cruz', role: 'singer', section: 'soprano', sample: true },
  { slug: 'isabelle-reyes', name: 'Isabelle Reyes', role: 'singer', section: 'soprano', sample: true },
  { slug: 'camille-torres', name: 'Camille Torres', role: 'singer', section: 'soprano', sample: true },
  { slug: 'sofia-lim', name: 'Sofia Lim', role: 'singer', section: 'soprano', sample: true },
  { slug: 'andrea-navarro', name: 'Andrea Navarro', role: 'singer', section: 'soprano', sample: true },
  { slug: 'patricia-gomez', name: 'Patricia Gomez', role: 'singer', section: 'soprano', sample: true },
  { slug: 'diana-flores', name: 'Diana Flores', role: 'singer', section: 'soprano', sample: true },
]

const sampleAltos: Voice[] = [
  { slug: 'claire-mendoza', name: 'Claire Mendoza', role: 'singer', section: 'alto', sample: true },
  { slug: 'rachel-villanueva', name: 'Rachel Villanueva', role: 'singer', section: 'alto', sample: true },
  { slug: 'julia-ramos', name: 'Julia Ramos', role: 'singer', section: 'alto', sample: true },
  { slug: 'nina-aquino', name: 'Nina Aquino', role: 'singer', section: 'alto', sample: true },
  { slug: 'grace-castillo', name: 'Grace Castillo', role: 'singer', section: 'alto', sample: true },
  { slug: 'andrea-pascual', name: 'Andrea Pascual', role: 'singer', section: 'alto', sample: true },
  { slug: 'lia-fernandez', name: 'Lia Fernandez', role: 'singer', section: 'alto', sample: true },
  { slug: 'monica-delacruz', name: 'Monica Dela Cruz', role: 'singer', section: 'alto', sample: true },
]

const sampleTenors: Voice[] = [
  { slug: 'marco-diaz', name: 'Marco Diaz', role: 'singer', section: 'tenor', sample: true },
  { slug: 'ethan-lopez', name: 'Ethan Lopez', role: 'singer', section: 'tenor', sample: true },
  { slug: 'gabriel-santos', name: 'Gabriel Santos', role: 'singer', section: 'tenor', sample: true },
  { slug: 'lucas-reyes', name: 'Lucas Reyes', role: 'singer', section: 'tenor', sample: true },
  { slug: 'adrian-torres', name: 'Adrian Torres', role: 'singer', section: 'tenor', sample: true },
  { slug: 'noah-garcia', name: 'Noah Garcia', role: 'singer', section: 'tenor', sample: true },
  { slug: 'julian-ramos', name: 'Julian Ramos', role: 'singer', section: 'tenor', sample: true },
]

const sampleBasses: Voice[] = [
  { slug: 'daniel-cruz', name: 'Daniel Cruz', role: 'singer', section: 'bass', sample: true },
  { slug: 'miguel-santos', name: 'Miguel Santos', role: 'singer', section: 'bass', sample: true },
  { slug: 'carlo-mendoza', name: 'Carlo Mendoza', role: 'singer', section: 'bass', sample: true },
  { slug: 'rafael-lim', name: 'Rafael Lim', role: 'singer', section: 'bass', sample: true },
  { slug: 'andre-villanueva', name: 'Andre Villanueva', role: 'singer', section: 'bass', sample: true },
  { slug: 'benedicto-reyes', name: 'Benedicto Reyes', role: 'singer', section: 'bass', sample: true },
  { slug: 'samuel-torres', name: 'Samuel Torres', role: 'singer', section: 'bass', sample: true },
]

const sampleLeadership: Voice[] = [
  {
    slug: 'conductor-placeholder',
    name: 'Conductor TBA',
    role: 'conductor',
    roleLabel: 'Conductor',
    bio: 'Sample leadership slot — replace with the confirmed conductor.',
    sample: true,
  },
  {
    slug: 'accompanist-placeholder',
    name: 'Accompanist TBA',
    role: 'accompanist',
    roleLabel: 'Accompanist',
    bio: 'Sample leadership slot — replace with the confirmed accompanist.',
    sample: true,
  },
]

const sampleProduction: Voice[] = [
  {
    slug: 'stage-manager',
    name: 'Lorenzo Habito',
    role: 'production',
    roleLabel: 'Stage manager',
    sample: true,
  },
  {
    slug: 'production-lead',
    name: 'Ava Santiago',
    role: 'production',
    roleLabel: 'Production lead',
    sample: true,
  },
  {
    slug: 'hospitality-lead',
    name: 'Bea Morales',
    role: 'production',
    roleLabel: 'Hospitality',
    sample: true,
  },
  {
    slug: 'tech-liaison',
    name: 'Ivan Cordero',
    role: 'production',
    roleLabel: 'Tech liaison',
    sample: true,
  },
  {
    slug: 'front-of-house',
    name: 'Kara Uy',
    role: 'production',
    roleLabel: 'Front of house',
    sample: true,
  },
]

export const eventConfig: EventConfig = {
  title: 'Exaltavit',
  subtitle: 'A choral concert',
  organizer: 'Avant Garde Singers',
  dateIso: '2026-10-17',
  dateLabel: 'October 17, 2026',
  timezone: 'Asia/Manila',
  venue: 'National Shrine and Parish of Our Lady of Aranzazu',
  venueCity: 'San Mateo, Rizal',
  timeLabel: null,
  facebookUrl: 'https://www.facebook.com/AGSingers',
  organizerEmail: 'avantgardesingers@gmail.com',
  siteUrl: envSiteUrl || 'https://exaltavit.netlify.app',
  mapUrl: '',
  privacyContact: 'avantgardesingers@gmail.com',
  surplusCopy:
    'Any surplus after production and hospitality needs will support future Avant Garde Singers community programs.',
  pickupCopy:
    'Pickup details will be confirmed by email before the concert. Exact schedule and location are still being finalized.',
  orderDeadlineCopy: 'Pre-order deadline will be announced soon. Order early so we can confirm sizes and pickup.',
  sizeChartReady: false,
  dedication: {
    title: 'Dedication to Nuestra Señora de Aranzazu',
    lead: 'Offered in honor of Our Lady of Aranzazu, patroness of San Mateo.',
    body: 'Exaltavit gathers sacred and choral song beneath the shrine that bears her name — a night of praise, thanksgiving, and welcome for the parish and the wider community.',
  },
  patronageLead:
    'Your patronage sustains a free evening of sacred song — the production essentials that shape the experience, and the hospitality that lets artists give their best. Partners who wish to underwrite a need are warmly invited.',
  patronageValuePoints: [
    'Sustain free admission so the parish and community can gather without a ticket barrier.',
    'Underwrite production essentials — print, tech, and the quiet costs of a polished concert.',
    'Support hospitality that lets singers and crew arrive ready to give their best.',
  ],
  suggestedAmountsPhp: [100, 250, 500, 1000],
  rsvpTally: {
    guests: 128,
    confirmations: 47,
    updatedLabel: 'Sample count — update in config',
  },
  gcash: {
    accountName: '',
    accountNumber: '',
    qrImagePath: '',
  },
  budget: {
    goalPhp: null,
    raisedPhp: null,
    note: 'Verified totals will appear when the organizer publishes them.',
  },
  products: [
    {
      id: 'shirt',
      name: 'Concert Shirt',
      pricePhp: 400,
      description: 'Ivory or navy tee with gold Exaltavit mark on the front and vine artwork on the back.',
      featured: true,
      colors: [
        { id: 'ivory', label: 'Ivory' },
        { id: 'navy', label: 'Navy' },
      ],
      sizes: [
        { id: 's', label: 'S' },
        { id: 'm', label: 'M' },
        { id: 'l', label: 'L' },
        { id: 'xl', label: 'XL' },
      ],
      variants: [
        { id: 'shirt-ivory-s', label: 'Ivory / S' },
        { id: 'shirt-ivory-m', label: 'Ivory / M' },
        { id: 'shirt-ivory-l', label: 'Ivory / L' },
        { id: 'shirt-ivory-xl', label: 'Ivory / XL' },
        { id: 'shirt-navy-s', label: 'Navy / S' },
        { id: 'shirt-navy-m', label: 'Navy / M' },
        { id: 'shirt-navy-l', label: 'Navy / L' },
        { id: 'shirt-navy-xl', label: 'Navy / XL' },
      ],
      preorderEnabled: true,
      imageSrc: '/exaltavit-artwork-1.png',
      imageAlt: 'Exaltavit concert shirt artwork preview',
    },
    {
      id: 'tote',
      name: 'Tote Bag',
      pricePhp: 180,
      description: 'Carry the concert identity — thorn, rose, apple, and star on ivory or navy canvas.',
      featured: true,
      colors: [
        { id: 'ivory', label: 'Ivory' },
        { id: 'navy', label: 'Navy' },
      ],
      variants: [
        { id: 'tote-ivory', label: 'Ivory' },
        { id: 'tote-navy', label: 'Navy' },
      ],
      preorderEnabled: true,
      imageSrc: '/exaltavit-artwork-1.png',
      imageAlt: 'Exaltavit tote bag artwork preview',
    },
    {
      id: 'enamel',
      name: 'Enamel Pin',
      pricePhp: 50,
      description: 'Gold-rimmed enamel pins: logo, thorn, apple, star, or rose.',
      variants: [
        { id: 'enamel-logo', label: 'Logo' },
        { id: 'enamel-thorn', label: 'Thorn' },
        { id: 'enamel-apple', label: 'Apple' },
        { id: 'enamel-star', label: 'Star' },
        { id: 'enamel-rose', label: 'Rose' },
      ],
      preorderEnabled: true,
      imageSrc: '/exaltavit-artwork-1.png',
      imageAlt: 'Exaltavit enamel pin artwork preview',
    },
    {
      id: 'button',
      name: 'Button Pin',
      pricePhp: 40,
      description: 'Circular button pins in ivory logo or navy rose-and-star designs.',
      variants: [
        { id: 'button-ivory', label: 'Ivory logo' },
        { id: 'button-navy', label: 'Navy rose & star' },
      ],
      preorderEnabled: true,
      imageSrc: '/exaltavit-artwork-2.png',
      imageAlt: 'Exaltavit button pin artwork preview',
    },
    {
      id: 'keychain',
      name: 'Keychain',
      pricePhp: 75,
      description: 'Charm pair: motif + Exaltavit tag in navy/gold or ivory/navy.',
      variants: [
        { id: 'key-logo', label: 'Logo' },
        { id: 'key-thorn', label: 'Thorn' },
        { id: 'key-rose', label: 'Rose' },
        { id: 'key-apple', label: 'Apple' },
        { id: 'key-star', label: 'Star' },
      ],
      preorderEnabled: true,
      imageSrc: '/exaltavit-artwork-1.png',
      imageAlt: 'Exaltavit keychain artwork preview',
    },
  ],
  sponsorOpportunities: [
    {
      id: 'hospitality',
      title: 'Hospitality partner',
      summary: 'Help underwrite concert-day hospitality so artists can give their best.',
    },
    {
      id: 'print',
      title: 'Print & program',
      summary: 'Support programs, signage, or printed keepsakes.',
    },
    {
      id: 'production',
      title: 'Production support',
      summary: 'Help with venue logistics, tech, or production essentials.',
    },
    {
      id: 'inkind',
      title: 'In-kind partner',
      summary: 'Offer goods or services that reduce out-of-pocket costs.',
    },
  ],
  thankYouList: [],
  // DEMO PARTNERS — fictitious placeholders for layout; replace with confirmed names.
  majorPartners: [
    {
      name: 'San Mateo Community Trust',
      note: 'Major partner (sample)',
      logoSrc: '/sponsors/san-mateo-community-trust.svg',
      blurb:
        'A local trust investing in shared spaces and gatherings across San Mateo — underwriting free admission so every family can attend.',
      sample: true,
    },
    {
      name: 'Aranzazu Heritage Circle',
      note: 'Major partner (sample)',
      logoSrc: '/sponsors/aranzazu-heritage-circle.svg',
      blurb:
        'Stewards of the shrine’s history and devotions, helping bring sacred music back beneath the patroness’s roof.',
      sample: true,
    },
  ],
  organizationSponsors: [
    {
      name: 'Rizal Arts Collective',
      note: 'Organization sponsor (sample)',
      logoSrc: '/sponsors/rizal-arts-collective.svg',
      blurb: 'Artists and designers from across Rizal supporting the concert’s print and visual identity.',
      sample: true,
    },
    {
      name: 'Parish Friends of Music',
      note: 'Organization sponsor (sample)',
      logoSrc: '/sponsors/parish-friends-of-music.svg',
      blurb: 'Parish volunteers who keep liturgical and choral music thriving — supporting rehearsal hospitality.',
      sample: true,
    },
    {
      name: 'East Valley Cultural Guild',
      note: 'Organization sponsor (sample)',
      logoSrc: '/sponsors/east-valley-cultural-guild.svg',
      blurb: 'A guild of local businesses championing culture in the valley — helping with venue logistics and tech.',
      sample: true,
    },
  ],
  individualSponsors: [
    {
      name: 'A. Mendoza',
      note: 'Individual sponsor (sample)',
      blurb: 'A longtime parishioner sponsoring refreshments for singers and crew.',
      sample: true,
    },
    {
      name: 'The Ramos Family',
      note: 'Individual sponsor (sample)',
      blurb: 'Supporting printed programs in memory of a beloved choir member.',
      sample: true,
    },
    {
      name: 'C. Villanueva',
      note: 'Individual sponsor (sample)',
      blurb: 'A music teacher helping open the evening to young singers and students.',
      sample: true,
    },
    {
      name: 'Anonymous friend of the choir',
      note: 'Individual sponsor (sample)',
      blurb: 'A quiet gift toward production essentials — with gratitude.',
      sample: true,
    },
  ],
  voicesIntro:
    'The Voices of Exaltavit — singers, conductor, accompanists, and the people behind the performance.',
  voicesSampleNote: 'Sample roster — replace with confirmed names.',
  voices: [
    ...sampleLeadership,
    ...sampleSopranos,
    ...sampleAltos,
    ...sampleTenors,
    ...sampleBasses,
    ...sampleProduction,
  ],
  repertoireIntro:
    'An evening in song — sacred and choral works gathered for this free concert. Short blurbs below are draft placeholders, not official program notes.',
  repertoire: [
    {
      title: 'Silence My Soul',
      highlight: true,
      blurb:
        'A quiet invitation inward — stillness as the first gesture of praise. Draft blurb; composer TBA.',
    },
    {
      title: 'On This Day',
      highlight: true,
      blurb:
        'A celebration of the present hour: thanksgiving for gathering, listening, and shared song. Draft blurb; composer TBA.',
    },
    {
      title: 'Awake My Soul',
      blurb:
        'A call to rise and sing — the soul stirred toward light, courage, and worship. Draft blurb; composer TBA.',
    },
    {
      title: 'Great God Almighty',
      highlight: true,
      blurb:
        'Powerful sacred praise naming God as mighty and near. Draft blurb; composer TBA.',
    },
    {
      title: 'Ukrainian Alleluia',
      composer: 'Craig Courtney',
      blurb:
        'A quiet voice of faith, praise, and hope amid suffering — Alleluia as perseverance. Draft program framing.',
    },
    {
      title: 'Wonderfully Made',
      blurb:
        'Wonder at being created and known — gratitude sung in gentle choral color. Draft blurb; composer TBA.',
    },
    {
      title: 'Shelter of Shalom',
      blurb:
        'Peace as shelter: a prayer for wholeness, rest, and communal blessing. Draft blurb; composer TBA.',
    },
    {
      title: 'No Mount Too High',
      blurb:
        'Faith that climbs — resolve and trust when the path rises steep. Draft blurb; composer TBA.',
    },
    {
      title: 'Ave Maria',
      highlight: true,
      blurb:
        'Marian devotion in song — a classic prayer of greeting and petition. Draft blurb; setting TBA.',
    },
    {
      title: 'Birhen ng Aranzazu',
      highlight: true,
      blurb:
        'Local Marian hymn honoring Our Lady of Aranzazu, patroness of San Mateo. Draft blurb; composer TBA.',
    },
  ],
  previewVideos: [],
  media: {
    hero: {
      // Temporary venue atmosphere (Wikimedia CC BY-SA 4.0) until a choir performance original is supplied.
      src: '/media/shrine-facade.jpg',
      alt: 'National Shrine and Parish of Our Lady of Aranzazu, San Mateo, Rizal',
      label: 'Venue exterior — temporary hero; replace with choir performance photo',
      credit: 'Photo: Ralff Nestor Nacor / Wikimedia Commons (CC BY-SA 4.0)',
    },
    ensemble: {
      alt: 'Avant Garde Singers ensemble',
      label: 'Ensemble photo — awaiting organizer original',
    },
    patroness: {
      src: '/media/patroness-aranzazu.jpg',
      alt: 'Original image of Our Lady of Aranzazu at the main altar, San Mateo',
      label: 'Patroness image — Wikimedia Commons (CC BY-SA 4.0)',
      credit: 'Photo: Alamat123456 / Wikimedia Commons (CC BY-SA 4.0)',
    },
  },
}

export function formatPhp(amount: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function getTimeDisplay(config: EventConfig = eventConfig): string {
  return config.timeLabel?.trim() || 'Time to be announced'
}

export function isGCashReady(config: EventConfig = eventConfig): boolean {
  return Boolean(
    config.gcash.accountName.trim() &&
      config.gcash.accountNumber.trim() &&
      config.gcash.qrImagePath.trim(),
  )
}

export function isMapReady(config: EventConfig = eventConfig): boolean {
  return Boolean(config.mapUrl.trim())
}

export function isProgressReady(config: EventConfig = eventConfig): boolean {
  return config.budget.goalPhp != null && config.budget.raisedPhp != null
}

export function getOrderableProducts(config: EventConfig = eventConfig): Product[] {
  return config.products.filter((product) => product.preorderEnabled && product.variants.length > 0)
}

export function getFeaturedProducts(config: EventConfig = eventConfig): Product[] {
  return getOrderableProducts(config).filter((product) => product.featured)
}

export function getAccessoryProducts(config: EventConfig = eventConfig): Product[] {
  return getOrderableProducts(config).filter((product) => !product.featured)
}

export function isMerchReady(config: EventConfig = eventConfig): boolean {
  return getOrderableProducts(config).length > 0
}

export function isOrganizerEmailReady(config: EventConfig = eventConfig): boolean {
  const email = config.organizerEmail.trim()
  return Boolean(email) && !email.endsWith('@example.com')
}

export function getShareUrl(config: EventConfig = eventConfig): string {
  if (config.siteUrl.trim()) return config.siteUrl.trim()
  if (typeof window !== 'undefined') return window.location.href.split('#')[0]
  return ''
}

export function getShareText(config: EventConfig = eventConfig): string {
  return `${config.title} — a free choral concert by ${config.organizer} on ${config.dateLabel} at the ${config.venue}, ${config.venueCity}. Join us!`
}

export function getHighlightRepertoire(config: EventConfig = eventConfig): RepertoireItem[] {
  const highlights = config.repertoire.filter((item) => item.highlight)
  return highlights.length > 0 ? highlights : config.repertoire.slice(0, 4)
}

export function getPrimaryPreview(config: EventConfig = eventConfig): PreviewVideo | undefined {
  return config.previewVideos.find((video) => video.primary && video.url.trim()) ?? config.previewVideos.find((video) => video.url.trim())
}

export function hasPreviewVideos(config: EventConfig = eventConfig): boolean {
  return config.previewVideos.some((video) => video.url.trim())
}

export function voiceAnchorId(slug: string): string {
  return `voice-${slug}`
}

export function hasMajorPartners(config: EventConfig = eventConfig): boolean {
  return config.majorPartners.length > 0
}

export function hasAcknowledgments(config: EventConfig = eventConfig): boolean {
  return (
    config.majorPartners.length > 0 ||
    config.organizationSponsors.length > 0 ||
    config.individualSponsors.length > 0 ||
    config.thankYouList.length > 0
  )
}

export function resolveVariantId(
  product: Product,
  colorId?: string,
  sizeId?: string,
): string {
  if (product.colors?.length && product.sizes?.length) {
    const color = colorId ?? product.colors[0]?.id
    const size = sizeId ?? product.sizes[0]?.id
    const match = product.variants.find((variant) => variant.id === `${product.id}-${color}-${size}`)
    return match?.id ?? product.variants[0]?.id ?? ''
  }
  if (product.colors?.length && !product.sizes?.length) {
    const color = colorId ?? product.colors[0]?.id
    const match = product.variants.find((variant) => variant.id === `${product.id}-${color}` || variant.id.endsWith(`-${color}`))
    return match?.id ?? product.variants[0]?.id ?? ''
  }
  return product.variants[0]?.id ?? ''
}

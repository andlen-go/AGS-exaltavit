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

export type ThankYouEntry = {
  name: string
  note?: string
}

export type RepertoireItem = {
  title: string
  composer?: string
  highlight?: boolean
}

export type VoiceRole = 'singer' | 'conductor' | 'accompanist' | 'production'

export type Voice = {
  slug: string
  name: string
  role: VoiceRole
  roleLabel?: string
  bio?: string
  portraitSrc?: string
  portraitAlt?: string
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
  suggestedAmountsPhp: number[]
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
  thankYouList: ThankYouEntry[]
  voicesIntro: string
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
    'Any surplus after concert meals and production needs will support future Avant Garde Singers community programs.',
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
    'Be part of Exaltavit. Your gift helps cover concert-day hospitality — including shared meals for the choir and crew — along with print, production, and the quiet costs that keep a free concert possible. Partners who wish to underwrite a need are warmly invited.',
  suggestedAmountsPhp: [100, 250, 500, 1000],
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
      summary: 'Help underwrite concert-day hospitality for singers and crew.',
    },
    {
      id: 'print',
      title: 'Print & program',
      summary: 'Support programs, signage, or printed keepsakes.',
    },
    {
      id: 'production',
      title: 'Production support',
      summary: 'Help with venue logistics, tech, or hospitality needs.',
    },
    {
      id: 'inkind',
      title: 'In-kind partner',
      summary: 'Offer goods or services that reduce out-of-pocket costs.',
    },
  ],
  thankYouList: [],
  voicesIntro:
    'The Voices of Exaltavit — singers, conductor, accompanists, and the people behind the performance. Portraits and bios will fill in as the roster is confirmed.',
  voices: [],
  repertoireIntro: 'An evening in song — sacred and choral works gathered for this free concert.',
  repertoire: [
    { title: 'Silence My Soul', highlight: true },
    { title: 'On This Day', highlight: true },
    { title: 'Awake My Soul' },
    { title: 'Great God Almighty', highlight: true },
    { title: 'Ukrainian Alleluia' },
    { title: 'Wonderfully Made' },
    { title: 'Shelter of Shalom' },
    { title: 'No Mount Too High' },
    { title: 'Ave Maria', highlight: true },
    { title: 'Birhen ng Aranzazu', highlight: true },
  ],
  previewVideos: [],
  media: {
    hero: {
      alt: 'Choir performance photo for Exaltavit',
      label: 'Hero performance photo — awaiting organizer original',
    },
    ensemble: {
      alt: 'Avant Garde Singers ensemble',
      label: 'Ensemble photo — awaiting organizer original',
    },
    patroness: {
      alt: 'Nuestra Señora de Aranzazu',
      label: 'Patroness image — awaiting organizer original',
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

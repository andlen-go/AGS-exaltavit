export type ProductVariant = {
  id: string
  label: string
}

export type Product = {
  id: string
  name: string
  pricePhp: number
  description: string
  variants: ProductVariant[]
  preorderEnabled: boolean
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
  sizeChartReady: boolean
  mealAppeal: string
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
  }
  products: Product[]
  sponsorOpportunities: SponsorOpportunity[]
  thankYouList: ThankYouEntry[]
  choirIntro: string
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
  organizerEmail: 'avantgardesingers@example.com',
  siteUrl: envSiteUrl,
  mapUrl: '',
  privacyContact: 'avantgardesingers@example.com',
  surplusCopy:
    'Any surplus after concert meals and production needs will support future Avant Garde Singers community programs.',
  pickupCopy:
    'Pickup details will be confirmed by email before the concert. Exact schedule and location are still being finalized.',
  sizeChartReady: false,
  mealAppeal:
    'Help us feed the choir and production team on concert day. Your gift covers shared meals so singers can focus on the music.',
  suggestedAmountsPhp: [100, 250, 500, 1000],
  gcash: {
    accountName: '',
    accountNumber: '',
    qrImagePath: '',
  },
  budget: {
    goalPhp: null,
    raisedPhp: null,
    note: 'Progress totals will appear here once the organizer publishes verified figures.',
  },
  products: [
    {
      id: 'shirt',
      name: 'Concert Shirt',
      pricePhp: 400,
      description: 'Ivory or navy tee with gold Exaltavit mark on the front and vine artwork on the back.',
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
    },
  ],
  sponsorOpportunities: [
    {
      id: 'meal',
      title: 'Meal sponsor',
      summary: 'Underwrite choir and crew meals for concert day.',
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
  choirIntro:
    'Avant Garde Singers is preparing Exaltavit as a night of sacred and choral music offered freely to the community. A fuller choir story and photos will appear here before launch.',
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

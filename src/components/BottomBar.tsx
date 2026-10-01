type Props = {
  hidden?: boolean
}

const items = [
  { href: '#support', label: 'Support' },
  { href: '#merchandise', label: 'Merch' },
  { href: '#attend', label: 'Attend' },
]

export function BottomBar({ hidden = false }: Props) {
  if (hidden) return null

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-navy/10 bg-ivory/95 backdrop-blur-md md:hidden"
      aria-label="Mobile sections"
    >
      <ul className="safe-pb grid grid-cols-3 gap-1 px-2 pt-2">
        {items.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              className="flex items-center justify-center rounded-sm px-2 py-2.5 text-sm font-semibold text-navy hover:bg-navy/5"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

import { useRef, useState } from 'react'
import { eventConfig, getHighlightRepertoire, type RepertoireItem } from '../config/event'
import { Button, Collapse, Section } from './ui'

function RepertoireRow({ item, number }: { item: RepertoireItem; number: number }) {
  return (
    <div className="flex items-baseline gap-4 border-b border-navy/10 py-4">
      <span className="w-8 shrink-0 font-display text-xl text-gold/80 tabular-nums">
        {String(number).padStart(2, '0')}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-display text-2xl text-navy sm:text-3xl">{item.title}</p>
        {item.composer?.trim() ? (
          <p className="mt-1 text-sm text-navy/60">{item.composer}</p>
        ) : (
          <p className="mt-1 text-sm text-navy/45">Composer to be announced</p>
        )}
        {item.blurb?.trim() ? (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-navy/70">
            {item.blurb}
            <span className="ml-2 text-[10px] font-semibold tracking-[0.14em] text-gold/80 uppercase">Draft</span>
          </p>
        ) : null}
      </div>
    </div>
  )
}

export function Repertoire() {
  const [expanded, setExpanded] = useState(false)
  const listRef = useRef<HTMLOListElement>(null)
  const highlights = new Set(getHighlightRepertoire())
  const hasMore = eventConfig.repertoire.length > highlights.size

  const rows = eventConfig.repertoire.map((item, index) => {
    const isHighlight = highlights.has(item)
    const number = expanded
      ? index + 1
      : eventConfig.repertoire.slice(0, index + 1).filter((entry) => highlights.has(entry)).length || 1
    return { item, isHighlight, number }
  })

  function toggle() {
    const collapsing = expanded
    setExpanded(!expanded)
    const top = listRef.current?.getBoundingClientRect().top ?? 0
    if (collapsing && top < 0) listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <Section
      id="repertoire"
      eyebrow="The Repertoire"
      title="An Evening in Song"
      lead={eventConfig.repertoireIntro}
    >
      <ol ref={listRef} className="scroll-mt-40 -mt-4">
        {rows.map(({ item, isHighlight, number }) =>
          isHighlight ? (
            <li key={item.title}>
              <RepertoireRow item={item} number={number} />
            </li>
          ) : (
            <Collapse key={item.title} as="li" open={expanded}>
              <RepertoireRow item={item} number={number} />
            </Collapse>
          ),
        )}
      </ol>

      {hasMore ? (
        <div className="mt-8">
          <Button type="button" variant="secondary" onClick={toggle} aria-expanded={expanded}>
            {expanded ? 'Show highlights only' : `View the full repertoire (${eventConfig.repertoire.length})`}
          </Button>
        </div>
      ) : null}
    </Section>
  )
}

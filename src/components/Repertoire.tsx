import { useState } from 'react'
import { eventConfig, getHighlightRepertoire } from '../config/event'
import { Button, Section } from './ui'

export function Repertoire() {
  const [expanded, setExpanded] = useState(false)
  const highlights = getHighlightRepertoire()
  const list = expanded ? eventConfig.repertoire : highlights

  return (
    <Section
      id="repertoire"
      eyebrow="The Repertoire"
      title="An Evening in Song"
      lead={eventConfig.repertoireIntro}
    >
      <ol className="space-y-4">
        {list.map((item, index) => (
          <li
            key={item.title}
            className="flex items-baseline gap-4 border-b border-navy/10 pb-4 last:border-0"
          >
            <span className="w-8 shrink-0 font-display text-xl text-gold/80">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-2xl text-navy sm:text-3xl">{item.title}</p>
              {item.composer?.trim() ? (
                <p className="mt-1 text-sm text-navy/60">{item.composer}</p>
              ) : (
                <p className="mt-1 text-sm text-navy/45">Composer to be announced</p>
              )}
            </div>
          </li>
        ))}
      </ol>

      {eventConfig.repertoire.length > highlights.length ? (
        <div className="mt-8">
          <Button type="button" variant="secondary" onClick={() => setExpanded((value) => !value)}>
            {expanded ? 'Show highlights' : 'View the full repertoire'}
          </Button>
        </div>
      ) : null}
    </Section>
  )
}

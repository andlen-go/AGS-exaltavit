import { useState } from 'react'
import { eventConfig, getPrimaryPreview, hasPreviewVideos } from '../config/event'
import { Section } from './ui'

function VideoCard({
  title,
  url,
  posterSrc,
  pastPerformance,
  large = false,
}: {
  title: string
  url: string
  posterSrc?: string
  pastPerformance?: boolean
  large?: boolean
}) {
  const [playing, setPlaying] = useState(false)
  const isYoutube = /youtu\.be|youtube\.com/.test(url)

  function youtubeEmbed(src: string): string {
    const idMatch = src.match(/(?:youtu\.be\/|v=|embed\/)([A-Za-z0-9_-]{6,})/)
    const id = idMatch?.[1]
    return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : src
  }

  return (
    <article className={large ? 'space-y-3' : 'space-y-2'}>
      <div className={`relative overflow-hidden bg-navy ${large ? 'aspect-video' : 'aspect-video'}`}>
        {playing ? (
          isYoutube ? (
            <iframe
              title={title}
              src={youtubeEmbed(url)}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video className="h-full w-full object-cover" src={url} controls autoPlay poster={posterSrc} />
          )
        ) : (
          <button
            type="button"
            className="group relative h-full w-full"
            onClick={() => setPlaying(true)}
            aria-label={`Play ${title}`}
          >
            {posterSrc ? (
              <img src={posterSrc} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-navy to-navy-soft">
                <span className="font-display text-2xl text-ivory/70">{title}</span>
              </div>
            )}
            <span className="absolute inset-0 bg-navy/25 transition group-hover:bg-navy/35" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-ivory/50 bg-navy/60 text-ivory backdrop-blur-sm">
                <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6 fill-current" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </span>
          </button>
        )}
      </div>
      <div>
        {pastPerformance ? (
          <p className="text-[11px] font-semibold tracking-[0.16em] text-gold uppercase">Past performance</p>
        ) : null}
        <h3 className={`font-display text-navy ${large ? 'text-2xl' : 'text-xl'}`}>{title}</h3>
      </div>
    </article>
  )
}

export function Preview() {
  if (!hasPreviewVideos()) return null

  const primary = getPrimaryPreview()
  const others = eventConfig.previewVideos.filter(
    (video) => video.url.trim() && video.id !== primary?.id,
  )

  return (
    <Section
      id="preview"
      eyebrow="Listen"
      title="Performance preview"
      lead="Hear the choir — then join us in the shrine on concert night."
      className="bg-ivory-deep/30"
    >
      {primary ? (
        <div className="space-y-4">
          <VideoCard
            title={primary.title}
            url={primary.url}
            posterSrc={primary.posterSrc}
            pastPerformance={primary.pastPerformance}
            large
          />
          <p className="text-base text-navy/75 sm:text-lg">
            Join us on {eventConfig.dateLabel.split(',')[0]}
          </p>
        </div>
      ) : null}

      {others.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {others.slice(0, 2).map((video) => (
            <VideoCard
              key={video.id}
              title={video.title}
              url={video.url}
              posterSrc={video.posterSrc}
              pastPerformance={video.pastPerformance}
            />
          ))}
        </div>
      ) : null}
    </Section>
  )
}

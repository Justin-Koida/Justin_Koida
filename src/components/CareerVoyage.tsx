import { useEffect, useRef, useState } from 'react'
import { site } from '../content/site'

const route = 'M 500 45 C 500 120 260 100 260 220 S 740 350 740 560 S 260 690 260 900 S 740 1030 740 1240 C 740 1380 500 1370 500 1450'

export default function CareerVoyage() {
  const map = useRef<HTMLDivElement>(null)
  const path = useRef<SVGPathElement>(null)
  const ship = useRef<SVGGElement>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const sailing = useRef(false)
  const travelFrame = useRef(0)
  const zoom = useRef<Animation | null>(null)
  const distance = useRef(0)
  const originScroll = useRef(0)
  const trigger = useRef<HTMLButtonElement | null>(null)
  const [travelling, setTravelling] = useState(false)
  const [selected, setSelected] = useState(0)
  const [previewDismissed, setPreviewDismissed] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    const update = () => {
      frame = 0
      if (sailing.current || !map.current || !path.current || !ship.current) return
      const rect = map.current.getBoundingClientRect()
      path.current.setAttribute('d', window.innerWidth <= 700 ? route.replaceAll('260', '360').replaceAll('740', '640') : route)
      const progress = media.matches ? 0 : Math.max(0, Math.min(1, (window.innerHeight * .32 - rect.top) / rect.height))
      // The route is monotonic in Y: match the ship's vertical position to the viewport.
      let low = 0
      let high = path.current.getTotalLength()
      const targetY = 45 + progress * 1405
      for (let i = 0; i < 16; i++) {
        const mid = (low + high) / 2
        if (path.current.getPointAtLength(mid).y < targetY) low = mid
        else high = mid
      }
      distance.current = (low + high) / 2
      const point = path.current.getPointAtLength(distance.current)
      ship.current.setAttribute('transform', `translate(${point.x} ${point.y}) scale(${1000 / rect.width} ${1500 / rect.height})`)
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    media.addEventListener('change', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      media.removeEventListener('change', schedule)
    }
  }, [])

  const entry = site.timeline[selected]
  const previousOverflow = useRef('')
  const restoreScroll = () => {
    zoom.current?.cancel()
    sailing.current = false
    setTravelling(false)
    document.body.style.overflow = previousOverflow.current
    window.scrollTo({ top: originScroll.current, behavior: 'instant' })
    trigger.current?.focus({ preventScroll: true })
  }

  useEffect(() => {
    const element = dialog.current
    const syncPage = () => {
      const match = window.location.hash.match(/^#experience-(\d+)$/)
      const index = match ? Number(match[1]) - 1 : -1
      if (index >= 0 && index < site.timeline.length) {
        setSelected(index)
        if (!element?.open) {
          if (!sailing.current) {
            previousOverflow.current = document.body.style.overflow
            originScroll.current = window.scrollY
          }
          element?.showModal()
          document.body.style.overflow = 'hidden'
          if (element) element.scrollTop = 0
        }
        zoom.current?.cancel()
        sailing.current = false
        setTravelling(false)
      } else if (element?.open) element.close()
    }
    syncPage()
    window.addEventListener('hashchange', syncPage)
    return () => {
      window.removeEventListener('hashchange', syncPage)
      cancelAnimationFrame(travelFrame.current)
      zoom.current?.cancel()
      if (sailing.current || element?.open) document.body.style.overflow = previousOverflow.current
    }
  }, [])

  function leaveIsland() {
    window.location.hash = 'experience'
  }

  async function enterIsland(index: number, button: HTMLButtonElement) {
    if (sailing.current || dialog.current?.open || !map.current || !path.current || !ship.current) return
    trigger.current = button
    originScroll.current = window.scrollY
    previousOverflow.current = document.body.style.overflow
    setSelected(index)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      window.location.hash = `experience-${index + 1}`
      return
    }
    sailing.current = true
    setTravelling(true)
    document.body.style.overflow = 'hidden'
    const mapElement = map.current
    const routeElement = path.current
    const shipElement = ship.current
    const rect = mapElement.getBoundingClientRect()
    const mapTop = rect.top + window.scrollY
    const targetY = 220 + index * 340
    let low = 0
    let high = routeElement.getTotalLength()
    for (let i = 0; i < 20; i++) {
      const middle = (low + high) / 2
      if (routeElement.getPointAtLength(middle).y < targetY) low = middle
      else high = middle
    }
    const end = (low + high) / 2
    const start = distance.current
    const started = performance.now()
    await new Promise<void>((resolve) => {
      const sail = (now: number) => {
        const progress = Math.min(1, (now - started) / 650)
        const eased = progress * progress * (3 - 2 * progress)
        const point = routeElement.getPointAtLength(start + (end - start) * eased)
        shipElement.setAttribute('transform', `translate(${point.x} ${point.y}) scale(${1000 / rect.width} ${1500 / rect.height})`)
        const camera = mapTop + point.y / 1500 * rect.height - window.innerHeight * .42
        window.scrollTo({ top: originScroll.current + (camera - originScroll.current) * eased, behavior: 'instant' })
        if (progress < 1) travelFrame.current = requestAnimationFrame(sail)
        else resolve()
      }
      travelFrame.current = requestAnimationFrame(sail)
    })
    const land = button.querySelector('.island-land')!.getBoundingClientRect()
    const currentRect = mapElement.getBoundingClientRect()
    mapElement.style.transformOrigin = `${land.left + land.width / 2 - currentRect.left}px ${land.top + land.height / 2 - currentRect.top}px`
    zoom.current = mapElement.animate([
      { transform: 'scale(1)', opacity: 1 },
      { transform: 'scale(3.5)', opacity: 0 },
    ], { duration: 420, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' })
    try { await zoom.current.finished } catch { return }
    window.location.hash = `experience-${index + 1}`
  }

  return <section id="experience" className={`voyage ${travelling ? 'is-travelling' : ''}`} aria-busy={travelling} aria-labelledby="voyage-title">
    <div className="voyage-heading">
      <div><p className="eyebrow">The grand line / Experience</p><h1 id="voyage-title">Every island.<br /><em>A new perspective.</em></h1></div>
      <div className="voyage-intro"><p>A voyage through my internships and research, from my most recent stop to where it began.</p><p className="map-instructions">Scroll to sail · Select an island to explore</p></div>
    </div>
    <div className="map" ref={map}>
      <div className="map-key" aria-hidden="true"><span>↓</span> MOST RECENT<br /><small>Follow the dotted course</small></div>
      <div className="compass" aria-hidden="true">N<span>✧</span>S</div>
      <svg className="voyage-route" viewBox="0 0 1000 1500" preserveAspectRatio="none" aria-hidden="true">
        <path ref={path} d={route} fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5 9" />
        <g ref={ship} transform="translate(500 45)" className="ship">
          <circle r="31" fill="#f8f1df" stroke="#284f56" strokeWidth="1.5" />
          <path d="M-20 10 H21 L12 20 H-10 Z" fill="#284f56" />
          <path d="M-2-24 V8 H-20 Z M3-19 L20 5 H3 Z" fill="#b65b40" />
          <path d="M0-25 V10" stroke="#284f56" strokeWidth="2" />
        </g>
      </svg>
      <ol className="islands">
        {site.timeline.map((item, index) => <li key={item.organization} className={`island-stop stop-${index}`}>
          <button className={`island ${previewDismissed ? 'preview-dismissed' : ''}`} aria-haspopup="dialog" onClick={(event) => void enterIsland(index, event.currentTarget)} aria-disabled={travelling} onMouseEnter={() => setPreviewDismissed(false)} onFocus={() => setPreviewDismissed(false)} onKeyDown={(event) => { if (event.key === 'Escape') setPreviewDismissed(true) }}>
            <span className="island-land" aria-hidden="true"><span className="island-number">0{index + 1}</span><span className="island-peak">△</span></span>
            <span className="island-label"><span className="entry-meta">{item.period}</span><strong>{item.organization}</strong><span className="island-role">{item.role}</span><span className="enter-label">Explore experience ↗</span></span>
            <span className="island-preview">{item.highlights[0]}</span>
          </button>
        </li>)}
      </ol>
      <p className="voyage-end"><span>✧</span> Where the voyage began</p>
    </div>
    <dialog ref={dialog} className="experience-dialog" aria-labelledby="experience-title" onClose={restoreScroll} onCancel={(event) => { event.preventDefault(); leaveIsland() }}>
      <div className="detail-nav"><span>{site.name} / Experience</span><button autoFocus onClick={leaveIsland}>← Back to the voyage</button></div>
      <div className="experience-content"><p className="eyebrow">Island 0{selected + 1} / {entry.period}</p><h2 id="experience-title">{entry.organization}</h2><p className="detail-role">{entry.role}</p><div className="detail-rule" /><h3>What I worked on</h3><ul>{entry.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul></div>
      <p className="detail-footer">THE GRAND LINE <span>0{selected + 1} / 0{site.timeline.length}</span></p>
    </dialog>
  </section>
}

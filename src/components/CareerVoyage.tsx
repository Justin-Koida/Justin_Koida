import { useEffect, useRef, useState } from 'react'
import { ShipArtwork, IslandArtwork, DockArtwork } from './VoyageArtwork'
import { site } from '../content/site'

// A dedicated channel separates sailing from island artwork and hover cards.
const route = 'M 500 65 C 470 120 470 170 480 220 S 530 440 520 560 S 470 780 480 900 S 530 1120 520 1240 C 520 1340 500 1380 500 1450'
const mobileRoute = 'M 170 65 C 160 120 160 170 170 220 S 180 440 170 560 S 160 780 170 900 S 180 1120 170 1240 C 170 1340 170 1380 170 1450'
const shipScale = () => window.innerWidth <= 800 ? .65 : 1

export default function CareerVoyage() {
  const map = useRef<HTMLDivElement>(null)
  const path = useRef<SVGPathElement>(null)
  const ship = useRef<SVGGElement>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const sailing = useRef(false)
  const travelFrame = useRef(0)
  const zoom = useRef<Animation | null>(null)
  const distance = useRef(0)
  const docked = useRef<{ x: number; y: number; routeX: number; distance: number; scroll: number } | null>(null)
  const scrollOffset = useRef(0)
  const pier = useRef<SVGGElement>(null)
  const [dockGeometry, setDockGeometry] = useState<{ x: number; y: number; dx: number; dy: number; sx: number; sy: number } | null>(null)
  const originScroll = useRef(0)
  const trigger = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null)
  const [travelling, setTravelling] = useState(false)
  const [selected, setSelected] = useState(0)
  const [previewDismissed, setPreviewDismissed] = useState(false)
  const [view, setView] = useState<'map' | 'list'>('map')

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    const update = () => {
      frame = 0
      if (sailing.current || docked.current || dialog.current?.open || !map.current || !path.current || !ship.current) return
      const rect = map.current.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      path.current.setAttribute('d', window.innerWidth <= 800 ? mobileRoute : route)
      const progress = media.matches ? 0 : Math.max(0, Math.min(1, (window.innerHeight * .32 - rect.top) / rect.height))
      // The route is monotonic in Y: match the ship's vertical position to the viewport.
      let low = 0
      let high = path.current.getTotalLength()
      const targetY = Math.max(65, Math.min(1450, 65 + progress * 1385 + scrollOffset.current))
      for (let i = 0; i < 16; i++) {
        const mid = (low + high) / 2
        if (path.current.getPointAtLength(mid).y < targetY) low = mid
        else high = mid
      }
      distance.current = (low + high) / 2
      const point = path.current.getPointAtLength(distance.current)
      ship.current.setAttribute('transform', `translate(${point.x} ${point.y}) scale(${shipScale() * 1000 / rect.width} ${shipScale() * 1500 / rect.height})`)
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
  }, [view])

  const entry = site.timeline[selected]
  const previousOverflow = useRef('')
  const restoreScroll = () => {
    zoom.current?.cancel()
    const trip = docked.current
    if (!trip || !map.current || !ship.current) {
      sailing.current = false
      setTravelling(false)
      document.body.style.overflow = previousOverflow.current
      window.scrollTo({ top: originScroll.current, behavior: 'instant' })
      trigger.current?.focus({ preventScroll: true })
      return
    }
    sailing.current = true
    setTravelling(true)
    window.scrollTo({ top: trip.scroll, behavior: 'instant' })
    const rect = map.current.getBoundingClientRect()
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const started = performance.now()
    const undock = (now: number) => {
      const progress = reduced ? 1 : Math.max(0, Math.min(1, (now - started - 200) / 700))
      const eased = progress * progress * (3 - 2 * progress)
      pier.current?.setAttribute('opacity', String(1 - eased))
      const x = trip.x + (trip.routeX - trip.x) * eased
      ship.current?.setAttribute('transform', `translate(${x} ${trip.y}) scale(${shipScale() * 1000 / rect.width} ${shipScale() * 1500 / rect.height})`)
      if (progress < 1) travelFrame.current = requestAnimationFrame(undock)
      else {
        distance.current = trip.distance
        const currentRect = map.current!.getBoundingClientRect()
        const scrollProgress = Math.max(0, Math.min(1, (window.innerHeight * .32 - currentRect.top) / currentRect.height))
        scrollOffset.current = trip.y - (65 + scrollProgress * 1385)
        docked.current = null
        setDockGeometry(null)
        sailing.current = false
        setTravelling(false)
        document.body.style.overflow = previousOverflow.current
        trigger.current?.focus({ preventScroll: true })
      }
    }
    travelFrame.current = requestAnimationFrame(undock)
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
    const islandBounds = button.getBoundingClientRect()
    const landBounds = button.querySelector('.island-land')!.getBoundingClientRect()
    // Approach through the clear channel, then dock outside the entire card/art envelope.
    const targetY = (landBounds.bottom - 28 - rect.top) / rect.height * 1500
    const docksOnRight = window.innerWidth > 800 && index % 2 === 0
    const clearance = 72 * shipScale() + 16
    const dockX = (docksOnRight
      ? Math.max(islandBounds.right, landBounds.right) - rect.left + clearance
      : Math.min(islandBounds.left, landBounds.left) - rect.left - clearance) / rect.width * 1000
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
        const progress = Math.min(1, (now - started) / 900)
        const eased = progress * progress * (3 - 2 * progress)
        const point = routeElement.getPointAtLength(start + (end - start) * eased)
        shipElement.setAttribute('transform', `translate(${point.x} ${point.y}) scale(${shipScale() * 1000 / rect.width} ${shipScale() * 1500 / rect.height})`)
        const camera = mapTop + point.y / 1500 * rect.height - window.innerHeight * .42
        window.scrollTo({ top: originScroll.current + (camera - originScroll.current) * eased, behavior: 'instant' })
        if (progress < 1) travelFrame.current = requestAnimationFrame(sail)
        else resolve()
      }
      travelFrame.current = requestAnimationFrame(sail)
    })
    const approach = routeElement.getPointAtLength(end)
    // Anchor within the painted beach, accounting for SVG contain/letterboxing.
    const artScale = Math.min(landBounds.width / 300, landBounds.height / 180)
    const beachX = landBounds.left + (landBounds.width - 300 * artScale) / 2 + (docksOnRight ? 244 : 56) * artScale
    const beachY = landBounds.top + (landBounds.height - 180 * artScale) / 2 + 130 * artScale
    const berthX = rect.left + dockX / 1000 * rect.width
    const berthY = rect.top + targetY / 1500 * rect.height + 36 * shipScale()
    setDockGeometry({ x: dockX, y: targetY + 36 * shipScale() / rect.height * 1500,
      dx: beachX - berthX, dy: beachY - berthY, sx: 1000 / rect.width, sy: 1500 / rect.height })
    pier.current?.setAttribute('opacity', '1')
    const dockingStarted = performance.now()
    await new Promise<void>((resolve) => {
      const dock = (now: number) => {
        const progress = Math.min(1, (now - dockingStarted) / 500)
        const eased = progress * progress * (3 - 2 * progress)
        const x = approach.x + (dockX - approach.x) * eased
        shipElement.setAttribute('transform', `translate(${x} ${targetY}) scale(${shipScale() * 1000 / rect.width} ${shipScale() * 1500 / rect.height})`)
        if (progress < 1) travelFrame.current = requestAnimationFrame(dock)
        else resolve()
      }
      travelFrame.current = requestAnimationFrame(dock)
    })
    distance.current = end
    docked.current = { x: dockX, y: targetY, routeX: approach.x, distance: end, scroll: window.scrollY }
    // Briefly hold at the dock; fading without zoom keeps the ship inside the viewport.
    zoom.current = mapElement.animate([{ opacity: 1 }, { opacity: 1 }, { opacity: .45 }],
      { duration: 350, fill: 'forwards' })
    try { await zoom.current.finished } catch { return }
    window.location.hash = `experience-${index + 1}`
  }

  return <section id="experience" className={`voyage ${travelling ? 'is-travelling' : ''}`} aria-busy={travelling} aria-labelledby="voyage-title">
    <div className="voyage-heading">
      <div><p className="eyebrow">Career voyage / Experience</p><h1 id="voyage-title">Every island.<br /><em>A new perspective.</em></h1></div>
      <div className="voyage-intro"><p>A voyage through my internships and research, from my most recent stop to where it began.</p><p className="map-instructions">Scroll to sail · Hover for a preview · Select to explore</p></div>
    </div>
    <div className="voyage-toolbar"><p>Four stops. A growing perspective.</p><div className="view-switch" role="group" aria-label="Experience view"><button disabled={travelling} aria-pressed={view === 'map'} onClick={() => setView('map')}>Explore map</button><button disabled={travelling} aria-pressed={view === 'list'} onClick={() => setView('list')}>Quick list</button></div></div>
    {view === 'list' && <ol className="experience-list">{site.timeline.map((item, index) => <li key={item.organization}><span className="list-number">0{index + 1}</span><div><p className="entry-meta">{item.period}</p><h2>{item.organization}</h2><p className="list-role">{item.role}</p><ul>{item.highlights.map(highlight => <li key={highlight}>{highlight}</li>)}</ul><a href={`#experience-${index + 1}`} onClick={(event) => { trigger.current = event.currentTarget; docked.current = null }}>Open experience ↗</a></div></li>)}</ol>}
    <div className="map" ref={map} hidden={view !== 'map'}>
      <div className="map-key" aria-hidden="true"><span>↓</span> MOST RECENT<br /><small>Follow the dotted course</small></div>
      <div className="compass" aria-hidden="true">N<span>✧</span>S</div>
      <svg className="voyage-route" viewBox="0 0 1000 1500" preserveAspectRatio="none" aria-hidden="true">
        <path ref={path} d={route} fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5 9" />
        <g ref={pier} className="island-quay" opacity="1">
          {dockGeometry && <g transform={`translate(${dockGeometry.x} ${dockGeometry.y}) scale(${dockGeometry.sx} ${dockGeometry.sy})`}><DockArtwork dx={dockGeometry.dx} dy={dockGeometry.dy} /></g>}
        </g>
        <g ref={ship} transform="translate(500 45)" className="ship">
          <ShipArtwork />
        </g>
      </svg>
      <ol className="islands">
        {site.timeline.map((item, index) => <li key={item.organization} className={`island-stop stop-${index}`}>
          <button className={`island ${previewDismissed ? 'preview-dismissed' : ''}`} onMouseEnter={() => setPreviewDismissed(false)} onFocus={() => setPreviewDismissed(false)} onKeyDown={(event) => { if (event.key === 'Escape') setPreviewDismissed(true) }} aria-haspopup="dialog" onClick={(event) => void enterIsland(index, event.currentTarget)} aria-disabled={travelling}>
            <span className="island-land" aria-hidden="true"><IslandArtwork variant={index} /><span className="island-number">0{index + 1}</span></span>
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
      <div className="experience-pagination"><button disabled={selected === 0} onClick={() => { window.location.hash = `experience-${selected}` }}>← Previous experience</button><button disabled={selected === site.timeline.length - 1} onClick={() => { window.location.hash = `experience-${selected + 2}` }}>Next experience →</button></div>
      <p className="detail-footer">CAREER VOYAGE <span>0{selected + 1} / 0{site.timeline.length}</span></p>
    </dialog>
  </section>
}

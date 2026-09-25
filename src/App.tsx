import { useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { site } from './content/site'

const tabs = [
  { id: 'about', label: 'About Me' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'work', label: 'Experience / Projects' },
] as const

export default function App() {
  const [active, setActive] = useState(0)
  const buttons = useRef<(HTMLButtonElement | null)[]>([])

  function navigateTabs(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length
    else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = tabs.length - 1
    else return
    event.preventDefault()
    setActive(next)
    buttons.current[next]?.focus()
  }

  return (
    <div className="page">
      <a className="skip-link" href="#main">Skip to content</a>
      <header>
        <p className="eyebrow">Personal portfolio</p>
        <h1>{site.name}</h1>
        <p className="intro">About me, my journey, and my work.</p>
      </header>
      <main id="main" tabIndex={-1}>
        <div className="tabs" role="tablist" aria-label="Portfolio sections">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              ref={(element) => { buttons.current[index] = element }}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-controls={`panel-${tab.id}`}
              aria-selected={active === index}
              tabIndex={active === index ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={(event) => navigateTabs(event, index)}
            >{tab.label}</button>
          ))}
        </div>
        {tabs.map((tab, index) => (
          <section
            key={tab.id}
            id={`panel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab.id}`}
            hidden={active !== index}
            tabIndex={0}
            className="panel"
          >
            <p className="eyebrow">{String(index + 1).padStart(2, '0')} / {tab.label}</p>
            <h2>{tab.label}</h2>
            {tab.id === 'about' && <p>{site.about}</p>}
            {tab.id === 'timeline' && <p>{site.timeline}</p>}
            {tab.id === 'work' && <div className="work-grid">
              <article><h3>Experience</h3><p>{site.experience}</p></article>
              <article><h3>Projects</h3><p>{site.projects}</p></article>
            </div>}
          </section>
        ))}
      </main>
      <footer>Portfolio in progress</footer>
    </div>
  )
}

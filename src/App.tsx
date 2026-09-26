import About from './components/About'
import { useEffect, useState } from 'react'
import Projects, { ProjectPage } from './components/Projects'
import { site } from './content/site'
import CareerVoyage from './components/CareerVoyage'

export default function App() {
  const [hash, setHash] = useState(window.location.hash)
  useEffect(() => {
    const navigate = () => setHash(window.location.hash)
    window.addEventListener('hashchange', navigate)
    return () => window.removeEventListener('hashchange', navigate)
  }, [])
  const project = site.projects.find(item => hash === `#project/${item.slug}`)
  useEffect(() => {
    if (['#projects', '#about', '#experience'].includes(hash)) {
      const section = document.getElementById(hash.slice(1))
      section?.scrollIntoView()
      if (hash === '#projects') section?.focus({ preventScroll: true })
    }
  }, [hash])
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header"><a className="wordmark" href="#experience">{site.name}<span> / Portfolio</span></a><nav aria-label="Main navigation"><a href="#experience">Experience</a><a href="#about">About</a><a href="#projects">Projects</a></nav></header>
    <main id="main" tabIndex={-1}>
      {project ? <ProjectPage project={project} /> : <>
      <CareerVoyage />
      <About />
      <Projects />
      </>}
    </main><footer className="site-footer">{site.name}<span>A voyage in progress.</span></footer>
  </>
}

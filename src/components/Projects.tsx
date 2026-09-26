import { useEffect, useRef } from 'react'
import { site } from '../content/site'

type Project = typeof site.projects[number]

function ImagePlaceholder() {
  return <div className="project-image-placeholder" aria-label="Project image placeholder"><span aria-hidden="true">＋</span><span>Project image</span><small>Coming into view</small></div>
}

export function ProjectPage({ project }: { project: Project }) {
  const heading = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    window.scrollTo(0, 0)
    heading.current?.focus({ preventScroll: true })
    const previous = document.title
    document.title = `${project.name} | ${site.name}`
    return () => { document.title = previous }
  }, [project])
  return <section className="project-page content-section">
    <a className="project-back" href="#projects">← Back to projects</a>
    <div className="project-page-heading"><p className="eyebrow">Project dossier</p><h1 ref={heading} tabIndex={-1}>{project.name}</h1><p>{project.summary}</p></div>
    <ImagePlaceholder />
    <div className="project-details"><div><p className="eyebrow">The work</p><h2>Contributions & results</h2><ul>{project.highlights.map(highlight => <li key={highlight}>{highlight}</li>)}</ul></div><aside><p className="eyebrow">Tools of the trade</p><h2>Technologies</h2><p>{project.technologies}</p>{project.link && <a className="project-demo" href={project.link.url}>{project.link.label} ↗</a>}</aside></div>
  </section>
}

export default function Projects() {
  return <section id="projects" className="content-section projects-section" tabIndex={-1}>
    <p className="eyebrow">The project board</p><h2>Wanted: a closer look.</h2><p className="poster-intro">Selected projects. Open a poster to explore the work behind it.</p>
    <div className="poster-grid">{site.projects.map((project, index) => <a className="wanted-poster" href={`#project/${project.slug}`} key={project.slug} aria-label={`View ${project.name} project`}>
      <div className="poster-topline"><span>Selected work</span><span>No. 0{index + 1}</span></div>
      <p className="wanted-heading" aria-hidden="true">WANTED</p>
      <ImagePlaceholder />
      <h3>{project.name}</h3><p className="poster-summary">{project.summary}</p><span className="poster-open">Open project dossier <span aria-hidden="true">↗</span></span>
    </a>)}</div>
  </section>
}

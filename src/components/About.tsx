import { site } from '../content/site'

export default function About() {
  const log = site.captainLog
  return <section id="about" className="content-section captain-log" aria-labelledby="about-title">
    <div className="log-heading"><div><p className="eyebrow">Captain’s log</p><h2 id="about-title">About me</h2></div><span className="log-mark" aria-hidden="true">JK / LOGBOOK</span></div>
    <div className="logbook">
      <div className="log-biography"><p className="eyebrow">Meet the captain</p><h3>{site.name}</h3><p className="log-lead">{log.introduction}</p><p>{log.background}</p><p>{log.projects}</p><ul className="log-focus" aria-label="Areas of experience">{log.focus.map(area => <li key={area}>{area}</li>)}</ul></div>
      <aside className="log-connections" aria-labelledby="connections-title"><p className="eyebrow">Find me ashore</p><h3 id="connections-title">Around the web</h3><div className="profile-list">{log.profiles.map(profile => {
        const content = <><span className="profile-name">{profile.name}<span aria-hidden="true">{profile.url ? '↗' : '—'}</span></span><span className="profile-description">{profile.description}</span>{!profile.url && <span className="profile-pending">Profile link coming soon</span>}</>
        return profile.url ? <a className="profile-card" key={profile.name} href={profile.url}>{content}</a> : <div className="profile-card profile-placeholder" key={profile.name}>{content}</div>
      })}</div><div className="chess-section"><span className="chess-symbol" aria-hidden="true">♞</span><p className="eyebrow">Beyond the code</p><h3>{log.chess.title}</h3><p>{log.chess.description}</p>{log.chess.url ? <a href={log.chess.url}>View my Chess.com profile ↗</a> : <p className="profile-pending">Chess.com · Profile coming soon</p>}</div></aside>
    </div>
  </section>
}

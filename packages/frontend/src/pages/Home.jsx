import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  MotionConfig,
  animate,
  motion,
  useInView,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from 'motion/react'
import { about, contact, life, profile, stats } from '../content/profile'
import LifeGallery from '../components/LifeGallery'
import './Home.css'

const ease = [0.25, 0.1, 0.25, 1]

// 进入视口时渐显上浮
function Reveal({ children, delay = 0, className, as = 'div' }) {
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.9, delay, ease }}
    >
      {children}
    </Tag>
  )
}

function Nav() {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 40))

  return (
    <nav className={`home-nav ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="home-nav-inner">
        <a href="#top" className="home-nav-brand">{profile.name}</a>
        <div className="home-nav-links">
          <a href="#about">About</a>
          <a href="#life">Life</a>
          <Link to="/under-the-hood" className="home-nav-cta">Under the Hood</Link>
        </div>
      </div>
    </nav>
  )
}

function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.25])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const y = useTransform(scrollYProgress, [0, 1], [0, 120])

  return (
    <section ref={ref} id="top" className="hero">
      <motion.div className="hero-stage" style={{ scale, opacity, y }}>
        <div className="hero-glow" aria-hidden="true" />
        {profile.portrait && (
          <img className="hero-portrait" src={profile.portrait} alt={profile.name} />
        )}
        <motion.h1
          className="hero-name metallic"
          initial={{ opacity: 0, scale: 0.92, filter: 'blur(12px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.4, ease }}
        >
          {profile.name}
        </motion.h1>
      </motion.div>

      <div className="hero-copy">
        <motion.p
          className="eyebrow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6, ease }}
        >
          {profile.eyebrow}
        </motion.p>
        <motion.p
          className="hero-tagline"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.8, ease }}
        >
          {profile.tagline}
        </motion.p>
      </div>
    </section>
  )
}

function About() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <section id="about" ref={ref} className="about">
      <motion.img
        src={about.image}
        alt=""
        aria-hidden="true"
        className="about-bg"
        style={{ y }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.6, ease }}
      />
      <div className="about-copy">
        <Reveal as="p" className="eyebrow">{about.eyebrow}</Reveal>
        <h2 className="display-sm">
          {about.headline.split('\n').map((line, i) => (
            <Reveal key={line} as="span" className="display-line" delay={0.15 * i}>
              {line}
            </Reveal>
          ))}
        </h2>
        <div className="about-body">
          {about.body.map((p, i) => (
            <Reveal key={p} as="p" delay={0.3 + 0.1 * i}>{p}</Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function CountUp({ value, suffix }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, value, {
      duration: 1.6,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, value])

  return <span ref={ref}>{display}{suffix}</span>
}

function Stats() {
  return (
    <section className="section stats">
      {stats.map((s, i) => (
        <Reveal key={s.label} className="home-stat" delay={0.1 * i}>
          <p className="home-stat-value"><CountUp value={s.value} suffix={s.suffix} /></p>
          <p className="home-stat-label">{s.label}</p>
        </Reveal>
      ))}
    </section>
  )
}

function KnowMe() {
  return (
    <section id="life" className="know-me">
      <div className="section section-center know-me-intro">
        <Reveal as="p" className="eyebrow">{life.eyebrow}</Reveal>
        <h2 className="display">
          {life.headline.split('\n').map((line, i) => (
            <Reveal key={line} as="span" className="display-line" delay={0.15 * i}>{line}</Reveal>
          ))}
        </h2>
        <Reveal as="p" className="section-body" delay={0.3}>{life.body}</Reveal>
      </div>
      <Reveal delay={0.2}>
        <LifeGallery photos={life.photos} />
      </Reveal>
    </section>
  )
}

function UnderTheHoodTeaser() {
  return (
    <section className="section section-center uth">
      <Reveal as="p" className="eyebrow">Under the Hood</Reveal>
      <h2 className="display-sm">
        <Reveal as="span" className="display-line">How this site is built.</Reveal>
      </h2>
      <Reveal as="p" className="section-body" delay={0.2}>
        React, Cloudflare Pages &amp; Workers, Terraform and GitHub Actions — a golden path from commit to production.
      </Reveal>
      <motion.img
        src="/images/SystemArchitecture1.drawio.svg"
        alt="System architecture diagram"
        className="uth-diagram"
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.1, ease }}
      />
      <Reveal delay={0.2}>
        <Link to="/under-the-hood" className="pill-button">Explore Under the Hood</Link>
      </Reveal>
    </section>
  )
}

function Contact() {
  return (
    <section className="section section-center contact">
      <h2 className="display">
        <Reveal as="span" className="display-line">{contact.headline}</Reveal>
      </h2>
      <Reveal className="contact-links" delay={0.2}>
        {contact.links.map((l) => (
          <a key={l.label} href={l.href} className="pill-link" target="_blank" rel="noopener noreferrer">
            {l.label} ›
          </a>
        ))}
      </Reveal>
    </section>
  )
}

function Home() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="home">
        <Nav />
        <Hero />
        <About />
        <Stats />
        <KnowMe />
        <UnderTheHoodTeaser />
        <Contact />
        <footer className="home-footer">
          <p>© {new Date().getFullYear()} {profile.name} · tiga2000.com</p>
        </footer>
      </div>
    </MotionConfig>
  )
}

export default Home

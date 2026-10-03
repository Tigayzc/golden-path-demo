import { useCallback, useEffect, useRef, useState } from 'react'
import './LifeGallery.css'

// 可滑动的虚拟画廊：横向滚动 + 吸附，离中心越远的照片越倾斜、越暗
function LifeGallery({ photos }) {
  const trackRef = useRef(null)
  const cardRefs = useRef([])
  const drag = useRef(null)
  const [active, setActive] = useState(0)

  // 根据每张卡片与视口中心的距离，直接写 transform（不触发 React 重渲染）
  const updateCards = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const center = track.scrollLeft + track.clientWidth / 2
    let nearest = 0
    let nearestDist = Infinity

    cardRefs.current.forEach((card, i) => {
      if (!card) return
      const cardCenter = card.offsetLeft + card.offsetWidth / 2
      const d = (cardCenter - center) / card.offsetWidth
      if (Math.abs(d) < nearestDist) {
        nearestDist = Math.abs(d)
        nearest = i
      }
      if (reduced) return
      const clamped = Math.max(-1.5, Math.min(1.5, d))
      const abs = Math.abs(clamped)
      card.style.transform = `perspective(1400px) rotateY(${clamped * -22}deg) scale(${1 - abs * 0.14})`
      card.style.opacity = String(1 - Math.min(abs, 1) * 0.55)
    })
    setActive(nearest)
  }, [])

  useEffect(() => {
    const track = trackRef.current
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(updateCards)
    }
    updateCards()
    track.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      track.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [updateCards])

  const scrollToIndex = (i) => {
    const track = trackRef.current
    const card = cardRefs.current[i]
    if (!track || !card) return
    const left = card.offsetLeft + card.offsetWidth / 2 - track.clientWidth / 2
    track.scrollTo({ left, behavior: 'smooth' })
  }

  const go = (delta) => scrollToIndex(Math.max(0, Math.min(photos.length - 1, active + delta)))

  // 鼠标拖拽（触屏和触控板走原生滑动）
  const onPointerDown = (e) => {
    if (e.pointerType !== 'mouse') return
    drag.current = { x: e.clientX, left: trackRef.current.scrollLeft, moved: false }
    trackRef.current.classList.add('is-dragging')
  }
  const onPointerMove = (e) => {
    if (!drag.current) return
    const dx = e.clientX - drag.current.x
    if (Math.abs(dx) > 3) drag.current.moved = true
    trackRef.current.scrollLeft = drag.current.left - dx
  }
  const endDrag = () => {
    if (!drag.current) return
    drag.current = null
    trackRef.current.classList.remove('is-dragging')
    scrollToIndex(active)
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      go(1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      go(-1)
    }
  }

  return (
    <div className="life-gallery">
      <div
        ref={trackRef}
        className="life-gallery-track"
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Photo gallery"
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
      >
        {photos.map((photo, i) => (
          <figure
            key={photo.src}
            ref={(el) => (cardRefs.current[i] = el)}
            className="life-gallery-card"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${photos.length}`}
          >
            <img src={photo.src} alt={photo.alt} loading="lazy" draggable="false" />
          </figure>
        ))}
      </div>

      <div className="life-gallery-controls">
        <button type="button" className="life-gallery-arrow" onClick={() => go(-1)} disabled={active === 0} aria-label="Previous photo">
          ‹
        </button>
        <div className="life-gallery-dots">
          {photos.map((photo, i) => (
            <button
              key={photo.src}
              type="button"
              className={i === active ? 'is-active' : ''}
              onClick={() => scrollToIndex(i)}
              aria-label={`Show photo ${i + 1}`}
            />
          ))}
        </div>
        <button type="button" className="life-gallery-arrow" onClick={() => go(1)} disabled={active === photos.length - 1} aria-label="Next photo">
          ›
        </button>
      </div>
    </div>
  )
}

export default LifeGallery

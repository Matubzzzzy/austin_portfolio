import { useState, useEffect } from "react"
import { createPortal } from "react-dom"

export default function Gallery({ images, title }) {
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const prev = () => setSelectedIndex(i => (i - 1 + images.length) % images.length)
  const next = () => setSelectedIndex(i => (i + 1) % images.length)

  useEffect(() => {
    if (selectedIndex === null) return
    const handleKey = (e) => {
      if (e.key === "ArrowLeft") prev()
      if (e.key === "ArrowRight") next()
      if (e.key === "Escape") setSelectedIndex(null)
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [selectedIndex])

  const modal = selectedIndex !== null && (
    <div className="modal" onClick={() => setSelectedIndex(null)}>
      <button className="arrow left" onClick={e => { e.stopPropagation(); prev() }}>&#8592;</button>
      <figure className="modal-figure" onClick={e => e.stopPropagation()}>
        <img src={images[selectedIndex].src} />
        {images[selectedIndex].label && (
          <figcaption className="modal-caption">{images[selectedIndex].label}</figcaption>
        )}
      </figure>
      <button className="arrow right" onClick={e => { e.stopPropagation(); next() }}>&#8594;</button>
    </div>
  )

  return (
    <>
      {title && <h2 className="gallery-title">{title}</h2>}
      <div className="gallery">
        {images.map(({ src, label }, i) => (
          <figure key={i} onClick={() => setSelectedIndex(i)}>
            <img src={src} />
            {label && <figcaption>{label}</figcaption>}
          </figure>
        ))}
      </div>
      {mounted && createPortal(modal, document.body)}
    </>
  )
}
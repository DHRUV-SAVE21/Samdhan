import { useEffect, useRef, useState } from 'react'

export function BloodLoader({ onFinish, onComplete }) {
  const videoRef = useRef(null)
  const [exiting, setExiting] = useState(false)

  const finishLoader = () => {
    setExiting(true)
    window.setTimeout(() => {
      if (onFinish) onFinish()
      if (onComplete) onComplete()
    }, 380)
  }

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(() => {})
    }

    const timer = window.setTimeout(() => {
      finishLoader()
    }, 5600)

    return () => window.clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      className={`blood-loader ${exiting ? 'blood-loader--exiting' : ''}`}
      role="status"
      aria-label="Loading BloodGrid"
    >
      <div className="blood-loader__stage">
        <video
          ref={videoRef}
          className="blood-loader__video"
          src="/loader.mp4"
          autoPlay
          muted
          playsInline
          onEnded={finishLoader}
        />
        {/* Corner mask + scale crops out the bottom-right watermark cleanly */}
        <div className="blood-loader__corner-mask" aria-hidden="true" />
      </div>

      <button
        type="button"
        className="blood-loader__skip"
        onClick={finishLoader}
      >
        Enter Site →
      </button>
    </div>
  )
}

export default BloodLoader

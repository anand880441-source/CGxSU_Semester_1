import React, { useState, useEffect, useRef } from 'react'
import { HiMusicalNote, HiPause, HiPlay, HiSpeakerWave, HiExclamationTriangle, HiSpeakerXMark } from 'react-icons/hi2'

const FloatingAudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [error, setError] = useState(false)
  const [magOffset, setMagOffset] = useState({ x: 0, y: 0 })
  const audioRef = useRef(null)
  const containerRef = useRef(null)

  // Handle magnetic effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current || isHovered) {
        if (!isHovered) setMagOffset({ x: 0, y: 0 })
        return
      }

      const rect = containerRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const dx = e.clientX - centerX
      const dy = e.clientY - centerY
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      const radius = 150
      if (distance < radius) {
        const power = (radius - distance) / radius
        setMagOffset({
          x: dx * 0.2 * power,
          y: dy * 0.2 * power
        })
      } else {
        setMagOffset({ x: 0, y: 0 })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isHovered])

  // Sync volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const togglePlay = (e) => {
    e.stopPropagation()
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(err => {
        console.error("Playback failed:", err)
        setError(true)
      })
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <>
      <audio 
        ref={audioRef}
        loop 
        src="/bg-music.mp3"
        onPlay={() => { setIsPlaying(true); setError(false); }}
        onPause={() => setIsPlaying(false)}
        onError={() => setError(true)}
      />
      
      <div 
        ref={containerRef}
        className="fixed bottom-8 right-8 z-[9999] transition-transform duration-300 ease-out"
        style={{ 
          transform: `translate(${magOffset.x}px, ${magOffset.y}px)`
        }}
      >
        <div 
          className="relative group"
          onMouseEnter={() => {
            setIsHovered(true)
            setMagOffset({ x: 0, y: 0 })
          }}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Main Bubble / Icon */}
          <button
            onClick={togglePlay}
            className={`
              w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-500 cursor-pointer
              ${isHovered ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}
              ${error ? 'bg-red-500' : 'bg-gradient-to-tr from-amber-500 to-yellow-400 rotate-12 group-hover:rotate-0'}
            `}
          >
            {error ? (
              <HiExclamationTriangle className="text-2xl" />
            ) : isPlaying ? (
              <div className="flex gap-0.5 items-end h-5">
                {[...Array(3)].map((_, i) => (
                  <div 
                    key={i} 
                    className="w-1 bg-white rounded-full animate-bounce"
                    style={{ 
                      height: `${40 + i * 20}%`,
                      animationDelay: `${i * 0.1}s` 
                    }}
                  />
                ))}
              </div>
            ) : (
              <HiMusicalNote className="text-2xl" />
            )}
          </button>

          {/* Expanded Glass Card */}
          <div className={`
            absolute bottom-0 right-0 p-1 rounded-[32px] overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
            ${isHovered ? 'scale-100 opacity-100 w-80 h-44' : 'scale-75 opacity-0 w-0 h-0 pointer-events-none'}
          `}>
            {/* Glass Background */}
            <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl border border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] rounded-[32px]" />
            
            <div className="relative p-6 flex flex-col h-full justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={togglePlay}
                  className={`
                    w-12 h-12 rounded-2xl flex items-center justify-center text-white transition-all duration-300 shadow-lg
                    ${error ? 'bg-red-500' : 'bg-amber-500 hover:bg-amber-600 hover:scale-105 active:scale-95'}
                  `}
                >
                  {error ? <HiExclamationTriangle className="text-xl" /> : isPlaying ? <HiPause className="text-2xl" /> : <HiPlay className="text-2xl translate-x-0.5" />}
                </button>
                
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-0.5">
                    {error ? 'System Error' : 'Now Playing'}
                  </p>
                  <p className="font-extrabold text-gray-900 truncate text-lg leading-tight">
                    {error ? 'Missing Audio File' : 'Aari Aari'}
                  </p>
                </div>
              </div>

              {/* Visualizer & Volume Row */}
              <div className="flex items-center gap-4 mt-auto">
                <div className="flex-1 h-10 bg-black/5 rounded-2xl flex items-center px-4 gap-3">
                  <HiSpeakerWave className={`text-amber-500 transition-opacity ${volume === 0 ? 'opacity-30' : 'opacity-100'}`} />
                  <input 
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="flex-1 h-1 bg-amber-200/50 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                </div>
                
                {/* Minimal Visualizer */}
                <div className="flex items-end gap-1 h-8">
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i}
                      className={`w-1 rounded-full transition-all duration-500 ${isPlaying ? 'bg-amber-400 animate-pulse' : 'bg-amber-200 h-1'}`}
                      style={{ 
                        height: isPlaying ? `${40 + Math.random() * 60}%` : '4px',
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        input[type='range']::-webkit-slider-thumb {
          appearance: none;
          width: 14px;
          height: 14px;
          background: #f59e0b;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
      `}</style>
    </>
  )
}

export default FloatingAudioPlayer
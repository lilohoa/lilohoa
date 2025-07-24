'use client'

import gsap from 'gsap'
import { useEffect, useRef } from 'react'

export default function AnimatedTitle() {
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const chars = titleRef.current?.querySelectorAll('.char')
    if (chars) {
      gsap.fromTo(
        chars,
        {
          opacity: 0,
          y: 20
        },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.5,
          ease: 'power3.out'
        }
      )
    }
  }, [])

  return (
    <h1 ref={titleRef} style={{ fontSize: '3rem', textAlign: 'center' }}>
      {'Blog của Hoa'.split('').map((char, i) => (
        <span key={i} className="char" style={{ display: 'inline-block' }}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </h1>
  )
}
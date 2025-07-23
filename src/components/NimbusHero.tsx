'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

const imageList = [
    'hero_comp_1.webp',
  'hero_comp_2.webp',
  'hero_comp_3.webp', 
  'hero_comp_4.webp',
  'hero_comp_5.webp',
  'hero_comp_6.webp',
  'hero_comp_7.webp',
  'hero_comp_8.webp',
  'hero_comp_9.webp',
  'hero_comp_10.webp',
  'hero_comp_11.webp',
  'hero_comp_12.webp',
  'hero_comp_13.webp',
  'hero_comp_14.webp',
  'hero_comp_15.webp',
  'hero_comp_16.webp',
  'hero_comp_17.webp',  
]

const HERO_HEIGHT = 700         // px
const THUMB_SIZE  = 150         // square thumbs

type Pos = { top: number; left: number }

export default function NimbusHero() {
  const [positions, setPositions] = useState<Pos[]>([])

  // generate positions once after mount
useEffect(() => {
  const screenW = window.innerWidth
  const newPos: Pos[] = imageList.map(() => ({
    top:  Math.floor(Math.random() * (HERO_HEIGHT - THUMB_SIZE)),
    left: Math.floor(Math.random() * (screenW - THUMB_SIZE)),
  }))
  setPositions(newPos)
}, [])

  return (
    <div className="w-screen flex justify-center items-center bg-gray-100">
    <section
  className="relative w-screen h-[400px] bg-gradient-to-b from-white to-gray-50 overflow-hidden"
>
      {positions.length > 0 &&
        imageList.map((src, i) => (
          <Image
            key={src}
            src={`/hero/${src}`}
            alt=""
            width={THUMB_SIZE}
            height={THUMB_SIZE}
            aria-hidden="true"
            loading="lazy"
            className="absolute pointer-events-none z-0"
            style={positions[i]}
          />
        ))}

      <div className="absolute inset-0 z-10 pointer-events-none
                      bg-white/20   /* subtle fog */
                      backdrop-blur-md" />

      {/* Central mock‑up */}
      <Image
        src="/hero/logo.png"
        alt="Nimbus dashboard mock‑up"
        width={500}
        height={300}
        priority
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
      />

      {/* Caption */}
      <div className="absolute bottom-10 w-full text-center text-3xl font-semibold text-gray-800 z-30 border-white-300 border-solid ">
        Because&nbsp;You&nbsp;Were&nbsp;There.
      </div>
    </section>
    </div>
  )
}

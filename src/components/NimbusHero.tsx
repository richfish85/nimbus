'use client'

import Image from 'next/image'

const imageList = [
  'hero_comp_1.webp',
]

export default function NimbusHero() {
  return (
    <section className="relative h-[700px] bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      {imageList.map((img, i) => (
        <Image
          key={img}
          src={`/hero/${img}`}
          alt={`Memory ${i}`}
          width={150}
          height={150}
          className={`hero-img img-${i + 1}`}
        />
      ))}

      <Image
        src="/hero/nimbus-ui-final.webp"
        alt="Nimbus Dashboard"
        width={500}
        height={300}
        className="nimbus-ui"
      />

      <div className="absolute bottom-10 w-full text-center text-3xl font-semibold text-gray-800 final-text">
        Because you were there.
      </div>
    </section>
  )
}

'use client'

import React, { Suspense } from 'react'
import HeroFormClient from './HeroFormClient'

export default function HeroFormPage() {
  return (
    <Suspense fallback={<div>A carregar...</div>}>
      <HeroFormClient />
    </Suspense>
  )
}

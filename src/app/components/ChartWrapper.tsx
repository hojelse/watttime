"use client"

import { ReactNode } from "react"
import { useEffect, useState } from "react"

export const ChartWrapper = ({ children }: { children: ReactNode }) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return children
}

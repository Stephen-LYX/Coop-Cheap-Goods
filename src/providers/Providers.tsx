"use client"

import { ItemProvider } from '../contexts/ItemContext'

interface ProvidersProps {
  children: React.ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <ItemProvider>
      {children}
    </ItemProvider>
  )
}
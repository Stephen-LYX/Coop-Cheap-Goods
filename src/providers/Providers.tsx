"use client"

import { ItemProvider } from '../contexts/ItemContext'
import { EncryptionProvider } from '../contexts/EncryptionContext'

interface ProvidersProps {
  children: React.ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <EncryptionProvider>
      <ItemProvider>
        {children}
      </ItemProvider>
    </EncryptionProvider>
  )
}
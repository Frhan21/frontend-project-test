import type { ReactNode } from 'react'

import AppQueryProvider from '@/providers/query-provider'
import SessionProvider from '@/providers/session-provider'

type AppProvidersProps = {
  children: ReactNode
}

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <AppQueryProvider>
      <SessionProvider>{children}</SessionProvider>
    </AppQueryProvider>
  )
}

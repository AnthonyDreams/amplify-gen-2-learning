import * as React from 'react'
import ModernSideBar from './modern-sidebar'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ margin: 0, padding: 0, display: 'flex' }}>
      <div style={{ flex: '1', minHeight: '100vh', position: 'relative' }}>
        <ModernSideBar>{children}</ModernSideBar>
      </div>
    </div>
  )
}

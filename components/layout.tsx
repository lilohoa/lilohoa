import Link from 'next/link'
import React from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
        <Link href="/" legacyBehavior>
          <a style={{ marginRight: '1rem' }}>Home</a>
        </Link>
        <Link href="/about" legacyBehavior>
          <a>About</a>
        </Link>
      </nav>
      <main style={{ padding: '1rem' }}>{children}</main>
    </>
  )
}
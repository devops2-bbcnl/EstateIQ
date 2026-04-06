import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Subscribe — Kynjo.Homes',
  description: 'Subscribe to Kynjo.Homes for your estate.',
  alternates: { canonical: '/subscribe' },
}

export default function SubscribeLayout({ children }: { children: React.ReactNode }) {
  return children
}

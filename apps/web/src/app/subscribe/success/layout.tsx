import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Subscription started — Kynjo.Homes',
  description: 'Your Kynjo.Homes subscription is being processed.',
  robots: { index: false, follow: false },
}

export default function SubscribeSuccessLayout({ children }: { children: React.ReactNode }) {
  return children
}

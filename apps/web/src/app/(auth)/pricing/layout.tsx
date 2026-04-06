import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing — Kynjo.Homes',
  description: 'Plans and pricing for Kynjo.Homes estate management.',
  alternates: { canonical: '/pricing' },
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children
}

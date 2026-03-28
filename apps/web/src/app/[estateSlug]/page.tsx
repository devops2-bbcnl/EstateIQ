import { notFound } from 'next/navigation'
import { getEstatePublicBySlug } from '@/lib/estatePublic'
import EstateLandingClient from './EstateLandingClient'

interface Props {
  params: Promise<{ estateSlug: string }>
}

export default async function EstateLandingPage({ params }: Props) {
  const { estateSlug } = await params

  const estate = await getEstatePublicBySlug(estateSlug)

  if (!estate) notFound()

  return <EstateLandingClient estate={estate} />
}
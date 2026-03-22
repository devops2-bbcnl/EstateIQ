import Topbar from '@/components/layout/Topbar'
import VehiclesClient from './VehiclesClient'

export default function VehiclesPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Vehicles & Stickers" />
      <VehiclesClient />
    </div>
  )
}
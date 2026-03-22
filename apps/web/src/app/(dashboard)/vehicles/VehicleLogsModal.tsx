'use client'
import { useEffect, useState } from 'react'
import { X, Loader2, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { fetchJson } from '@/lib/fetchJson'

type Outcome = 'GRANTED' | 'WARNING' | 'BLOCKED'

interface ScanLog {
  id: string
  outcome: Outcome
  debtAmount: number
  scannedAt: string
  location: string | null
  scannedBy: string | null
}

interface Props {
  vehicle: { id: string; plateNumber: string }
  onClose: () => void
}

const OUTCOME_STYLES: Record<Outcome, { icon: any; color: string; bg: string; label: string }> = {
  GRANTED: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50',  label: 'Granted'  },
  WARNING: { icon: AlertTriangle,color: 'text-amber-600', bg: 'bg-amber-50',  label: 'Warning'  },
  BLOCKED: { icon: XCircle,      color: 'text-red-600',   bg: 'bg-red-50',    label: 'Blocked'  },
}

export default function VehicleLogsModal({ vehicle, onClose }: Props) {
  const [logs, setLogs]     = useState<ScanLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchJson<ScanLog[]>(`/api/vehicles/${vehicle.id}/logs`)
      .then(({ data }) => { setLogs(data ?? []); setLoading(false) })
  }, [vehicle.id])

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[85vh] flex flex-col">

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="font-semibold text-gray-900">Scan history</h2>
            <p className="text-xs text-gray-400 mt-0.5 font-mono">{vehicle.plateNumber}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 text-gray-400">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={22} className="animate-spin text-gray-400" />
            </div>
          )}

          {!loading && logs.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-sm">
              No scan events recorded yet.
            </div>
          )}

          {!loading && logs.length > 0 && (
            <div className="space-y-2">
              {logs.map(log => {
                const { icon: Icon, color, bg, label } = OUTCOME_STYLES[log.outcome]
                return (
                  <div key={log.id} className={cn('flex items-start gap-3 rounded-xl p-3', bg)}>
                    <Icon size={16} className={cn('shrink-0 mt-0.5', color)} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={cn('text-sm font-semibold', color)}>{label}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(log.scannedAt).toLocaleString('en-NG', {
                            day: 'numeric', month: 'short',
                            hour: '2-digit', minute: '2-digit',
                          })}
                        </span>
                      </div>
                      {log.debtAmount > 0 && (
                        <p className="text-xs text-gray-600 mt-0.5">
                          Outstanding: ₦{log.debtAmount.toLocaleString('en-NG')}
                        </p>
                      )}
                      {log.location && (
                        <p className="text-xs text-gray-400 mt-0.5">📍 {log.location}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 shrink-0">
          <button onClick={onClose}
            className="w-full border border-gray-200 text-gray-700 rounded py-2.5 text-sm font-medium hover:bg-gray-50">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
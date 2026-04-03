'use client'
import { X, Printer, Download } from 'lucide-react'
import QRCode from 'react-qr-code'

interface Vehicle {
  id: string
  plateNumber: string
  make: string | null
  model: string | null
  color: string | null
  scanToken: string
  resident: { firstName: string; lastName: string }
}

interface Props { vehicle: Vehicle; onClose: () => void }

export default function VehicleStickerModal({ vehicle, onClose }: Props) {
  const scanUrl = `${window.location.origin}/api/scan/vehicle?token=${vehicle.scanToken}`

  function handlePrint() {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Kynjo.Homes Vehicle Sticker — ${vehicle.plateNumber}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f9fafb; }
          .sticker {
            width: 85mm; padding: 6mm; border: 2px solid #16a34a;
            border-radius: 8px; background: #fff; text-align: center;
          }
          .header { background: #16a34a; color: #fff; padding: 4mm; border-radius: 4px; margin-bottom: 4mm; }
          .header h1 { font-size: 14pt; font-weight: 700; letter-spacing: 0.5px; }
          .header p  { font-size: 8pt; opacity: 0.8; }
          .qr { margin: 4mm auto; display: flex; justify-content: center; }
          .plate { font-size: 18pt; font-weight: 800; font-family: monospace; letter-spacing: 3px; color: #111827; margin: 3mm 0; }
          .details { font-size: 8pt; color: #6b7280; }
          .footer { margin-top: 3mm; font-size: 7pt; color: #9ca3af; border-top: 1px solid #f3f4f6; padding-top: 2mm; }
        </style>
      </head>
      <body>
        <div class="sticker">
          <div class="header">
            <h1>Kynjo.Homes</h1>
            <p>Vehicle Access Pass</p>
          </div>
          <div class="qr">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="120" height="120">
              ${document.getElementById('sticker-qr')?.innerHTML ?? ''}
            </svg>
          </div>
          <div class="plate">${vehicle.plateNumber}</div>
          <div class="details">
            ${[vehicle.color, vehicle.make, vehicle.model].filter(Boolean).join(' · ')}<br/>
            ${vehicle.resident.firstName} ${vehicle.resident.lastName}
          </div>
          <div class="footer">Scan to verify resident status</div>
        </div>
        <script>window.onload = () => window.print()</script>
      </body>
      </html>
    `)
    printWindow.document.close()
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Vehicle QR sticker</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 text-gray-400">
            <X size={16} />
          </button>
        </div>

        <div className="p-6">
          {/* Sticker preview */}
          <div className="border-2 border-green-500 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="bg-green-600 px-4 py-3 text-center">
              <p className="text-white font-bold text-lg">Kynjo.Homes</p>
              <p className="text-green-100 text-xs">Vehicle Access Pass</p>
            </div>

            {/* QR code */}
            <div className="flex flex-col items-center py-5 px-4 gap-3">
              <div id="sticker-qr" className="p-3 bg-white border border-gray-100 rounded">
                <QRCode
                  value={scanUrl}
                  size={140}
                  level="M"
                />
              </div>

              {/* Plate */}
              <p className="text-2xl font-black tracking-widest font-mono text-gray-900">
                {vehicle.plateNumber}
              </p>

              {/* Vehicle info */}
              <p className="text-xs text-gray-500 text-center">
                {[vehicle.color, vehicle.make, vehicle.model].filter(Boolean).join(' · ') || 'No details'}
              </p>
              <p className="text-xs text-gray-500">
                {vehicle.resident.firstName} {vehicle.resident.lastName}
              </p>

              <p className="text-xs text-gray-300 mt-1">Scan to verify resident status</p>
            </div>
          </div>

          {/* Scan URL for testing */}
          <div className="mt-4 bg-gray-50 rounded px-3 py-2">
            <p className="text-xs text-gray-400 mb-1">Scan URL (for testing)</p>
            <p className="text-xs text-gray-600 font-mono break-all">{scanUrl}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-700 rounded py-2.5 text-sm font-medium hover:bg-gray-50"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 bg-green-600 text-white rounded py-2.5 text-sm font-medium hover:bg-green-700 flex items-center justify-center gap-2"
            >
              <Printer size={14} /> Print sticker
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
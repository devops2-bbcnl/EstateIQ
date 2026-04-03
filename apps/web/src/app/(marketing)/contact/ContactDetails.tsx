import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react'
import { getContactInfo } from '@/lib/contactInfo'

export default function ContactDetails() {
  const info = getContactInfo()

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-sm font-semibold text-white/90 uppercase tracking-wide">Corporate</h2>
        <p className="mt-1 text-sm font-medium text-white/95">{info.companyName}</p>
      </div>

      <div className="flex gap-3">
        <MapPin className="size-5 text-green-300 shrink-0 mt-0.5" aria-hidden />
        <address className="text-sm text-white/90 not-italic leading-relaxed">
          {info.addressLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </address>
      </div>

      <div className="flex gap-3 items-start">
        <Phone className="size-5 text-green-300 shrink-0 mt-0.5" aria-hidden />
        <div className="text-sm">
          <a href={info.phoneTelHref} className="text-white/95 hover:text-green-300 font-medium">
            {info.phoneDisplay}
          </a>
        </div>
      </div>

      <div className="flex gap-3 items-start">
        <Mail className="size-5 text-green-300 shrink-0 mt-0.5" aria-hidden />
        <a
          href={`mailto:${info.email}`}
          className="text-sm text-white/95 hover:text-green-300 font-medium break-all"
        >
          {info.email}
        </a>
      </div>

      <div className="flex gap-3 items-start">
        <MessageCircle className="size-5 text-green-300 shrink-0 mt-0.5" aria-hidden />
        <a
          href={info.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-green-200 hover:text-white hover:underline font-medium"
        >
          Chat on WhatsApp
        </a>
      </div>

      <p className="text-xs text-white/85 pt-2 border-t border-white/25">
        For privacy-related requests, email{' '}
        <a href="mailto:privacy@kynjo.homes" className="text-green-200 hover:text-white hover:underline">
          privacy@kynjo.homes
        </a>
        .
      </p>
    </div>
  )
}

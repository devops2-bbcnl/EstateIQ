'use client'

import { forwardRef } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'
import type { TurnstileInstance } from '@marsidev/react-turnstile'

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

/** True when the widget should be shown (public site key set at build time). */
export function isTurnstileWidgetEnabled(): boolean {
  return Boolean(SITE_KEY?.trim())
}

type Props = {
  onToken: (token: string | null) => void
}

/**
 * Cloudflare Turnstile challenge. Renders nothing when NEXT_PUBLIC_TURNSTILE_SITE_KEY is unset
 * (local dev without Turnstile — server must omit TURNSTILE_SECRET_KEY too).
 */
export const TurnstileWidget = forwardRef<TurnstileInstance | undefined, Props>(
  function TurnstileWidget({ onToken }, ref) {
    if (!SITE_KEY) return null

    return (
      <div className="flex justify-center py-1 w-full min-h-[65px]">
        <Turnstile
          ref={ref}
          siteKey={SITE_KEY}
          onSuccess={(token) => onToken(token)}
          onExpire={() => onToken(null)}
          onError={() => onToken(null)}
          options={{ theme: 'light', size: 'normal' }}
        />
      </div>
    )
  }
)

const PAYSTACK_INLINE_SRC = 'https://js.paystack.co/v1/inline.js'

/** Paystack Inline v1: `email` + `amount` are still required when resuming with `access_code`, or the checkout shows “valid email” errors. */
type PaystackSetup = (options: {
  key: string
  email: string
  amount: number
  currency?: string
  access_code: string
  callback: (response: { reference: string }) => void
  onClose?: () => void
}) => { openIframe: () => void }

declare global {
  interface Window {
    PaystackPop?: { setup: PaystackSetup }
  }
}

function loadPaystackInlineScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()
  if (window.PaystackPop) return Promise.resolve()

  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${PAYSTACK_INLINE_SRC}"]`
    )
    if (existing) {
      const done = () => resolve()
      if (window.PaystackPop) {
        done()
        return
      }
      existing.addEventListener('load', done, { once: true })
      existing.addEventListener('error', () => reject(new Error('Failed to load Paystack')), {
        once: true,
      })
      return
    }

    const s = document.createElement('script')
    s.src = PAYSTACK_INLINE_SRC
    s.async = true
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('Failed to load Paystack'))
    document.body.appendChild(s)
  })
}

export async function openPaystackInlinePopup(options: {
  accessCode: string
  publicKey: string
  email: string
  amountKobo: number
  onSuccess: (reference: string) => void
  onClose?: () => void
}): Promise<void> {
  await loadPaystackInlineScript()
  const PaystackPop = window.PaystackPop
  if (!PaystackPop) throw new Error('Paystack checkout could not load')

  const handler = PaystackPop.setup({
    key: options.publicKey,
    email: options.email.trim(),
    amount: options.amountKobo,
    currency: 'NGN',
    access_code: options.accessCode,
    callback: response => options.onSuccess(response.reference),
    onClose: options.onClose,
  })
  handler.openIframe()
}

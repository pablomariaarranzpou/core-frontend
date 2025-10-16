/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_STRIPE_PUBLIC_KEY: string
  readonly VITE_STRIPE_STARTER_PRICE_ID: string
  readonly VITE_STRIPE_PROFESSIONAL_PRICE_ID: string
  readonly VITE_STRIPE_ENTERPRISE_PRICE_ID: string
  // más variables de entorno...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

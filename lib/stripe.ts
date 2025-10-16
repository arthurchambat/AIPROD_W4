import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
})

// Prix par génération en centimes (0.99 EUR = 99 centimes)
export const PRICE_PER_GENERATION = 99

// Convertir en euros pour l'affichage
export const PRICE_PER_GENERATION_EUR = PRICE_PER_GENERATION / 100

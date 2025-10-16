import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
})

// Prix par génération en centimes (0.99 EUR = 99 centimes)
export const PRICE_PER_GENERATION = 99

// Convertir en euros pour l'affichage
export const PRICE_PER_GENERATION_EUR = PRICE_PER_GENERATION / 100

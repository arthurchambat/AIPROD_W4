# 💳 Intégration Stripe - Guide Complet

## 📋 Vue d'ensemble

Système de paiement Stripe avec modèle **"paiement à la génération"** : l'utilisateur paie **0,99€ avant** la génération de l'image.

## 🎯 Flow de paiement

```
1. Upload image + prompt → "Générer (0,99€)"
2. Création projet (status='pending', payment_status='pending')
3. Création Stripe Checkout Session
4. Redirection → Page Stripe
5. Paiement carte bancaire
6. Webhook Stripe → payment_status='paid'
7. Retour dashboard → Badge "✓ Payé" + "🎨 Générer"
8. Génération image (après vérification paiement)
9. Affichage → Badge "✅ Complété"
```

## 🔧 Configuration

### Variables d'environnement

Copier `.env.example` → `.env.local` et remplir les valeurs :

```bash
# Stripe (récupérer sur https://dashboard.stripe.com/apikeys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_URL="http://localhost:3000"
STRIPE_WEBHOOK_SECRET="whsec_..."  # Après configuration webhook
```

### Configuration webhook Stripe

1. **Stripe Dashboard** → [Webhooks](https://dashboard.stripe.com/test/webhooks)
2. **Add endpoint** : `http://localhost:3000/api/webhooks/stripe`
3. **Événements** : `checkout.session.completed`
4. **Copier** le Signing Secret → `STRIPE_WEBHOOK_SECRET`

### Test en local avec Stripe CLI

```bash
# Terminal 1
npm run dev

# Terminal 2
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copier le `whsec_...` affiché dans `.env.local` puis redémarrer.

## 🧪 Test

1. http://localhost:3000/dashboard
2. Upload image → "💳 Générer (0,99€)"
3. Carte test : `4242 4242 4242 4242`
4. Vérifier webhook : Terminal 2 affiche `✅ checkout.session.completed`
5. Dashboard : "✓ Payé" + "🎨 Générer"
6. Clic → Image générée !

## 🔐 Sécurité

✅ **Signature webhook vérifiée** (`stripe.webhooks.constructEvent`)  
✅ **Prix hardcodé serveur** (`PRICE_PER_GENERATION = 99`)  
✅ **Vérification paiement** (`payment_status='paid'` requis)  
✅ **Auth JWT** sur toutes les APIs  
✅ **RLS Supabase** sur les projets

## 📁 APIs créées

- `POST /api/create-project` : Crée projet pending
- `POST /api/create-checkout-session` : Crée session Stripe
- `POST /api/webhooks/stripe` : Reçoit événements (webhook)
- `POST /api/generate-image` : Génère après paiement

## 🎨 États projet

| payment_status | status | Badge | Actions |
|---|---|---|---|
| pending | pending | ⏳ Paiement en attente | 🗑️ |
| paid | pending | ✓ Payé | 🎨 Générer + 🗑️ |
| paid | processing | 🎨 Génération... | 🗑️ |
| paid | completed | ✅ Complété | 🗑️ |

## 🚀 Production

1. Clés Live : `pk_live_...` et `sk_live_...`
2. Webhook production sur Stripe Dashboard
3. Activer compte Stripe (vérification + IBAN)

## 📚 Ressources

- [Stripe Docs](https://stripe.com/docs)
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Webhooks](https://stripe.com/docs/webhooks)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)

Pour plus de détails, voir le fichier `SECURITY.md` sur la gestion des clés API.

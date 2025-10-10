#!/bin/bash

# 🧹 Script de nettoyage du projet
# Usage: chmod +x clean-local.sh && ./clean-local.sh

echo "🧹 Nettoyage du projet en cours..."

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Nettoyer le cache Next.js
echo "${YELLOW}📦 Nettoyage du cache Next.js...${NC}"
rm -rf .next
echo "${GREEN}✅ Cache .next/ supprimé${NC}"

# 2. Nettoyer le cache npm
echo "${YELLOW}📦 Nettoyage du cache npm...${NC}"
rm -rf node_modules/.cache
echo "${GREEN}✅ Cache node_modules/.cache/ supprimé${NC}"

# 3. Supprimer les fichiers de documentation temporaires (optionnel)
# Décommentez si vous voulez les supprimer
# echo "${YELLOW}📄 Suppression des fichiers temporaires...${NC}"
# rm -f FIX_AUTH_CONFIG.md
# rm -f TEST_AUTH_FLOW.md
# echo "${GREEN}✅ Fichiers temporaires supprimés${NC}"

echo ""
echo "${GREEN}✨ Nettoyage terminé !${NC}"
echo ""
echo "Pour redémarrer le serveur :"
echo "  ${YELLOW}npm run dev${NC}"
echo ""
